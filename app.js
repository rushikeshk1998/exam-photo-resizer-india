/* Exam Photo & Signature Resizer - static, client-side */
const PRESETS = [
  { id: 'custom', group: 'Custom', name: 'Custom (manual)', short: 'Custom', doc: 'photo', w: 413, h: 531, dpi: 200, minKb: 20, maxKb: 50, fmt: 'image/jpeg', note: 'Set exact dimensions, DPI and KB from your notification.' },
  { id: 'ssc-photo', group: 'SSC', name: 'SSC Photo (3.5 × 4.5 cm, 200 DPI)', short: 'SSC photo', doc: 'photo', w: 276, h: 354, dpi: 200, minKb: 20, maxKb: 50, fmt: 'image/jpeg', note: 'Common SSC photo size. Verify the current notification before submitting.' },
  { id: 'ssc-signature', group: 'SSC', name: 'SSC Signature (140 × 60 px)', short: 'SSC signature', doc: 'signature', w: 140, h: 60, dpi: 200, minKb: 10, maxKb: 20, fmt: 'image/jpeg', enhance: 'signature', note: 'Common small signature upload. Use signature cleanup for clearer strokes.' },
  { id: 'ibps-photo', group: 'IBPS/SBI', name: 'IBPS/SBI Photo (200 × 230 px)', short: 'IBPS photo', doc: 'photo', w: 200, h: 230, dpi: 200, minKb: 20, maxKb: 50, fmt: 'image/jpeg', note: 'Common banking photo spec. Verify your exam notification.' },
  { id: 'ibps-signature', group: 'IBPS/SBI', name: 'IBPS/SBI Signature (140 × 60 px)', short: 'IBPS signature', doc: 'signature', w: 140, h: 60, dpi: 200, minKb: 10, maxKb: 20, fmt: 'image/jpeg', enhance: 'signature', note: 'Use clear ink as required by the notification. Cleanup helps small outputs.' },
  { id: 'ibps-thumb', group: 'IBPS/SBI', name: 'IBPS/SBI Left Thumb (240 × 240 px)', short: 'IBPS thumb', doc: 'thumb', w: 240, h: 240, dpi: 200, minKb: 20, maxKb: 50, fmt: 'image/jpeg', note: 'Verify ink colour and dimensions in the official instructions.' },
  { id: 'ibps-declaration', group: 'IBPS/SBI', name: 'IBPS/SBI Handwritten Declaration (800 × 400 px)', short: 'IBPS declaration', doc: 'declaration', w: 800, h: 400, dpi: 200, minKb: 50, maxKb: 100, fmt: 'image/jpeg', enhance: 'scan', note: 'Use the exact declaration text required for your application.' },
  { id: 'upsc-photo', group: 'UPSC', name: 'UPSC Photo/Signature (350 × 350 px example)', short: 'UPSC photo', doc: 'photo', w: 350, h: 350, dpi: 300, minKb: 20, maxKb: 300, fmt: 'image/jpeg', note: 'UPSC requirements vary by exam. Check the current notification, including name and date rules.' },
  { id: 'mpsc-photo', group: 'MPSC', name: 'MPSC Photo (3.5 × 4.5 cm)', short: 'MPSC photo', doc: 'photo', w: 276, h: 354, dpi: 200, minKb: 20, maxKb: 50, fmt: 'image/jpeg', note: 'Verify the current advertisement and portal requirements.' },
  { id: 'mpsc-signature', group: 'MPSC', name: 'MPSC Signature (3.5 × 1.5 cm)', short: 'MPSC signature', doc: 'signature', w: 276, h: 118, dpi: 200, minKb: 10, maxKb: 20, fmt: 'image/jpeg', enhance: 'signature', note: 'Verify exact dimensions before upload.' },
  { id: 'nta-photo', group: 'NTA', name: 'NTA Passport Photo (example)', short: 'NTA photo', doc: 'photo', w: 276, h: 354, dpi: 200, minKb: 10, maxKb: 200, fmt: 'image/jpeg', note: 'NTA specs differ by exam and session. Use the information bulletin.' },
  { id: 'nsdl-pan-photo', group: 'PAN', name: 'NSDL PAN Photo (276 × 197 px @ 200 DPI)', short: 'NSDL photo', doc: 'photo', w: 276, h: 197, dpi: 200, minKb: 10, maxKb: 50, fmt: 'image/jpeg', note: 'Approximate preset. Confirm NSDL requirements before upload.' },
  { id: 'nsdl-pan-signature', group: 'PAN', name: 'NSDL PAN Signature (157 × 354 px @ 200 DPI)', short: 'NSDL signature', doc: 'signature', w: 157, h: 354, dpi: 200, minKb: 10, maxKb: 50, fmt: 'image/jpeg', enhance: 'signature', note: 'Approximate preset. Confirm exact NSDL signature requirements.' },
  { id: 'uti-pan-photo', group: 'PAN', name: 'UTI PAN Photo (213 × 213 px)', short: 'UTI photo', doc: 'photo', w: 213, h: 213, dpi: 300, minKb: 3, maxKb: 30, fmt: 'image/jpeg', note: 'UTIITSL requirements can be strict. Verify the final file in the portal.' },
  { id: 'uti-pan-signature', group: 'PAN', name: 'UTI PAN Signature (400 × 200 px)', short: 'UTI signature', doc: 'signature', w: 400, h: 200, dpi: 600, minKb: 3, maxKb: 60, fmt: 'image/jpeg', enhance: 'signature', note: 'High-contrast signature preset. Verify UTIITSL instructions before upload.' },
];

