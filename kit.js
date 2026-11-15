(function () {
  const R = window.ExamResizer;
  if (!R) return;
  const $ = (id) => document.getElementById(id);
  const slots = [
    { key: 'photo', title: 'Photograph', presetId: 'ibps-photo', accept: 'image/*' },
    { key: 'signature', title: 'Signature', presetId: 'ibps-signature', accept: 'image/*' },
    { key: 'thumb', title: 'Left thumb impression', presetId: 'ibps-thumb', accept: 'image/*' },
    { key: 'declaration', title: 'Handwritten declaration', presetId: 'ibps-declaration', accept: 'image/*' },
  ].map((s) => ({ ...s, preset: R.presetById(s.presetId), file: null, bitmap: null, blob: null, name: null, note: '', cls: '' }));

  function setStatus(msg, cls) { const el = $('kitStatus'); if (el) { el.textContent = msg || ''; el.className = 'status' + (cls ? ' ' + cls : ''); } }

  function render() {
    const grid = $('kitGrid'); if (!grid) return;
    grid.innerHTML = '';
    slots.forEach((s, i) => {
      const p = s.preset || {};
      const div = document.createElement('div');
      div.className = 'kit-slot';
      div.innerHTML = `
        <h3>${s.title}</h3>
        <p class="kit-spec">${p.w || '?'} × ${p.h || '?'} px, target ${p.minKb || '?'}–${p.maxKb || '?'} KB, JPG${p.enhance ? ' · cleanup on' : ''}</p>
        <div class="kit-row">
          <label class="btn btn-ghost" style="margin:0; cursor:pointer;">Choose file<input data-i="${i}" type="file" accept="${s.accept}" style="display:none" /></label>
          <button class="btn" data-dl="${i}" type="button" ${s.blob ? '' : 'disabled'}>Download</button>
        </div>
        <div class="kit-file">${s.file ? s.file.name : 'No file selected.'}</div>
        <div class="kit-status ${s.cls}">${s.note || ''}</div>`;
      grid.appendChild(div);
    });
    grid.querySelectorAll('input[type=file]').forEach((inp) => inp.addEventListener('change', async (e) => {
      const i = Number(inp.dataset.i); const file = e.target.files && e.target.files[0]; if (!file) return;
      const s = slots[i]; s.file = file; s.blob = null; s.note = 'File selected.'; s.cls = '';
      try { if (s.bitmap && s.bitmap.close) s.bitmap.close(); } catch {}
      try { s.bitmap = await R.loadBitmapFromFile(file); s.note = 'Ready to process.'; s.cls = 'ok'; } catch { s.note = 'Could not load image.'; s.cls = 'err'; }
      render(); updateZip();
    }));
    grid.querySelectorAll('button[data-dl]').forEach((btn) => btn.addEventListener('click', () => {
      const s = slots[Number(btn.dataset.dl)]; if (!s || !s.blob) return;
      downloadBlob(s.blob, s.name || (s.key + '.jpg'));
    }));
  }

  function downloadBlob(blob, name) {
    const a = document.createElement('a'), url = URL.createObjectURL(blob);
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function settingsForSlot(s) {
    const p = s.preset || {};
    const bw = s.bitmap.width || s.bitmap.naturalWidth, bh = s.bitmap.height || s.bitmap.naturalHeight;
    const ta = (p.w||1)/(p.h||1), sa = bw/bh;
    let sw=bw, sh=bh, sx=0, sy=0; // cover crop
    if (sa > ta) { sh = bh; sw = Math.round(bh * ta); sx = Math.round((bw-sw)/2); }
    else { sw = bw; sh = Math.round(bw / ta); sy = Math.round((bh-sh)/2); }
    const padToggle = document.getElementById('padToMin');
    return {
      widthPx: p.w, heightPx: p.h, dpi: p.dpi || 200, format: p.fmt || 'image/jpeg', minKb: p.minKb, maxKb: p.maxKb, autoCompress: true,
      padToMin: padToggle ? padToggle.checked : false,
      enhanceOn: !!p.enhance, enhanceMode: p.enhance || 'off', threshold: 160, thickness: p.enhance === 'signature' ? 1 : 0, contrast: 115,
      slateOn: false, cropRect: { sx, sy, sw, sh }
    };
  }

  async function processAll() {
    const selected = slots.filter((s) => s.bitmap);
    if (!selected.length) { setStatus('Choose at least one file first.', 'warn'); return; }
    $('processAllBtn').disabled = true; $('downloadZipBtn').disabled = true;
    setStatus('Processing files...', '');
    let ok = 0;
    for (const s of selected) {
      s.note = 'Processing...'; s.cls = ''; render();
      try {
        const res = await R.processFromBitmap(s.bitmap, settingsForSlot(s));
        s.blob = res.blob;
        s.name = `IBPS_${s.key}_${res.outW}x${res.outH}.jpg`;
        const kb = s.blob.size/1024, p=s.preset;
        const inRange = kb >= p.minKb && kb <= p.maxKb;
        s.note = `${R.fmtBytes(s.blob.size)} (target ${p.minKb}–${p.maxKb} KB)${inRange ? '' : ' — outside range'}. ${res.note || ''}`;
        s.cls = inRange ? 'ok' : 'warn';
        ok++;
      } catch (e) { s.note = 'Processing failed.'; s.cls = 'err'; }
      render();
    }
    setStatus(`Processed ${ok}/${selected.length} file(s). Review sizes before uploading.`, ok === selected.length ? 'ok' : 'warn');
    $('processAllBtn').disabled = false;
    updateZip();
  }

  function updateZip() { $('downloadZipBtn').disabled = !slots.some((s) => s.blob); }
  async function downloadZip() {
    const files = slots.filter((s)=>s.blob).map((s)=>({ name: s.name, blob: s.blob }));
    if (!files.length) return;
    $('downloadZipBtn').disabled = true; setStatus('Creating ZIP...', '');
    try { const zip = await ZipStore.createZip(files); downloadBlob(zip, 'IBPS_SBI_application_images.zip'); setStatus('ZIP downloaded.', 'ok'); }
    catch { setStatus('Could not create ZIP.', 'err'); }
    finally { updateZip(); }
  }
  function resetKit() {
    slots.forEach((s)=>{ s.file=null; s.blob=null; s.name=null; s.note=''; s.cls=''; try{ if(s.bitmap&&s.bitmap.close) s.bitmap.close(); }catch{} s.bitmap=null; });
    render(); updateZip(); setStatus('Kit reset.');
  }

  // Theme
  R.applyTheme(R.getPreferredTheme());
  const tt = $('themeToggle'); if (tt) tt.addEventListener('click', R.toggleTheme);
  $('processAllBtn').addEventListener('click', processAll);
  $('downloadZipBtn').addEventListener('click', downloadZip);
  $('resetKitBtn').addEventListener('click', resetKit);
  render(); setStatus('Select files for the documents you need, then process and download.');
})();
