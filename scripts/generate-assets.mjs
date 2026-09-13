#!/usr/bin/env node
/**
 * Generate the three occult sigil PNGs (eye, goat, sun) used by the scene.
 *
 * We hand-draw stylised sigils onto a small bitmap and emit PNGs via Node's
 * built-in zlib. No external dependencies. These are placeholder-but-intentional
 * graphics that match the aesthetic; designers can replace the files in
 * public/sprites/ at any time without touching code.
 */
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(import.meta.dirname, '..', 'public', 'sprites');
fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 256;
const H = 256;

function crc32(buf) {
  let c;
  const table =
    crc32.table ||
    (crc32.table = (() => {
      const t = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
      }
      return t;
    })());
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function writePNG(filename, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const stride = W * 4 + 1;
  const raw = Buffer.alloc(stride * H);
  for (let y = 0; y < H; y++) {
    raw[y * stride] = 0; // filter: None
    rgba.copy(raw, y * stride + 1, y * W * 4, (y + 1) * W * 4);
  }
  const idat = zlib.deflateSync(raw);
  const iend = Buffer.alloc(0);
  const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', iend)]);
  fs.writeFileSync(path.join(OUT_DIR, filename), png);
  console.log('wrote', filename, `(${png.length} bytes)`);
}

function makeCanvas() {
  return Buffer.alloc(W * H * 4); // transparent
}

function setPx(buf, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = r;
  buf[i + 1] = g;
  buf[i + 2] = b;
  buf[i + 3] = a;
}

// Thick antialiased-ish line using Xiaolin Wu-lite / Bresenham with width
function line(buf, x0, y0, x1, y1, setPixel, w = 2) {
  const dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0,
    y = y0;
  while (true) {
    for (let ox = -w; ox <= w; ox++)
      for (let oy = -w; oy <= w; oy++) if (ox * ox + oy * oy <= w * w + 1) setPixel(x + ox, y + oy);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

function circle(buf, cx, cy, r, setPixel, w = 2) {
  let x = r,
    y = 0,
    err = 1 - r;
  while (x >= y) {
    for (let i = -(w >> 1); i <= w - (w >> 1) - (w & 1 ? 0 : 1); i++) {
      for (let j = -1; j <= 1; j++) setPixel(cx + x + i, cy + y + j);
      for (let j = -1; j <= 1; j++) setPixel(cx + y + i, cy + x + j);
      for (let j = -1; j <= 1; j++) setPixel(cx - y + i, cy + x + j);
      for (let j = -1; j <= 1; j++) setPixel(cx - x + i, cy + y + j);
      for (let j = -1; j <= 1; j++) setPixel(cx - x + i, cy - y + j);
      for (let j = -1; j <= 1; j++) setPixel(cx - y + i, cy - x + j);
      for (let j = -1; j <= 1; j++) setPixel(cx + y + i, cy - x + j);
      for (let j = -1; j <= 1; j++) setPixel(cx + x + i, cy - y + j);
    }
    y++;
    if (err < 0) err += 2 * y + 1;
    else {
      x--;
      err += 2 * (y - x + 1);
    }
  }
}

function fillCircle(buf, cx, cy, r, setPixel) {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) setPixel(cx + x, cy + y);
    }
  }
}

// Palette: white-on-transparent so Three.js tint/mix-blend-mode recolors it
const white = (buf) => (x, y) => setPx(buf, x, y, 255, 255, 255, 255);

// ---------- EYE (all-seeing eye in triangle) ----------
{
  const buf = makeCanvas();
  const p = white(buf);
  // Triangle pointing up
  const apex = [W / 2, 36],
    bl = [28, H - 36],
    br = [W - 28, H - 36];
  line(buf, apex[0], apex[1], bl[0], bl[1], p, 4);
  line(buf, bl[0], bl[1], br[0], br[1], p, 4);
  line(buf, br[0], br[1], apex[0], apex[1], p, 4);
  // Eye: almond shape approximated by two arcs
  const ecx = W / 2,
    ecy = H / 2 - 10;
  const erx = 76,
    ery = 36;
  for (let a = 0; a <= Math.PI * 2; a += 0.01) {
    const x = Math.round(ecx + Math.cos(a) * erx);
    const y = Math.round(ecy + Math.sin(a) * ery);
    for (let w = -2; w <= 2; w++) setPx(buf, x + w, y, 255, 255, 255, 255);
  }
  // Pupil
  fillCircle(buf, ecx, ecy, 16, p);
  // Iris circle
  circle(buf, ecx, ecy, 26, p, 2);
  // Eyelid beams
  for (let i = -3; i <= 3; i++) {
    line(buf, ecx + i * 10, apex[1] + 30, ecx + i * 6, ecy - ery - 4, p, 1);
  }
  writePNG('eye.png', buf);
}

