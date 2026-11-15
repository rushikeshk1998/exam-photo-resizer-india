/* Minimal ZIP (stored, no compression) for client-side downloads. */
(function (global) {
  function u16(n) { return [n & 255, (n >>> 8) & 255]; }
  function u32(n) { return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]; }
  function strBytes(s) { return new TextEncoder().encode(s); }
  function crc32(buf) {
    let c = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) {
      c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xff];
    }
    return (c ^ -1) >>> 0;
  }
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  async function createZip(files) {
    // files: [{name, blob}]
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2)) & 0xffff;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;
    for (const file of files) {
      const name = strBytes(file.name);
      const data = new Uint8Array(await file.blob.arrayBuffer());
      const crc = crc32(data);
      const size = data.length;
      const local = new Uint8Array(30 + name.length + data.length);
      local.set([0x50,0x4b,0x03,0x04, 20,0, 0,0, 0,0, ...u16(dosTime), ...u16(dosDate), ...u32(crc), ...u32(size), ...u32(size), ...u16(name.length), 0,0], 0);
      local.set(name, 30);
      local.set(data, 30 + name.length);
      localParts.push(local);

      const central = new Uint8Array(46 + name.length);
      central.set([0x50,0x4b,0x01,0x02, 20,0, 20,0, 0,0, 0,0, ...u16(dosTime), ...u16(dosDate), ...u32(crc), ...u32(size), ...u32(size), ...u16(name.length), 0,0, 0,0, 0,0, 0,0, 0,0,0,0, ...u32(offset)], 0);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.length;
    }
    const centralSize = centralParts.reduce((a, b) => a + b.length, 0);
    const end = new Uint8Array(22);
    end.set([0x50,0x4b,0x05,0x06, 0,0, 0,0, ...u16(files.length), ...u16(files.length), ...u32(centralSize), ...u32(offset), 0,0], 0);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  }

  global.ZipStore = { createZip };
})(window);
