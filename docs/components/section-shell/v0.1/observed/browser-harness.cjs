const { chromium } = require('/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('fs');
const out = 'docs/components/section-shell/v0.1/observed/';
(async () => {
  const browser = await chromium.launch({
    executablePath:
      '/home/egdev/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
    headless: true
  });
  const results = {};
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    const go = async (id) => {
      await page.goto(`http://127.0.0.1:6031/iframe.html?id=templates-sectionshell--${id}&viewMode=story`);
      await page.locator('.eg-section').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
    };
    await go('five-registers');
    results[`registers-${width}`] = await page.evaluate(() => {
      const props = [
        'backgroundColor',
        'backgroundImage',
        'color',
        'boxShadow',
        'position',
        'isolation',
        'boxSizing',
        'display',
        'flexDirection',
        'justifyContent',
        'minHeight',
        'paddingTop',
        'paddingBottom',
        'marginTop',
        'marginBottom'
      ];
      const get = (e, pseudo) => {
        const c = getComputedStyle(e, pseudo);
        return Object.fromEntries(
          props.concat(['content', 'maskImage', 'webkitMaskImage', 'pointerEvents']).map((p) => [p, c[p]])
        );
      };
      const root = getComputedStyle(document.documentElement);
      return {
        tokens: Object.fromEntries(
          [
            '--nav-height',
            '--space-8',
            '--section-min-height',
            '--content-max',
            '--gutter',
            '--color-surface-0',
            '--color-bg-flood',
            '--color-fg-on-flood',
            '--color-bg-deep',
            '--color-fg-default',
            '--gradient-section-show'
          ].map((x) => [x, root.getPropertyValue(x).trim()])
        ),
        sections: [...document.querySelectorAll('.eg-section')].map((e) => ({
          name: e.getAttribute('aria-label'),
          rect: e.getBoundingClientRect().toJSON(),
          style: get(e),
          before: get(e, '::before'),
          wrap: {
            rect: e.firstElementChild.getBoundingClientRect().toJSON(),
            style: getComputedStyle(e.firstElementChild).cssText,
            width: getComputedStyle(e.firstElementChild).width,
            maxWidth: getComputedStyle(e.firstElementChild).maxWidth,
            paddingLeft: getComputedStyle(e.firstElementChild).paddingLeft,
            boxSizing: getComputedStyle(e.firstElementChild).boxSizing
          }
        })),
        sheets: [...document.styleSheets].map((s) => {
          try {
            return { href: s.href, legacy: [...s.cssRules].some((r) => r.cssText.includes('.eg-section >')) };
          } catch {
            return { href: s.href };
          }
        })
      };
    });
    await page.screenshot({ path: `${out}registers-${width}-initial.png`, fullPage: true });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [
        { name: 'prefers-reduced-motion', value: 'reduce' },
        { name: 'prefers-reduced-transparency', value: 'reduce' }
      ]
    });
    results[`reduced-${width}`] = await page
      .locator('.eg-section')
      .last()
      .evaluate((e) => ({
        background: getComputedStyle(e).backgroundColor,
        media: matchMedia('(prefers-reduced-transparency: reduce)').matches
      }));
    await go('without-wrap');
    results[`unwrap-${width}`] = await page.locator('.eg-section').evaluate((e) => ({
      root: e.getBoundingClientRect().toJSON(),
      children: [...e.children].map((c) => ({
        class: c.className,
        rect: c.getBoundingClientRect().toJSON(),
        width: getComputedStyle(c).width,
        maxWidth: getComputedStyle(c).maxWidth,
        marginLeft: getComputedStyle(c).marginLeft,
        marginRight: getComputedStyle(c).marginRight
      }))
    }));
    await go('long-content');
    results[`long-${width}`] = await page.locator('.eg-section').evaluate((e) => ({
      height: e.getBoundingClientRect().height,
      scrollHeight: e.scrollHeight,
      viewport: innerHeight
    }));
    await go('single-and-both-fades');
    results[`fades-${width}`] = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-hidden=true]')].map((e) => ({
        mask: getComputedStyle(e).maskImage,
        webkit: getComputedStyle(e).webkitMaskImage,
        bg: getComputedStyle(e).backgroundColor,
        events: getComputedStyle(e).pointerEvents,
        sections: [...e.parentElement.querySelectorAll('section')].map((s) => ({
          background: getComputedStyle(s).backgroundColor,
          mask: getComputedStyle(s).maskImage
        }))
      }))
    );
    await page.screenshot({ path: `${out}fades-${width}-initial.png`, fullPage: true });
    await go('adjacent-grafito-groups');
    results[`adjacent-${width}`] = await page.evaluate(() => {
      const s = [...document.querySelectorAll('section')];
      const u = document.querySelector('[aria-hidden=true]');
      return {
        mask: getComputedStyle(u).maskImage,
        background: getComputedStyle(u).backgroundColor,
        sections: s.map((e) => ({
          rect: e.getBoundingClientRect().toJSON(),
          background: getComputedStyle(e).backgroundColor,
          mask: getComputedStyle(e).maskImage
        }))
      };
    });
    await go('host-fixed-bar');
    await page.keyboard.press('Tab');
    results[`focus-${width}`] = await page.evaluate(() => {
      const e = document.activeElement;
      const c = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const bar = document.querySelector('.sticky').getBoundingClientRect();
      return {
        tag: e.tagName,
        outline: c.outline,
        outlineOffset: c.outlineOffset,
        boxShadow: c.boxShadow,
        rect: r.toJSON(),
        bar: bar.toJSON(),
        visible: r.top >= bar.bottom && r.bottom <= innerHeight
      };
    });
    await page.screenshot({ path: `${out}focus-${width}-initial.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(`${out}browser-functional-checks.json`, JSON.stringify(results, null, 2) + '\n');
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