const $ = (id) => document.getElementById(id);
const els = {
  themeToggle: $('themeToggle'),
  presetSelect: $('presetSelect'), docType: $('docType'), format: $('format'),
  widthPx: $('widthPx'), heightPx: $('heightPx'), dpi: $('dpi'),
  widthCm: $('widthCm'), heightCm: $('heightCm'), lockAspect: $('lockAspect'),
  minKb: $('minKb'), maxKb: $('maxKb'), autoCompress: $('autoCompress'), padToMin: $('padToMin'), presetNote: $('presetNote'),
  slateOn: $('slateOn'), slateName: $('slateName'), slateDate: $('slateDate'), slateText: $('slateText'),
  enhanceOn: $('enhanceOn'), enhanceMode: $('enhanceMode'), threshold: $('threshold'), thresholdVal: $('thresholdVal'),
  thickness: $('thickness'), thicknessVal: $('thicknessVal'), contrast: $('contrast'), contrastVal: $('contrastVal'),
  processBtn: $('processBtn'), downloadBtn: $('downloadBtn'), resetBtn: $('resetBtn'), status: $('status'),
  dropZone: $('dropZone'), fileInput: $('fileInput'),
  originalCanvas: $('originalCanvas'), outputCanvas: $('outputCanvas'),
  originalMeta: $('originalMeta'), outputMeta: $('outputMeta'),
  cropPanel: $('cropPanel'), cropCanvas: $('cropCanvas'), cropZoom: $('cropZoom'), cropZoomVal: $('cropZoomVal'),
  cropCenterBtn: $('cropCenterBtn'), cropFitBtn: $('cropFitBtn'), kitLink: $('kitLink'),
};

let sourceBitmap = null;
let sourceName = 'image', sourceBytes = 0, sourceW = 0, sourceH = 0;
let outputBlob = null;
let syncing = false;
let crop = { x: 0.5, y: 0.5, zoom: 1, dragging: false, start: null };

function setStatus(msg, cls = '') {
  if (!els.status) return;
  els.status.textContent = msg || '';
  els.status.className = 'status' + (cls ? ' ' + cls : '');
}

