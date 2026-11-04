// HomeTemplate v0.1 browser probe (HI1 U9). Read-only against a running local Storybook.
// Usage: node browser-probe.mjs <storybook-origin>
// Writes browser-observed.json and PNG evidence next to this script; refuses to overwrite existing results.
import { createHash } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/egdev/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ORIGIN = process.argv[2];
const EXECUTABLE = '/home/egdev/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const OUT = join(HERE, 'browser-observed.json');
if (!ORIGIN) {
  console.error('Usage: node browser-probe.mjs <storybook-origin>');
  process.exit(2);
}
if (existsSync(OUT)) {
  console.error(`Refusing to overwrite ${OUT}`);
  process.exit(1);
}

const STORIES = [
  'default',
  'profiles-and-handoff',
  'two-anchor-travel',
  'mobile-gate',
  'natural-vs-consumer-sticky-lab',
  'invalid-geometry-fail-open',
  'reduced-motion-note',
  'native-attributes-and-class-name',
  'active-zone-callback'
];
const VIEWPORTS = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 }
];
const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');

const snapshot = () => {
  const root = document.querySelector('.eg-home-template');
  if (!root) {
    return { mounted: false };
  }
  const [ambient, isotipo] = root.querySelectorAll('canvas');
  const vignette = root.querySelector('[class*="gradient-vignette"]');
  const fallbacks = [...root.querySelectorAll('.eg-home-template-anchor > div')].map((node) => ({
    state: node.getAttribute('data-state'),
    opacity: getComputedStyle(node).opacity
  }));
  const gl =
    document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
  return {
    mounted: true,
    zone: root.getAttribute('data-state'),
    motion: root.getAttribute('data-motion'),
    ambientOpacity: ambient ? getComputedStyle(ambient).opacity : null,
    isotipoOpacity: isotipo ? getComputedStyle(isotipo).opacity : null,
    ambientPointer: ambient ? getComputedStyle(ambient).pointerEvents : null,
    isotipoPointer: isotipo ? getComputedStyle(isotipo).pointerEvents : null,
    vignetteImage: vignette ? getComputedStyle(vignette).backgroundImage.slice(0, 40) : null,
    fallbacks,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    webgl: Boolean(gl),
    htmlAttributes: [...document.documentElement.attributes].map((a) => a.name).sort(),
    bodyStyle: document.body.getAttribute('style')
  };
};

async function probe(browser, label, contextOptions) {
  const records = [];
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, ...contextOptions });
    for (const story of STORIES) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(String(error.message)));
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });
      await page.goto(`${ORIGIN}/iframe.html?id=templates-hometemplate--${story}&viewMode=story`, {
        waitUntil: 'networkidle'
      });
      await page.waitForTimeout(800);
      const steps = [];
      const height = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(height * fraction));
        await page.waitForTimeout(450);
        steps.push({
          fraction,
          scrollY: await page.evaluate(() => Math.round(window.scrollY)),
          ...(await page.evaluate(snapshot))
        });
      }
      let screenshot = null;
      if (story === 'two-anchor-travel' || story === 'invalid-geometry-fail-open') {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(450);
        const file = `home-template-${label}-${story}-${viewport.width}.png`;
        const png = await page.screenshot();
        writeFileSync(join(HERE, file), png);
        screenshot = { file, sha256: sha(png) };
      }
      records.push({ label, story, viewport, errors, steps, screenshot });
      await page.close();
    }
    await context.close();
  }
  return records;
}

const results = { origin: ORIGIN, executable: EXECUTABLE, capturedAt: new Date().toISOString(), runs: [] };
let browser = await chromium.launch({ executablePath: EXECUTABLE, args: ['--enable-unsafe-swiftshader'] });
try {
  results.runs.push(...(await probe(browser, 'motion', { reducedMotion: 'no-preference' })));
  results.runs.push(...(await probe(browser, 'reduced', { reducedMotion: 'reduce' })));
} finally {
  await browser.close();
}
browser = await chromium.launch({ executablePath: EXECUTABLE, args: ['--disable-webgl', '--disable-3d-apis'] });
try {
  results.runs.push(...(await probe(browser, 'nowebgl', { reducedMotion: 'no-preference' })));
} finally {
  await browser.close();
}
writeFileSync(OUT, `${JSON.stringify(results, null, 2)}\n`);
console.log(`runs=${results.runs.length} errors=${results.runs.reduce((n, r) => n + r.errors.length, 0)}`);
