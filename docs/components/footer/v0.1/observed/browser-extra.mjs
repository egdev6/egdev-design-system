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
  const p = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('http://127.0.0.1:6033/iframe.html?id=organisms-footer--focus&viewMode=story', {
    waitUntil: 'networkidle'
  });
  await p.evaluate(() => document.fonts.ready);
  const before = await p.locator('footer a').evaluateAll((els) =>
    els.map((a) => {
      const s = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return {
        label: a.getAttribute('aria-label') || a.textContent.trim(),
        width: r.width,
        height: r.height,
        color: s.color,
        background: s.backgroundColor,
        outline: s.outline,
        boxShadow: s.boxShadow
      };
    })
  );
  const focused = [];
  for (let i = 0; i < 5; i++) {
    await p.keyboard.press('Tab');
    focused.push(
      await p.evaluate(() => {
        const a = document.activeElement;
        const s = getComputedStyle(a);
        const b = getComputedStyle(a, '::before');
        const c = getComputedStyle(a, '::after');
        return {
          label: a.getAttribute('aria-label') || a.textContent.trim(),
          html: a.outerHTML,
          outline: s.outline,
          shadow: s.boxShadow,
          border: s.border,
          background: s.backgroundColor,
          before: { content: b.content, outline: b.outline, shadow: b.boxShadow },
          after: { content: c.content, outline: c.outline, shadow: c.boxShadow }
        };
      })
    );
    if (i === 3) {
      await p.screenshot({ path: join(out, 'social-focus-second-follow-up-390.png'), fullPage: true });
    }
  }
  const legacy = await p.evaluate(() => {
    const a = document.createElement('div');
    a.innerHTML =
      '<div class="eg-footer"><div class="eg-footer__grid"><div>legacy first</div><div>legacy second</div></div><div class="eg-footer__legal">legacy legal</div></div>';
    document.body.append(a);
    const root = a.firstElementChild;
    const grid = root.firstElementChild;
    const pick = (e) => {
      const s = getComputedStyle(e);
      return {
        padding: s.padding,
        borderTop: s.borderTop,
        gridTemplateColumns: s.gridTemplateColumns,
        gridColumn: s.gridColumn,
        fontSize: s.fontSize
      };
    };
    return {
      root: pick(root),
      grid: pick(grid),
      first: pick(grid.firstElementChild),
      legal: pick(root.lastElementChild)
    };
  });
  await p.goto('http://127.0.0.1:6033/iframe.html?id=organisms-footer--minimal&viewMode=story', {
    waitUntil: 'networkidle'
  });
  const minimal = await p.evaluate(() => ({
    stage: document.querySelectorAll('footer .eg-footer__stage').length,
    grid: document.querySelectorAll('footer .eg-footer__grid').length,
    legal: document.querySelectorAll('footer .eg-footer__legal').length
  }));
  const result = { before, focused, legacy, minimal };
  const data = JSON.parse(await readFile(join(out, 'browser-functional-checks.json'), 'utf8'));
  data.extra = result;
  await writeFile(join(out, 'browser-functional-checks.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