function cmToPx(cm, dpi) { return Math.max(1, Math.round((Number(cm) / 2.54) * Number(dpi))); }
function pxToCm(px, dpi) { const d = Number(dpi) || 200; return (Number(px) / d) * 2.54; }
function fmtBytes(bytes) { return (bytes / 1024).toFixed(1) + ' KB'; }
function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
function nextFrame() {
  // rAF does not fire in hidden/background tabs, so race it with a timer.
  return new Promise((resolve) => {
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    try { requestAnimationFrame(fin); } catch {}
    setTimeout(fin, 50);
  });
}

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#11161c' : '#ffffff');
  if (els.themeToggle) els.themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
}
function toggleTheme() { const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', next); applyTheme(next); }

function presetById(id) { return PRESETS.find((p) => p.id === id); }
function renderPresetChips(){
  const box = document.getElementById('presetChips');
  if (!box) return;
  box.innerHTML = '';
  for (const p of PRESETS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = p.short || p.name;
    b.dataset.presetId = p.id;
    b.setAttribute('aria-pressed', String(!!els.presetSelect && els.presetSelect.value === p.id));
    b.addEventListener('click', () => {
      if (!els.presetSelect) return;
      els.presetSelect.value = p.id;
      applyPreset(p);
      syncPresetChips();
    });
    box.appendChild(b);
  }
}
function syncPresetChips(){
  const box = document.getElementById('presetChips');
  if (!box) return;
  box.querySelectorAll('.chip').forEach((c) => {
    c.setAttribute('aria-pressed', String(!!els.presetSelect && c.dataset.presetId === els.presetSelect.value));
  });
}
function initPresets() {
  if (!els.presetSelect) return;
  const groups = {};
  for (const p of PRESETS) (groups[p.group] ||= []).push(p);
  els.presetSelect.innerHTML = '';
  for (const [group, items] of Object.entries(groups)) {
    const og = document.createElement('optgroup'); og.label = group;
    for (const p of items) { const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name; og.appendChild(opt); }
    els.presetSelect.appendChild(og);
  }
  const q = new URLSearchParams(location.search).get('preset');
  const initial = presetById(q) || presetById(document.documentElement.dataset.preset) || PRESETS[1] || PRESETS[0];
  els.presetSelect.value = initial.id;
  applyPreset(initial);
  renderPresetChips();
  syncPresetChips();
}

function applyPreset(p) {
  if (!p) return;
  syncing = true;
  if (els.docType) els.docType.value = p.doc || 'photo';
  if (els.format) els.format.value = p.fmt || 'image/jpeg';
  if (els.widthPx) els.widthPx.value = p.w;
  if (els.heightPx) els.heightPx.value = p.h;
  if (els.dpi) els.dpi.value = p.dpi || 200;
  if (els.widthCm) els.widthCm.value = pxToCm(p.w, els.dpi.value).toFixed(2);
  if (els.heightCm) els.heightCm.value = pxToCm(p.h, els.dpi.value).toFixed(2);
  if (els.minKb) els.minKb.value = p.minKb;
  if (els.maxKb) els.maxKb.value = p.maxKb;
  if (els.presetNote) els.presetNote.textContent = p.note || '';
  if (els.enhanceMode) els.enhanceMode.value = p.enhance || (p.doc === 'signature' ? 'signature' : p.doc === 'declaration' ? 'scan' : 'off');
  if (els.enhanceOn && els.enhanceMode) els.enhanceOn.checked = els.enhanceMode.value !== 'off';
  syncing = false;
  updateCropAspect();
  drawCropPreview();
}

function syncFromPx(source) {
  if (syncing) return;
  syncing = true;
  const dpi = Math.max(1, Number(els.dpi && els.dpi.value) || 200);
  let w = Math.max(1, Math.round(Number(els.widthPx && els.widthPx.value) || 1));
  let h = Math.max(1, Math.round(Number(els.heightPx && els.heightPx.value) || 1));
  if (els.lockAspect && els.lockAspect.checked && sourceW && sourceH && (source === 'w' || source === 'h')) {
    const ar = sourceW / sourceH;
    if (source === 'w') h = Math.max(1, Math.round(w / ar));
    if (source === 'h') w = Math.max(1, Math.round(h * ar));
    if (els.widthPx) els.widthPx.value = w; if (els.heightPx) els.heightPx.value = h;
  }
  if (els.widthCm) els.widthCm.value = pxToCm(w, dpi).toFixed(2);
  if (els.heightCm) els.heightCm.value = pxToCm(h, dpi).toFixed(2);
  syncing = false;
  updateCropAspect(); drawCropPreview();
}
function syncFromCm(source) {
  if (syncing) return;
  syncing = true;
  const dpi = Math.max(1, Number(els.dpi && els.dpi.value) || 200);
  let wc = Math.max(0.01, Number(els.widthCm && els.widthCm.value) || 1);
  let hc = Math.max(0.01, Number(els.heightCm && els.heightCm.value) || 1);
  if (els.lockAspect && els.lockAspect.checked && sourceW && sourceH && (source === 'w' || source === 'h')) {
    const ar = sourceW / sourceH;
    if (source === 'w') hc = wc / ar; if (source === 'h') wc = hc * ar;
    if (els.widthCm) els.widthCm.value = wc.toFixed(2); if (els.heightCm) els.heightCm.value = hc.toFixed(2);
  }
  if (els.widthPx) els.widthPx.value = cmToPx(wc, dpi);
  if (els.heightPx) els.heightPx.value = cmToPx(hc, dpi);
  syncing = false;
  updateCropAspect(); drawCropPreview();
}

function targetAspect() {
  const w = Math.max(1, Number(els.widthPx && els.widthPx.value) || 1);
  const h = Math.max(1, Number(els.heightPx && els.heightPx.value) || 1);
  return w / h;
}
function updateCropAspect() {
  if (!els.cropCanvas) return;
  const a = targetAspect();
  // set canvas drawing buffer with target aspect, capped for performance
  const baseW = 720;
  els.cropCanvas.width = baseW;
  els.cropCanvas.height = Math.max(120, Math.round(baseW / a));
  els.cropCanvas.style.aspectRatio = `${els.cropCanvas.width} / ${els.cropCanvas.height}`;
}
function resetCrop(fitMode) {
  crop.x = 0.5; crop.y = 0.5; crop.zoom = 1;
  if (els.cropZoom) els.cropZoom.value = '100';
  if (els.cropZoomVal) els.cropZoomVal.textContent = '100%';
  if (fitMode === 'fit' && sourceW && sourceH) { crop.zoom = 1; }
  drawCropPreview();
}
function getCropRect(frameW, frameH) {
  if (!sourceW || !sourceH) return { sx:0, sy:0, sw:sourceW, sh:sourceH };
  const zoom = Math.max(1, Number(crop.zoom) || 1);
  const frameA = frameW / frameH;
  const srcA = sourceW / sourceH;
  let sw, sh;
  if (srcA > frameA) { sh = sourceH / zoom; sw = sh * frameA; }
  else { sw = sourceW / zoom; sh = sw / frameA; }
  sw = Math.min(sourceW, sw); sh = Math.min(sourceH, sh);
  const sx = clamp((sourceW - sw) * crop.x, 0, Math.max(0, sourceW - sw));
  const sy = clamp((sourceH - sh) * crop.y, 0, Math.max(0, sourceH - sh));
  return { sx, sy, sw: Math.max(1, sw), sh: Math.max(1, sh) };
}
function drawCropPreview() {
  if (!els.cropCanvas || !els.cropPanel) return;
  if (!sourceBitmap) { els.cropPanel.hidden = true; return; }
  els.cropPanel.hidden = false;
  updateCropAspect();
  const c = els.cropCanvas, ctx = c.getContext('2d');
  ctx.fillStyle = '#11161c'; ctx.fillRect(0,0,c.width,c.height);
  const r = getCropRect(c.width, c.height);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceBitmap, r.sx, r.sy, r.sw, r.sh, 0, 0, c.width, c.height);
  // subtle frame
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(1,1,c.width-2,c.height-2);
}