// ---------- GOAT (Baphomet head / sigil of the goat) ----------
{
  const buf = makeCanvas();
  const p = white(buf);
  // Pentagram outline
  const cx = W / 2,
    cy = H / 2 + 10,
    R = 104;
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * ((2 * Math.PI * 2) / 5); // 2-step = star
    pts.push([Math.round(cx + R * Math.cos(a)), Math.round(cy + R * Math.sin(a))]);
  }
  for (let i = 0; i < 5; i++) {
    line(buf, pts[i][0], pts[i][1], pts[(i + 2) % 5][0], pts[(i + 2) % 5][1], p, 3);
  }
  // Horns: two curves above the pentagram
  for (let t = -1; t <= 1; t += 2) {
    const hx = cx + t * 40,
      hy = cy - R - 10;
    line(buf, hx, hy + 30, hx + t * 12, hy - 10, p, 3);
    line(buf, hx + t * 12, hy - 10, hx + t * 28, hy - 30, p, 3);
    line(buf, hx + t * 28, hy - 30, hx + t * 30, hy - 52, p, 3);
  }
  // Ears (triangles)
  line(buf, cx - 54, cy - 40, cx - 86, cy - 80, p, 3);
  line(buf, cx - 86, cy - 80, cx - 40, cy - 68, p, 3);
  line(buf, cx + 54, cy - 40, cx + 86, cy - 80, p, 3);
  line(buf, cx + 86, cy - 80, cx + 40, cy - 68, p, 3);
  // Eyes (red dots rendered via mix-blend: just holes in white is tricky; keep white)
  fillCircle(buf, cx - 28, cy - 10, 8, p);
  fillCircle(buf, cx + 28, cy - 10, 8, p);
  // Snout / goatee
  circle(buf, cx, cy + 16, 22, p, 3);
  line(buf, cx - 8, cy + 34, cx - 4, cy + 60, p, 2);
  line(buf, cx + 8, cy + 34, cx + 4, cy + 60, p, 2);
  // Pentagram circumcircle
  circle(buf, cx, cy, R + 12, p, 2);
  writePNG('goat.png', buf);
}

// ---------- SUN (chaos star / sun wheel) ----------
{
  const buf = makeCanvas();
  const p = white(buf);
  const cx = W / 2,
    cy = H / 2;
  // 8-pointed chaos star
  const R = 92;
  const r = 36;
  const points = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    points.push([Math.round(cx + rad * Math.cos(a)), Math.round(cy + rad * Math.sin(a))]);
  }
  for (let i = 0; i < 16; i++) {
    line(buf, points[i][0], points[i][1], points[(i + 1) % 16][0], points[(i + 1) % 16][1], p, 3);
  }
  // Central disc
  fillCircle(buf, cx, cy, 18, p);
  // Outer halo: dashes
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x1 = Math.round(cx + (R + 14) * Math.cos(a));
    const y1 = Math.round(cy + (R + 14) * Math.sin(a));
    const x2 = Math.round(cx + (R + 28) * Math.cos(a));
    const y2 = Math.round(cy + (R + 28) * Math.sin(a));
    line(buf, x1, y1, x2, y2, p, 2);
  }
  // Circle around star
  circle(buf, cx, cy, R + 6, p, 2);
  writePNG('sun.png', buf);
}

// ---------- FAVICON (conic vortex) ----------
{
  const FW = 64,
    FH = 64;
  const buf = Buffer.alloc(FW * FH * 4);
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= FW || y < 0 || y >= FH) return;
    const i = (y * FW + x) * 4;
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
  };
  const cx = FW / 2,
    cy = FH / 2,
    r = FW / 2 - 2;
  for (let y = 0; y < FH; y++) {
    for (let x = 0; x < FW; x++) {
      const dx = x - cx + 0.5,
        dy = y - cy + 0.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > r) continue;
      const ang = Math.atan2(dy, dx);
      const hue = (ang / (Math.PI * 2) + 0.5 + d / (r * 3)) % 1;
      // simple HSL-to-RGB for S=1, L=0.5
      const h6 = hue * 6;
      const c = 1;
      const x2 = c * (1 - Math.abs((h6 % 2) - 1));
      let rr = 0,
        gg = 0,
        bb = 0;
      if (h6 < 1) {
        rr = c;
        gg = x2;
      } else if (h6 < 2) {
        rr = x2;
        gg = c;
      } else if (h6 < 3) {
        gg = c;
        bb = x2;
      } else if (h6 < 4) {
        gg = x2;
        bb = c;
      } else if (h6 < 5) {
        rr = x2;
        bb = c;
      } else {
        rr = c;
        bb = x2;
      }
      set(x, y, Math.round(rr * 255), Math.round(gg * 255), Math.round(bb * 255), 255);
    }
  }
  // emit PNG
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(FW, 0);
  ihdr.writeUInt32BE(FH, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const stride = FW * 4 + 1;
  const raw = Buffer.alloc(stride * FH);
  for (let y = 0; y < FH; y++) {
    raw[y * stride] = 0;
    buf.copy(raw, y * stride + 1, y * FW * 4, (y + 1) * FW * 4);
  }
  const idat = zlib.deflateSync(raw);
  const iend = Buffer.alloc(0);
  const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', iend)]);
  fs.writeFileSync(
    path.resolve(OUT_DIR, '..', 'favicon.svg'),
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <conicGradient id="g">
      <stop offset="0%" stop-color="#ff0000"/>
      <stop offset="16%" stop-color="#ff8800"/>
      <stop offset="33%" stop-color="#ffff00"/>
      <stop offset="50%" stop-color="#00ff00"/>
      <stop offset="66%" stop-color="#00ffff"/>
      <stop offset="83%" stop-color="#0000ff"/>
      <stop offset="100%" stop-color="#ff00ff"/>
    </conicGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#g)"/>
</svg>`,
  );
  fs.writeFileSync(path.resolve(OUT_DIR, '..', 'favicon.png'), png);
  console.log('wrote favicon.png + favicon.svg');
}
