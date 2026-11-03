const { chromium } = require('/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({
    executablePath:
      '/home/egdev/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'
  });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto('http://127.0.0.1:6031/iframe.html?id=templates-sectionshell--single-and-both-fades&viewMode=story');
  await p.locator('section').first().waitFor();
  const r = await p.evaluate(() => {
    const roots = [...document.querySelectorAll('section')];
    const token = getComputedStyle(document.documentElement);
    return {
      tokens: Object.fromEntries(
        ['--mask-section-fade-top', '--mask-section-fade-bottom', '--mask-section-fade-both'].map((x) => [
          x,
          token.getPropertyValue(x)
        ])
      ),
      groups: roots.map((s) => {
        const u = s.parentElement.querySelector('[aria-hidden=true]');
        return {
          underlay: {
            mask: getComputedStyle(u).maskImage,
            bg: getComputedStyle(u).backgroundColor,
            classes: u.className
          },
          section: { bg: getComputedStyle(s).backgroundColor, classes: s.className }
        };
      })
    };
  });
  await p.screenshot({
    path: 'docs/components/section-shell/v0.1/observed/fades-normal-1280-initial.png',
    fullPage: true
  });
  fs.writeFileSync(
    'docs/components/section-shell/v0.1/observed/browser-supplement.json',
    JSON.stringify(r, null, 2) + '\n'
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