function releaseSource() { if (sourceBitmap && typeof sourceBitmap.close === 'function') { try { sourceBitmap.close(); } catch {} } sourceBitmap = null; }
function drawPreview(img, canvas, maxW) {
  if (!canvas) return;
  const sw = img.width || img.naturalWidth, sh = img.height || img.naturalHeight;
  const scale = Math.min(1, maxW / sw, 420 / sh);
  canvas.width = Math.max(1, Math.round(sw * scale)); canvas.height = Math.max(1, Math.round(sh * scale));
  const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

async function loadFile(file) {
  if (!file) return;
  setStatus('Loading image...', '');
  outputBlob = null; if (els.downloadBtn) els.downloadBtn.disabled = true;
  releaseSource();
  try {
    let img;
    if (window.createImageBitmap) img = await createImageBitmap(file, { imageOrientation: 'from-image' });
    else img = await new Promise((resolve, reject) => { const el = new Image(); const url = URL.createObjectURL(file); el.onload=()=>{URL.revokeObjectURL(url);resolve(el);}; el.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('decode'));}; el.src=url; });
    sourceBitmap = img; sourceName = file.name || 'image'; sourceBytes = file.size || 0; sourceW = img.width || img.naturalWidth; sourceH = img.height || img.naturalHeight;
    if (els.originalCanvas) drawPreview(img, els.originalCanvas, 900);
    if (els.outputCanvas) drawPreview(img, els.outputCanvas, 900);
    if (els.originalMeta) els.originalMeta.textContent = `File: ${sourceName}\nPixels: ${sourceW} × ${sourceH}\nSize: ${fmtBytes(sourceBytes)}`;
    if (els.outputMeta) els.outputMeta.textContent = 'Not processed yet.';
    if (els.processBtn) els.processBtn.disabled = false;
    resetCrop('cover'); drawCropPreview();
    setStatus('Image loaded. Adjust crop/settings, then click Process image.', 'ok');
  } catch (e) { setStatus('This image could not be loaded. Try JPG or PNG. Some HEIC files may not be supported by your browser.', 'err'); }
}

