import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle0'});
  await page.waitForTimeout(2000);
  try {
    await page.waitForSelector('button:contains("ENTER THE VOID")', {timeout: 5000});
    await page.click('button:contains("ENTER THE VOID")', {waitUntil: 'networkidle0'});
    await page.waitForTimeout(3000);
  } catch (e) { console.log('No enter button'); }
  const clip = {x: 0, y: 0, width: 1440, height: 900};
  await page.screenshot({path: 'docs/images/project-preview.png', viewport: {width: 1440, height: 900}, clip, fullPage: false});
  console.log('Captured project-preview.png');
  await page.waitForTimeout(5000);
  await page.screenshot({path: 'docs/images/project-active.png', viewport: {width: 1440, height: 900}, clip, fullPage: false});
  console.log('Captured project-active.png');
  await page.waitForTimeout(3000);
  await page.screenshot({path: 'docs/images/project-detail.png', viewport: {width: 1440, height: 900}, clip, fullPage: false});
  console.log('Captured project-detail.png');
  await browser.close();
})();