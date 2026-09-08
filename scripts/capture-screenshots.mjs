#!/usr/bin/env -S node --input-type=module
/**
 * capture-screenshots.mjs
 *
 * Drives a headless browser through the running app and captures the README /
 * portfolio screenshots into docs/images/.
 *
 * Puppeteer is intentionally NOT a default dependency (it would force a ~300MB
 * Chromium download on every `npm install`). Install it once, on demand:
 *
 *   npm install -D puppeteer
 *
 * Then, from two terminals:
 *   1. Start the dev server:   npm run dev        (serves http://localhost:5173)
 *   2. Run:                    npm run capture:screenshots
 *
 * Point at another origin with CAPTURE_BASE_URL, e.g. a built preview:
 *   CAPTURE_BASE_URL=http://localhost:4173 npm run capture:screenshots
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let puppeteer;
try {
  ({ default: puppeteer } = await import('puppeteer'));
} catch {
  console.error(
    'puppeteer is not installed. Install it once to capture screenshots:\n' +
      '  npm install -D puppeteer\n' +
      '(See the header of this script for details.)',
  );
  process.exit(1);
}

const DEFAULT_URL = 'http://localhost:5173';
const BASE_URL = process.env.CAPTURE_BASE_URL || DEFAULT_URL;

// Output directory = docs/images (repo root), resolved from this file's location.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.resolve(REPO_ROOT, 'docs/images');

const WIDTH = 1440;
const HEIGHT = 900;
const CLIP = { x: 0, y: 0, width: WIDTH, height: HEIGHT };

async function dismissWarningGate(page) {
  // Gate is skipped if the session already entered; otherwise click it.
  const entered = await page.evaluate(
    () => !document.body.textContent.includes('ENTER THE VOID'),
  );
  if (entered) return;
  const handle = await page.evaluateHandle(() =>
    Array.from(document.querySelectorAll('button')).find((n) =>
      (n.textContent || '').includes('ENTER THE VOID'),
    ),
  );
  await handle.asElement().click();
  await page.waitForTimeout(3000);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-browser-side-navigation'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });

    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    await dismissWarningGate(page);

    const shots = [
      { file: 'project-preview.png', delay: 0 },
      { file: 'project-active.png', delay: 5000 },
      { file: 'project-detail.png', delay: 3000 },
    ];

    for (const shot of shots) {
      if (shot.delay) await page.waitForTimeout(shot.delay);
      await page.screenshot({ path: path.join(OUT_DIR, shot.file), clip: CLIP });
      console.log(`Captured ${shot.file}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