function makeCanvas(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function applyEnhancer(srcCanvas) {
  if (!els.enhanceOn || !els.enhanceOn.checked || !els.enhanceMode || els.enhanceMode.value === 'off') return srcCanvas;
  const mode = els.enhanceMode.value;
  const threshold = Number(els.threshold && els.threshold.value) || 160;
  const thickness = Math.max(0, Math.min(2, Number(els.thickness && els.thickness.value) || 0));
  const contrast = (Number(els.contrast && els.contrast.value) || 115) / 100;
  const w = srcCanvas.width, h = srcCanvas.height;
  const out = makeCanvas(w,h), ctx = out.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(srcCanvas,0,0);
  const img = ctx.getImageData(0,0,w,h), d = img.data, n = w*h;
  const gray = new Uint8ClampedArray(n);
  for (let i=0,p=0;p<n;i+=4,p++){ let g=d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114; g=(g-128)*contrast+128; gray[p]=g<0?0:g>255?255:g; }
  if (mode==='signature') {
    const map = new Uint8ClampedArray(n);
    for (let p=0;p<n;p++) map[p]=gray[p]<threshold?0:255;
    if (thickness>0) dilateInPlace(map,w,h,thickness);
    for (let i=0,p=0;p<n;i+=4,p++){ const v=map[p]; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
  } else {
    const cut = Math.min(threshold,245);
    for (let i=0,p=0;p<n;i+=4,p++){ const v=gray[p]<cut?Math.round(gray[p]*0.72):255; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
  }
  ctx.putImageData(img,0,0); return out;
}
function dilateInPlace(src,w,h,radius){ let cur=src; for(let r=0;r<radius;r++){ const next=new Uint8ClampedArray(cur.length); next.fill(255); for(let y=0;y<h;y++){ const yw=y*w; for(let x=0;x<w;x++){ if(cur[yw+x]!==0) continue; const y0=y>0?y-1:0,y1=y+1<h?y+1:h-1,x0=x>0?x-1:0,x1=x+1<w?x+1:w-1; for(let yy=y0;yy<=y1;yy++){ const row=yy*w; for(let xx=x0;xx<=x1;xx++) next[row+xx]=0; } } } cur=next; } if(cur!==src) src.set(cur); }
function drawSlate(ctx,w,h){ if(!els.slateOn||!els.slateOn.checked) return; const name=(els.slateName&&els.slateName.value||'').trim(); const dateVal=els.slateDate&&els.slateDate.value; let date=''; if(dateVal){ try{ date=new Date(dateVal+'T00:00:00').toLocaleDateString('en-IN'); }catch{ date=dateVal; } } let text=(els.slateText&&els.slateText.value||'').trim(); if(!text) text=[name,date?'DOP: '+date:''].filter(Boolean).join(' | '); if(!text) return; const stripH=Math.max(16,Math.round(h*0.11)); ctx.fillStyle='#fff'; ctx.fillRect(0,h-stripH,w,stripH); ctx.strokeStyle='#d0d7de'; ctx.strokeRect(0,h-stripH,w,stripH); ctx.fillStyle='#111827'; ctx.textAlign='center'; ctx.textBaseline='middle'; let fs=Math.max(9,Math.round(stripH*0.42)); ctx.font='600 '+fs+'px Arial,sans-serif'; while(ctx.measureText(text).width>w-10&&fs>8){ fs--; ctx.font='600 '+fs+'px Arial,sans-serif'; } ctx.fillText(text,w/2,h-stripH/2+0.5); }
function findApp0Segment(bytes){
  // Walk JPEG marker segments and return the first APP0 (JFIF) segment, if any.
  let i = 2;
  while (i + 4 <= bytes.length) {
    if (bytes[i] !== 0xFF) break;
    const marker = bytes[i + 1];
    if (marker === 0xD8 || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) { i += 2; continue; }
    if (marker === 0xDA || marker === 0xD9) break; // start of scan / end of image
    const len = (bytes[i + 2] << 8) | bytes[i + 3];
    if (len < 2) break;
    if (marker === 0xE0) return { start: i, segSize: 2 + len };
    i += 2 + len;
  }
  return null;
}
function injectJpegDpi(blob, dpi){
  return blob.arrayBuffer().then((buf) => {
    const bytes = new Uint8Array(buf);
    if (bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) return blob;
    const d = Math.max(1, Math.min(65535, Math.round(Number(dpi) || 200)));
    // APP0 / JFIF 1.01, units = dots per inch, Xdensity = Ydensity = d
    const app0 = new Uint8Array([0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,0x01,0x01,(d>>8)&255,d&255,(d>>8)&255,d&255,0x00,0x00]);
    const seg = findApp0Segment(bytes);
    if (seg) {
      // Replace the existing APP0 segment (marker + segment bytes).
      const out = new Uint8Array(bytes.length - seg.segSize + app0.length);
      out.set(bytes.subarray(0, 2), 0);
      out.set(app0, 2);
      out.set(bytes.subarray(seg.start + seg.segSize), 2 + app0.length);
      return new Blob([out], { type: 'image/jpeg' });
    }
    // No APP0 present: insert one right after the SOI marker.
    const out = new Uint8Array(bytes.length + app0.length);
    out.set(bytes.subarray(0, 2), 0);
    out.set(app0, 2);
    out.set(bytes.subarray(2), 2 + app0.length);
    return new Blob([out], { type: 'image/jpeg' });
  });
}
function canvasToBlob(canvas,type,quality){ return new Promise((resolve)=>canvas.toBlob((b)=>resolve(b),type,quality)); }
function addLightNoise(canvas, alpha, density){
  // Adds near-invisible speckle so a very small image can reach a portal's MINIMUM KB rule.
  const w = canvas.width, h = canvas.height;
  const c = makeCanvas(w, h);
  const g = c.getContext('2d');
  g.drawImage(canvas, 0, 0);
  const count = Math.max(60, Math.round(w * h * density));
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w), y = Math.floor(Math.random() * h);
    const v = Math.random() < 0.5 ? 0 : 255;
    g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + alpha + ')';
    g.fillRect(x, y, 1, 1);
  }
  return c;
}
async function compressToTarget(canvas,type,minKb,maxKb,dpi,auto,pad){
  if (type !== 'image/jpeg' || !auto) {
    const blob = await canvasToBlob(canvas, type, type === 'image/png' ? 1 : 0.92);
    if (!blob) throw new Error('encode');
    const out = type === 'image/jpeg' ? await injectJpegDpi(blob, dpi) : blob;
    return { blob: out, note: type === 'image/png' ? 'PNG exported. JPG works best for KB limits.' : 'JPG exported. Target KB is off.' };
  }
  const minB = Math.max(1, Number(minKb) || 1) * 1024;
  const maxB = Math.max(Number(maxKb) || Number(minKb) || 1, Number(minKb) || 1) * 1024;
  const safeMax = Math.max(minB, maxB - 64); // leave room for the DPI header we add at the end
  let quality = 0.92;
  let best = null;
  for (let i = 0; i < 10; i++) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (!blob) throw new Error('encode');
    best = blob;
    if (blob.size >= minB && blob.size <= safeMax) {
      return { blob: await injectJpegDpi(blob, dpi), note: 'Target KB met.' };
    }
    if (blob.size > safeMax) {
      const factor = Math.max(0.05, safeMax / blob.size);
      let next = quality * Math.pow(factor, 0.7);
      if (next > quality - 0.02) next = quality - 0.02;
      if (next < 0.2) {
        return { blob: await injectJpegDpi(best, dpi), note: 'Cannot reach ' + maxKb + ' KB at this pixel size even at the lowest quality (' + fmtBytes(best.size) + '). Reduce dimensions or use a simpler background.' };
      }
      quality = next;
    } else {
      const next = quality + 0.06;
      if (next > 0.98) {
        if (pad) {
          const levels = [[0.03,0.08],[0.05,0.2],[0.08,0.45],[0.12,0.9],[0.18,1.6],[0.25,2.6],[0.35,4.0],[0.45,6.0]];
          for (const lv of levels) {
            const padded = addLightNoise(canvas, lv[0], lv[1]);
            const b = await canvasToBlob(padded, 'image/jpeg', 0.92);
            if (!b) continue;
            if (b.size >= minB) {
              return { blob: await injectJpegDpi(b, dpi), note: 'Minimum KB reached by adding light noise (visually near-unchanged).' };
            }
            best = b;
          }
        }
        return { blob: await injectJpegDpi(best, dpi), note: 'Smallest possible output here is ' + fmtBytes(best.size) + ' (below ' + minKb + ' KB).' };
      }
      quality = next;
    }
  }
  const finalBlob = await injectJpegDpi(best, dpi);
  return { blob: finalBlob, note: finalBlob.size > maxB ? 'Closest result is ' + fmtBytes(finalBlob.size) + ' (above ' + maxKb + ' KB).' : 'Result: ' + fmtBytes(finalBlob.size) + '.' };
}

