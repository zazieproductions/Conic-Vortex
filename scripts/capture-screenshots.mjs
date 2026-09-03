#!/usr/bin/env -S node --input-type=module
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/images');
const VIEWPORT = { width: 1440, height: 900 };

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-browser-side-navigation'],
  });
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);

  // Click through the warning gate
  try {
    const enterBtn = await page.waitForSelector('button:contains("ENTER THE VOID")', {
      timeout: 5000,
    });
    if (enterBtn) {
      await enterBtn.click();
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('No warning gate or already inside');
  }

  const clip = { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height };

  // 1. Primary preview — interface after entering, steady state
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'project-preview.png'),
    viewport: VIEWPORT,
    clip,
    fullPage: false,
  });
  console.log('Captured project-preview.png');

  // 2. Active state — wait for animation to settle into a meaningful frame
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'project-active.png'),
    viewport: VIEWPORT,
    clip,
    fullPage: false,
  });
  console.log('Captured project-active.png');

  // 3. Detail shot — another animation frame, focusing on different area
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'project-detail.png'),
    viewport: VIEWPORT,
    clip,
    fullPage: false,
  });
  console.log('Captured project-detail.png');

  await browser.close();
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});