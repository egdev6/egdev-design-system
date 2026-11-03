import { writeFile } from 'node:fs/promises';
import { chromium } from '/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';

const out = 'docs/components/top-bar/v0.1/observed/';
const browser = await chromium.launch({
  executablePath:
    '/home/egdev/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
const cdp = await page.context().newCDPSession(page);
const results = { browser: browser.version(), checks: {}, limitations: [] };
async function story(name) {
  await page.goto(`http://127.0.0.1:6032/iframe.html?id=organisms-topbar--${name}&viewMode=story`, {
    waitUntil: 'networkidle'
  });
  await page.locator('header.eg-topbar').waitFor();
}
async function measure() {
  return page.evaluate(() => {
    const h = document.querySelector('header.eg-topbar');
    const c = h.firstElementChild;
    const n = h.querySelector('nav');
    const s = getComputedStyle(h);
    const r = h.getBoundingClientRect();
    const get = (e) =>
      e && {
        text: e.textContent.trim(),
        display: getComputedStyle(e).display,
        rect: e.getBoundingClientRect().toJSON()
      };
    return {
      width: r.width,
      top: r.top,
      height: r.height,
      position: s.position,
      zIndex: s.zIndex,
      containerType: s.containerType,
      containerName: s.containerName,
      internalContainer: getComputedStyle(c).containerType,
      background: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      backdrop: s.backdropFilter,
      webkitBackdrop: s.webkitBackdropFilter,
      border: s.borderBottom,
      shadow: s.boxShadow,
      transition: s.transitionDuration,
      animation: s.animationDuration,
      before: getComputedStyle(h, '::before').content,
      after: getComputedStyle(h, '::after').content,
      nav: get(n),
      controls: [...h.querySelectorAll('button')].map((e) => get(e.parentElement)),
      overflow: document.documentElement.scrollWidth - innerWidth,
      stylesheets: [...document.styleSheets].map((x) => x.href)
    };
  });
}
try {
  await story('composed-controls');
  for (const vp of [1280, 390]) {
    for (const width of [899, 899.5, 900, 900.5, 901]) {
      await page.setViewportSize({ width: vp, height: 800 });
      await page.locator('header.eg-topbar').evaluate((e, w) => (e.style.width = w + 'px'), width);
      await page.waitForTimeout(80);
      const m = await measure();
      const ax = await cdp.send('Accessibility.getFullAXTree');
      const names = ax.nodes.filter((n) => !n.ignored && n.name?.value).map((n) => n.name.value);
      results.checks[`boundary-${vp}-${width}`] = {
        ...m,
        axNames: names.filter((x) => ['Home', 'About', 'Search', 'Account', 'Menu'].includes(x))
      };
    }
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const name of ['default', 'glass']) {
    await story(name);
    results.checks[name] = await measure();
    await page.screenshot({ path: out + name + '-initial.png' });
  }
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-reduced-transparency', value: 'reduce' },
      { name: 'prefers-reduced-motion', value: 'reduce' }
    ]
  });
  for (const name of ['default', 'glass']) {
    await story(name);
    results.checks[name + '-reduced'] = await measure();
  }
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  await story('composed-controls');
  const tabs = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    tabs.push(
      await page.evaluate(() => ({
        text: document.activeElement.textContent.trim(),
        outline: getComputedStyle(document.activeElement).outline,
        shadow: getComputedStyle(document.activeElement).boxShadow
      }))
    );
  }
  results.checks.keyboard = tabs;
  await story('current-page');
  results.checks.current = await page.locator('[aria-current]').evaluate((e) => ({
    value: e.getAttribute('aria-current'),
    decoration: getComputedStyle(e).textDecorationLine,
    after: getComputedStyle(e, '::after').content
  }));
  await story('default');
  results.checks.scrollBefore = await measure();
  await page.evaluate(() => {
    document.body.style.minHeight = '3000px';
    scrollTo(0, 500);
  });
  await page.waitForTimeout(100);
  results.checks.scrollAfter = await measure();
  await page.setViewportSize({ width: 390, height: 800 });
  await story('mobile-dialog');
  await page.getByRole('button', { name: 'Menu' }).click();
  results.checks.dialogOpen = {
    count: await page.getByRole('dialog').count(),
    active: await page.evaluate(() => document.activeElement.outerHTML),
    glass: await measure()
  };
  await page.screenshot({ path: out + 'dialog-initial.png' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  results.checks.dialogClosed = {
    count: await page.getByRole('dialog').count(),
    active: await page.evaluate(() => document.activeElement.textContent.trim())
  };
  await page.setViewportSize({ width: 1280, height: 800 });
  await story('user-menu');
  await page.getByRole('button', { name: 'Account' }).click();
  results.checks.menuOpen = {
    count: await page.getByRole('menu').count(),
    active: await page.evaluate(() => document.activeElement.outerHTML)
  };
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  results.checks.menuClosed = {
    count: await page.getByRole('menu').count(),
    active: await page.evaluate(() => document.activeElement.textContent.trim())
  };
  await story('long-labels');
  results.checks.longWide = await measure();
  await page.setViewportSize({ width: 390, height: 800 });
  results.checks.longNarrow = await measure();
} catch (e) {
  results.error = String(e.stack || e);
}
await writeFile(out + 'browser-functional-checks-followup.json', JSON.stringify(results, null, 2) + '\n');
await browser.close();
console.log('Finished browser checks; see browser-functional-checks-followup.json');