async function processFromBitmap(bitmap, settings) {
  const outW = Math.max(1, Math.min(12000, Math.round(Number(settings.widthPx) || 1)));
  const outH = Math.max(1, Math.min(12000, Math.round(Number(settings.heightPx) || 1)));
  const type = settings.format || 'image/jpeg';
  const dpi = Math.max(1, Number(settings.dpi) || 200);
  const bw = bitmap.width || bitmap.naturalWidth, bh = bitmap.height || bitmap.naturalHeight;
  const src = settings.cropRect || { sx: 0, sy: 0, sw: bw, sh: bh };
  const cropRect = {
    sx: Math.max(0, Number(src.sx) || 0),
    sy: Math.max(0, Number(src.sy) || 0),
    sw: Math.max(1, Number(src.sw) || bw),
    sh: Math.max(1, Number(src.sh) || bh),
  };
  const maxWork = (settings.enhanceOn && settings.enhanceMode !== 'off') ? 1800 : 2400;
  const scale = Math.min(1, maxWork / cropRect.sw, maxWork / cropRect.sh);
  const workW = Math.max(1, Math.round(cropRect.sw * scale)), workH = Math.max(1, Math.round(cropRect.sh * scale));
  let work = makeCanvas(workW, workH);
  let wctx = work.getContext('2d'); wctx.fillStyle='#fff'; wctx.fillRect(0,0,workW,workH);
  wctx.drawImage(bitmap, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, workW, workH);
  // apply enhancer using settings (temporarily read from settings via helper)
  work = applyEnhancerWithSettings(work, settings);
  const out = makeCanvas(outW, outH);
  const ctx = out.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,outW,outH);
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.drawImage(work, 0, 0, outW, outH);
  drawSlateWithSettings(ctx, outW, outH, settings);
  const { blob, note } = await compressToTarget(out, type, settings.minKb, settings.maxKb, dpi, settings.autoCompress !== false, !!settings.padToMin);
  return { blob, note, outW, outH, canvas: out };
}
function applyEnhancerWithSettings(srcCanvas, s) {
  if (!s.enhanceOn || s.enhanceMode === 'off') return srcCanvas;
  // reuse DOM-based function by temporarily? easier: inline logic
  const mode=s.enhanceMode, threshold=Number(s.threshold)||160, thickness=Math.max(0,Math.min(2,Number(s.thickness)||0)), contrast=(Number(s.contrast)||115)/100;
  const w=srcCanvas.width,h=srcCanvas.height,out=makeCanvas(w,h),ctx=out.getContext('2d',{willReadFrequently:true}); ctx.drawImage(srcCanvas,0,0);
  const img=ctx.getImageData(0,0,w,h),d=img.data,n=w*h,gray=new Uint8ClampedArray(n);
  for(let i=0,p=0;p<n;i+=4,p++){ let g=d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114; g=(g-128)*contrast+128; gray[p]=g<0?0:g>255?255:g; }
  if(mode==='signature'){ const map=new Uint8ClampedArray(n); for(let p=0;p<n;p++) map[p]=gray[p]<threshold?0:255; if(thickness>0) dilateInPlace(map,w,h,thickness); for(let i=0,p=0;p<n;i+=4,p++){ const v=map[p]; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; } }
  else { const cut=Math.min(threshold,245); for(let i=0,p=0;p<n;i+=4,p++){ const v=gray[p]<cut?Math.round(gray[p]*0.72):255; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; } }
  ctx.putImageData(img,0,0); return out;
}
function drawSlateWithSettings(ctx,w,h,s){ if(!s.slateOn) return; const name=(s.slateName||'').trim(); let date=''; if(s.slateDate){ try{ date=new Date(s.slateDate+'T00:00:00').toLocaleDateString('en-IN'); }catch{ date=s.slateDate; } } let text=(s.slateText||'').trim(); if(!text) text=[name,date?'DOP: '+date:''].filter(Boolean).join(' | '); if(!text) return; const stripH=Math.max(16,Math.round(h*0.11)); ctx.fillStyle='#fff'; ctx.fillRect(0,h-stripH,w,stripH); ctx.strokeStyle='#d0d7de'; ctx.strokeRect(0,h-stripH,w,stripH); ctx.fillStyle='#111827'; ctx.textAlign='center'; ctx.textBaseline='middle'; let fs=Math.max(9,Math.round(stripH*0.42)); ctx.font='600 '+fs+'px Arial,sans-serif'; while(ctx.measureText(text).width>w-10&&fs>8){ fs--; ctx.font='600 '+fs+'px Arial,sans-serif'; } ctx.fillText(text,w/2,h-stripH/2+0.5); }

