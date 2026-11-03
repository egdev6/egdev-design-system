const { chromium } = require('/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('fs');
const dir = 'docs/components/section-shell/v0.1/observed/';
const base = 'http://127.0.0.1:6031/iframe.html?id=';
(async () => {
  const browser = await chromium.launch({
    executablePath:
      '/home/egdev/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'
  });
  const result = {};
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const go = async (id) => {
      await page.goto(base + id + '&viewMode=story');
      await page.locator('.eg-section').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
    };
    const inspect = async () =>
      page.evaluate(() =>
        [...document.querySelectorAll('#storybook-root section')]
          .map((s) => {
            const host = s.parentElement;
            const u = host.querySelector(':scope > [aria-hidden="true"]');
            if (!u) {
              return null;
            }
            const c = getComputedStyle(u);
            const sc = getComputedStyle(s);
            return {
              label: s.getAttribute('aria-label'),
              mask: c.maskImage,
              webkitMask: c.webkitMaskImage,
              underlayBackground: c.backgroundColor,
              sectionBackground: sc.backgroundColor,
              sectionMask: sc.maskImage,
              underlayHeight: u.getBoundingClientRect().height,
              sectionRect: s.getBoundingClientRect().toJSON(),
              pointerEvents: c.pointerEvents
            };
          })
          .filter(Boolean)
      );
    await go('templates-sectionshell--single-and-both-fades');
    result[`stories-normal-${width}`] = await inspect();
    await page.screenshot({ path: `${dir}fades-follow-up-${width}.png`, fullPage: true });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }]
    });
    result[`stories-reduced-${width}`] = {
      media: await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches),
      groups: await inspect()
    };
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
    await go('templates-sectionshell--adjacent-grafito-groups');
    result[`adjacent-normal-${width}`] = await inspect();
    // Add test-only host fixtures by cloning real story markup. Inline token selection provides the bottom edge, absent from the stories.
    await page.evaluate(() => {
      const root = document.querySelector('#storybook-root');
      const group = root.firstElementChild;
      for (const [edge, short] of [
        ['bottom', false],
        ['both', true]
      ]) {
        const g = group.cloneNode(true);
        const s = [...g.querySelectorAll('section')];
        s.slice(1).forEach((x) => x.remove());
        s[0].setAttribute('aria-label', edge + (short ? ' short fixture' : ' fixture'));
        const u = g.querySelector(':scope > [aria-hidden=true]');
        u.style.maskImage = `var(--mask-section-fade-${edge})`;
        u.style.webkitMaskImage = `var(--mask-section-fade-${edge})`;
        if (short) {
          g.style.height = '120px';
          g.style.overflow = 'hidden';
          s[0].style.minHeight = '0';
          s[0].style.height = '120px';
          s[0].style.padding = '0';
        }
        root.append(g);
      }
    });
    result[`fixture-normal-${width}`] = await inspect();
    await page.screenshot({ path: `${dir}fade-fixtures-follow-up-${width}.png`, fullPage: true });
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }]
    });
    result[`fixture-reduced-${width}`] = await inspect();
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });
    const cardPage = await browser.newPage({ viewport: { width, height: 800 } });
    await cardPage.goto(base + 'molecules-communitycard--default&viewMode=story');
    await cardPage.locator('.eg-community-card').waitFor();
    const card = await cardPage
      .locator('.eg-community-card')
      .first()
      .evaluate((e) => e.outerHTML);
    await cardPage.close();
    await go('templates-sectionshell--five-registers');
    await page.evaluate((html) => {
      const graf = [...document.querySelectorAll('section')].find(
        (x) => x.getAttribute('aria-label') === 'grafito section'
      );
      const inside = document.createElement('div');
      inside.id = 'inside-card';
      inside.innerHTML = html;
      graf.firstElementChild.replaceChildren(inside);
      const outside = document.createElement('div');
      outside.id = 'outside-card';
      outside.innerHTML = html;
      graf.after(outside);
    }, card);
    const styles = async (selector) =>
      page.locator(selector + ' .eg-community-card').evaluate((e) => {
        const c = getComputedStyle(e);
        return {
          backgroundColor: c.backgroundColor,
          backgroundImage: c.backgroundImage,
          backdropFilter: c.backdropFilter,
          boxShadow: c.boxShadow,
          border: c.border,
          transform: c.transform
        };
      });
    const rest = { inside: await styles('#inside-card'), outside: await styles('#outside-card') };
    await page.locator('#inside-card .eg-community-card').hover();
    const insideHover = await styles('#inside-card');
    await page.locator('#outside-card .eg-community-card').hover();
    const outsideHover = await styles('#outside-card');
    result[`card-${width}`] = {
      rest,
      hover: { inside: insideHover, outside: outsideHover },
      note: 'Clones of delivered CommunityCard story DOM; React event handlers are not copied. CSS hover and computed paint are exercised.'
    };
    const button = page.locator('#inside-card button');
    await button.focus();
    result[`focus-${width}`] = await button.evaluate((e) => {
      const c = getComputedStyle(e);
      const p = getComputedStyle(e.parentElement);
      const r = e.getBoundingClientRect();
      return {
        focused: document.activeElement === e,
        focusVisible: e.matches(':focus-visible'),
        outline: c.outline,
        outlineColor: c.outlineColor,
        outlineStyle: c.outlineStyle,
        outlineWidth: c.outlineWidth,
        outlineOffset: c.outlineOffset,
        boxShadow: c.boxShadow,
        background: c.backgroundColor,
        parentBackground: p.backgroundColor,
        rect: r.toJSON(),
        viewport: { width: innerWidth, height: innerHeight },
        visible: r.top >= 0 && r.bottom <= innerHeight
      };
    });
    await page.screenshot({ path: `${dir}card-focus-follow-up-${width}.png` });
    await page.close();
  }
  await browser.close();
  const path = dir + 'browser-functional-checks.json';
  const previous = JSON.parse(fs.readFileSync(path, 'utf8'));
  previous.followUp = result;
  fs.writeFileSync(path, JSON.stringify(previous, null, 2) + '\n');
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
