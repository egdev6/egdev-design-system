import { writeFile } from 'node:fs/promises';
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
  await page.locator('footer nav a').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  const data = await page.evaluate(() => {
    const links = [...document.querySelectorAll('footer nav a')].map((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      return {
        text: a.textContent.trim(),
        href: a.getAttribute('href'),
        width: r.width,
        height: r.height,
        display: s.display,
        padding: s.padding,
        lineHeight: s.lineHeight,
        fontFamily: s.fontFamily,
        className: a.className
      };
    });
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      userAgent: navigator.userAgent,
      fonts: document.fonts.status,
      colorSchemeDark: matchMedia('(prefers-color-scheme: dark)').matches,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
      links
    };
  });
  data.browserVersion = browser.version();
  data.gate6 = data.links.every((link) => link.width >= 44 && link.height >= 44) ? 'PASS' : 'FAIL';
  await page.screenshot({ path: join(out, 'gate-6-initial-1280.png'), fullPage: true });
  await writeFile(join(out, 'browser-functional-checks.json'), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(data, null, 2));
} finally {
  await browser.close();
}