function currentSettings() {
  return {
    widthPx: els.widthPx && els.widthPx.value, heightPx: els.heightPx && els.heightPx.value, dpi: els.dpi && els.dpi.value,
    format: els.format && els.format.value, minKb: els.minKb && els.minKb.value, maxKb: els.maxKb && els.maxKb.value,
    autoCompress: els.autoCompress ? els.autoCompress.checked : true,
    padToMin: els.padToMin ? els.padToMin.checked : false,
    enhanceOn: els.enhanceOn ? els.enhanceOn.checked : false, enhanceMode: els.enhanceMode && els.enhanceMode.value,
    threshold: els.threshold && els.threshold.value, thickness: els.thickness && els.thickness.value, contrast: els.contrast && els.contrast.value,
    slateOn: els.slateOn ? els.slateOn.checked : false, slateName: els.slateName && els.slateName.value, slateDate: els.slateDate && els.slateDate.value, slateText: els.slateText && els.slateText.value,
    cropRect: (els.cropCanvas && sourceW && sourceH) ? getCropRect(els.cropCanvas.width, els.cropCanvas.height) : (sourceW?{sx:0,sy:0,sw:sourceW,sh:sourceH}:null),
  };
}

async function processImage() {
  if (!sourceBitmap) return;
  if (els.processBtn) els.processBtn.disabled = true;
  if (els.downloadBtn) els.downloadBtn.disabled = true;
  setStatus('Processing image...', ''); await nextFrame();
  try {
    const settings = currentSettings();
    const { blob, note, outW, outH, canvas } = await processFromBitmap(sourceBitmap, settings);
    outputBlob = blob;
    if (els.outputCanvas) { els.outputCanvas.width = outW; els.outputCanvas.height = outH; els.outputCanvas.getContext('2d').drawImage(canvas,0,0); }
    const minKb = Number(settings.minKb)||1, maxKb = Math.max(minKb, Number(settings.maxKb)||minKb);
    const sizeKb = blob.size/1024;
    const inRange = settings.format !== 'image/jpeg' || !settings.autoCompress ? true : (sizeKb >= minKb && sizeKb <= maxKb);
    if (els.outputMeta) els.outputMeta.textContent = `Pixels: ${outW} × ${outH}\nDPI: ${settings.dpi}\nFormat: ${blob.type}\nSize: ${fmtBytes(blob.size)}\nTarget: ${minKb}–${maxKb} KB${settings.format==='image/jpeg'&&settings.autoCompress ? (inRange?' (within range)':' (outside range)') : ''}\n${note}`;
    setStatus(inRange ? 'Output ready. ' + (note||'') : 'Output ready, but outside target KB. ' + (note||''), inRange ? 'ok' : 'warn');
    if (els.downloadBtn) els.downloadBtn.disabled = false;
  } catch (e) {
    console.error(e);
    const detail = e && e.message ? ' (' + e.message + ')' : '';
    setStatus('Could not process this image' + detail + '. Try JPG/PNG, or adjust the size/format settings.', 'err');
  }
  finally { if (els.processBtn) els.processBtn.disabled = !sourceBitmap; }
}

function downloadOutput() {
  if (!outputBlob) return;
  const ext = outputBlob.type === 'image/png' ? 'png' : 'jpg';
  const base = (sourceName||'image').replace(/\.[^.]+$/,'').replace(/[^\w.-]+/g,'_').slice(0,60) || 'image';
  const name = `${base}_${els.widthPx?els.widthPx.value:'out'}x${els.heightPx?els.heightPx.value:'out'}_${els.docType?els.docType.value:'output'}.${ext}`;
  const a = document.createElement('a'), url = URL.createObjectURL(outputBlob);
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}

function resetAll() {
  releaseSource(); sourceName='image'; sourceBytes=0; sourceW=0; sourceH=0; outputBlob=null;
  if (els.fileInput) els.fileInput.value = '';
  [els.originalCanvas, els.outputCanvas].forEach((c)=>{ if(!c) return; c.width=320; c.height=180; c.getContext('2d').clearRect(0,0,c.width,c.height); });
  if (els.originalMeta) els.originalMeta.textContent = '';
  if (els.outputMeta) els.outputMeta.textContent = '';
  if (els.processBtn) els.processBtn.disabled = true;
  if (els.downloadBtn) els.downloadBtn.disabled = true;
  if (els.cropPanel) els.cropPanel.hidden = true;
  setStatus('Select an image to begin.');
}

