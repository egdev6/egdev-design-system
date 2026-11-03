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
  const p = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await p.goto('http://127.0.0.1:6033/iframe.html?id=organisms-footer--focus&viewMode=story', {
    waitUntil: 'networkidle'
  });
  await p.evaluate(() => document.fonts.ready);
  const colors = await p.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    links: [...document.querySelectorAll('footer a')].map((a) => ({
      name: a.getAttribute('aria-label') || a.textContent.trim(),
      color: getComputedStyle(a).color
    }))
  }));
  const rgb = (s) => s.match(/\d+/g).slice(0, 3).map(Number);
  const lum = (s) =>
    rgb(s)
      .map((x) => {
        x /= 255;
        return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      })
      .reduce((t, x, i) => t + x * [0.2126, 0.7152, 0.0722][i], 0);
  const bg = lum(colors.background);
  for (const a of colors.links) {
    const fg = lum(a.color);
    a.contrast = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  }
  for (let i = 0; i < 4; i++) {
    await p.keyboard.press('Tab');
  }
  await p.waitForTimeout(600);
  const social = await p.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return { name: document.activeElement.textContent.trim(), shadow: s.boxShadow, outline: s.outline };
  });
  await p.screenshot({ path: join(out, 'social-focus-settled-second-follow-up-390.png'), fullPage: true });
  const data = JSON.parse(await readFile(join(out, 'browser-functional-checks.json'), 'utf8'));
  data.focusContrast = { colors, socialSettled: social };
  await writeFile(join(out, 'browser-functional-checks.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(JSON.stringify(data.focusContrast, null, 2));
} finally {
  await browser.close();
}
