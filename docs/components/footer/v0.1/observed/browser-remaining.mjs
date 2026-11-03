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
const p = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const url = (id) => `http://127.0.0.1:6033/iframe.html?id=organisms-footer--${id}&viewMode=story`;
async function story(id) {
  await p.goto(url(id), { waitUntil: 'networkidle' });
  await p.locator('footer').waitFor();
  await p.evaluate(() => document.fonts.ready);
}
async function measure() {
  return p.evaluate(() => {
    const props = [
      'position',
      'display',
      'gridTemplateColumns',
      'gridColumn',
      'gap',
      'padding',
      'margin',
      'borderTopWidth',
      'borderTopStyle',
      'borderTopColor',
      'borderBottomWidth',
      'borderBottomStyle',
      'borderBottomColor',
      'fontFamily',
      'fontSize',
      'color',
      'backgroundColor',
      'boxShadow',
      'listStyleType',
      'justifyContent',
      'flexWrap'
    ];
    const val = (el) => {
      if (!el) {
        return null;
      }
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        classes: el.className,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        ...Object.fromEntries(props.map((k) => [k, s[k]]))
      };
    };
    const f = document.querySelector('footer');
    const grid = f.querySelector('.eg-footer__grid');
    const list = f.querySelector('nav ul');
    const root = getComputedStyle(document.documentElement);
    return {
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      root: val(f),
      stage: val(f.querySelector('.eg-footer__stage')),
      grid: val(grid),
      children: grid ? [...grid.children].map(val) : [],
      legal: val(f.querySelector('.eg-footer__legal')),
      list: val(list),
      tokens: {
        borderWidth: root.getPropertyValue('--border-width').trim(),
        hairline: root.getPropertyValue('--color-border-hairline').trim()
      },
      bodyBackground: getComputedStyle(document.body).backgroundColor
    };
  });
}
try {
  const result = { browserVersion: browser.version(), widths: {}, noBrand: {}, responsive: {}, checks: {} };
  for (const w of [390, 859, 860, 861, 1280]) {
    await p.setViewportSize({ width: w, height: 900 });
    await story('default');
    result.widths[w] = await measure();
    await p.screenshot({ path: join(out, `default-second-follow-up-${w}.png`), fullPage: true });
    await story('social');
    result.noBrand[w] = await measure();
    await story('responsive');
    result.responsive[w] = await measure();
  }
  await p.setViewportSize({ width: 390, height: 900 });
  await story('responsive');
  result.longContent = await p.evaluate(() => {
    const a = document.querySelector('footer nav a');
    a.textContent = 'Unbroken'.repeat(50);
    const f = document.querySelector('footer');
    const r = a.getBoundingClientRect();
    return {
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      anchorWidth: r.width,
      footerWidth: f.getBoundingClientRect().width,
      anchorScrollWidth: a.scrollWidth,
      anchorClientWidth: a.clientWidth
    };
  });
  await p.screenshot({ path: join(out, 'long-unbroken-second-follow-up-390.png'), fullPage: true });
  await p.setViewportSize({ width: 1280, height: 900 });
  await story('landmark');
  result.landmarks = {
    mainCount: await p.getByRole('main').count(),
    contentinfoCount: await p.getByRole('contentinfo').count(),
    footerInMain: await p.locator('main footer').count(),
    namedNav: await p.getByRole('navigation', { name: 'Explore' }).count(),
    namedList: await p.getByRole('list', { name: 'Community profiles' }).count()
  };
  await story('focus');
  result.keyboard = [];
  for (let i = 0; i < 5; i++) {
    await p.keyboard.press('Tab');
    result.keyboard.push(
      await p.evaluate(() => {
        const a = document.activeElement;
        const s = getComputedStyle(a);
        return {
          tag: a.tagName,
          name: a.getAttribute('aria-label') || a.textContent.trim(),
          href: a.getAttribute('href'),
          focusVisible: a.matches(':focus-visible'),
          outline: s.outline,
          boxShadow: s.boxShadow
        };
      })
    );
  }
  await p.keyboard.press('Enter');
  result.enterHash = await p.evaluate(() => location.hash);
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await story('default');
  result.reducedMotion = await p.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    links: [...document.querySelectorAll('footer a')].map((a) => ({
      text: a.textContent.trim(),
      property: getComputedStyle(a).transitionProperty,
      duration: getComputedStyle(a).transitionDuration
    }))
  }));
  await p.emulateMedia({ reducedMotion: 'no-preference' });
  const previous = JSON.parse(await readFile(join(out, 'browser-functional-checks.json'), 'utf8'));
  previous.remaining = result;
  await writeFile(join(out, 'browser-functional-checks.json'), JSON.stringify(previous, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