function bindCropEvents() {
  if (!els.cropCanvas) return;
  const c = els.cropCanvas;
  const pos = (e) => { const r=c.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return { x:(t.clientX-r.left)/r.width, y:(t.clientY-r.top)/r.height }; };
  const start = (e) => { if(!sourceBitmap) return; crop.dragging=true; crop.start=pos(e); c.classList.add('dragging'); e.preventDefault(); };
  const move = (e) => { if(!crop.dragging) return; const p=pos(e); crop.x = clamp(crop.x - (p.x-crop.start.x), 0, 1); crop.y = clamp(crop.y - (p.y-crop.start.y), 0, 1); crop.start=p; drawCropPreview(); e.preventDefault(); };
  const end = () => { crop.dragging=false; c.classList.remove('dragging'); };
  c.addEventListener('mousedown', start); window.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
  c.addEventListener('touchstart', start, {passive:false}); window.addEventListener('touchmove', move, {passive:false}); window.addEventListener('touchend', end);
  if (els.cropZoom) els.cropZoom.addEventListener('input', ()=>{ crop.zoom = Number(els.cropZoom.value)/100; if(els.cropZoomVal) els.cropZoomVal.textContent = els.cropZoom.value+'%'; drawCropPreview(); });
  if (els.cropCenterBtn) els.cropCenterBtn.addEventListener('click', ()=>{ crop.x=0.5; crop.y=0.5; drawCropPreview(); });
  if (els.cropFitBtn) els.cropFitBtn.addEventListener('click', ()=>resetCrop('fit'));
}

function bindEvents() {
  if (els.themeToggle) els.themeToggle.addEventListener('click', toggleTheme);
  if (els.presetSelect) els.presetSelect.addEventListener('change', () => { applyPreset(presetById(els.presetSelect.value)); syncPresetChips(); });
  if (els.widthPx) els.widthPx.addEventListener('input', () => syncFromPx('w'));
  if (els.heightPx) els.heightPx.addEventListener('input', () => syncFromPx('h'));
  if (els.widthCm) els.widthCm.addEventListener('input', () => syncFromCm('w'));
  if (els.heightCm) els.heightCm.addEventListener('input', () => syncFromCm('h'));
  if (els.dpi) els.dpi.addEventListener('input', () => syncFromPx());
  if (els.threshold) els.threshold.addEventListener('input', () => { if(els.thresholdVal) els.thresholdVal.textContent = els.threshold.value; });
  if (els.thickness) els.thickness.addEventListener('input', () => { if(els.thicknessVal) els.thicknessVal.textContent = els.thickness.value; });
  if (els.contrast) els.contrast.addEventListener('input', () => { if(els.contrastVal) els.contrastVal.textContent = els.contrast.value + '%'; });
  if (els.enhanceMode) els.enhanceMode.addEventListener('change', () => { if(els.enhanceOn) els.enhanceOn.checked = els.enhanceMode.value !== 'off'; });
  if (els.processBtn) els.processBtn.addEventListener('click', processImage);
  if (els.downloadBtn) els.downloadBtn.addEventListener('click', downloadOutput);
  if (els.resetBtn) els.resetBtn.addEventListener('click', resetAll);
  if (els.fileInput) els.fileInput.addEventListener('change', (e) => loadFile(e.target.files && e.target.files[0]));
  if (els.dropZone) {
    ['dragenter','dragover'].forEach((ev)=>els.dropZone.addEventListener(ev,(e)=>{ e.preventDefault(); els.dropZone.classList.add('drag'); }));
    ['dragleave','drop'].forEach((ev)=>els.dropZone.addEventListener(ev,(e)=>{ e.preventDefault(); els.dropZone.classList.remove('drag'); }));
    els.dropZone.addEventListener('drop',(e)=>loadFile(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]));
  }
  bindCropEvents();
}

// Expose core for kit page
window.ExamResizer = { PRESETS, presetById, processFromBitmap, loadBitmapFromFile: async (file) => {
  if (window.createImageBitmap) return createImageBitmap(file, { imageOrientation: 'from-image' });
  return new Promise((resolve,reject)=>{ const el=new Image(), url=URL.createObjectURL(file); el.onload=()=>{URL.revokeObjectURL(url);resolve(el);}; el.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('decode'));}; el.src=url; });
}, fmtBytes, applyTheme, getPreferredTheme, toggleTheme };

applyTheme(getPreferredTheme());
initPresets();
bindEvents();
if (els.thresholdVal && els.threshold) els.thresholdVal.textContent = els.threshold.value;
if (els.thicknessVal && els.thickness) els.thicknessVal.textContent = els.thickness.value;
if (els.contrastVal && els.contrast) els.contrastVal.textContent = els.contrast.value + '%';
if (els.slateDate && !els.slateDate.value) els.slateDate.valueAsDate = new Date();
resetAll();
setStatus('Select a preset, upload an image, adjust crop/settings, and process it. Files are processed in your browser.');
