import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';

const out = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath:
    '/home/egdev/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  args: ['--no-sandbox']
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:6033/iframe.html?id=organisms-footer--default&viewMode=story', {
    waitUntil: 'networkidle'
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('footer nav a').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    userAgent: navigator.userAgent,
    fonts: document.fonts.status,
    links: [...document.querySelectorAll('footer nav a')].map((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      const range = document.createRange();
      range.selectNodeContents(a);
      const text = range.getBoundingClientRect();
      return {
        text: a.textContent.trim(),
        width: r.width,
        height: r.height,
        minWidth: s.minWidth,
        minHeight: s.minHeight,
        justifyContent: s.justifyContent,
        textStartOffset: text.left - r.left,
        className: a.className
      };
    })
  }));
  result.browserVersion = browser.version();
  result.hotReloaded = result.links.every((l) => l.className.split(' ').includes('min-w-14'));
  result.gate6 =
    result.links.length > 0 && result.links.every((l) => l.width >= 44 && l.height >= 44) ? 'PASS' : 'FAIL';
  await page.screenshot({ path: join(out, 'gate-6-second-follow-up-1280.png'), fullPage: true });
  const previous = JSON.parse(await readFile(join(out, 'browser-functional-checks.json'), 'utf8'));
  previous.secondFollowUp = result;
  await writeFile(join(out, 'browser-functional-checks.json'), JSON.stringify(previous, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
