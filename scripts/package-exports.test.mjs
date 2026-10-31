import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Build first: these checks verify exported artifacts, not CSS consumption or React compatibility.
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = (name) => JSON.parse(readFileSync(resolve(root, `packages/${name}/package.json`), 'utf8'));
const ui = manifest('ui');
const tokens = manifest('tokens');
const effects = manifest('effects');
function artifact(name, target) {
  assert.equal(typeof target, 'string', `${name} export must have a file target`);
  assert.ok(target.startsWith('./'), `${name} export must be package-relative`);
  const path = resolve(root, `packages/${name}`, target);
  assert.ok(existsSync(path), `Missing exported artifact: ${path}. Run pnpm build before this test.`);
  assert.ok(statSync(path).isFile() && statSync(path).size > 0, `Export must be a nonempty file: ${path}`);
  return path;
}

test('ambient package exposes the decorative component and its stylesheet without private engines', async () => {
  assert.equal(effects.exports['.'].import, './dist/index.js');
  assert.equal(effects.exports['.'].types, './dist/index.d.ts');
  assert.equal(effects.exports['./styles.css'], './dist/styles.css');
  const exported = await import(artifact('effects', effects.exports['.'].import));
  assert.ok(exported.AmbientBackground);
  for (const name of ['useAmbientBackground', 'ambientRootVariants', 'createParticleStreaks']) {
    assert.equal(Object.hasOwn(exported, name), false, name);
  }
  const css = readFileSync(artifact('effects', effects.exports['./styles.css']), 'utf8');
  for (const value of ['--eg-ambient-opacity', '--color-ambient-bg', 'forced-colors']) {
    assert.ok(css.includes(value), `Missing AmbientBackground CSS ${value}`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(createElement(exported.AmbientBackground));
  assert.match(html, /eg-ambient-background/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /data-state="stopped"/);
  assert.match(html, /<canvas/);
});

// Read a complete emitted block, including nested supports/media rules and quoted values.
function cssBlock(css, opening) {
  const match = opening.exec(css);
  assert.ok(match, `Missing emitted CSS block ${opening}`);
  let depth = 1;
  let quote = '';
  for (let index = match.index + match[0].length; index < css.length; index++) {
    const char = css[index];
    if (char === '\\') {
      index++;
    } else if (quote) {
      if (char === quote) {
        quote = '';
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') {
      depth++;
    } else if (char === '}' && --depth === 0) {
      return css.slice(match.index, index + 1);
    }
  }
  assert.fail(`Unclosed emitted CSS block ${opening}`);
}

// Match escaped emitted selectors, not unescaped CVA class names; allow only complete approved utilities.
const unapprovedTransitionUtility =
  /\.transition-(?!(?:none|colors|opacity|transform|shadow|\\\[background-color\\,border-color\\\]|\\\[border-color\\,box-shadow\\\]|\\\[border-color\\,color\\\]|\\\[translate\\\]|\\\[translate\\,background-color\\\]|\\\[opacity\\,translate\\\]|\\\[color\\,background-color\\,border-color\\,box-shadow\\,scale\\\])(?=\s*\{))[\w\\]/;

test('Collapsible ships native group-state caret motion and reduced-motion resets', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    '.whitespace-normal',
    '.text-start',
    '.transition-transform',
    String.raw`.group-data-\[state\=open\]\/collapsible\:rotate-180`,
    String.raw`.motion-reduce\:group-data-\[state\=open\]\/collapsible\:rotate-0`,
    String.raw`.motion-reduce\:transform-none`
  ]) {
    assert.ok(utilities.includes(selector), 'Missing Collapsible utility ' + selector);
  }
  assert.match(utilities, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(utilities, /\.eg-collapsible[^{}]*\{/);
  assert.equal(existsSync(resolve(root, 'packages/ui/src/molecules/collapsible/collapsible.css')), false);
});
test('Collapsible package preserves amended native closed/open relationships and private helpers in SSR', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  assert.equal(typeof exported.Collapsible, 'function');
  assert.equal(typeof exported.CollapsibleContent, 'function');
  assert.equal(exported.CollapsibleTrigger.$$typeof, Symbol.for('react.forward_ref'));
  for (const name of [
    'useCollapsible',
    'useCollapsibleTrigger',
    'useCollapsibleContent',
    'collapsibleVariants',
    'collapsibleTriggerVariants',
    'collapsibleContentVariants',
    'collapsibleCaretVariants'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, name + ' is private');
  }
  for (const open of [false, true]) {
    const dom = new JSDOM(
      renderToString(
        createElement(exported.Collapsible, {
          defaultOpen: open,
          children: [
            createElement(exported.CollapsibleTrigger, { key: 'trigger', children: 'Details' }),
            createElement(exported.CollapsibleContent, {
              key: 'content',
              children: createElement('input', { 'aria-label': 'Body field' })
            })
          ]
        })
      )
    );
    try {
      const doc = dom.window.document;
      const trigger = doc.querySelector('button');
      const content = doc.querySelector('.eg-collapsible__content');
      assert.ok(trigger && content?.id);
      assert.equal(trigger.getAttribute('type'), 'button');
      assert.equal(trigger.getAttribute('aria-expanded'), String(open));
      assert.equal(trigger.getAttribute('aria-controls'), open ? content.id : null);
      assert.equal(content.hasAttribute('hidden'), !open);
      assert.equal(Boolean(content.querySelector('input')), open);
      assert.equal(doc.querySelectorAll('.eg-surface').length, 1);
    } finally {
      dom.window.close();
    }
  }
});

test('Panel ships band resets and direct-zone corner utilities without a new marker engine', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    '.gap-0',
    '.overflow-visible',
    '.bg-none',
    '.shadow-none',
    '.backdrop-filter-none',
    String.raw`.first\:rounded-t-\[calc\(var\(--radius-xl\)-var\(--border-width\)\)\]`,
    String.raw`.last\:rounded-b-\[calc\(var\(--radius-xl\)-var\(--border-width\)\)\]`,
    String.raw`.first\:rounded-t-xl`,
    String.raw`.last\:rounded-b-xl`
  ]) {
    assert.ok(utilities.includes(selector), 'Missing Panel utility ' + selector);
  }
  assert.doesNotMatch(utilities, /\.eg-panel[^{}]*\{/);
  assert.equal(existsSync(resolve(root, 'packages/ui/src/molecules/panel/panel.css')), false);
});
test('Panel package preserves compound zones, explicit frame ownership and closed public exports in SSR', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  for (const name of ['Panel', 'PanelHeader', 'PanelBody', 'PanelFooter']) {
    assert.equal(typeof exported[name], 'function');
  }
  for (const name of [
    'usePanel',
    'usePanelHeader',
    'usePanelBody',
    'usePanelFooter',
    'PanelContext',
    'panelVariants',
    'panelHeaderVariants',
    'panelBodyVariants',
    'panelFooterVariants'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, name + ' is private');
  }
  for (const tone of ['surface-1', 'overlay', 'inherit']) {
    for (const variant of ['default', 'banded']) {
      const dom = new JSDOM(
        renderToString(
          createElement(exported.Panel, {
            tone,
            variant,
            children: [
              createElement(exported.PanelHeader, { key: 'header', children: 'Heading' }),
              createElement(exported.PanelBody, {
                key: 'body',
                children: createElement('button', { type: 'button', children: 'Child action' })
              }),
              createElement(exported.PanelFooter, { key: 'footer', children: 'Metadata' })
            ]
          })
        )
      );
      try {
        const wrapper = dom.window.document.querySelector('.eg-panel');
        assert.ok(wrapper);
        assert.deepEqual(
          [...wrapper.children].map((node) => node.className.match(/eg-panel__(header|body|footer)/)?.[1]),
          ['header', 'body', 'footer']
        );
        assert.equal(wrapper.classList.contains('eg-surface'), tone !== 'inherit');
        assert.equal(wrapper.getAttribute('data-tone'), tone);
        assert.equal(wrapper.getAttribute('data-variant'), variant);
        assert.equal(wrapper.hasAttribute('role'), false);
        assert.equal(wrapper.querySelectorAll('button').length, 1);
      } finally {
        dom.window.close();
      }
    }
  }
  assert.throws(() => renderToString(createElement(exported.PanelBody, { children: 'Orphan' })), /Panel/);
});

test('Toast ships floating elevation, viewport, swipe, fade and reduced-motion utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`,
    String.raw`.w-\[min\(calc\(100vw-2\*var\(--space-6\)\)\,calc\(var\(--space-24\)\*4\)\)\]`,
    String.raw`.data-\[swipe\=move\]\:translate-x-\[var\(--radix-toast-swipe-move-x\)\]`,
    String.raw`.data-\[swipe\=cancel\]\:translate-x-0`,
    String.raw`.data-\[swipe\=cancel\]\:transition-transform`,
    String.raw`.starting\:opacity-0`,
    String.raw`.motion-reduce\:transition-none`,
    String.raw`.motion-reduce\:data-\[swipe\=cancel\]\:transition-none`,
    '.bottom-6',
    '.end-6'
  ]) {
    assert.ok(utilities.includes(selector), `Missing Toast utility ${selector}`);
  }
  assert.match(utilities, /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)/);
  assert.match(utilities, /@starting-style/);
  assert.match(utilities, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(utilities, /\.eg-toast(?:-viewport)?\s*\{/, 'Toast markers are not a CSS engine');
});

test('Toast provider preserves application SSR without rendering portal content on the server', async () => {
  const { Toast, ToastProvider } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  assert.equal(typeof Toast, 'function');
  assert.equal(typeof ToastProvider, 'function');
  const html = renderToString(
    createElement(ToastProvider, {
      children: [
        createElement('main', { key: 'app' }, 'Application'),
        createElement(Toast, { key: 'toast', summary: 'Link copied' })
      ]
    })
  );
  assert.equal(html, '<main>Application</main>');
});

test('Notice ships static molecule tint, wrapping and compact typography utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const color of ['fg-secondary', 'status-info', 'status-success', 'status-warning', 'status-danger']) {
    for (const [prefix, opacity] of [
      ['border', 30],
      ['from', 11],
      ['to', 4]
    ]) {
      assert.ok(utilities.includes(`.${prefix}-${color}\\/${opacity}`), `Missing Notice ${prefix}-${color}/${opacity}`);
    }
  }
  for (const selector of [
    '.bg-linear-to-b',
    '.text-body-default',
    '.text-label-default',
    '.flex-wrap',
    String.raw`.basis-\[calc\(var\(--space-24\)\*2\.5\)\]`
  ]) {
    assert.ok(utilities.includes(selector), `Missing Notice utility ${selector}`);
  }
  assert.doesNotMatch(utilities, /\.eg-notice(?:__\w+)?\s*\{/, 'Notice markers have no new visual stylesheet');
});

test('MeterRow ships wrapping and token typography with real one-owner progress SSR', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const [selector, declaration] of [
    ['.gap-x-3', /column-gap:\s*var\(--space-3[,)]/],
    ['.gap-y-1', /row-gap:\s*var\(--space-1[,)]/],
    [String.raw`.\[overflow-wrap\:anywhere\]`, /overflow-wrap:\s*anywhere/],
    [
      String.raw`.leading-\[var\(--text-body-default--line-height\)\]`,
      /line-height:\s*var\(--text-body-default--line-height[,)]/
    ],
    [
      String.raw`.font-\[var\(--text-body-muted--font-weight\)\]`,
      /font-weight:\s*var\(--text-body-muted--font-weight[,)]/
    ]
  ]) {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`)), declaration);
  }
  assert.doesNotMatch(utilities, /\.eg-meter-row[^{}]*\{/, 'Markers are not another visual engine');
  const { MeterRow } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  for (const value of [42.5, NaN]) {
    const dom = new JSDOM(
      renderToString(createElement(MeterRow, { label: 'Import files', value, help: 'Keep this tab open' }))
    );
    try {
      const document = dom.window.document;
      const row = document.querySelector('.eg-meter-row');
      const bar = document.querySelector('[role="progressbar"]');
      assert.ok(row && bar);
      assert.equal(document.querySelectorAll('[role="progressbar"]').length, 1);
      assert.equal(row.hasAttribute('role'), false);
      assert.equal(bar.getAttribute('aria-label'), 'Import files');
      assert.equal(row.firstElementChild.getAttribute('aria-hidden'), 'true');
      assert.equal(document.querySelector('output, meter, [aria-live]'), null);
      const ids = bar.getAttribute('aria-describedby').split(' ');
      assert.equal(new Set(ids).size, ids.length);
      assert.equal(
        ids.map((id) => document.getElementById(id).textContent).join(' '),
        Number.isFinite(value) ? 'Keep this tab open' : 'In progress Keep this tab open'
      );
      assert.equal(bar.getAttribute('aria-valuenow'), Number.isFinite(value) ? '42.5' : null);
      assert.equal(bar.getAttribute('aria-valuetext'), Number.isFinite(value) ? '42.5%' : null);
    } finally {
      dom.window.close();
    }
  }
});

test('SelectTile ships shared Material, state priority, stretched geometry and native SSR semantics', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{}]*\\{`));
  for (const state of ['checked', 'on']) {
    const selected = String.raw`.has-\[\[data-state\=${state}\]\]`;
    const fill = rule(`${selected}\\:bg-surface-3`);
    assert.match(fill, new RegExp(`:has\\(:is\\(\\[data-state=["']?${state}["']?\\]\\)\\)`));
    assert.match(fill, /background-color:\s*var\(--color-surface-3[,)]/);
    const live = rule(`${String.raw`.data-\[state\=live\]\:`}${selected.slice(1)}\\:border-fg-brand-default`);
    assert.match(live, /\[data-state[=\s]+["']?live/);
    assert.match(live, /border-color:\s*var\(--color-fg-brand-default[,)]/);
    const selectedShadow = rule(`${selected}\\:shadow-\\[var\\(--shadow-edge-strong\\)\\,var\\(--shadow-elev-1\\)\\]`);
    const hoverShadow = rule(String.raw`.hover\:shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-2\)\]`);
    assert.ok(
      utilities.indexOf(selectedShadow) > utilities.indexOf(hoverShadow),
      'Selected shadow wins over hover at equal specificity'
    );
    assert.ok(
      utilities.indexOf(live) > utilities.indexOf(fill),
      'Live+selected extension follows the selection recipe'
    );
  }
  for (const token of [
    'gradient-post-new',
    'shadow-edge-strong',
    'shadow-elev-1',
    'shadow-elev-2',
    'shadow-glow-base',
    'shadow-well',
    'shadow-focus'
  ]) {
    assert.match(utilities, new RegExp(`var\\(--${token}[,)]`));
  }
  for (const selector of [
    String.raw`.focus-visible\:shadow-focus`,
    String.raw`.data-disabled\:opacity-45`,
    String.raw`.motion-reduce\:transition-none`,
    '.absolute',
    '.inset-0',
    '.min-h-11',
    '.object-cover',
    '.wrap-anywhere'
  ]) {
    assert.ok(utilities.includes(selector), `Missing SelectTile utility ${selector}`);
  }
  const layers = /@layer\s+theme,\s*base,\s*components,\s*utilities/.exec(css);
  assert.ok(layers, 'Utilities must outrank legacy component rules, including .eg-tile:hover');
  assert.ok(cssBlock(css, /@layer components\s*\{/).includes('.eg-tile:hover'), 'Keep the original legacy recipe');
  assert.doesNotMatch(utilities, /\.eg-tile[\s:{]/, 'No new marker-based visual engine');
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.equal(typeof exported.SelectTile, 'function');
  assert.equal(exported.selectTileVariants, undefined);
  assert.equal(exported.useSelectTile, undefined);
  for (const type of ['single', 'multiple']) {
    const document = new JSDOM(
      renderToStaticMarkup(
        createElement(exported.SelectTile, {
          type,
          label: 'Scenes',
          options: [{ value: 'camera', label: 'Camera', meta: 'Two layers', live: true, badge: 'Live' }],
          defaultValue: type === 'single' ? 'camera' : ['camera']
        })
      )
    );
    try {
      const group = document.window.document.querySelector('.eg-select-tile');
      assert.equal(group.getAttribute('role'), type === 'single' ? 'radiogroup' : 'group');
      const button = group.querySelector('button');
      assert.equal(button.children.length, 0);
      assert.equal(button.getAttribute(type === 'single' ? 'aria-checked' : 'aria-pressed'), 'true');
      assert.equal(
        document.window.document.getElementById(button.getAttribute('aria-labelledby')).textContent,
        'Camera'
      );
      assert.equal(
        button
          .getAttribute('aria-describedby')
          .split(' ')
          .map((id) => document.window.document.getElementById(id).textContent)
          .join(' '),
        'Two layers Live'
      );
      assert.equal(button.parentElement.getAttribute('data-state'), 'live');
      assert.ok(button.parentElement.matches(`:has([data-state="${type === 'single' ? 'checked' : 'on'}"])`));
    } finally {
      document.window.close();
    }
  }
});

test('Timeline ships bounded geometry, attribute states, legacy resets and passive SSR semantics', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  for (const multiplier of [2, 3, 4]) {
    assert.match(css, new RegExp(String.raw`max-height:\s*calc\(var\(--space-24\)\s*\*\s*${multiplier}\)`));
  }
  for (const selector of [
    String.raw`.data-\[state\=highlighted\]\:bg-bg-brand-subtle`,
    String.raw`.not-data-\[state\=highlighted\]\:data-\[kind\=command\]\:bg-fg-default\/3`,
    String.raw`.data-\[role\=moderator\]\:text-status-success`,
    String.raw`.focus-visible\:-outline-offset-\(--focus-width\)`
  ]) {
    assert.ok(css.includes(selector), `Missing Timeline utility ${selector}`);
  }
  assert.match(css, /outline-color:\s*var\(--color-focus-ring[,)]/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /grid-template-columns:\s*var\(--space-14\)\s+minmax\(0,\s*auto\)\s+minmax\(0,\s*1fr\)/);
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const event = { id: 'event', time: { text: '01:13', dateTime: 'PT1M13S' }, category: 'Release', body: 'Published' };
  const html = renderToString(createElement(exported.Timeline, { label: 'Events', items: [event] }));
  assert.match(html, /role="region"/);
  assert.match(html, /aria-live="off"/);
  assert.match(html, /<ol[^>]*role="list"/);
  assert.match(html, /dateTime="PT1M13S"/i);
  const chat = {
    id: 'chat',
    time: event.time,
    platform: { name: 'Community', icon: 'twitch' },
    author: { name: 'Alex', moderator: true, avatar: {} },
    message: '<b>!help</b>',
    command: true
  };
  const transcript = renderToString(
    createElement(exported.Timeline, { variant: 'chat', label: 'Chat', items: [chat] })
  );
  assert.match(transcript, /role="log"/);
  assert.match(transcript, /aria-live="polite"/);
  assert.match(transcript, /aria-relevant="additions"/);
  assert.match(transcript, /aria-atomic="false"/);
  assert.match(transcript, /&lt;b&gt;!help&lt;\/b&gt;/);
  assert.match(transcript, /Moderator/);
  assert.match(transcript, /Command/);
  for (const name of ['timelineVariants', 'useTimeline', 'timelineItemVariants']) {
    assert.equal(Object.hasOwn(exported, name), false);
  }
});

test('NavList ships every static CVA utility and native disclosure/current-page SSR', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/molecules/nav-list/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const classes = new Set();
  function collect(node) {
    if (ts.isStringLiteral(node)) {
      for (const name of node.text.split(/\s+/)) {
        classes.add(name);
      }
    } else {
      ts.forEachChild(node, collect);
    }
  }
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      for (const argument of node.arguments) {
        collect(argument);
      }
    } else {
      ts.forEachChild(node, visit);
    }
  }
  visit(source);
  assert.ok(classes.size > 45, 'Scan every NavList part recipe');
  for (const name of classes) {
    if (name === 'eg-nav-list' || name.startsWith('group/')) {
      continue;
    }
    const selector = '.' + name.replace(/[^\w-]/g, '\\$&');
    assert.ok(css.includes(selector), `Missing NavList utility ${name}`);
  }
  assert.match(css, /outline-color:\s*var\(--color-focus-ring-inverse[,)]/);
  assert.match(css, /outline-width:\s*var\(--focus-width[,)]/);
  assert.match(css, /min-height:\s*calc\(var\(--space-1\)\s*\*\s*11\)/);
  assert.doesNotMatch(css, /\.eg-nav-list\s*\{/);
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const home = { id: 'home', label: 'Home', href: '#home', 'aria-current': 'page', count: 0 };
  const html = renderToString(
    createElement(exported.NavList, {
      label: 'Workspace',
      items: [
        home,
        { kind: 'group', id: 'tools', label: 'Tools', items: [] },
        {
          kind: 'collapsible-group',
          id: 'closed',
          label: 'Closed',
          count: 4,
          signal: { state: 'live', text: 'Voting live' },
          items: [{ id: 'secret', label: 'Secret', href: '#secret' }]
        },
        {
          kind: 'collapsible-group',
          id: 'open',
          label: 'Open',
          defaultOpen: true,
          items: [{ id: 'draft', label: 'Draft', href: '#draft', tag: { children: 'New' }, warning: 'Needs attention' }]
        }
      ]
    })
  );
  assert.match(html, /^<nav aria-label="Workspace" class="eg-nav-list /);
  assert.match(html, /<a href="#home" aria-current="page" class="eg-surface [^"]*bg-surface-3/);
  assert.match(html, /aria-labelledby="[^"]+-caption-1"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="[^"]+" aria-expanded="true"/);
  assert.match(html, /eg-status-dot/);
  assert.match(html, /Voting live/);
  assert.match(html, /eg-badge/);
  assert.match(html, /Needs attention/);
  assert.doesNotMatch(html, /Secret|role="(?:menu|tree|tab)|eg-menu|aria-selected/);
  for (const name of ['useNavList', 'navListLinkVariants', 'navListTriggerVariants']) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} stays internal`);
  }
});

test('transition utility guard accepts only the exact approved emitted selectors', () => {
  for (const selector of [
    '.transition-none',
    '.transition-colors',
    '.transition-opacity',
    '.transition-transform',
    '.transition-shadow',
    String.raw`.transition-\[background-color\,border-color\]`,
    String.raw`.transition-\[border-color\,box-shadow\]`,
    String.raw`.transition-\[translate\,background-color\]`,
    String.raw`.transition-\[border-color\,color\]`,
    String.raw`.transition-\[translate\]`,
    String.raw`.transition-\[opacity\,translate\]`,
    String.raw`.transition-\[color\,background-color\,border-color\,box-shadow\,scale\]`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.doesNotMatch(`${selector} { transition-property: none; }`, unapprovedTransitionUtility, selector);
  }
});

test('transition utility guard rejects unrelated named and arbitrary transitions', () => {
  for (const selector of [
    '.transition-all',
    '.transition-width',
    '.transition-colors-extra',
    '.transition-opacity-extra',
    '.transition-none-extra',
    '.transition-transform-extra',
    '.transition-shadow-extra',
    String.raw`.transition-\[all\]`,
    String.raw`.transition-\[width\]`,
    String.raw`.transition-\[background-color\,border-color\,opacity\]`,
    String.raw`.transition-\[border-color\,box-shadow\,opacity\]`,
    String.raw`.transition-\[translate\,background-color\,width\]`,
    String.raw`.transition-\[translate\,background-color\]extra`,
    String.raw`.transition-\[border-color\,color\,width\]`,
    String.raw`.transition-\[border-color\,color\]extra`,
    String.raw`.transition-\[translate\,width\]`,
    String.raw`.transition-\[translate\]extra`,
    String.raw`.transition-\[opacity\,translate\,width\]`,
    String.raw`.transition-\[opacity\,translate\]extra`,
    String.raw`.transition-\[color\,background-color\,border-color\,box-shadow\,scale\,width\]`,
    String.raw`.transition-\[color\,background-color\,border-color\,box-shadow\,scale\]extra`
  ]) {
    assert.throws(
      () => assert.doesNotMatch(`${selector} { transition-property: all; }`, unapprovedTransitionUtility),
      { code: 'ERR_ASSERTION' },
      selector
    );
  }
});

test('Toggle ships its exact token-backed pressed, focus, reset and reduced-motion utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  for (const selector of [
    String.raw`.data-\[state\=on\]\:bg-surface-3`,
    String.raw`.data-\[state\=on\]\:bg-\[image\:var\(--gradient-sheen\)\]`,
    String.raw`.data-\[state\=on\]\:border-border-hairline-strong`,
    String.raw`.group-data-\[state\=on\]\/toggle\:text-fg-brand-raised`,
    String.raw`.active\:scale-97`,
    String.raw`.data-disabled\:opacity-45`,
    String.raw`.motion-reduce\:active\:scale-100`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.ok(css.includes(selector), `Missing Toggle utility ${selector}`);
  }
  for (const token of [
    'gradient-sheen',
    'shadow-edge-strong',
    'shadow-elev-1',
    'shadow-focus',
    'duration-fast',
    'duration-press',
    'ease-out',
    'ease-snappy'
  ]) {
    assert.ok(css.includes(`var(--${token})`), token);
  }
  const press = cssBlock(css, /\.active\\:scale-97:active\s*\{/);
  assert.match(press, /--tw-scale-x:\s*97%/);
  assert.match(press, /--tw-scale-y:\s*97%/);
  assert.match(press, /scale:\s*var\(--tw-scale-x\)\s+var\(--tw-scale-y\)/);
  assert.match(css, /box-sizing:\s*border-box/);
  assert.match(css, /padding-block:\s*var\(--space-0\)/);
  assert.doesNotMatch(css, /\.eg-toggle\s*[,{]/, 'Root marker is not a separate visual engine');
});

test('Chip ships its exact token-backed pill, pressed, focus, press and reduced-motion utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}[^{]*\\{`));
  };
  assert.match(
    rule(String.raw`.\[background\:var\(--gradient-sheen\)\,var\(--color-surface-1\)\]`),
    /background:\s*var\(--gradient-sheen\),\s*var\(--color-surface-1\)\s*;/
  );
  assert.match(
    rule(String.raw`.hover\:\[background\:var\(--gradient-sheen\)\,var\(--color-surface-2\)\]`),
    /background:\s*var\(--gradient-sheen\),\s*var\(--color-surface-2\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=on\]\:\[background\:var\(--gradient-chip-active\)\,var\(--color-surface-1\)\]`),
    /background:\s*var\(--gradient-chip-active\),\s*var\(--color-surface-1\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=on\]\:shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-glow-base\)\]`),
    /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-glow-base\)\s*;/
  );
  assert.match(rule(String.raw`.data-\[state\=on\]\:border-primitive-red-neon\/60`), /color-mix\(/);
  assert.match(rule(String.raw`.active\:scale-\[\.97\]`), /scale:\s*\.97\s*;/);
  // The on-state shadow is emitted after the plain focus ring, so the on+focus rule restores it.
  const focus = css.indexOf(String.raw`.focus-visible\:shadow-focus:focus-visible`);
  const on = css.indexOf(String.raw`.data-\[state\=on\]\:shadow-\[var\(--shadow-edge-strong\)`);
  const onFocus = css.indexOf(String.raw`.data-\[state\=on\]\:focus-visible\:shadow-focus`);
  assert.ok(focus > -1 && on > focus && onFocus > on, 'On+focus ring must follow the on-state shadow');
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(
    cssBlock(reducedMotion, /\.motion-reduce\\:active\\:translate-none:active\s*\{/),
    /translate:\s*none\s*;/
  );
  assert.match(cssBlock(reducedMotion, /\.motion-reduce\\:active\\:scale-none:active\s*\{/), /scale:\s*none\s*;/);
  for (const selector of [
    String.raw`.pointer-coarse\:min-h-11`,
    String.raw`.active\:translate-y-px`,
    String.raw`.active\:duration-\[var\(--duration-press\)\]`,
    String.raw`.active\:ease-\[var\(--ease-snappy\)\]`,
    String.raw`.duration-\[var\(--duration-fast\)\]`,
    String.raw`.ease-\[var\(--ease-out\)\]`,
    String.raw`.hover\:border-border-hairline-strong`,
    String.raw`.disabled\:opacity-45`,
    '.shadow-edge',
    '.transition-colors'
  ]) {
    assert.ok(css.includes(selector), `Missing Chip utility ${selector}`);
  }
  assert.doesNotMatch(utilities, /\.eg-chip[^{]*\{/, 'Chip has no stylesheet: its marker adds no utility rule');
});

test('SocialLinks ships static collection utilities and native SSR composition without a second visual engine', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of ['.list-none', '.shrink-0', '.text-label-eyebrow', '.font-display', '.text-fg-secondary']) {
    assert.ok(utilities.includes(selector), `Missing SocialLinks utility ${selector}`);
  }
  assert.match(utilities, /font-size:\s*var\(--text-label-eyebrow[,)]/);
  for (const gap of [1, 2, 3, 4]) {
    assert.match(utilities, new RegExp(`gap:\\s*var\\(--space-${gap}[,)]`));
  }
  assert.doesNotMatch(utilities, /\.eg-social(?:__\w+)?\s*\{/);
  const { SocialLinks, Icon } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const items = [
    {
      id: 'github',
      href: 'https://example.org/profile',
      label: 'Project GitHub',
      icon: createElement(Icon, { name: 'github' }),
      external: true,
      rel: 'me NOOPENER me'
    }
  ];
  const html = renderToString(createElement(SocialLinks, { items, inline: true, gap: 1 }));
  assert.match(html, /eg-social/);
  assert.match(html, /<ul[^>]*role="list"[^>]*aria-label="Social profiles"/);
  assert.match(html, /<li[^>]*><a[^>]*href="https:\/\/example.org\/profile"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="me NOOPENER noreferrer"/);
  assert.match(html, /Project GitHub \(opens in a new tab\)/);
  assert.doesNotMatch(html, /<button|role="button"|aria-label="Project GitHub"/);
  assert.equal(renderToString(createElement(SocialLinks, { items: [] })), '');
  const ghost = renderToString(createElement(SocialLinks, { items, variant: 'ghost', size: 'md', caption: null }));
  assert.doesNotMatch(ghost, /eg-social__label/);
  assert.match(ghost, /size-10/);
});

test('ChipGroup ships wrapping layout, token underline and disabled/motion guards from its CVA source', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  assert.match(cssBlock(utilities, /\.flex-wrap\s*\{/), /flex-wrap:\s*wrap/);
  assert.match(cssBlock(utilities, /\.gap-2\s*\{/), /gap:\s*var\(--space-2\)/);
  for (const selector of [
    String.raw`.data-\[state\=on\]\:underline`,
    String.raw`.decoration-\[length\:var\(--border-width\)\]`,
    String.raw`.underline-offset-\[var\(--space-1\)\]`,
    String.raw`.disabled\:cursor-not-allowed`,
    String.raw`.disabled\:active\:translate-none`,
    String.raw`.disabled\:active\:scale-none`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.ok(utilities.includes(selector), `Missing ChipGroup utility ${selector}`);
  }
  assert.match(utilities, /text-decoration-thickness:\s*var\(--border-width\)/);
  assert.match(utilities, /text-underline-offset:\s*var\(--space-1\)/);
  assert.doesNotMatch(css, /\.eg-chip-group[^{]*\{/, 'Root marker adds no painted panel');
  const source = readFileSync(resolve(root, 'packages/ui/src/styles/compiled.css'), 'utf8');
  assert.ok(source.includes('@source "../molecules/chip-group/types.ts";'));
});

test('Tabs publishes only its approved API and ships static molecule utilities', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.equal(typeof exported.Tabs, 'function');
  assert.match(exported.tabsVariants(), /\beg-tabs\b/);
  for (const name of [
    'useTabs',
    'TabsList',
    'TabsTrigger',
    'TabsContent',
    'tabsListVariants',
    'tabsTriggerVariants',
    'tabsCountVariants',
    'tabsPanelVariants'
  ]) {
    assert.equal(exported[name], undefined, name);
  }
  const entry = readFileSync(artifact('ui', ui.exports['.'].types), 'utf8');
  assert.match(entry, /TabsItem/);
  assert.match(entry, /TabsProps/);
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    String.raw`.p-0\.75`,
    String.raw`.min-h-8\.5`,
    String.raw`.\[scrollbar-width\:none\]`,
    String.raw`.rounded-\[calc\(var\(--radius-md\)---spacing\(0\.75\)\)\]`,
    String.raw`.data-\[state\=active\]\:after\:bg-fg-brand-default`,
    String.raw`.data-\[state\=active\]\:after\:shadow-glow-base`,
    String.raw`.motion-reduce\:after\:transition-none`,
    String.raw`.focus-visible\:inset-ring-focus-ring`,
    String.raw`.bg-status-danger\/14`
  ]) {
    assert.ok(utilities.includes(selector), `Missing Tabs utility ${selector}`);
  }
  assert.match(utilities, /scrollbar-width:\s*none/);
  assert.match(utilities, /border-radius:\s*calc\(var\(--radius-md\)\s*-\s*[^;]+\)/);
  const active = css.indexOf(String.raw`.data-\[state\=active\]\:shadow-\[var\(--shadow-edge-strong\)`);
  const activeFocus = css.indexOf(String.raw`.data-\[state\=active\]\:focus-visible\:shadow-focus`);
  assert.ok(active > -1 && activeFocus > active, 'Focused active segment must retain the focus shadow');
  assert.doesNotMatch(utilities, /\.eg-tabs[^\s]*\s*\{/, 'No Tabs stylesheet or legacy part recipes in utilities');
});

test('UI publishes its stable declaration entry and reachable internal declarations', (context) => {
  assert.equal(ui.exports['.'].types, './dist/index.d.ts');
  assert.equal(ui.types, ui.exports['.'].types);
  const entry = artifact('ui', ui.exports['.'].types);
  const dist = dirname(entry);
  assert.ok(!existsSync(resolve(dist, 'src/index.d.ts')), 'Fresh build must not retain the mis-rooted entry');
  const pending = [entry];
  const visited = new Set();
  while (pending.length) {
    const file = pending.pop();
    if (visited.has(file)) {
      continue;
    }
    visited.add(file);
    const source = readFileSync(file, 'utf8');
    assert.ok(source.trim(), `Empty declaration: ${file}`);
    const info = ts.preProcessFile(source, true);
    for (const reference of [...info.importedFiles, ...info.referencedFiles]) {
      const specifier = reference.fileName;
      if (!specifier.startsWith('.')) {
        continue;
      }
      const base = resolve(dirname(file), specifier.replace(/\.js$/, ''));
      const dependency = [base, `${base}.d.ts`, resolve(base, 'index.d.ts')].find(
        (candidate) => candidate.endsWith('.d.ts') && existsSync(candidate) && statSync(candidate).isFile()
      );
      assert.ok(dependency, `Unresolved internal declaration: ${file} -> ${specifier}`);
      assert.ok(!relative(dist, dependency).startsWith('..'), `Declaration escapes dist: ${dependency}`);
      pending.push(dependency);
    }
  }
  assert.ok(visited.size > 1, 'Public entry must link to component declarations');
  context.diagnostic(`Checked ${visited.size} reachable declaration files`);
});

test('UI ships Select token recipes, Radix geometry and precise state utilities', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    ['.min-h-11', /min-height:\s*calc\(var\(--space-1\) \* 11\)/],
    ['.min-h-9', /min-height:\s*calc\(var\(--space-1\) \* 9\)/],
    ['.pl-3', /padding-left:\s*var\(--space-3\)/],
    ['.pr-10', /padding-right:\s*var\(--space-10\)/],
    [String.raw`.py-1\.5`, /padding-block:\s*calc\(var\(--space-1\) \* 1\.5\)/],
    ['.border-solid', /border-style:\s*solid/],
    [String.raw`.border-\(length\:--border-width\)`, /border-width:\s*var\(--border-width\)/],
    [String.raw`.min-w-\[var\(--radix-select-trigger-width\)\]`, /min-width:\s*var\(--radix-select-trigger-width\)/],
    [
      String.raw`.max-h-\[var\(--radix-select-content-available-height\)\]`,
      /max-height:\s*var\(--radix-select-content-available-height\)/
    ],
    ['.transition-colors', /transition-property:\s*color, background-color, border-color/],
    [String.raw`.duration-\[var\(--duration-fast\)\]`, /transition-duration:\s*var\(--duration-fast\)/],
    [
      String.raw`.font-\(weight\:--text-body-default--font-weight\)`,
      /font-weight:\s*var\(--text-body-default--font-weight\)/
    ]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  for (const text of [
    'var(--shadow-well)',
    'var(--shadow-ring-brand)',
    'var(--shadow-edge-strong)',
    'var(--shadow-elev-3)',
    'var(--blur-overlay)',
    'var(--focus-width)',
    'var(--color-focus-ring-inverse',
    'data-highlighted',
    'data-disabled',
    'data-placeholder',
    'data-state="open"',
    'backdrop-filter: none',
    'color-mix(in oklab, var(--color-fg-default',
    '6%',
    'saturate(150%)'
  ]) {
    assert.ok(css.includes(text), `Missing Select CSS ${text}`);
  }
  assert.match(utilities, /prefers-reduced-transparency:\s*reduce/);
  const reduce = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(reduce, /motion-reduce\\:transition-none/);
  assert.doesNotMatch(utilities, /\.eg-select(?:-content)?\s*\{/, 'Select has no stylesheet');
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.ok(exported.Select, 'Select must be public');
  for (const name of ['selectTriggerVariants', 'selectContentVariants', 'selectItemVariants', 'useSelect']) {
    assert.equal(exported[name], undefined, `${name} must remain private`);
  }
  const types = readFileSync(resolve(root, 'packages/ui/dist/atoms/select/types.d.ts'), 'utf8');
  for (const name of ['SelectProps', 'SelectOption', 'SelectSize']) {
    assert.ok(types.includes(`type ${name}`), `${name} must be declared`);
  }
});

test('UI ships Dropzone token geometry, native resets and attribute-driven colors without preflight', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    ['.min-w-24', /min-width:\s*var\(--space-24\)/],
    ['.min-h-24', /min-height:\s*var\(--space-24\)/],
    ['.min-h-14', /min-height:\s*var\(--space-14\)/],
    [String.raw`.gap-1\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/],
    [String.raw`.gap-2\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)/],
    ['.border-dashed', /border-style:\s*dashed/],
    ['.bg-none', /background-image:\s*none/],
    [String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none/],
    ['.transition-colors', /transition-property:[^;]*background-color[^;]*border-color[^;]*;/],
    [
      String.raw`.data-\[state\=over\]\:border-border-brand[data-state="over"]`,
      /\[data-state=["']?over["']?\][\s\S]*border-color:\s*var\(--color-border-brand/
    ],
    [
      String.raw`.data-\[state\=over\]\:bg-alpha-red-07[data-state="over"]`,
      /background-color:\s*var\(--color-alpha-red-07/
    ],
    [String.raw`.data-\[state\=over\]\:text-fg-default[data-state="over"]`, /color:\s*var\(--color-fg-default/],
    [
      String.raw`.focus-visible\:shadow-focus:focus-visible`,
      /--tw-shadow:\s*0 0 0 2px var\(--tw-shadow-color, #141518\), 0 0 0 4px var\(--tw-shadow-color, #FF0036\)/
    ],
    [String.raw`.disabled\:opacity-45:disabled`, /opacity:\s*(?:45%|0\.45)/],
    [String.raw`.motion-reduce\:transition-none`, /transition-property:\s*none/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  assert.ok(utilities.includes('.flex-row') && utilities.includes('.flex-col'));
  assert.ok(utilities.includes(String.raw`.disabled\:pointer-events-none`));
  assert.ok(utilities.includes(String.raw`.disabled\:cursor-not-allowed`));
});

test('Field public build renders linked descriptions and Slider invalid semantics without Tailwind', async () => {
  const { Field, Input, Slider } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  const html = renderToString(
    createElement(Field, {
      label: 'Post',
      hint: 'Hint',
      error: 'Shorten the post',
      counter: { value: 294, max: 280 },
      readout: '294 characters',
      children: createElement(Input, { id: 'post', 'aria-describedby': 'external external' })
    })
  );
  const dom = new JSDOM(`<p id="external">External guidance</p>${html}`);
  try {
    const document = dom.window.document;
    const field = document.querySelector('.eg-field');
    const input = document.getElementById('post');
    assert.equal(field.tagName, 'DIV');
    assert.equal(field.getAttribute('data-state'), 'invalid');
    assert.equal(field.querySelector('label').htmlFor, input.id);
    assert.equal(field.querySelector('output').getAttribute('for'), input.id);
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.deepEqual(
      input
        .getAttribute('aria-describedby')
        .split(' ')
        .map((id) => document.getElementById(id).textContent),
      ['External guidance', 'Shorten the post', '294 / 280']
    );
    assert.equal(field.querySelector('[aria-live], [role="alert"]'), null);
  } finally {
    dom.window.close();
  }
  const sliderDOM = new JSDOM(
    renderToString(
      createElement(Field, {
        label: 'Ring size',
        error: 'Too large',
        children: createElement(Slider, { label: 'Ring size', defaultValue: 56 })
      })
    )
  );
  try {
    const document = sliderDOM.window.document;
    const slider = document.querySelector('[role="slider"]');
    assert.equal(slider.getAttribute('aria-invalid'), 'true');
    assert.equal(document.getElementById(slider.getAttribute('aria-describedby')).textContent, 'Too large');
  } finally {
    sliderDOM.window.close();
  }
});

test('UI ships Field layout, description tones and single-opacity disabled selectors', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\{]*\\{`));
  assert.match(rule(String.raw`.grid-cols-\[auto_1fr\]`), /grid-template-columns:\s*auto 1fr/);
  assert.match(rule('.gap-1\\.5'), /gap:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/);
  for (const selector of [
    String.raw`.group-has-\[\:disabled\]\:opacity-45`,
    String.raw`.group-has-\[\[data-disabled\]\]\:opacity-45`
  ]) {
    const body = rule(selector);
    assert.match(body, /:has\(/);
    assert.match(body, /opacity:\s*(?:\.45|45%)/);
  }
  assert.match(rule(String.raw`.data-\[state\=over\]\:text-status-danger`), /color:\s*var\(--color-status-danger[,)]/);
  assert.match(
    rule(String.raw`.font-\[var\(--text-body-muted--font-weight\)\]`),
    /font-weight:\s*var\(--text-body-muted--font-weight[,)]/
  );
  assert.ok(utilities.includes(String.raw`.pointer-coarse\:min-h-11`));
  assert.match(utilities, /@media\s*\(pointer:\s*coarse\)/);
  assert.doesNotMatch(utilities, /\.eg-field[^\{]*\{/, 'Field marker is not a second visual engine');
});

test('UI ships the Stat Material card, figure recipes and highlight utilities without preflight', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    [
      '.text-display-stat',
      /font-size:\s*var\(--text-display-stat[,)][\s\S]*line-height:\s*var\(--tw-leading,\s*var\(--text-display-stat--line-height[,)]/
    ],
    ['.text-display-stat-sm', /font-size:\s*var\(--text-display-stat-sm[,)]/],
    ['.tabular-nums', /font-variant-numeric:/],
    ['.rounded-lg', /border-radius:\s*var\(--radius-lg[,)]/],
    ['.bg-surface-1', /background-color:\s*var\(--color-surface-1[,)]/],
    [String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`, /background-image:\s*var\(--gradient-sheen\)/],
    [
      String.raw`.shadow-\[var\(--shadow-edge\)\,var\(--shadow-elev-1\)\]`,
      /--tw-shadow:\s*var\(--shadow-edge\),\s*var\(--shadow-elev-1\)/
    ],
    [String.raw`.gap-1\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/],
    [String.raw`.py-2\.5`, /padding-block:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)/],
    [String.raw`.transition-\[border-color\,box-shadow\]`, /transition-property:\s*border-color,\s*box-shadow/],
    [String.raw`.duration-\[var\(--duration-base\)\]`, /transition-duration:\s*var\(--duration-base\)/],
    [String.raw`.ease-\[var\(--ease-out\)\]`, /transition-timing-function:\s*var\(--ease-out\)/],
    [
      String.raw`.data-\[state\=highlighted\]\:border-border-brand[data-state="highlighted"]`,
      /border-color:\s*var\(--color-border-brand[,)]/
    ],
    [
      String.raw`.data-\[state\=highlighted\]\:shadow-\[var\(--shadow-edge\)\,var\(--shadow-glow-base\)\][data-state="highlighted"]`,
      /--tw-shadow:\s*var\(--shadow-edge\),\s*var\(--shadow-glow-base\)/
    ],
    [
      String.raw`.group-data-\[state\=highlighted\]\/stat\:text-fg-brand-raised:is(:where(.group\/stat)[data-state="highlighted"] *)`,
      /color:\s*var\(--color-fg-brand-raised[,)]/
    ],
    [
      String.raw`.data-\[state\=unavailable\]\:text-fg-muted[data-state="unavailable"]`,
      /color:\s*var\(--color-fg-muted[,)]/
    ],
    [String.raw`.motion-reduce\:transition-none`, /transition-property:\s*none/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  assert.ok(utilities.includes('.sr-only'), 'Stat no-data text needs the sr-only utility');
  assert.doesNotMatch(css, /\.eg-stat-(?:label|value|delta)\s*\{/, 'Stat part markers carry no stylesheet rules');
});

test('PageHeader ships compact typography and intrinsic layout without marker paint', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  assert.match(
    rule(String.raw`.basis-\[calc\(var\(--space-24\)\*3\)\]`),
    /flex-basis:\s*calc\(var\(--space-24\)\s*\*\s*3\)/
  );
  assert.match(rule('.text-heading-small'), /font-size:\s*var\(--text-heading-small[,)]/);
  assert.match(
    rule('.text-heading-small'),
    /font-weight:\s*var\(--tw-font-weight,\s*var\(--text-heading-small--font-weight[,)]/
  );
  assert.match(
    rule('.text-label-eyebrow'),
    /letter-spacing:\s*var\(--tw-tracking,\s*var\(--text-label-eyebrow--letter-spacing[,)]/
  );
  assert.match(rule('.gap-x-6'), /column-gap:\s*var\(--space-6[,)]/);
  assert.match(rule('.gap-y-4'), /row-gap:\s*var\(--space-4[,)]/);
  assert.match(rule('.wrap-anywhere'), /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(utilities, /\.eg-page-header\s*[,{]/);
  const { PageHeader, Button, ButtonGroup } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const minimal = renderToString(createElement(PageHeader, { title: 'Projects' }));
  assert.match(minimal, /<header[^>]*eg-page-header/);
  assert.match(minimal, /<h1[^>]*>Projects<\/h1>/);
  assert.doesNotMatch(minimal, /title=|role=|tabindex=|aria-live=|<p\b|eg-button-group/);
  const grouped = renderToString(
    createElement(PageHeader, {
      title: 'Projects',
      eyebrow: 'Workspace',
      level: 2,
      actions: createElement(ButtonGroup, {
        variant: 'spaced',
        children: [
          createElement(Button, { key: 'import', children: 'Import' }),
          createElement(Button, { key: 'new', children: 'New project' })
        ]
      })
    })
  );
  assert.match(grouped, /<p[^>]*>Workspace<\/p><h2[^>]*>Projects<\/h2>/);
  assert.equal((grouped.match(/role="group"/g) ?? []).length, 1);
  const single = renderToString(
    createElement(PageHeader, {
      title: 'Projects',
      actions: createElement(Button, { asChild: true, children: createElement('a', { href: '#new' }, 'New project') })
    })
  );
  assert.match(single, /<a[^>]*href="#new"/);
  assert.doesNotMatch(single, /role="group"/);
});

test('ListItem ships compound layout, state Material and native empty focus utilities', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  for (const name of [
    'ListItem',
    'ListItemActions',
    'ListItemBody',
    'ListItemContent',
    'ListItemFooter',
    'ListItemMedia',
    'ListItemMeta'
  ]) {
    assert.equal(typeof exported[name], 'function', `${name} is a plain component without a ref API`);
  }
  assert.equal(exported.listItemVariants, undefined, 'ListItem recipes remain internal');
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const selectors = [
    String.raw`.data-\[state\=new\]\:bg-\[image\:var\(--gradient-post-new\)\]`,
    String.raw`.data-\[state\=failed\]\:border-status-danger\/40`,
    String.raw`.data-\[state\=dragging\]\:border-dashed`,
    String.raw`.group-data-\[state\=dragging\]\/list-item\:opacity-50`,
    String.raw`.group-data-\[state\=done\]\/list-item\:text-fg-muted`,
    String.raw`.group-data-\[state\=off\]\/list-item\:text-fg-secondary`,
    String.raw`.data-\[state\=empty\]\:focus-visible\:shadow-focus`,
    String.raw`.data-\[state\=empty\]\:disabled\:opacity-45`,
    String.raw`.data-\[variant\=row\]\:flex-wrap`,
    String.raw`.group-data-\[variant\=compact\]\/list-item\:text-label-default`
  ];
  for (const state of ['done', 'off', 'empty']) {
    for (const reset of ['bg-transparent', 'bg-none', 'shadow-none']) {
      selectors.push(`.data-\\[state\\=${state}\\]\\:${reset}`);
    }
  }
  for (const selector of selectors) {
    assert.ok(css.includes(selector), `Missing ListItem utility ${selector}`);
  }
  assert.match(css, /calc\(var\(--space-20\)\s*\+\s*var\(--space-2\)\)/);
  assert.doesNotMatch(css, /\.eg-list-item(?:__[a-z]+)?\s*[{,]/, 'Markers are not a separate visual engine');
});

test('ButtonGroup ships static spacing, wrapping, logical child corners and focus stacking', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const source = readFileSync(resolve(root, 'packages/ui/src/styles/compiled.css'), 'utf8');
  assert.match(source, /@source "\.\.\/molecules\/\*\*\/types\.ts"/);
  for (const selector of [
    '.inline-flex',
    '.items-stretch',
    '.flex-wrap',
    '.flex-nowrap',
    '.gap-3',
    String.raw`.gap-0\.5`,
    String.raw`.\*\:not-first\:rounded-s-sm`,
    String.raw`.\*\:not-last\:rounded-e-sm`,
    String.raw`.\*\:focus-visible\:relative`,
    String.raw`.\*\:focus-visible\:z-10`
  ]) {
    assert.ok(utilities.includes(selector), `Missing ButtonGroup utility ${selector}`);
  }
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\{]*\\{`));
  assert.match(rule('.gap-3'), /gap:\s*var\(--space-3\)/);
  assert.match(rule(String.raw`.gap-0\.5`), /gap:\s*calc\(var\(--space-1\)\s*\*\s*0\.5\)/);
  const start = rule(String.raw`.\*\:not-first\:rounded-s-sm`);
  const end = rule(String.raw`.\*\:not-last\:rounded-e-sm`);
  assert.match(start, /border-start-start-radius:\s*var\(--radius-sm(?:,\s*4px)?\)/);
  assert.match(start, /border-end-start-radius:\s*var\(--radius-sm(?:,\s*4px)?\)/);
  assert.match(end, /border-start-end-radius:\s*var\(--radius-sm(?:,\s*4px)?\)/);
  assert.match(end, /border-end-end-radius:\s*var\(--radius-sm(?:,\s*4px)?\)/);
  assert.match(start, /:not\(:first-child\)/);
  assert.match(end, /:not\(:last-child\)/);
  assert.match(rule(String.raw`.\*\:focus-visible\:relative`), /position:\s*relative/);
  assert.match(rule(String.raw`.\*\:focus-visible\:z-10`), /z-index:\s*10/);
  assert.ok(
    utilities.indexOf(String.raw`.\*\:not-first\:rounded-s-sm`) > utilities.indexOf('.rounded-md'),
    'Parent child-corner utilities must follow the atom radius utility'
  );
  assert.doesNotMatch(css, /\.eg-button-group\s*[,{]/, 'No separate visual engine');
});

test('UI ships SearchTrigger token geometry, coarse targets and attribute-driven states without preflight', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    ['.min-w-48', /min-width:\s*calc\(var\(--space-1\)\s*\*\s*48\)/],
    ['.min-h-10', /min-height:\s*var\(--space-10\)/],
    ['.w-10', /width:\s*var\(--space-10\)/],
    ['.h-auto', /height:\s*auto/],
    ['.ps-3', /padding-inline-start:\s*var\(--space-3\)/],
    ['.pe-2', /padding-inline-end:\s*var\(--space-2\)/],
    ['.ms-auto', /margin-inline-start:\s*auto/],
    [String.raw`.pointer-coarse\:min-h-11`, /min-height:\s*calc\(var\(--space-1\)\s*\*\s*11\)/],
    [String.raw`.pointer-coarse\:w-11`, /width:\s*calc\(var\(--space-1\)\s*\*\s*11\)/],
    [String.raw`.transition-\[border-color\,color\]`, /transition-property:\s*border-color,\s*color\s*;/],
    [String.raw`.enabled\:hover\:border-border-brand:enabled:hover`, /border-color:\s*var\(--color-border-brand/],
    [String.raw`.enabled\:hover\:text-fg-secondary:enabled:hover`, /color:\s*var\(--color-fg-secondary/],
    [
      String.raw`.font-\[var\(--text-body-default--font-weight\)\]`,
      /font-weight:\s*var\(--text-body-default--font-weight\)/
    ],
    [String.raw`.disabled\:opacity-45:disabled`, /opacity:\s*(?:45%|0\.45)/],
    [String.raw`.motion-reduce\:transition-none`, /transition-property:\s*none/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  const coarse = cssBlock(utilities, /@media\s*\(pointer:\s*coarse\)\s*\{/);
  assert.ok(
    coarse.includes(String.raw`.pointer-coarse\:min-h-11`) && coarse.includes(String.raw`.pointer-coarse\:w-11`)
  );
  assert.ok(utilities.includes(String.raw`.focus-visible\:shadow-focus:focus-visible`));
  // Legacy .eg-search keeps its components-layer defaults; utilities win by layer order.
  assert.ok(css.indexOf('.eg-search{') < css.indexOf('@layer utilities'));
});

test('UI ships PullQuote quote recipes, logical filet and measure without preflight', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    [
      '.text-quote-pull',
      /font-size:\s*var\(--text-quote-pull[,)][\s\S]*line-height:[^;]*--text-quote-pull--line-height/
    ],
    [
      '.text-quote-display',
      /font-size:\s*var\(--text-quote-display[,)][\s\S]*line-height:[^;]*--text-quote-display--line-height/
    ],
    ['.max-w-quote-pull', /max-width:\s*var\(--container-quote-pull[,)]/],
    ['.max-w-none', /max-width:\s*none/],
    [
      String.raw`.border-s-\[length\:calc\(var\(--border-width\)\*2\)\]`,
      /border-inline-start-width:\s*calc\(var\(--border-width\)\s*\*\s*2\)/
    ],
    ['.border-fg-brand-default', /border-color:\s*var\(--color-fg-brand-default/],
    [String.raw`.ps-4\.5`, /padding-inline-start:\s*calc\(var\(--space-1\)\s*\*\s*4\.5\)/],
    [String.raw`.py-0\.5`, /padding-block:\s*calc\(var\(--space-1\)\s*\*\s*0\.5\)/],
    ['.gap-3', /gap:\s*var\(--space-3\)/],
    [String.raw`.gap-5\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*5\.5\)/],
    ['.text-fg-brand-raised', /color:\s*var\(--color-fg-brand-raised/],
    ['.uppercase', /text-transform:\s*uppercase/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  // Physical left filet/inset utilities would keep a second border in RTL.
  for (const selector of [String.raw`.border-l-\[length\:calc`, String.raw`.pl-4\.5`]) {
    assert.equal(utilities.includes(selector), false, `${selector} must not ship`);
  }
});

test('Menu ships its public declarations, shared overlay and owned geometry utilities', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.equal(typeof exported.Menu, 'function');
  assert.equal(typeof exported.menuVariants, 'function');
  for (const name of ['useMenu', 'menuItemVariants', 'menuIconVariants', 'Entries', 'EntryContent']) {
    assert.equal(exported[name], undefined, `${name} stays internal`);
  }
  const declarations = readFileSync(artifact('ui', './dist/molecules/menu/types.d.ts'), 'utf8');
  for (const name of [
    'MenuProps',
    'MenuEntry',
    'MenuActionItem',
    'MenuLinkItem',
    'MenuSeparatorItem',
    'MenuLabelItem',
    'MenuSubmenuItem',
    'MenuTone',
    'MenuAlign',
    'MenuSide'
  ]) {
    assert.match(declarations, new RegExp(`export (?:declare )?type ${name}\\b`));
  }
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    String.raw`.min-w-57\.5`,
    String.raw`.max-h-\[var\(--radix-dropdown-menu-content-available-height\)\]`,
    String.raw`.py-2\.25`,
    String.raw`.data-highlighted\:bg-status-danger\/10`,
    String.raw`.group-data-highlighted\:text-fg-brand-default`,
    String.raw`.focus-visible\:inset-ring-2`,
    String.raw`.focus-visible\:inset-ring-focus-ring-inverse`,
    String.raw`.pointer-coarse\:min-h-11`,
    String.raw`.starting\:opacity-0`,
    String.raw`.motion-safe\:starting\:-translate-y-1\.5`,
    String.raw`.motion-reduce\:transition-none`,
    String.raw`.transition-\[opacity\,translate\]`
  ]) {
    assert.ok(utilities.includes(selector), `Missing Menu utility ${selector}`);
  }
  assert.match(utilities, /@starting-style/);
  assert.match(utilities, /transition-property:\s*opacity,\s*translate/);
  assert.match(utilities, /var\(--radix-dropdown-menu-content-available-height\)/);
  assert.match(utilities, /var\(--color-surface-overlay[,)]/);
  assert.match(utilities, /prefers-reduced-transparency:\s*reduce/);
  assert.match(utilities, /not \(backdrop-filter:/);
  assert.doesNotMatch(utilities, /\.eg-menu\s*\{/, 'Menu has no stylesheet recipe');
});

test('UI publishes its stable JavaScript entry', () => {
  assert.equal(ui.exports['.'].import, './dist/index.js');
  assert.equal(ui.main, ui.exports['.'].import);
  artifact('ui', ui.exports['.'].import);
});

test('UI CSS export resolves to a compiled artifact under dist', () => {
  assert.equal(ui.exports['./styles.css'], './dist/styles.css');
  artifact('ui', ui.exports['./styles.css']);
});

test('UI ships plain layered CSS without canonical token definitions or unrelated utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /@(import|reference|source|tailwind|theme|custom-variant|apply)\b/);
  assert.match(css, /@layer theme, base, components, utilities\s*;/);
  assert.match(css, /@layer components\s*\{/);
  for (const selector of [
    '.eg-gauge-arc',
    '.eg-gauge-center',
    '.min-w-0',
    '.bg-transparent',
    '.bg-none',
    String.raw`.\[box-shadow\:none\]`
  ]) {
    assert.ok(css.includes(selector), `Missing shipped selector ${selector}`);
  }
  for (const token of ['--color-surface-0', '--radius-full', '--shadow-well']) {
    assert.ok(css.includes(`var(${token})`), `UI must consume ${token}`);
    assert.ok(!css.includes(`${token}:`), `UI must not redefine ${token}`);
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const canonical = new Set([...theme.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  for (const token of canonical) {
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  // Only approved component CVA sources are scanned, not stories, tests or the default palette.
  // (`p-4` is no longer a sentinel: ListItem's approved CVA ships it.)
  assert.doesNotMatch(css, /\.bg-red-500\s*[,\{]/);
});

test('UI ships functional static Gauge utilities without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}(?:\\[data-state=[^\\]]+\\])?\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.bg-transparent', /background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/],
    ['.bg-none', /background-image:\s*none\s*;/],
    [String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none\s*;/],
    [String.raw`.rounded-\[var\(--radius-full\)\]`, /border-radius:\s*var\(--radius-full\)\s*;/],
    ['.border-0', /border(?:-width)?:\s*(?:0|0px)\s*;/],
    ['.p-0', /padding:\s*(?:0|0px|var\(--space-0\)|calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\))\s*;/],
    ['.inline-flex', /display:\s*inline-flex\s*;/],
    ['.min-w-0', /min-width:\s*(?:0|0px|var\(--space-0\))\s*;/],
    ['.gap-2', /gap:\s*var\(--space-2\)\s*;/],
    ['.font-sans', /font-family:\s*var\(--font-sans(?:,\s*"Barlow",\s*system-ui,\s*sans-serif)?\)\s*;/],
    ['.text-fg-default', /color:\s*var\(--color-fg-default(?:,\s*var\(--color-primitive-white\))?\)\s*;/],
    ['.text-label-default', /font-size:\s*var\(--text-label-default(?:,\s*14px)?\)\s*;/],
    ['.transition-none', /transition-property:\s*none\s*;/],
    [String.raw`.hover\:shadow-none:hover`, /box-shadow:\s*[^;]+;/]
  ]) {
    assert.match(rule(selector), declaration);
  }
  for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
    for (const [prefix, property] of [
      ['w', 'width'],
      ['h', 'height']
    ]) {
      assert.match(rule(`.${prefix}-\\[var\\(--${size}\\)\\]`), new RegExp(`${property}:\\s*var\\(--${size}\\)\\s*;`));
    }
  }
  for (const stroke of ['3px', '4px', '6px']) {
    assert.ok(rule(`.\\[--eg-gauge-stroke\\:${stroke}\\]`).includes(`--eg-gauge-stroke: ${stroke};`));
  }
  assert.match(
    rule(String.raw`.\[--eg-gauge-stroke\:calc\(var\(--eg-gauge-size\)\/14\)\]`),
    /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)\s*;/
  );
  assert.match(
    rule(String.raw`.\[--eg-gauge-track\:--alpha\(var\(--color-fg-default\)\/10\%\)\]`),
    /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)\s*;/
  );
  assert.doesNotMatch(css, /--alpha\s*\(/);
  assert.match(
    rule(String.raw`.\[--eg-gauge-fill\:var\(--color-fg-brand-default\)\]`),
    /--eg-gauge-fill:\s*var\(--color-fg-brand-default\)\s*;/
  );
  for (const [state, token] of [
    ['warning', 'status-warning'],
    ['critical', 'status-danger'],
    ['muted', 'fg-muted']
  ]) {
    const body = rule(`.data-\\[state\\=${state}\\]\\:\\[--eg-gauge-fill\\:var\\(--color-${token}\\)\\]`);
    assert.match(body, new RegExp(`\\[data-state=["']?${state}["']?\\]\\s*\\{`));
    assert.ok(body.includes(`--eg-gauge-fill: var(--color-${token});`));
  }
});

test('UI ships the approved Skeleton silhouette utilities with the canonical v0.2 pulse', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, property, token] of [
    ['.h-3', 'height', 'space-3'],
    ['.h-4', 'height', 'space-4'],
    ['.h-5', 'height', 'space-5'],
    ['.h-12', 'height', 'space-12'],
    ['.h-20', 'height', 'space-20'],
    ['.h-24', 'height', 'space-24'],
    ['.size-8', 'width', 'space-8'],
    ['.size-12', 'width', 'space-12'],
    ['.size-16', 'width', 'space-16']
  ]) {
    const body = rule(selector);
    assert.match(body, new RegExp(`${property}:\\s*var\\(--${token}\\)\\s*;`));
    if (property === 'width') {
      assert.match(body, new RegExp(`height:\\s*var\\(--${token}\\)\\s*;`), `${selector} must size both axes`);
    }
  }
  for (const [selector, token, fallback] of [
    ['.rounded-sm', 'radius-sm', '4px'],
    ['.rounded-md', 'radius-md', '12px'],
    ['.rounded-full', 'radius-full', '9999px']
  ]) {
    assert.match(rule(selector), new RegExp(`border-radius:\\s*var\\(--${token},\\s*${fallback}\\)\\s*;`));
  }
  assert.match(rule('.w-full'), /width:\s*100%\s*;/);
  assert.match(
    rule('.bg-border-default'),
    /background-color:\s*var\(--color-border-default,\s*var\(--color-primitive-graphite-800\)\)\s*;/
  );
  assert.match(rule('.block'), /display:\s*block\s*;/);
  const utilityLayer = cssBlock(css, /@layer utilities\s*\{/);
  // The v0.2 delta binds the decorative pulse to the canonical --animate-pulse token.
  assert.match(rule('.animate-pulse'), /animation:\s*var\(--animate-pulse[,)]/);
  const reducedMotion = cssBlock(utilityLayer, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(
    cssBlock(reducedMotion, /\.motion-reduce\\:animate-none\s*\{/),
    /animation:\s*none\s*;/,
    'Reduced-motion preferences must stop the pulse'
  );
  // Pulse (Skeleton) and spin (Spinner, #69) are the only approved animation utilities.
  // Transitions are limited to none, Tooltip opacity (#75 D10), ProgressBar transform (#65 AC-09),
  // Input/Textarea border-color and box-shadow, Switch track background-color and border-color,
  // and Switch thumb translate and background-color; Slider adds only box-shadow (#68 D8).
  // Link adds only border-color/color and translate (#61); none reach the Skeleton.
  // Select #67 adds transition-colors only; Skeleton remains static in its own DOM checks.
  // Toggle #74 adds only its exact color/background-color/border-color/box-shadow/scale list.
  // Dropzone #56 adds transition-colors only.
  // Stat #70 reuses the approved [border-color,box-shadow] selector; no Skeleton transition.
  // SearchTrigger #99 reuses the approved transition-[border-color,color] selector only.
  // PullQuote #98 adds no transition or animation utility.
  assert.doesNotMatch(
    utilityLayer,
    /\.animate-(?!pulse\b|spin\b|none\b)\w/,
    'Only the approved pulse and spin animation utilities may ship'
  );
  assert.doesNotMatch(
    utilityLayer,
    unapprovedTransitionUtility,
    'Only the exact approved component transition utilities may ship'
  );
  assert.doesNotMatch(utilityLayer, /@keyframes/, 'The utilities layer must not define keyframes');
});

test('UI ships the Spinner icon-scale, stroke and canonical spin utilities with their keyframes', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, value] of [
    ['.size-4', 'var\\(--space-4\\)'],
    [String.raw`.size-\(--icon-size\)`, 'var\\(--icon-size\\)'],
    ['.size-7', 'var\\(--space-7\\)']
  ]) {
    const body = rule(selector);
    assert.match(body, new RegExp(`width:\\s*${value}\\s*;`), `${selector} width`);
    assert.match(body, new RegExp(`height:\\s*${value}\\s*;`), `${selector} height`);
  }
  assert.match(rule('.size-full'), /width:\s*100%\s*;/);
  assert.match(rule('.inline-flex'), /display:\s*inline-flex\s*;/);
  assert.match(rule('.fill-none'), /fill:\s*none\s*;/);
  assert.match(rule('.stroke-current'), /stroke:\s*currentcolor\s*;/i);
  assert.match(rule(String.raw`.stroke-\(length\:--icon-stroke\)`), /stroke-width:\s*var\(--icon-stroke\)\s*;/);
  // D3: one linear turn per second through the canonical token, with a native fallback.
  assert.match(rule('.animate-spin'), /animation:\s*var\(--animate-spin,\s*spin 1s linear infinite\)\s*;/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(cssBlock(reducedMotion, /\.motion-reduce\\:animate-none\s*\{/), /animation:\s*none\s*;/);
  // Keyframes ship outside the utilities layer so native consumers animate without Tailwind.
  assert.match(css, /@keyframes spin\s*\{\s*to\s*\{\s*transform:\s*rotate\(360deg\);\s*\}\s*\}/);
  assert.doesNotMatch(css, /\.eg-spinner[^{]*\{/, 'Spinner has no stylesheet: its marker carries no rule');
});

test('UI ships the Logo heights, token inks and link focus ring over the legacy marker', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Heights are --spacing multiples: 28/32px bound steps and the 9 × 4px calculated step.
  assert.match(rule('.h-7'), /height:\s*var\(--space-7\)\s*;/);
  assert.match(rule('.h-8'), /height:\s*var\(--space-8\)\s*;/);
  assert.match(rule('.h-9'), /height:\s*calc\(var\(--space-1\) \* 9\)\s*;/);
  assert.match(rule('.h-full'), /height:\s*100%\s*;/);
  assert.match(rule('.w-auto'), /width:\s*auto\s*;/);
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.leading-none'), /line-height:\s*1\s*;/);
  assert.match(rule('.rounded-sm'), /border-radius:\s*var\(--radius-sm[,)]/);
  // D3: the artwork is painted only by the logo tokens and the white primitive.
  assert.match(rule(String.raw`.fill-\(--logo-red\)`), /fill:\s*var\(--logo-red\)\s*;/);
  assert.match(rule(String.raw`.fill-\(--logo-red-shade\)`), /fill:\s*var\(--logo-red-shade\)\s*;/);
  assert.match(rule('.fill-primitive-white'), /fill:\s*var\(--color-primitive-white[,)]/);
  assert.match(rule(String.raw`.focus-visible\:outline-none:focus-visible`), /outline-style:\s*none\s*;/);
  assert.match(
    rule(String.raw`.focus-visible\:shadow-focus:focus-visible`),
    /--tw-shadow:\s*0 0 0 2px var\(--tw-shadow-color, #141518\), 0 0 0 4px var\(--tw-shadow-color, #FF0036\)\s*;/
  );
  // The legacy .eg-logo rule stays in the components layer, so the utilities above win.
  const components = cssBlock(css, /@layer components\s*\{/);
  assert.match(components, /\.eg-logo\s*\{[^}]*height:\s*32px/);
  assert.doesNotMatch(utilities, /\.eg-logo[^{]*\{/, 'Logo adds no marker rule of its own');
});

test('UI ships the StatusDot ring, glow and fill utilities with its motion-safe pulse keyframes', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // D4: 8px status dots and 10px signal dots on the spacing scale.
  assert.match(rule('.size-2'), /width:\s*var\(--space-2\)\s*;/);
  assert.match(rule(String.raw`.size-2\.5`), /width:\s*calc\(var\(--space-1\) \* 2\.5\)\s*;/);
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.rounded-full'), /border-radius:\s*var\(--radius-full[,)]/);
  // D5/D6: a 2px ring that always uses the surface token.
  assert.match(rule('.ring-2'), /--tw-ring-shadow:[^;]*calc\(2px \+ var\(--tw-ring-offset-width\)\)/);
  assert.match(rule('.ring-bg-surface'), /--tw-ring-color:\s*var\(--color-bg-surface[,)]/);
  assert.match(rule('.shadow-glow-hot'), /--tw-shadow:[^;]*rgba\(255, 0, 54, 0\.75\)/);
  for (const [utility, token] of [
    ['.bg-status-success', '--color-status-success'],
    ['.bg-status-info', '--color-status-info'],
    ['.bg-status-warning', '--color-status-warning'],
    ['.bg-status-danger', '--color-status-danger'],
    ['.bg-primitive-neutral-600', '--color-primitive-neutral-600'],
    ['.bg-fg-brand-default', '--color-fg-brand-default'],
    ['.bg-primitive-white', '--color-primitive-white']
  ]) {
    assert.match(rule(utility), new RegExp(`background-color:\\s*var\\(${token}[,)]`), utility);
  }
  // D7/AC-04/AC-05: the pulse only runs without a reduced-motion preference.
  const motionSafe = cssBlock(utilities, /@media \(prefers-reduced-motion: no-preference\)\s*\{/);
  assert.match(
    cssBlock(
      motionSafe,
      /\.motion-safe\\:animate-\\\[eg-status-dot-pulse_2\\\.4s_var\\\(--ease-out\\\)_infinite\\\]\s*\{/
    ),
    /animation:\s*eg-status-dot-pulse 2\.4s var\(--ease-out\) infinite\s*;/
  );
  // status-dot.css ships only top-level keyframes, never a selector for the marker.
  assert.match(
    css,
    /@keyframes eg-status-dot-pulse\s*\{\s*0%, 100%\s*\{\s*transform:\s*scale\(1\);\s*opacity:\s*100%;\s*\}\s*50%\s*\{\s*transform:\s*scale\(0\.72\);\s*opacity:\s*75%;\s*\}\s*\}/
  );
  assert.doesNotMatch(utilities, /@keyframes eg-status-dot-pulse/);
});

test('UI ships the flat Kbd token utilities without a Kbd-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.whitespace-nowrap'), /white-space:\s*nowrap\s*;/);
  assert.match(rule('.border'), /border-width:\s*1px\s*;/);
  assert.match(rule('.border-border-subtle'), /border-color:\s*var\(--color-border-subtle[,)]/);
  assert.match(rule(String.raw`.px-1\.5`), /padding-inline:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*1\.5\)\s*;/);
  assert.match(rule(String.raw`.py-0\.5`), /padding-block:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)\s*;/);
  // The hairline needs Tailwind's border-style initial value outside a Tailwind consumer.
  assert.match(css, /@property --tw-border-style\s*\{[^}]*initial-value:\s*solid/);
  // D6 no stylesheet: the only .eg-kbd rules are the retained legacy ones (components layer, below utilities).
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const kbdRules = (text) => (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-kbd[^{]*\{/g) ?? []).length;
  assert.equal(kbdRules(css), kbdRules(legacy), 'Kbd has no stylesheet: its marker carries no new rule');
});

test('UI ships the Countdown digit, spacing and label token utilities without a Countdown stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // #82 owner-approved recipes resolve through tokens, with the exact source values as fallbacks.
  for (const [size, clamp] of [
    ['md', String.raw`clamp\(52px, 6vw, 96px\)`],
    ['sm', String.raw`clamp\(36px, 4vw, 56px\)`]
  ]) {
    const body = rule(`.text-countdown-${size}`);
    assert.match(body, new RegExp(`font-size:\\s*var\\(--text-countdown-${size},\\s*${clamp}\\)\\s*;`));
    assert.match(body, new RegExp(`line-height:[^;]*--text-countdown-${size}--line-height,\\s*0\\.85`));
    assert.match(body, new RegExp(`font-weight:[^;]*--text-countdown-${size}--font-weight,\\s*800`));
  }
  assert.match(
    rule('.gap-x-countdown-column'),
    /column-gap:\s*var\(--spacing-countdown-column,\s*clamp\(14px, 2\.2vw, 32px\)\)\s*;/
  );
  assert.match(rule('.min-w-countdown-unit'), /min-width:\s*var\(--spacing-countdown-unit,\s*1\.9ch\)\s*;/);
  assert.match(rule('.gap-y-2'), /row-gap:\s*var\(--space-2\)\s*;/);
  assert.match(rule(String.raw`.mt-2\.5`), /margin-top:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)\s*;/);
  assert.match(rule('.mt-3'), /margin-top:\s*var\(--space-3\)\s*;/);
  assert.match(rule('.min-w-0'), /min-width:\s*var\(--space-0\)\s*;/);
  assert.match(rule('.flex-wrap'), /flex-wrap:\s*wrap\s*;/);
  assert.match(rule('.tabular-nums'), /font-variant-numeric:[^;]*--tw-numeric-spacing/);
  assert.match(rule('.not-italic'), /font-style:\s*normal\s*;/);
  assert.match(rule('.text-inherit'), /color:\s*inherit\s*;/);
  assert.match(rule('.text-label-eyebrow'), /font-size:\s*var\(--text-label-eyebrow,\s*14px\)/);
  assert.match(rule('.text-fg-secondary'), /color:\s*var\(--color-fg-secondary[,)]/);
  // D11 no stylesheet: the only .eg-countdown rules are the retained legacy ones (components layer).
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const countdownRules = (text) => (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-countdown[^{]*\{/g) ?? []).length;
  assert.equal(
    countdownRules(css),
    countdownRules(legacy),
    'Countdown has no stylesheet: its markers carry no new rule'
  );
  assert.doesNotMatch(utilities, /\.eg-countdown/, 'Countdown markers never become utilities');
});

test('UI ships every static Badge CVA utility and all twelve token treatments without a stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (utility) => {
    const selector = `.${utility.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)}`;
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/atoms/badge/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const classes = new Set();
  const collect = (node) => {
    if (node && ts.isStringLiteral(node)) {
      for (const value of node.text.split(/\s+/).filter(Boolean)) {
        classes.add(value);
      }
    }
  };
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      collect(node.arguments[0]);
    }
    if (ts.isPropertyAssignment(node) && ['className', 'soft', 'solid'].includes(node.name.getText(source))) {
      collect(node.initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.ok(classes.size > 30, 'Scan the real base, decorative part and compound variants');
  for (const utility of classes) {
    if (utility !== 'eg-badge') {
      rule(utility);
    }
  }
  for (const tone of ['fg-secondary', 'status-info', 'status-success', 'status-warning', 'status-danger']) {
    assert.ok(rule(`text-${tone}`).includes(`var(--color-${tone}`));
    assert.match(rule(`border-${tone}/30`), /30%/);
    assert.match(rule(`bg-${tone}/8`), /8%/);
    assert.ok(rule(`bg-${tone}`).includes(`var(--color-${tone}`));
  }
  for (const [utility, token] of [
    ['text-primitive-red-200', 'color-primitive-red-200'],
    ['border-alpha-red-22', 'color-alpha-red-22'],
    ['bg-alpha-red-12', 'color-alpha-red-12'],
    ['bg-action-primary-solid-bg', 'color-action-primary-solid-bg'],
    ['text-action-primary-solid-fg', 'color-action-primary-solid-fg'],
    ['text-fg-on-status', 'color-fg-on-status']
  ]) {
    assert.ok(rule(utility).includes(`var(--${token}`), utility);
  }
  for (const [utility, factor] of [
    ['size-3.5', '3.5'],
    ['gap-1.5', '1.5'],
    ['py-1.5', '1.5'],
    ['px-2.5', '2.5']
  ]) {
    assert.ok(rule(utility).includes(`calc(var(--space-1) * ${factor})`), utility);
  }
  // Tailwind expands named shadow tokens and inserts its optional color override.
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  const edge = /--shadow-edge:\s*([^;]+);/.exec(theme)?.[1];
  assert.ok(edge);
  assert.ok(
    rule('shadow-edge').includes(`--tw-shadow: ${edge.replace(/(rgba\([^)]+\))/, 'var(--tw-shadow-color, $1)')};`)
  );
  assert.match(rule('shadow-none'), /--tw-shadow:\s*0 0 #0000\s*;/);
  assert.doesNotMatch(css, /\.eg-badge\s*[,{]/, 'Badge has no stylesheet');
});

test('UI ships the RadioGroup row, radio and indicator utilities without a RadioGroup stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Layout by orientation and the 40px option row on the --spacing scale (D5, D7).
  assert.match(rule('.gap-1'), /gap:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.gap-x-6'), /column-gap:\s*var\(--space-6\)\s*;/);
  assert.match(rule('.gap-y-1'), /row-gap:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.min-h-10'), /min-height:\s*var\(--space-10\)\s*;/);
  assert.match(
    rule(String.raw`.has-\[\[data-state\=checked\]\]\:text-fg-default:has(:is([data-state=checked]))`),
    /color:\s*var\(--color-fg-default[,)]/
  );
  assert.match(
    rule(String.raw`.has-\[\[data-disabled\]\]\:opacity-45:has(:is([data-disabled]))`),
    /opacity:\s*45%\s*;/
  );
  // Radio circle: 20px border-box well, raised primary recipe when checked (D6).
  assert.match(rule('.size-5'), /width:\s*var\(--space-5\)\s*;\s*height:\s*var\(--space-5\)\s*;/);
  assert.match(rule('.place-items-center'), /place-items:\s*center\s*;/);
  assert.match(rule('.box-border'), /box-sizing:\s*border-box\s*;/);
  assert.match(rule('.border-border-control'), /border-color:\s*var\(--color-border-control[,)]/);
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)\s*;/);
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:border-action-primary-solid-bg[data-state="checked"]`),
    /border-color:\s*var\(--color-action-primary-solid-bg[,)]/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:bg-\[image\:var\(--gradient-btn-primary\)\][data-state="checked"]`),
    /background-image:\s*var\(--gradient-btn-primary\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:shadow-\[var\(--shadow-btn-primary\)\][data-state="checked"]`),
    /--tw-shadow:\s*var\(--shadow-btn-primary\)\s*;/
  );
  // Checked border wins over hover because the checked rule is emitted later at equal specificity.
  assert.ok(
    utilities.indexOf(String.raw`.hover\:border-fg-muted:hover`) <
      utilities.indexOf(String.raw`.data-\[state\=checked\]\:border-action-primary-solid-bg[data-state="checked"]`),
    'The checked border must follow the hover border'
  );
  // Focus ring wins over the checked halo through the higher-specificity checked+focus rule (AC-06).
  assert.match(
    rule(
      String.raw`.data-\[state\=checked\]\:focus-visible\:shadow-\[var\(--shadow-focus\)\][data-state="checked"]:focus-visible`
    ),
    /--tw-shadow:\s*var\(--shadow-focus\)\s*;/
  );
  assert.match(
    rule(String.raw`.transition-\[border-color\,box-shadow\]`),
    /transition-property:\s*border-color,\s*box-shadow\s*;/
  );
  assert.match(rule(String.raw`.disabled\:pointer-events-none:disabled`), /pointer-events:\s*none\s*;/);
  // Indicator: 8px black dot.
  assert.match(rule('.size-2'), /width:\s*var\(--space-2\)\s*;/);
  assert.match(rule('.bg-action-primary-solid-fg'), /background-color:\s*var\(--color-action-primary-solid-fg[,)]/);
  // D9 no stylesheet: the marker carries no rule.
  assert.doesNotMatch(css, /\.eg-radio-group[^{]*\{/, 'RadioGroup has no stylesheet: its marker carries no rule');
});

test('UI ships the Tooltip overlay recipe, fallbacks and fade as token utilities without a stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector, scope = utilities) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(scope, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.bg-surface-overlay'), /background-color:\s*var\(--color-surface-overlay[,)]/);
  assert.match(
    rule(String.raw`.backdrop-blur-\[var\(--blur-overlay\)\]`),
    /--tw-backdrop-blur:\s*blur\(var\(--blur-overlay\)\)/
  );
  assert.match(rule('.backdrop-saturate-150'), /--tw-backdrop-saturate:\s*saturate\(150%\)/);
  assert.match(rule('.border-border-hairline-strong'), /border-color:\s*var\(--color-border-hairline-strong[,)]/);
  assert.match(
    rule(String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`),
    /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)/
  );
  assert.match(rule('.rounded-sm'), /border-radius:\s*var\(--radius-sm[,)]/);
  // D9: --space-1 x --space-2 through the token spacing scale.
  assert.match(rule('.px-2'), /padding-inline:\s*var\(--space-2\)\s*;/);
  assert.match(rule('.py-1'), /padding-block:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.text-fg-default'), /color:\s*var\(--color-fg-default[,)]/);
  assert.match(
    rule(String.raw`.max-w-\[var\(--radix-tooltip-content-available-width\)\]`),
    /max-width:\s*var\(--radix-tooltip-content-available-width\)/
  );
  assert.match(rule('.transition-opacity'), /transition-property:\s*opacity/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-fast\)\]`), /transition-duration:\s*var\(--duration-fast\)/);
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)/);
  // D10: the enter fade starts from transparent through @starting-style; reduced motion drops the transition.
  assert.match(
    rule(String.raw`.starting\:opacity-0`, cssBlock(utilities, /@starting-style\s*\{/)),
    /opacity:\s*0%?\s*;/
  );
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(rule(String.raw`.motion-reduce\:transition-none`, reducedMotion), /transition-property:\s*none/);
  // D8: solid surface-2 without blur or saturation under reduced transparency.
  const reduced = [...utilities.matchAll(/@media \(prefers-reduced-transparency:\s*reduce\)\s*\{/g)]
    .map((match) => cssBlock(utilities.slice(match.index), /@media[^{]*\{/))
    .join('\n');
  const fallback = (name) => rule(String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:` + name, reduced);
  assert.match(fallback('bg-surface-2'), /background-color:\s*var\(--color-surface-2[,)]/);
  assert.match(fallback('backdrop-blur-none'), /--tw-backdrop-blur:\s*;/);
  assert.match(fallback('backdrop-saturate-100'), /--tw-backdrop-saturate:\s*saturate\(100%\)/);
  // D12/D14: no z-index, no transform and no stylesheet rule for the public marker.
  assert.doesNotMatch(css, /\.eg-tooltip[^{]*\{/, 'Tooltip has no stylesheet: its marker carries no rule');
});

test('UI ships the Switch track, thumb and state utilities without a Switch stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Track geometry: 36×20 border-box pill on the --spacing scale (AC-05).
  assert.match(rule('.w-9'), /width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)\s*;/);
  assert.match(rule('.h-5'), /height:\s*var\(--space-5\)\s*;/);
  assert.match(rule('.box-border'), /box-sizing:\s*border-box\s*;/);
  assert.match(rule('.border-border-control'), /border-color:\s*var\(--color-border-control[,)]/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)\s*;/);
  // Checked: primary gradient, bevel/halo token and the black thumb moved 16px (D4).
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:bg-\[image\:var\(--gradient-btn-primary\)\][data-state="checked"]`),
    /background-image:\s*var\(--gradient-btn-primary\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:shadow-\[var\(--shadow-btn-primary\)\][data-state="checked"]`),
    /--tw-shadow:\s*var\(--shadow-btn-primary\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:translate-x-4[data-state="checked"]`),
    /--tw-translate-x:\s*var\(--(?:space-4|spacing-4)\)\s*;\s*translate:/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:bg-action-primary-solid-fg[data-state="checked"]`),
    /background-color:\s*var\(--color-action-primary-solid-fg[,)]/
  );
  assert.match(rule(String.raw`.size-3\.5`), /width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*3\.5\)\s*;/);
  // Thumb travel animates the translate property; reduced motion removes every transition (D6).
  assert.match(
    rule(String.raw`.transition-\[translate\,background-color\]`),
    /transition-property:\s*translate,\s*background-color\s*;/
  );
  assert.match(css, /@property --tw-translate-y\s*\{[^}]*initial-value:\s*0/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(reducedMotion, /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/);
  // Focus ring wins over the checked halo through the higher-specificity checked+focus rule (AC-06).
  assert.match(
    rule(
      String.raw`.data-\[state\=checked\]\:focus-visible\:shadow-\[var\(--shadow-focus\)\][data-state="checked"]:focus-visible`
    ),
    /--tw-shadow:\s*var\(--shadow-focus\)\s*;/
  );
  assert.match(rule(String.raw`.disabled\:opacity-45:disabled`), /opacity:\s*45%\s*;/);
  // D11 no stylesheet: the marker carries no rule; legacy .eg-check--switch stays untouched.
  assert.doesNotMatch(css, /\.eg-switch[^{]*\{/, 'Switch has no stylesheet: its marker carries no rule');
  assert.match(css, /\.eg-check--switch input\s*\{/, 'Legacy switch styles remain until an approved migration');
});

test('UI ships the ProgressBar track, fill geometry and motion utilities without a ProgressBar stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Tracks: sm hairline, lg Material well (D5) and the sm-only edge strip.
  assert.match(rule(String.raw`.h-0\.5`), /height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)\s*;/);
  assert.match(rule(String.raw`.h-2\.5`), /height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*2\.5\)\s*;/);
  assert.match(rule(String.raw`.rounded-\[var\(--radius-sm\)\]`), /border-radius:\s*var\(--radius-sm\)\s*;/);
  assert.match(rule('.bg-border-subtle'), /background-color:\s*var\(--color-border-subtle[,)]/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.shadow-well'), /--tw-shadow:\s*inset 0 1px 2px/);
  assert.match(rule('.bg-bg-glass'), /background-color:\s*var\(--color-bg-glass[,)]/);
  assert.match(rule('.inset-x-0'), /inset-inline:/);
  // Fills: brand, gradient with the token bevel instead of the source halo (D6) and the muted series.
  assert.match(rule('.bg-fg-brand-default'), /background-color:\s*var\(--color-fg-brand-default[,)]/);
  assert.match(rule('.bg-fg-muted'), /background-color:\s*var\(--color-fg-muted[,)]/);
  assert.match(
    rule(String.raw`.bg-\[image\:var\(--gradient-progress\)\]`),
    /background-image:\s*var\(--gradient-progress\)\s*;/
  );
  assert.match(rule('.shadow-edge-strong'), /--tw-shadow:\s*inset 0 1px 0/);
  assert.match(rule(String.raw`.rounded-\[inherit\]`), /border-radius:\s*inherit\s*;/);
  // D8 geometry: a static scale utility reading the numeric custom property, left origin and token motion.
  assert.match(
    rule(String.raw`.scale-x-\[var\(--eg-progress-value\)\]`),
    /--tw-scale-x:\s*var\(--eg-progress-value\)\s*;[^}]*scale:\s*var\(--tw-scale-x\)\s+var\(--tw-scale-y\)/
  );
  assert.match(css, /@property --tw-scale-y\s*\{[^}]*initial-value:\s*1/);
  assert.match(rule('.origin-left'), /transform-origin:/);
  assert.match(rule('.transition-transform'), /transition-property:[^;]*\bscale\b/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-base\)\]`), /transition-duration:\s*var\(--duration-base\)/);
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(reducedMotion, /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/);
  // D10 no stylesheet: the fill marker carries no rule and .eg-progress keeps only its legacy rules.
  assert.doesNotMatch(css, /\.eg-progress-fill[^{]*\{/);
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const progressRules = (text) =>
    (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-progress(?![\w-])[^{]*\{/g) ?? []).length;
  assert.equal(progressRules(css), progressRules(legacy), 'ProgressBar has no stylesheet: no new eg-progress rule');
});

test('UI ships the Textarea well, sheet and state utilities without a Textarea-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.min-h-30'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*30\)\s*;/);
  assert.match(rule('.min-h-70'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*70\)\s*;/);
  assert.match(rule('.resize-y'), /resize:\s*vertical\s*;/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-primitive-neutral-950'), /background-color:\s*var\(--color-primitive-neutral-950[,)]/);
  assert.match(
    rule(String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`),
    /background-image:\s*var\(--gradient-sheen\)\s*;/
  );
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)\s*;/);
  assert.match(rule('.text-code'), /font-size:\s*var\(--text-code[,)]/);
  assert.match(rule('.ease-out'), /transition-timing-function:\s*var\(--ease-out[,)]/);
  assert.match(
    rule(String.raw`.duration-\[var\(--duration-fast\)\]`),
    /transition-duration:\s*var\(--duration-fast\)\s*;/
  );
  assert.match(rule(String.raw`.disabled\:opacity-45:disabled`), /opacity:\s*45%\s*;/);
  assert.match(
    cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{(?=[^@]*\.motion-reduce\\:transition-none)/),
    /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/
  );
  // Invalid wins over the hover, read-only hover and focus border because it is emitted later (D7).
  const at = (selector) => {
    const index = utilities.indexOf(selector);
    assert.ok(index >= 0, `Missing Textarea utility ${selector}`);
    return index;
  };
  const invalid = at(String.raw`.aria-invalid\:border-status-danger[aria-invalid="true"]`);
  const invalidHover = at(String.raw`.aria-invalid\:hover\:border-status-danger[aria-invalid="true"]:hover`);
  const invalidFocus = at(
    String.raw`.aria-invalid\:focus-visible\:border-status-danger[aria-invalid="true"]:focus-visible`
  );
  const readOnlyHover = at(String.raw`.read-only\:hover\:border-border-control:read-only:hover`);
  for (const earlier of [
    at(String.raw`.hover\:border-fg-muted:hover`),
    at(String.raw`.focus-visible\:border-border-brand-strong:focus-visible`)
  ]) {
    assert.ok(earlier < invalid, 'Invalid border must follow hover and focus borders');
  }
  assert.ok(readOnlyHover < invalidHover, 'Invalid hover must follow the read-only hover reset');
  assert.ok(invalid < invalidFocus, 'Focused invalid keeps the danger border');
  // D11 no stylesheet: the marker carries no rule of its own.
  assert.doesNotMatch(css, /\.eg-textarea[^{]*\{/, 'Textarea has no stylesheet: its marker carries no rule');
});

test('UI ships the Input well, state and preset utilities without an Input-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-primitive-neutral-950'), /background-color:\s*var\(--color-primitive-neutral-950[,)]/);
  assert.match(rule('.border-border-control'), /border-color:\s*var\(--color-border-control[,)]/);
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)/);
  assert.match(rule('.min-h-11'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*11\)/);
  assert.match(rule('.min-h-9'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/);
  assert.match(rule('.pl-9'), /padding-left:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/);
  assert.match(rule('.text-code'), /font-size:\s*var\(--text-code[,)]/);
  assert.match(rule('.font-mono'), /font-family:\s*var\(--font-mono[,)]/);
  assert.match(rule(String.raw`.hover\:border-fg-muted:hover`), /border-color:\s*var\(--color-fg-muted[,)]/);
  assert.match(
    rule(String.raw`.focus-visible\:border-border-brand-strong:focus-visible`),
    /border-color:\s*var\(--color-border-brand-strong[,)]/
  );
  assert.match(
    rule(String.raw`.focus-visible\:shadow-\[var\(--shadow-well\)\,var\(--shadow-ring-brand\)\]:focus-visible`),
    /--tw-shadow:\s*var\(--shadow-well\),\s*var\(--shadow-ring-brand\)/
  );
  assert.match(
    rule(String.raw`.aria-invalid\:border-status-danger[aria-invalid="true"]`),
    /border-color:\s*var\(--color-status-danger[,)]/
  );
  assert.match(rule(String.raw`.has-\[\:disabled\]\:opacity-45:has(:is(:disabled))`), /opacity:\s*45%/);
  assert.match(rule('.ease-out'), /transition-timing-function:\s*var\(--ease-out[,)]/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-fast\)\]`), /transition-duration:\s*var\(--duration-fast\)/);
  // Invalid wins over hover and focus at equal specificity because its rule is emitted later.
  const at = (selector) => utilities.indexOf(selector);
  assert.ok(at(String.raw`.aria-invalid\:border-status-danger`) > at(String.raw`.hover\:border-fg-muted`));
  assert.ok(
    at(String.raw`.aria-invalid\:border-status-danger`) > at(String.raw`.focus-visible\:border-border-brand-strong`)
  );
  // The icon offset must follow the symmetric padding so padding-left survives the cascade.
  assert.ok(at('.pl-9 {') > at('.px-3 {'));
  assert.ok(at('.pr-9 {') > at('.px-3 {'));
  assert.match(rule('.pr-9'), /padding-right:\s*calc\(var\(--space-1\)\s*\*\s*9\)/);
  assert.match(rule('.right-3'), /right:\s*var\(--space-3\)/);
  assert.doesNotMatch(css, /\.eg-input[^{]*\{/, 'Input has no stylesheet: its marker carries no rule (D14)');
});

test('UI ships the approved Gauge geometry in the components layer', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const components = cssBlock(css, /@layer components\s*\{/);
  const arc = cssBlock(components, /\.eg-gauge-arc\s*\{/);
  const center = cssBlock(components, /\.eg-gauge-center\s*\{/);
  assert.match(
    arc,
    /background:\s*conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\), var\(--eg-gauge-track\) 0\)\s*;/
  );
  assert.match(arc, /mask:\s*radial-gradient\(/);
  assert.match(center, /inset:\s*30%\s*;/);
});

test('UI ships the approved Label typography recipe without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Base recipe: token typography, foreground color and sans family.
  const base = rule('.text-label-default');
  assert.match(base, /font-size:\s*var\(--text-label-default(?:,\s*14px)?\)\s*;/);
  assert.match(
    base,
    /font-weight:\s*var\(--tw-font-weight,\s*var\(--text-label-default--font-weight(?:,\s*600)?\)\)\s*;/
  );
  assert.match(base, /line-height:\s*var\(--tw-leading,\s*var\(--text-label-default--line-height(?:,\s*1\.2)?\)\)\s*;/);
  assert.match(
    rule('.text-fg-secondary'),
    /color:\s*var\(--color-fg-secondary(?:,\s*var\(--color-primitive-[a-z0-9-]+\))?\)\s*;/
  );
  assert.match(rule('.font-sans'), /font-family:\s*var\(--font-sans/);
  // Choice treatment emits the approved token-backed weight, not a numeric value.
  const choice = rule(String.raw`.font-\[var\(--text-body-default--font-weight\)\]`);
  assert.match(choice, /font-weight:\s*var\(--text-body-default--font-weight\)\s*;/);
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const token of ['--text-label-default--font-weight', '--text-body-default--font-weight']) {
    assert.ok(theme.includes(`${token}:`), `Choice/base weights must reference the existing token ${token}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
});

test('UI ships the static Icon preset, fill and stroke utilities without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declarations] of [
    ['.inline-block', [/display:\s*inline-block\s*;/]],
    ['.shrink-0', [/flex-shrink:\s*0\s*;/]],
    ['.align-middle', [/vertical-align:\s*middle\s*;/]],
    ['.stroke-current', [/stroke:\s*currentcolor\s*;/i]],
    [String.raw`.stroke-\(length\:--icon-stroke\)`, [/stroke-width:\s*var\(--icon-stroke\)\s*;/]],
    ['.fill-none', [/fill:\s*none\s*;/]],
    ['.fill-current', [/fill:\s*currentcolor\s*;/i]],
    ['.size-4', [/width:\s*var\(--space-4\)\s*;/, /height:\s*var\(--space-4\)\s*;/]],
    [String.raw`.size-\(--icon-size\)`, [/width:\s*var\(--icon-size\)\s*;/, /height:\s*var\(--icon-size\)\s*;/]],
    ['.size-7', [/width:\s*var\(--space-7\)\s*;/, /height:\s*var\(--space-7\)\s*;/]]
  ]) {
    const body = rule(selector);
    for (const declaration of declarations) {
      assert.match(body, declaration, `${selector} must ship ${declaration}`);
    }
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const [token, value] of [
    ['--icon-size', '20px'],
    ['--icon-stroke', '1.75'],
    ['--space-4', '16px'],
    ['--space-7', '28px']
  ]) {
    assert.match(theme, new RegExp(`${token}:\\s*${value.replace('.', '\\.')};`), `${token} must stay ${value}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
});

test('UI ships Link token recipes, scoped motion and legacy resets without a new stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.border-0', /border-width:\s*0(?:px)?\s*;/],
    ['.text-fg-brand-raised', /color:\s*var\(--color-fg-brand-raised[,)]/],
    ['.pb-0', /padding-bottom:\s*var\(--space-0\)/],
    ['.no-underline', /text-decoration-line:\s*none/],
    ['.cursor-pointer', /cursor:\s*pointer/],
    ['.transform-none', /transform:\s*none/],
    ['.transition-colors', /transition-property:[^;]*color/],
    [String.raw`.transition-\[translate\]`, /transition-property:\s*translate/],
    [String.raw`.duration-\(--duration-fast\)`, /(?:--tw-duration|transition-duration):\s*var\(--duration-fast\)/],
    [String.raw`.ease-\(--ease-out\)`, /transition-timing-function:\s*var\(--ease-out\)/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  for (const selector of [
    String.raw`.hover\:text-primitive-red-200`,
    String.raw`.motion-safe\:group-hover\/link\:translate-x-1`,
    String.raw`.motion-reduce\:translate-none`,
    String.raw`.motion-reduce\:transition-none`,
    String.raw`.focus-visible\:outline-none`,
    String.raw`.focus-visible\:\[box-shadow\:var\(--shadow-focus\)\]`,
    String.raw`.focus-visible\:rounded-sm`
  ]) {
    assert.ok(utilities.includes(selector), `Missing Link utility ${selector}`);
  }
  assert.match(utilities, /@media \(prefers-reduced-motion:\s*no-preference\)/);
  assert.match(rule(String.raw`.motion-reduce\:translate-none`), /translate:\s*none/);
  assert.match(rule(String.raw`.motion-reduce\:transition-none`), /transition-property:\s*none/);
  assert.match(
    rule(String.raw`.focus-visible\:\[box-shadow\:var\(--shadow-focus\)\]:focus-visible`),
    /box-shadow:\s*var\(--shadow-focus\)/
  );
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const markerRules = (text) => (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-link[^{]*\{/g) ?? []).length;
  assert.equal(markerRules(css), markerRules(legacy), 'Link adds no marker stylesheet rules');
});

test('UI Link exports safe native and slotted navigation with decorative small Icons', async () => {
  const { Link } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  assert.equal(Link?.$$typeof, Symbol.for('react.forward_ref'));
  const html = renderToString(createElement(Link, { href: '#docs', external: true, rel: 'author' }, 'Docs'));
  for (const text of [
    'eg-link',
    'text-label-default',
    'size-4',
    'aria-hidden="true"',
    'target="_blank"',
    'author noopener noreferrer',
    '(opens in a new tab)'
  ]) {
    assert.ok(html.includes(text), `Link SSR must render ${text}`);
  }
  const slotted = renderToString(
    createElement(Link, { asChild: true, arrow: false, children: createElement('a', { href: '#router' }, 'Router') })
  );
  assert.match(slotted, /^<a [^>]*href="#router"/);
  assert.doesNotMatch(slotted, /<svg|asChild=|external=|arrow=/);
});

test('UI ships exactly the approved Avatar utility recipe without new marker rules', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.inline-grid', /display:\s*inline-grid\s*;/],
    ['.bg-linear-135', /--tw-gradient-position:\s*135deg/],
    ['.from-bg-deep', /--tw-gradient-from:\s*var\(--color-bg-deep[,)]/],
    ['.to-primitive-red-neon', /--tw-gradient-to:\s*var\(--color-primitive-red-neon[,)]/],
    ['.object-cover', /object-fit:\s*cover\s*;/],
    [
      String.raw`.ring-\[var\(--eg-avatar-ring\,var\(--color-bg-surface\)\)\]`,
      /--tw-ring-color:\s*var\(--eg-avatar-ring,\s*var\(--color-bg-surface\)\)/
    ]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  for (const size of ['2.75', '3.25', '4.5', '5.5', '7.5']) {
    const body = rule('.size-' + size.replace('.', '\\.'));
    for (const property of ['width', 'height']) {
      assert.match(body, new RegExp(`${property}:\\s*calc\\(var\\(--space-1\\) \\* ${size.replace('.', '\\.')}\\)`));
    }
  }
  assert.match(utilities, /opacity-60\[data-state="paused"\]\s*\{\s*opacity:\s*60%/);
  assert.match(utilities, /grayscale\[data-state="paused"\]\s*\{\s*--tw-grayscale:\s*grayscale\(100%\)/);
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const markers = (text) => (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-avatar[^{}]*\{/g) ?? []).length;
  assert.equal(markers(css), markers(legacy), 'No stylesheet: legacy Avatar rules stay unchanged');
  const { Avatar } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(
    createElement(Avatar, { label: 'Channel on LinkedIn, paused', badgeIcon: 'linkedin', paused: true })
  );
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="Channel on LinkedIn, paused"/);
  assert.match(html, /data-state="paused"/);
  assert.match(html, /eg-avatar__badge/);
  assert.equal((html.match(/aria-label=/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<img|tabindex=|style=|is-paused/);
});

test('UI preserves Lucide notices for the system icon paths', () => {
  const notices = readFileSync(resolve(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');
  for (const source of ['packages/ui/src/atoms/icon/icon-paths.ts', 'packages/ui/src/atoms/spinner/Spinner.tsx']) {
    assert.ok(notices.includes(source), `Lucide attribution must cover ${source}`);
  }
  assert.match(notices, /loader-circle/, 'Spinner uses the Lucide loader-circle path');
  assert.match(notices, /ISC License/);
  assert.match(notices, /Copyright \(c\) 2026 Lucide Icons and Contributors/);
  assert.match(notices, /Copyright \(c\) 2013-present Cole Bemis/);
});

test('UI Icon renders decorative and labelled svg glyphs on the server', async () => {
  const { Icon } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const decorative = renderToString(createElement(Icon, { name: 'plus', id: 'add-icon' }));
  assert.match(decorative, /^<svg /, 'Decorative Icon must render the bare svg');
  for (const text of [
    'id="add-icon"',
    'viewBox="0 0 24 24"',
    'aria-hidden="true"',
    'focusable="false"',
    'stroke-linecap="round"',
    'stroke-linejoin="round"',
    '<path d="M5 12h14"></path><path d="M12 5v14"></path>'
  ]) {
    assert.ok(decorative.includes(text), `Decorative Icon SSR must render ${text}`);
  }
  const classes = new Set((decorative.match(/\bclass="([^"]+)"/)?.[1] ?? '').split(/\s+/));
  for (const marker of [
    'eg-icon',
    'size-(--icon-size)',
    'fill-none',
    'stroke-current',
    'stroke-(length:--icon-stroke)'
  ]) {
    assert.ok(classes.has(marker), `Decorative Icon must keep ${marker}`);
  }
  assert.ok(!classes.has('fill-current'), 'Default Icon must remain stroke-only');
  assert.doesNotMatch(decorative, /role=|aria-label|<title|tabindex=|width=|height=|style=/);
  const labelled = renderToString(createElement(Icon, { name: 'search', label: 'Search', size: 'sm', filled: true }));
  assert.match(labelled, /^<svg [^>]*aria-hidden="true"[^>]*>.*<\/svg><span [^>]*>Search<\/span>$/);
  assert.ok(labelled.includes('size-4') && labelled.includes('fill-current'), 'Labelled Icon keeps its presets');
  assert.match(
    labelled,
    /<span [^>]*style="[^"]*position:absolute/,
    'Radix AccessibleIcon must hide the label visually'
  );
  assert.doesNotMatch(labelled, /role=|<title|label="/);
  assert.doesNotMatch(renderToString(createElement(Icon, { name: 'search', label: '' })), /<span/);
});

test('UI ships the Surface Material recipes as static token utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (scope, selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(scope, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.bg-surface-0', /background-color:\s*var\(--color-surface-0[,)]/],
    ['.bg-surface-3', /background-color:\s*var\(--color-surface-3[,)]/],
    ['.bg-surface-overlay', /background-color:\s*var\(--color-surface-overlay[,)]/],
    [String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`, /background-image:\s*var\(--gradient-sheen\)\s*;/],
    ['.border-border-hairline', /border-color:\s*var\(--color-border-hairline[,)]/],
    ['.border-border-hairline-strong', /border-color:\s*var\(--color-border-hairline-strong[,)]/],
    ['.border-solid', /border-style:\s*solid\s*;/],
    ['.box-border', /box-sizing:\s*border-box\s*;/],
    [String.raw`.shadow-\[var\(--shadow-well\)\]`, /--tw-shadow:\s*var\(--shadow-well\)\s*;/],
    [
      String.raw`.shadow-\[var\(--shadow-edge\)\,var\(--shadow-elev-1\)\]`,
      /--tw-shadow:\s*var\(--shadow-edge\),\s*var\(--shadow-elev-1\)\s*;/
    ],
    [
      String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`,
      /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)\s*;/
    ],
    ['.backdrop-blur-overlay', /--tw-backdrop-blur:\s*blur\(var\(--blur-overlay[,)]/],
    ['.rounded-xl', /border-radius:\s*var\(--radius-xl[,)]/],
    ['.p-6', /padding:\s*var\(--space-6\)\s*;/]
  ]) {
    assert.match(rule(utilities, selector), declaration, `Surface recipe ${selector}`);
  }
  const reduced = cssBlock(utilities, /@media \(prefers-reduced-transparency:\s*reduce\)\s*\{(?=\s*\.\\\[\\@media)/);
  assert.match(
    rule(reduced, String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:bg-surface-2`),
    /background-color:\s*var\(--color-surface-2[,)]/
  );
  assert.match(
    rule(reduced, String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:backdrop-filter-none`),
    /backdrop-filter:\s*none\s*;/
  );
  const unsupported = cssBlock(utilities, /@supports not \(backdrop-filter:[^{]+\{(?=\s*\.not-supports-)/);
  assert.match(
    rule(unsupported, String.raw`.not-supports-\[backdrop-filter\]\:bg-surface-2`),
    /background-color:\s*var\(--color-surface-2[,)]/
  );
  assert.doesNotMatch(css, /\.eg-surface\s*[,{]/, 'Surface marker must not become a shipped CSS rule (no stylesheet)');
});

test('UI ships the approved Text and Heading title recipes without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // The four fluid title recipes resolve to their token size, leading and weight.
  for (const size of ['section', 'hero', 'show', 'display']) {
    const recipe = rule(`.text-title-${size}`);
    assert.match(recipe, new RegExp(`font-size:\\s*var\\(--text-title-${size}(?:,[^;]+)?\\)\\s*;`));
    assert.match(recipe, new RegExp(`line-height:\\s*var\\(--tw-leading,\\s*var\\(--text-title-${size}--line-height`));
    assert.match(
      recipe,
      new RegExp(`font-weight:\\s*var\\(--tw-font-weight,\\s*var\\(--text-title-${size}--font-weight`)
    );
  }
  // Hero canvas glow uses the glyph text-shadow token; other accents reset it.
  assert.match(
    rule(String.raw`.\[text-shadow\:var\(--text-shadow-title-hero\)\]`),
    /text-shadow:\s*var\(--text-shadow-title-hero\)\s*;/
  );
  assert.match(rule(String.raw`.\[text-shadow\:none\]`), /text-shadow:\s*none\s*;/);
  for (const [selector, token] of [
    ['.text-fg-brand-default', '--color-fg-brand-default'],
    ['.text-fg-brand-raised', '--color-fg-brand-raised'],
    ['.text-fg-on-flood', '--color-fg-on-flood']
  ]) {
    assert.match(rule(selector), new RegExp(`color:\\s*var\\(${token}`));
  }
  assert.match(rule('.text-label-eyebrow'), /font-size:\s*var\(--text-label-eyebrow/);
  assert.match(rule('.font-display'), /font-family:\s*var\(--font-display/);
  assert.match(rule('.uppercase'), /text-transform:\s*uppercase\s*;/);
  // The eyebrow diamond is an empty decorative pseudo-element, emitted from static CVA utilities.
  for (const selector of [
    String.raw`.before\:rotate-45`,
    String.raw`.before\:size-2`,
    String.raw`.before\:bg-fg-brand-default`
  ]) {
    assert.ok(utilities.includes(selector), `Packed styles must retain eyebrow diamond utility ${selector}`);
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const token of ['--text-title-hero', '--text-shadow-title-hero']) {
    assert.ok(theme.includes(`${token}:`), `Title recipes must reference the existing token ${token}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
  assert.doesNotMatch(css, /\.eg-(?:text|heading)\s*[,{]/, 'Text/Heading markers must not become shipped CSS rules');
});

test('UI ships every static IconButton CVA utility, native resets and scoped state recipes', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const source = readFileSync(resolve(root, 'packages/ui/src/atoms/icon-button/types.ts'), 'utf8');
  const file = ts.createSourceFile('types.ts', source, ts.ScriptTarget.Latest, true);
  const classes = new Set();
  const add = (text) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => classes.add(token));
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(file) === 'cva') {
      const [base, config] = node.arguments;
      assert.ok(ts.isStringLiteral(base));
      add(base.text);
      const variants = config.properties.find((property) => property.name?.getText(file) === 'variants');
      for (const axis of variants.initializer.properties) {
        for (const value of axis.initializer.properties) {
          assert.ok(ts.isStringLiteral(value.initializer));
          add(value.initializer.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  assert.ok(classes.size > 50, 'Scan both root and icon recipes, not a hand-maintained subset');
  for (const token of classes) {
    if (token === 'eg-icon-btn' || token === 'group/icon-button') {
      continue;
    }
    const escaped = '.' + token.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
    assert.ok(utilities.includes(escaped), `Missing IconButton utility ${token}`);
  }
  for (const token of [
    '--gradient-btn-primary-hover',
    '--gradient-btn-secondary-hover',
    '--color-alpha-red-65',
    '--duration-press',
    '--ease-spring'
  ]) {
    assert.ok(utilities.includes(`var(${token}`), `IconButton must consume ${token}`);
  }
  assert.match(utilities, /box-sizing:\s*border-box/);
  assert.match(utilities, /border-style:\s*solid/);
  for (const axis of ['x', 'y']) {
    assert.ok(new RegExp(`--tw-scale-${axis}:\\s*94%`).test(utilities), `Pressed ${axis} scale must be .94`);
  }
  assert.ok(/scale:\s*var\(--tw-scale-x\) var\(--tw-scale-y\)/.test(utilities));
  assert.match(utilities, /prefers-reduced-motion:\s*no-preference/);
  assert.match(utilities, /prefers-reduced-motion:\s*reduce/);
  assert.match(utilities, /transition:\s*color var\(--duration-fast\) var\(--ease-out\)/);
  assert.match(utilities, /translate:\s*var\(--tw-translate-x\)/, 'Tailwind v4 lift uses translate, not transform');
  assert.doesNotMatch(utilities, /\.eg-icon-btn[^a-z-]/, 'No new marker recipe or stylesheet');
  const { IconButton, Icon } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(
    createElement(IconButton, { label: 'Search', icon: createElement(Icon, { name: 'search' }) })
  );
  assert.match(html, /^<button [^>]*type="button"/);
  assert.match(html, /eg-icon-btn/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /<span style="[^"]*position:absolute[^>]*>Search<\/span>/);
  assert.doesNotMatch(html, /aria-label=|aria-pressed=|data-state=|eg-icon-btn--/);
});

test('UI JavaScript remains importable without a CSS loader', async () => {
  const entry = artifact('ui', ui.exports['.'].import);
  const imports = ts.preProcessFile(readFileSync(entry, 'utf8'), true).importedFiles;
  assert.ok(!imports.some(({ fileName }) => fileName.endsWith('.css')), 'Styles must remain an explicit import');
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { Gauge, VisuallyHidden } = await import(entry);
  assert.match(renderToString(createElement(Gauge, { label: 'CSS consumer', value: 42 })), /role="meter"/);
  const hidden = renderToString(createElement(VisuallyHidden, null, 'Hidden note'));
  assert.match(hidden, /<span class="eg-visually-hidden"[^>]*clip:rect\(0, 0, 0, 0\)[^>]*>Hidden note<\/span>/);
});

test('Button emits every static CVA utility and its approved native resets and motion tokens', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/atoms/button/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const classes = new Set();
  function collect(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'defaultVariants') {
      return;
    }
    if (ts.isStringLiteral(node)) {
      for (const name of node.text.split(/\s+/)) {
        classes.add(name);
      }
    } else {
      ts.forEachChild(node, collect);
    }
  }
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      for (const argument of node.arguments) {
        collect(argument);
      }
    } else {
      ts.forEachChild(node, visit);
    }
  }
  visit(source);
  for (const name of classes) {
    if (['eg-btn', 'eg-btn__icon', 'group/button'].includes(name)) {
      continue;
    }
    const selector = '.' + name.replace(/[^\w-]/g, '\\$&');
    assert.ok(css.includes(selector), `Missing Button utility ${name}`);
  }
  assert.ok(classes.size > 75, 'Scan the full root and icon-slot CVA recipes');
  for (const token of [
    '--gradient-btn-primary',
    '--gradient-btn-primary-hover',
    '--gradient-btn-secondary',
    '--gradient-btn-secondary-hover',
    '--shadow-btn-primary',
    '--shadow-btn-primary-hover',
    '--shadow-btn-pressed',
    '--shadow-focus',
    '--duration-press',
    '--ease-snappy'
  ]) {
    assert.ok(css.includes(`var(${token})`), token);
  }
  assert.match(css, /--tw-translate-y:\s*1px\s*;/);
  assert.match(css, /translate:\s*var\(--tw-translate-x\) var\(--tw-translate-y\)/);
  assert.match(css, /--tw-scale-x:\s*97%\s*;/);
  assert.match(css, /scale:\s*var\(--tw-scale-x\) var\(--tw-scale-y\)/);
  assert.match(css, /box-sizing:\s*border-box/);
  assert.match(css, /border-style:\s*solid/);
  assert.match(css, /font-weight:\s*var\(--text-cta-label--font-weight/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('ModuleCard ships named article SSR and keeps its composition recipes private', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const html = renderToStaticMarkup(
    createElement(exported.ModuleCard, {
      title: 'Capability',
      status: 'error',
      variant: 'banded',
      tone: 'overlay',
      actions: createElement(exported.Button, null, 'Retry'),
      footer: 'Updated today',
      children: 'Check the connection.',
      className: 'col-span-full'
    })
  );
  const heading = /<h2[^>]*id="([^"]+)"/.exec(html);
  assert.ok(heading, 'The card generates one native h2');
  assert.ok(html.includes(`aria-labelledby="${heading[1]}"`));
  assert.match(html, /^<article\b/);
  assert.match(html, /data-state="error"/);
  assert.match(html, /data-variant="banded"/);
  assert.match(html, /data-tone="overlay"/);
  assert.ok(html.includes('Needs attention'));
  for (const marker of [
    'eg-module-card',
    'eg-module-card__head',
    'eg-module-card__name',
    'eg-module-card__body',
    'eg-module-card__actions',
    'eg-module-card__foot',
    'eg-badge',
    'eg-icon',
    'eg-surface',
    'col-span-full'
  ]) {
    assert.ok(html.includes(marker), marker);
  }
  assert.doesNotMatch(html, /role="(?:alert|status)"|aria-live=|tabindex=/);
  for (const name of ['useModuleCard', 'moduleCardVariants', 'moduleCardHeadVariants', 'ModuleCardNativeProps']) {
    assert.equal(Object.hasOwn(exported, name), false, name);
  }
});

test('ModuleCard ships scanned state, band, layout and legacy-reset utilities without a new stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}[^{]*\\{`));
  };
  for (const selector of [
    String.raw`.data-\[state\=error\]\:border-status-danger\/40`,
    String.raw`.data-\[state\=stopped\]\:bg-transparent`,
    String.raw`.data-\[state\=stopped\]\:bg-none`,
    String.raw`.data-\[state\=stopped\]\:shadow-none`,
    String.raw`.data-\[state\=stopped\]\:border-dashed`,
    String.raw`.data-\[state\=stopped\]\:border-border-control`,
    String.raw`.data-\[tone\=overlay\]\:bg-none`,
    String.raw`.group-data-\[tone\=overlay\]\/module-card\:px-5`,
    String.raw`.last\:rounded-b-xl`,
    String.raw`.\[\&\>\:last-child\:not\(\:first-child\)\]\:ml-0`,
    String.raw`.\[\&\>\:last-child\:not\(\:first-child\)\]\:ms-auto`
  ]) {
    assert.ok(utilities.includes(selector), `Missing ModuleCard utility ${selector}`);
  }
  assert.match(rule('.col-span-full'), /grid-column:\s*1\s*\/\s*-1/);
  assert.match(rule('.transform-none'), /transform:\s*none/);
  assert.match(rule('.transition-none'), /transition-property:\s*none/);
  assert.match(rule('.overflow-visible'), /overflow:\s*visible/);
  assert.match(rule('.border-x-0'), /border-inline-(?:width|style):/);
  assert.match(rule('.text-cta-label'), /font-weight:[^;]*var\(--text-cta-label--font-weight[,)]/);
  assert.match(rule('.text-heading-small'), /font-size:\s*var\(--text-heading-small[,)]/);
  assert.match(rule('.bg-surface-3'), /background-color:\s*var\(--color-surface-3[,)]/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.doesNotMatch(utilities, /\.eg-module-card[^{}]*\{/);
  assert.ok(css.includes('.eg-module-card:hover'), 'Legacy consumers remain untouched in the components layer');
  const source = readFileSync(resolve(root, 'packages/ui/src/molecules/module-card/useModuleCard.ts'), 'utf8');
  assert.match(source, /surfaceVariants\(/);
  assert.doesNotMatch(source, /Panel|PageHeader|Notice|background:|backdrop-filter:/);
  assert.ok(!existsSync(resolve(root, 'packages/ui/src/molecules/module-card/module-card.css')));
});

test('SectionHeader emits every local CVA utility and its exact static breakpoint without a stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/molecules/section-header/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const classes = new Set();
  function collect(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'defaultVariants') {
      return;
    }
    if (ts.isStringLiteral(node)) {
      for (const name of node.text.split(/\s+/).filter(Boolean)) {
        classes.add(name);
      }
    } else {
      ts.forEachChild(node, collect);
    }
  }
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      for (const argument of node.arguments) {
        collect(argument);
      }
    } else {
      ts.forEachChild(node, visit);
    }
  }
  visit(source);
  assert.ok(classes.size > 20, 'Scan every local root and part recipe');
  for (const name of classes) {
    if (name.startsWith('eg-')) {
      continue;
    }
    assert.ok(css.includes('.' + name.replace(/[^\w-]/g, '\\$&')), `Missing SectionHeader utility ${name}`);
  }
  const wide = cssBlock(css, /@media \(width >= 860px\)\s*\{(?=\s*\.section-header-split\\:)/);
  assert.match(wide, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(0,\s*0\.8fr\)/);
  assert.match(wide, /justify-self:\s*(?:flex-)?end/);
  const lede = cssBlock(css, /\.text-body-muted\s*\{/);
  assert.match(lede, /font-size:\s*var\(--text-body-muted,\s*20px\)/);
  assert.match(lede, /line-height:\s*var\(--tw-leading,\s*var\(--text-body-muted--line-height,\s*1\.6\)\)/);
  assert.match(lede, /font-weight:\s*var\(--tw-font-weight,\s*var\(--text-body-muted--font-weight,\s*400\)\)/);
  assert.ok(!existsSync(resolve(root, 'packages/ui/src/molecules/section-header/section-header.css')));
});

test('SectionHeader ships native passive SSR composition with decorative rule and fallbacks', async () => {
  const { SectionHeader } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const render = (props) =>
    renderToString(createElement(SectionHeader, { title: 'Build ', accent: 'together.', ...props }));
  const html = render({ variant: 'inline', eyebrow: 'Our work', titleId: 'section-title', id: 'root' });
  assert.match(html, /^<header/);
  assert.match(html, /id="root"/);
  assert.match(html, /<h2[^>]*id="section-title"/);
  assert.match(html, /role="none"/);
  assert.doesNotMatch(html, /role="separator"|aria-live|tabindex|eg-section-head--inline/);
  assert.equal(html, render({ variant: 'inline', eyebrow: 'Our work', titleId: 'section-title', id: 'root' }));
  for (const variant of ['split', 'inline']) {
    const fallback = render({ variant });
    assert.match(fallback, /flex flex-col items-start gap-5/);
    assert.doesNotMatch(fallback, /eg-divider|eg-section-head__lede/);
  }
});

test('UI root exports the layout primitives, Surface, Gauge, AspectRatio, Portal and Slot with passive SSR semantics', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.deepEqual(
    Object.keys(exported).sort(),
    [
      'AspectRatio',
      'Avatar',
      'Badge',
      'Button',
      'ButtonGroup',
      'Carousel',
      'Checkbox',
      'Chip',
      'ChipGroup',
      'Cluster',
      'Collapsible',
      'CollapsibleContent',
      'CollapsibleTrigger',
      'Countdown',
      'Divider',
      'Dropzone',
      'Field',
      'FieldMessage',
      'Gauge',
      'GaugeDock',
      'GaugeDockItem',
      'GaugeDockSeparator',
      'Heading',
      'HoverCard',
      'HoverCardContent',
      'HoverCardTrigger',
      'Icon',
      'IconButton',
      'Indicator',
      'Input',
      'Kbd',
      'Label',
      'Link',
      'ListItem',
      'ListItemActions',
      'ListItemBody',
      'ListItemContent',
      'ListItemFooter',
      'ListItemMedia',
      'ListItemMeta',
      'Logo',
      'Menu',
      'MeterRow',
      'ModuleCard',
      'NavList',
      'Notice',
      'PageHeader',
      'Panel',
      'PanelBody',
      'PanelFooter',
      'PanelHeader',
      'Popover',
      'PopoverClose',
      'PopoverContent',
      'PopoverTrigger',
      'Portal',
      'ProgressBar',
      'PullQuote',
      'RadioGroup',
      'SearchTrigger',
      'SectionHeader',
      'Select',
      'SelectTile',
      'Skeleton',
      'Slider',
      'Slot',
      'Slottable',
      'SocialLinks',
      'Spinner',
      'Stack',
      'Stat',
      'StatusDot',
      'Surface',
      'Switch',
      'Tabs',
      'Text',
      'Textarea',
      'Timeline',
      'Toast',
      'ToastProvider',
      'Toggle',
      'Tooltip',
      'VisuallyHidden',
      'badgeVariants',
      'chipVariants',
      'cn',
      'dropzoneVariants',
      'labelVariants',
      'menuVariants',
      'navListVariants',
      'noticeVariants',
      'progressBarVariants',
      'radioGroupVariants',
      'sliderVariants',
      'statVariants',
      'statusDotVariants',
      'surfaceVariants',
      'tabsVariants',
      'tooltipVariants'
    ],
    'Only approved components and cn are public runtime exports'
  );
  assert.equal(
    typeof exported.Countdown,
    'function',
    'Countdown must be a plain function with no public ref API (D12)'
  );
  assert.equal(exported.Select?.$$typeof, Symbol.for('react.forward_ref'), 'Select forwards the native button ref');
  assert.equal(exported.Checkbox?.$$typeof, Symbol.for('react.forward_ref'), 'Checkbox must forward its button ref');
  assert.equal(typeof exported.ButtonGroup, 'function', 'ButtonGroup has no public root ref API');
  assert.equal(typeof exported.Dropzone, 'function', 'Dropzone must be a plain function with no public ref API');
  assert.equal(typeof exported.Field, 'function', 'Field has no public ref API');
  assert.equal(typeof exported.Stat, 'function', 'Stat must be a plain function with no public ref API');
  assert.equal(typeof exported.statVariants, 'function', 'Stat card recipe must be public');
  assert.equal(typeof exported.dropzoneVariants, 'function', 'Dropzone recipe must be public');
  assert.equal(
    exported.SearchTrigger?.$$typeof,
    Symbol.for('react.forward_ref'),
    'SearchTrigger forwards the native button ref'
  );
  assert.equal(typeof exported.Chip, 'function', 'Chip must be a plain function component with no public ref API');
  assert.equal(typeof exported.chipVariants, 'function', 'Chip recipe must stay public for ChipGroup');
  assert.equal(typeof exported.ChipGroup, 'function', 'ChipGroup has no public ref API');
  assert.equal(typeof exported.Gauge, 'function', 'Gauge must be a named root export');
  // Radix forwardRef wraps AspectRatio in a React ref object; its callable contract is proven by SSR below.
  assert.equal(typeof exported.AspectRatio, 'object', 'AspectRatio must be a named forwardRef root export');
  assert.equal(typeof exported.Skeleton, 'function', 'Skeleton must be a named root export');
  assert.equal(typeof exported.Spinner, 'function', 'Spinner must be a plain function component without a ref API');
  assert.equal(typeof exported.Logo, 'function', 'Logo must be a plain function component without a ref API (D8)');
  assert.equal(typeof exported.StatusDot, 'function', 'StatusDot must be a plain function component without a ref API');
  assert.equal(typeof exported.statusDotVariants, 'function', 'StatusDot composition recipe must be a public export');
  assert.equal(typeof exported.Kbd, 'function', 'Kbd must be a plain function component without a ref API (D5)');
  assert.equal(typeof exported.sliderVariants, 'function', 'Slider root recipe must stay a public export');
  assert.equal(typeof exported.Tooltip, 'function', 'Tooltip must be a plain function component without a ref API');
  assert.equal(typeof exported.tooltipVariants, 'function', 'Tooltip overlay recipe must stay a public export');
  assert.equal(
    typeof exported.ProgressBar,
    'function',
    'ProgressBar must be a plain function component without a ref API'
  );
  assert.equal(typeof exported.progressBarVariants, 'function', 'ProgressBar track recipe must stay a public export');
  assert.equal(
    exported.Textarea?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Textarea must be a forwardRef component whose ref targets the native textarea (D9)'
  );
  assert.equal(
    exported.Input?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Input must be a React 18-compatible forwardRef component targeting the native input (D12)'
  );
  assert.equal(
    exported.Switch?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Switch must be a forwardRef component whose ref targets the root button (D9)'
  );
  assert.equal(
    typeof exported.RadioGroup,
    'function',
    'RadioGroup must be a plain function component without a ref API'
  );
  assert.deepEqual(
    Object.keys(exported.radioGroupVariants).sort(),
    ['indicator', 'item', 'label', 'root', 'row'],
    'RadioGroup per-part recipes stay public for SelectTile parity'
  );
  assert.equal(
    exported.VisuallyHidden?.$$typeof,
    Symbol.for('react.forward_ref'),
    'VisuallyHidden must be a forwardRef component with a public ref'
  );
  assert.equal(typeof exported.VisuallyHidden.render, 'function', 'VisuallyHidden must expose its render function');
  assert.equal(typeof exported.Stack, 'function', 'Stack must be a plain function component without a ref API');
  assert.equal(typeof exported.Cluster, 'function', 'Cluster must be a plain function component without a ref API');
  assert.equal(
    exported.Stack.prototype?.render,
    undefined,
    'Stack must not be a forwardRef component (D10: no public ref)'
  );
  assert.equal(typeof exported.Icon, 'function', 'Icon must be a plain function component without a ref API');
  assert.equal(exported.Icon.prototype?.render, undefined, 'Icon must not be a forwardRef component (D6: no ref)');
  assert.equal(
    exported.Surface?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Surface must be a React 18-compatible forwardRef bridge with a public ref'
  );
  assert.equal(typeof exported.surfaceVariants, 'function', 'Surface composition recipe must stay a public export');
  for (const name of ['Text', 'Heading']) {
    assert.equal(typeof exported[name], 'function', `${name} must be a plain function component without a ref API`);
  }
  assert.equal(exported.default, undefined, 'UI must not introduce a default export');
  const declaration = artifact('ui', ui.exports['.'].types);
  const program = ts.createProgram([declaration], { moduleResolution: ts.ModuleResolutionKind.Bundler });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(declaration));
  const names = new Set(checker.getExportsOfModule(symbol).map((item) => item.name));
  assert.deepEqual([...names].sort(), [
    'AspectRatio',
    'AspectRatioProps',
    'Avatar',
    'AvatarProps',
    'AvatarSize',
    'Badge',
    'BadgeProps',
    'BadgeTone',
    'BadgeVariant',
    'Button',
    'ButtonGroup',
    'ButtonGroupProps',
    'ButtonGroupVariant',
    'ButtonProps',
    'ButtonSize',
    'ButtonVariant',
    'Carousel',
    'CarouselItem',
    'CarouselMessages',
    'CarouselProps',
    'Checkbox',
    'CheckboxCheckedState',
    'CheckboxProps',
    'Chip',
    'ChipGroup',
    'ChipGroupOption',
    'ChipGroupProps',
    'ChipGroupType',
    'ChipProps',
    'Cluster',
    'ClusterProps',
    'Collapsible',
    'CollapsibleContent',
    'CollapsibleContentProps',
    'CollapsibleProps',
    'CollapsibleTrigger',
    'CollapsibleTriggerProps',
    'Countdown',
    'CountdownProps',
    'CountdownSize',
    'CountdownTone',
    'CountdownUnits',
    'Divider',
    'DividerOrientation',
    'DividerProps',
    'Dropzone',
    'DropzoneProps',
    'Field',
    'FieldCounter',
    'FieldLayout',
    'FieldMessage',
    'FieldMessageProps',
    'FieldMessageTone',
    'FieldProps',
    'Gauge',
    'GaugeDock',
    'GaugeDockItem',
    'GaugeDockItemProps',
    'GaugeDockProps',
    'GaugeDockSeparator',
    'GaugeDockSeparatorProps',
    'GaugeProps',
    'GaugeSize',
    'GaugeState',
    'Heading',
    'HeadingLevel',
    'HeadingProps',
    'HoverCard',
    'HoverCardContent',
    'HoverCardContentProps',
    'HoverCardProps',
    'HoverCardTrigger',
    'HoverCardTriggerProps',
    'Icon',
    'IconButton',
    'IconButtonProps',
    'IconButtonSize',
    'IconButtonVariant',
    'IconName',
    'IconProps',
    'IconSize',
    'Indicator',
    'IndicatorPosition',
    'IndicatorProps',
    'IndicatorSize',
    'IndicatorTone',
    'IndicatorVariant',
    'Input',
    'InputProps',
    'InputSize',
    'InputType',
    'InputVariant',
    'Kbd',
    'KbdProps',
    'Label',
    'LabelProps',
    'LabelVariant',
    'LayoutAlignItems',
    'LayoutGap',
    'LayoutJustifyContent',
    'Link',
    'LinkProps',
    'ListItem',
    'ListItemActions',
    'ListItemBody',
    'ListItemContent',
    'ListItemFooter',
    'ListItemMedia',
    'ListItemMeta',
    'ListItemPartProps',
    'ListItemProps',
    'ListItemStatus',
    'ListItemVariant',
    'Logo',
    'LogoProps',
    'LogoSize',
    'LogoVariant',
    'Menu',
    'MenuActionItem',
    'MenuAlign',
    'MenuEntry',
    'MenuLabelItem',
    'MenuLinkItem',
    'MenuProps',
    'MenuSeparatorItem',
    'MenuSide',
    'MenuSubmenuItem',
    'MenuTone',
    'MeterRow',
    'MeterRowMessages',
    'MeterRowProps',
    'MeterRowVariant',
    'ModuleCard',
    'ModuleCardLevel',
    'ModuleCardMessages',
    'ModuleCardProps',
    'ModuleCardStatus',
    'ModuleCardTone',
    'ModuleCardVariant',
    'NavList',
    'NavListCollapsibleGroup',
    'NavListEntry',
    'NavListGroupBase',
    'NavListLink',
    'NavListProps',
    'NavListSignal',
    'NavListStaticGroup',
    'NavListTag',
    'Notice',
    'NoticeProps',
    'NoticeTone',
    'PageHeader',
    'PageHeaderLevel',
    'PageHeaderProps',
    'Panel',
    'PanelBody',
    'PanelBodyProps',
    'PanelFooter',
    'PanelFooterProps',
    'PanelHeader',
    'PanelHeaderProps',
    'PanelProps',
    'PanelTone',
    'PanelVariant',
    'Popover',
    'PopoverClose',
    'PopoverCloseProps',
    'PopoverContent',
    'PopoverContentProps',
    'PopoverProps',
    'PopoverTrigger',
    'PopoverTriggerProps',
    'Portal',
    'PortalProps',
    'ProgressBar',
    'ProgressBarProps',
    'ProgressBarSize',
    'ProgressBarVariant',
    'PullQuote',
    'PullQuoteProps',
    'PullQuoteTone',
    'PullQuoteVariant',
    'RadioGroup',
    'RadioGroupOption',
    'RadioGroupOrientation',
    'RadioGroupProps',
    'SearchTrigger',
    'SearchTriggerProps',
    'SectionHeader',
    'SectionHeaderLevel',
    'SectionHeaderProps',
    'SectionHeaderTone',
    'SectionHeaderVariant',
    'Select',
    'SelectOption',
    'SelectProps',
    'SelectSize',
    'SelectTile',
    'SelectTileOption',
    'SelectTileProps',
    'SelectTileRatio',
    'SelectTileThumbnail',
    'SelectTileType',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slider',
    'SliderProps',
    'Slot',
    'SlotProps',
    'Slottable',
    'SocialLinkItem',
    'SocialLinks',
    'SocialLinksGap',
    'SocialLinksProps',
    'SocialLinksSize',
    'SocialLinksVariant',
    'Spinner',
    'SpinnerProps',
    'SpinnerSize',
    'Stack',
    'StackProps',
    'Stat',
    'StatProps',
    'StatusDot',
    'StatusDotProps',
    'StatusDotState',
    'Surface',
    'SurfaceElevation',
    'SurfacePadding',
    'SurfaceProps',
    'SurfaceRadius',
    'SurfaceTone',
    'Switch',
    'SwitchProps',
    'Tabs',
    'TabsItem',
    'TabsProps',
    'TabsSize',
    'TabsTone',
    'TabsVariant',
    'Text',
    'TextProps',
    'TextTone',
    'TextVariant',
    'Textarea',
    'TextareaProps',
    'TextareaVariant',
    'Timeline',
    'TimelineChatItem',
    'TimelineEvent',
    'TimelineMessages',
    'TimelineProps',
    'TimelineSize',
    'TimelineTime',
    'TimelineVariant',
    'TitleVariant',
    'Toast',
    'ToastProps',
    'ToastProvider',
    'ToastProviderProps',
    'Toggle',
    'ToggleProps',
    'ToggleSize',
    'Tooltip',
    'TooltipProps',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'badgeVariants',
    'chipVariants',
    'cn',
    'dropzoneVariants',
    'labelVariants',
    'menuVariants',
    'navListVariants',
    'noticeVariants',
    'progressBarVariants',
    'radioGroupVariants',
    'sliderVariants',
    'statVariants',
    'statusDotVariants',
    'surfaceVariants',
    'tabsVariants',
    'tooltipVariants'
  ]);
  for (const name of [
    'useCountdown',
    'countdownRootVariants',
    'countdownValueVariants',
    'countdownLabelVariants',
    'CountdownState'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} must not be a runtime root export`);
    assert.equal(names.has(name), false, `${name} must not be a declaration root export`);
  }
  for (const name of [
    'useToast',
    'useToastProvider',
    'toastVariants',
    'toastViewportVariants',
    'ToastActionProps',
    'usePageHeader',
    'PageHeaderActions',
    'PageHeaderNativeProps',
    'pageHeaderVariants',
    'pageHeaderTextVariants',
    'pageHeaderHeadingVariants',
    'pageHeaderEyebrowVariants',
    'pageHeaderActionsVariants',
    'useField',
    'fieldVariants',
    'fieldLabelRowVariants',
    'fieldMessageVariants',
    'fieldCounterVariants',
    'fieldReadoutVariants',
    'useNotice',
    'noticeAppearanceVariants',
    'noticeIconVariants',
    'noticeTextVariants',
    'noticeActionsVariants',
    'useButtonGroup',
    'buttonGroupVariants',
    'useSlider',
    'sliderTrackVariants',
    'sliderRangeVariants',
    'sliderThumbVariants',
    'usePullQuote',
    'pullQuoteVariants',
    'pullQuoteQuotationVariants',
    'pullQuotePassageVariants',
    'pullQuoteAccentVariants',
    'pullQuoteSourceVariants',
    'useStat',
    'StatSize',
    'statLabelVariants',
    'statUnavailableTextVariants',
    'statValueVariants',
    'statDeltaVariants',
    'useChip',
    'useChipGroup',
    'chipGroupVariants',
    'chipGroupItemVariants',
    'chipGroupIconVariants',
    'chipIconVariants'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} must not be a runtime root export`);
    assert.equal(names.has(name), false, `${name} must not be a declaration root export`);
  }
  for (const name of [
    'useSocialLinks',
    'socialLinksVariants',
    'socialLinksCaptionVariants',
    'socialLinksListVariants',
    'socialLinksItemVariants',
    'SocialLinksNativeProps',
    'useSectionHeader',
    'sectionHeaderVariants',
    'sectionHeaderEyebrowVariants',
    'sectionHeaderHeadingVariants',
    'sectionHeaderLedeVariants',
    'sectionHeaderRuleVariants',
    'SectionHeaderNativeProps',
    'useMeterRow',
    'meterRowVariants',
    'MeterRowNativeProps',
    'useSearchTrigger',
    'searchTriggerVariants',
    'searchTriggerLabelVariants',
    'searchTriggerHintVariants'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} must stay internal to SearchTrigger`);
    assert.equal(names.has(name), false, `${name} must not be a declaration root export`);
  }
  for (const name of [
    'ButtonGroup',
    'ButtonGroupProps',
    'ButtonGroupVariant',
    'Chip',
    'ChipProps',
    'chipVariants',
    'Countdown',
    'CountdownProps',
    'CountdownSize',
    'CountdownTone',
    'CountdownUnits',
    'Dropzone',
    'DropzoneProps',
    'dropzoneVariants',
    'Notice',
    'NoticeProps',
    'NoticeTone',
    'noticeVariants',
    'Toast',
    'ToastProps',
    'ToastProvider',
    'ToastProviderProps',
    'SearchTrigger',
    'SearchTriggerProps',
    'SectionHeader',
    'SectionHeaderLevel',
    'SectionHeaderProps',
    'SectionHeaderTone',
    'SectionHeaderVariant',
    'Divider',
    'DividerOrientation',
    'DividerProps',
    'Gauge',
    'GaugeProps',
    'GaugeState',
    'GaugeSize',
    'Icon',
    'IconButton',
    'IconButtonProps',
    'IconButtonSize',
    'IconButtonVariant',
    'IconName',
    'IconProps',
    'IconSize',
    'Kbd',
    'KbdProps',
    'Link',
    'LinkProps',
    'ProgressBar',
    'ProgressBarProps',
    'ProgressBarSize',
    'ProgressBarVariant',
    'progressBarVariants',
    'PullQuote',
    'PullQuoteProps',
    'PullQuoteTone',
    'PullQuoteVariant',
    'Textarea',
    'TextareaProps',
    'TextareaVariant',
    'Input',
    'InputProps',
    'InputSize',
    'InputType',
    'InputVariant',
    'AspectRatio',
    'AspectRatioProps',

    'Label',
    'LabelProps',
    'LabelVariant',
    'Logo',
    'LogoProps',
    'LogoSize',
    'LogoVariant',
    'MeterRow',
    'MeterRowMessages',
    'MeterRowProps',
    'MeterRowVariant',
    'Portal',
    'PortalProps',
    'RadioGroup',
    'RadioGroupOption',
    'RadioGroupOrientation',
    'RadioGroupProps',
    'radioGroupVariants',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slot',
    'SlotProps',
    'Slottable',
    'Spinner',
    'SpinnerProps',
    'SpinnerSize',
    'Stack',
    'StackProps',
    'StatusDot',
    'StatusDotProps',
    'StatusDotState',
    'statusDotVariants',
    'Stat',
    'StatProps',
    'statVariants',
    'Cluster',
    'ClusterProps',
    'LayoutAlignItems',
    'LayoutGap',
    'LayoutJustifyContent',
    'Surface',
    'SurfaceElevation',
    'SurfacePadding',
    'SurfaceProps',
    'SurfaceRadius',
    'SurfaceTone',
    'surfaceVariants',
    'Switch',
    'SwitchProps',
    'Tooltip',
    'TooltipProps',
    'tooltipVariants',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'labelVariants'
  ]) {
    assert.ok(names.has(name), `Missing public declaration export ${name}`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const buttonGroupHtml = renderToString(
    createElement(exported.ButtonGroup, {
      variant: 'attached',
      label: 'Save options',
      className: 'ms-auto',
      children: [
        createElement(exported.Button, { key: 'save' }, 'Save'),
        createElement(exported.IconButton, {
          key: 'options',
          label: 'More save options',
          size: 'lg',
          icon: createElement(exported.Icon, { name: 'chevron-down' })
        })
      ]
    })
  );
  assert.match(buttonGroupHtml, /^<div role="group" aria-label="Save options" class="eg-button-group /);
  assert.match(buttonGroupHtml, /\*:not-first:rounded-s-sm/);
  assert.match(buttonGroupHtml, /ms-auto/);
  assert.match(buttonGroupHtml, /More save options/);
  assert.equal((buttonGroupHtml.match(/<button /g) ?? []).length, 2);
  assert.doesNotMatch(buttonGroupHtml, /aria-haspopup|aria-expanded|eg-btn--join|eg-btn-split/);
  const dropzoneHtml = renderToString(
    createElement(exported.Dropzone, { onFiles: () => undefined, accept: 'image/*', multiple: true })
  );
  assert.match(dropzoneHtml, /^<button[^>]*type="button"[^>]*data-state="idle"/);
  assert.match(
    dropzoneHtml,
    /Drag, paste or upload<\/span><\/button><input type="file" hidden="" tabindex="-1" accept="image\/\*" multiple=""\/>$/
  );
  assert.match(dropzoneHtml, /aria-hidden="true"/);
  assert.doesNotMatch(dropzoneHtml, /name=|required=|onFiles=|aria-live=|is-over/);
  // Countdown SSR is the deterministic initializing placeholder: no digits, clock or live region (D3/D8).
  const countdownHtml = renderToString(
    createElement(exported.Countdown, {
      deadline: Date.UTC(2030, 0, 2, 1, 1, 1),
      deadlineText: 'Jan 2, 2030, 01:01:01 UTC',
      id: 'launch',
      tone: 'canvas'
    })
  );
  assert.match(countdownHtml, /^<div id="launch" role="timer" aria-labelledby="[^"]+" aria-live="off"/);
  assert.match(countdownHtml, /data-state="initializing"/);
  assert.match(countdownHtml, /class="eg-countdown min-w-0 text-fg-default"/);
  assert.match(countdownHtml, /<time id="[^"]+" dateTime="2030-01-02T01:01:01.000Z"/i);
  assert.match(countdownHtml, />Calculating time remaining<\/p><\/div>$/);
  assert.doesNotMatch(countdownHtml, /eg-countdown__row|eg-countdown--|aria-hidden|role="status"/);
  const invalidCountdownHtml = renderToString(
    createElement(exported.Countdown, { deadline: Number.NaN, deadlineText: 'Unknown' })
  );
  assert.match(invalidCountdownHtml, /data-state="unavailable"/);
  assert.match(invalidCountdownHtml, />Time unavailable<\/p><\/div>$/);
  assert.doesNotMatch(invalidCountdownHtml, /<time/);
  const statHtml = renderToString(
    createElement(exported.Stat, { label: 'Subs', value: 4, delta: '+1 10 s ago', highlighted: true, id: 'subs' })
  );
  const statLabelId = statHtml.match(/<span id="([^"]+)" class="eg-stat-label /)?.[1];
  assert.ok(statLabelId, 'Stat label carries a generated id');
  assert.match(
    statHtml,
    new RegExp(
      `^<div id="subs" role="group" aria-labelledby="${statLabelId.replace(/[^\w]/g, '\\$&')}" data-state="highlighted" class="eg-stat `
    )
  );
  assert.match(
    statHtml,
    />Subs<\/span><span class="eg-stat-value [^"]*text-display-stat[^"]*">4<\/span><span class="eg-stat-delta [^"]*">\+1 10 s ago<\/span><\/div>$/
  );
  const noDataHtml = renderToString(createElement(exported.Stat, { label: 'Superchats', value: null, size: 'sm' }));
  assert.match(
    noDataHtml,
    /<span data-state="unavailable" class="eg-stat-value [^"]*text-display-stat-sm[^"]*"><span aria-hidden="true">—<\/span><span class="sr-only">No data<\/span><\/span><\/div>$/
  );
  assert.doesNotMatch(noDataHtml, /data-state="highlighted"|eg-stat-delta|aria-live|>0</);
  const chipGroupOptions = [
    { value: 'react', label: 'React' },
    { value: 'css', label: 'CSS' }
  ];
  for (const type of ['single', 'multiple']) {
    const html = renderToString(
      createElement(exported.ChipGroup, {
        type,
        label: 'Topics',
        options: chipGroupOptions,
        defaultValue: type === 'single' ? 'react' : ['react']
      })
    );
    assert.match(html, /role="group"/);
    assert.match(html, /aria-label="Topics"/);
    assert.match(html, /class="eg-chip-group flex flex-wrap items-center gap-2"/);
    assert.match(html, type === 'single' ? /role="radio" aria-checked="true"/ : /aria-pressed="true"/);
    assert.doesNotMatch(html, /<input|is-active|eg-surface/);
  }
  assert.equal(typeof exported.Notice, 'function', 'Notice has no public ref API');
  const sharedNotice = exported.noticeVariants({ tone: 'danger', size: 'sm' });
  assert.ok(sharedNotice.split(' ').includes('eg-surface'), 'A1 permits inherited Surface identity');
  assert.doesNotMatch(sharedNotice, /eg-notice|eg-toast|aria-|role=/);
  const noticeHtml = renderToString(
    createElement(exported.Notice, {
      summary: 'Sign in required.',
      tone: 'danger',
      id: 'connection',
      children: 'Reconnect to continue.'
    })
  );
  assert.match(noticeHtml, /role="alert"/);
  assert.match(noticeHtml, /data-tone="danger"/);
  assert.match(noticeHtml, /class="eg-notice eg-surface /);
  assert.match(noticeHtml, /<strong>Sign in required\.<\/strong> (?:<!-- -->)?Reconnect to continue\./);
  assert.match(noticeHtml, /aria-hidden="true"><svg/);
  assert.doesNotMatch(noticeHtml, /aria-live=|tabindex=|eg-notice__actions/);
  const searchHtml = renderToString(createElement(exported.SearchTrigger, { shortcut: 'Ctrl K' }));
  assert.match(searchHtml, /^<button[^>]*type="button"[^>]*aria-label="Search…"[^>]*class="eg-surface[^"]*eg-search/);
  assert.match(searchHtml, /<svg class="eg-icon[^"]*size-4[^"]*"[^>]*aria-hidden="true"/);
  assert.match(
    searchHtml,
    /<span class="whitespace-nowrap">Search…<\/span><span class="ms-auto" aria-hidden="true"><kbd class="eg-kbd[^"]*">Ctrl K<\/kbd><\/span><\/button>$/
  );
  assert.doesNotMatch(
    searchHtml,
    /aria-haspopup|aria-expanded|aria-controls|aria-keyshortcuts|data-state|eg-search--|eg-search__/
  );
  const compactHtml = renderToString(createElement(exported.SearchTrigger, { compact: true, shortcut: 'Ctrl K' }));
  assert.match(compactHtml, /aria-label="Search…"/);
  assert.doesNotMatch(compactHtml, /<span|<kbd|min-w-48/);
  assert.equal(typeof exported.PullQuote, 'function', 'PullQuote must be a plain function with no public ref API');
  const pullQuoteHtml = renderToString(
    createElement(exported.PullQuote, {
      text: 'Build ',
      accent: 'carefully.',
      source: 'Field notes',
      cite: 'https://example.com/notes',
      id: 'quote'
    })
  );
  assert.match(
    pullQuoteHtml,
    /^<figure id="quote" class="eg-quote [^"]*max-w-quote-pull[^"]*"><blockquote cite="https:\/\/example\.com\/notes" class="eg-quote__text [^"]*text-quote-pull[^"]*"><p class="[^"]*">Build <span class="eg-quote__accent [^"]*inline[^"]*">carefully\.<\/span><\/p><\/blockquote><figcaption class="eg-quote__source [^"]*">Field notes<\/figcaption><\/figure>$/
  );
  assert.doesNotMatch(pullQuoteHtml, /role=|<h[1-6]|<cite|<a |aria-live=|eg-quote--display/);
  assert.equal(renderToString(createElement(exported.PullQuote, { text: '  ', source: 'Orphan' })), '');
  assert.equal(renderToString(createElement(exported.Portal, { children: 'Server layer' })), '');
  assert.equal(typeof exported.labelVariants, 'function', 'Label composition recipe must stay a public export');
  const labelHtml = renderToString(
    createElement(exported.Label, { children: 'Email address', htmlFor: 'email', id: 'email-label' })
  );
  for (const text of ['<label', 'for="email"', 'id="email-label"', 'eg-label', 'text-label-default', 'Email address']) {
    assert.ok(labelHtml.includes(text), `Label SSR must render ${text}`);
  }
  const choiceHtml = renderToString(
    createElement(exported.Label, { children: 'Choose plan', htmlFor: 'plan', variant: 'choice' })
  );
  for (const text of ['text-fg-secondary', 'font-[var(--text-body-default--font-weight)]']) {
    assert.ok(choiceHtml.includes(text), `Label choice SSR must render ${text}`);
  }
  assert.doesNotMatch(labelHtml + choiceHtml, /asChild|aria-live=|<button|<input|tabindex=/);
  const html = renderToString(createElement(exported.Gauge, { label: 'Capacity', value: 42.5 }));
  for (const text of [
    'eg-gauge',
    'role="meter"',
    'aria-label="Capacity"',
    'aria-valuenow="42.5"',
    'aria-valuetext="42.5 / 100"'
  ]) {
    assert.ok(html.includes(text), `Gauge SSR must render ${text}`);
  }
  const invalid = renderToString(createElement(exported.Gauge, { label: 'Capacity', value: NaN }));
  assert.match(invalid, /Data unavailable/);
  assert.doesNotMatch(invalid, /role="meter"|aria-value(?:now|min|max|text)=|eg-gauge-arc/);
  assert.doesNotMatch(html + invalid, /aria-live=|<button|<input|tabindex=/);
  // AspectRatio reserves geometry with the Radix padding-bottom trick and no extra semantics.
  const wide = renderToString(createElement(exported.AspectRatio, { 'aria-label': 'Media', ratio: 16 / 9 }, 'Media'));
  assert.ok(
    wide.includes('eg-aspect-ratio') && wide.includes('min-w-0'),
    'AspectRatio must carry its marker and CVA base'
  );
  assert.ok(wide.includes('padding-bottom:56.25%'), 'AspectRatio 16/9 must derive its padding-bottom geometry');
  // Stack and Cluster resolve token gaps as static CVA utilities without inline appearance.
  const stacked = renderToString(createElement(exported.Stack, { 'aria-label': 'Sections', gap: 6 }, 'Sections'));
  assert.ok(
    stacked.includes('eg-stack') && stacked.includes('flex-col') && stacked.includes('gap-6'),
    'Stack must carry its marker and default column classes'
  );
  const clustered = renderToString(createElement(exported.Cluster, { 'aria-label': 'Actions', gap: 0 }, 'Actions'));
  assert.ok(
    clustered.includes('eg-cluster') && clustered.includes('flex-wrap') && clustered.includes('gap-0'),
    'Cluster must carry its marker and wrapping row classes'
  );
  assert.doesNotMatch(stacked + clustered, /aria-live=|tabindex=|role=/);
  // Text defaults to a paragraph eyebrow; Heading to a native h2 section title with its level independent of size.
  const eyebrow = renderToString(createElement(exported.Text, null, 'Weekly stream'));
  assert.match(eyebrow, /^<p class="[^"]*eg-text[^"]*text-label-eyebrow[^"]*">Weekly stream<\/p>$/);
  const heading = renderToString(createElement(exported.Heading, { accent: 'ideas' }, 'Big '));
  assert.match(
    heading,
    /^<h2 class="[^"]*eg-heading[^"]*text-title-section[^"]*">Big <span class="[^"]*eg-heading__accent[^"]*">ideas<\/span><\/h2>$/
  );
  const hero = renderToString(
    createElement(exported.Heading, { level: 4, variant: 'hero', accent: '.', accentBreak: false }, 'Talk')
  );
  assert.ok(
    hero.startsWith('<h4') && hero.includes('text-title-hero') && hero.includes('Talk<span'),
    'Level must not resize; no space is injected'
  );
  assert.ok(
    hero.includes('[text-shadow:var(--text-shadow-title-hero)]') && hero.includes('inline'),
    'Canvas hero accent glows inline'
  );
  assert.doesNotMatch(eyebrow + heading + hero, /aria-live=|tabindex=|role=|aria-level=/);
  // Surface resolves its Material recipe as static CVA utilities on a passive div or slotted child.
  const surface = renderToString(createElement(exported.Surface, null, 'Card'));
  for (const text of [
    '<div class="eg-surface',
    'bg-surface-1',
    'bg-[image:var(--gradient-sheen)]',
    'p-6',
    'rounded-xl'
  ]) {
    assert.ok(surface.includes(text), `Surface SSR must render ${text}`);
  }
  const overlay = renderToString(createElement(exported.Surface, { tone: 'overlay' }, 'Glass'));
  assert.ok(overlay.includes('bg-surface-overlay') && overlay.includes('not-supports-[backdrop-filter]:bg-surface-2'));
  const slotted = renderToString(
    createElement(exported.Surface, { asChild: true, tone: 'well' }, createElement('section', { 'aria-label': 'Well' }))
  );
  assert.match(slotted, /^<section aria-label="Well" class="eg-surface [^"]*shadow-\[var\(--shadow-well\)\]/);
  assert.doesNotMatch(surface + overlay + slotted, /aria-live=|tabindex=|role=|style=/);
  assert.ok(
    wide.includes('data-radix-aspect-ratio-wrapper'),
    'AspectRatio must render the inner generic div inside the Radix frame'
  );
  assert.ok(wide.includes('Media'), 'AspectRatio must render its children');
  assert.doesNotMatch(wide, /aria-live=|<button|<input|tabindex=|role=/);
  for (const ratio of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    const fallback = renderToString(createElement(exported.AspectRatio, { ratio }, 'Fallback'));
    assert.ok(fallback.includes('padding-bottom:100%'), `Invalid ratio ${ratio} must fall back to a square`);
  }
  // Spinner: labelled status region or decorative hidden arc, Icon-scale presets, no ref or state.
  const status = renderToString(createElement(exported.Spinner, { label: 'Loading results', id: 'loading' }));
  assert.match(
    status,
    /^<span id="loading" role="status" class="eg-spinner inline-flex shrink-0 size-\(--icon-size\)">/
  );
  assert.match(
    status,
    /<svg class="[^"]*animate-spin motion-reduce:animate-none" aria-hidden="true" focusable="false"/
  );
  assert.match(status, /<span style="[^"]*clip:rect\(0, 0, 0, 0\)[^"]*">Loading results<\/span><\/span>$/);
  assert.doesNotMatch(status, /aria-hidden="true" class="eg-spinner|aria-live=|tabindex=|data-state/);
  for (const label of [undefined, '', '  ']) {
    const decorative = renderToString(createElement(exported.Spinner, { label }));
    assert.match(decorative, /^<span aria-hidden="true" class="eg-spinner /, 'Unlabelled spinners are decorative');
    assert.doesNotMatch(decorative, /role=|clip:rect/, 'Decorative spinners have no status or hidden text');
  }
  for (const [size, utility] of [
    ['sm', 'size-4'],
    ['md', 'size-(--icon-size)'],
    ['lg', 'size-7']
  ]) {
    const sized = renderToString(createElement(exported.Spinner, { size }));
    assert.ok(sized.includes(`class="eg-spinner inline-flex shrink-0 ${utility}"`), `Spinner ${size} preset`);
  }
  // Logo: named span image or named native link around hidden inline V4 artwork (#62).
  const logo = renderToString(createElement(exported.Logo, { id: 'brand' }));
  assert.match(
    logo,
    /^<span id="brand" role="img" aria-label="egdev" class="eg-logo inline-block shrink-0 leading-none rounded-sm h-8">/
  );
  assert.match(logo, /<svg class="block h-full w-auto" aria-hidden="true" focusable="false" viewBox="0 0 653 258">/);
  assert.equal((logo.match(/<path /g) ?? []).length, 8, 'The wordmark ships its eight V4 paths');
  assert.equal((logo.match(/class="fill-primitive-white"/g) ?? []).length, 1, 'One white name path');
  assert.doesNotMatch(logo, /href=|tabindex=|<title|fill="|style=/);
  const mark = renderToString(createElement(exported.Logo, { variant: 'mark' }));
  assert.match(mark, /viewBox="0 0 638\.45 612\.37"/);
  assert.equal((mark.match(/<polygon /g) ?? []).length, 7, 'The isotype ships its seven V4 polygons');
  assert.equal((mark.match(/class="fill-\(--logo-red\)"/g) ?? []).length, 5);
  assert.equal((mark.match(/class="fill-\(--logo-red-shade\)"/g) ?? []).length, 2);
  const home = renderToString(createElement(exported.Logo, { href: '/', label: 'egdev, home', rel: 'home' }));
  assert.match(
    home,
    /^<a rel="home" href="\/" aria-label="egdev, home" class="eg-logo [^"]*focus-visible:outline-none focus-visible:shadow-focus">/
  );
  assert.doesNotMatch(home, /role=/, 'The link keeps its native role');
  for (const [size, utility] of [
    ['sm', 'h-7'],
    ['md', 'h-8'],
    ['lg', 'h-9']
  ]) {
    const sized = renderToString(createElement(exported.Logo, { size }));
    assert.ok(sized.includes(`rounded-sm ${utility}"`), `Logo ${size} preset`);
  }
  // StatusDot: always decorative, empty, data-state per state; ring vs glow geometry and the live pulse.
  const pulse = 'motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]';
  assert.equal(
    renderToString(createElement(exported.StatusDot)),
    '<span aria-hidden="true" data-state="stopped" class="eg-status-dot inline-block shrink-0 rounded-full size-2 ring-2 ring-bg-surface bg-primitive-neutral-600"></span>'
  );
  for (const [state, fill] of [
    ['running', 'bg-status-success'],
    ['idle', 'bg-status-info'],
    ['warning', 'bg-status-warning'],
    ['error', 'bg-status-danger'],
    ['stopped', 'bg-primitive-neutral-600']
  ]) {
    const dot = renderToString(createElement(exported.StatusDot, { state, pulse: true }));
    assert.ok(dot.includes(`data-state="${state}"`), `StatusDot ${state} state`);
    assert.ok(dot.includes(`size-2 ring-2 ring-bg-surface ${fill}`), `StatusDot ${state} ringed fill`);
    assert.doesNotMatch(dot, /shadow-glow-hot|animate/, `StatusDot ${state} never glows or pulses`);
  }
  for (const [state, fill] of [
    ['live', 'bg-fg-brand-default'],
    ['standby', 'bg-primitive-white']
  ]) {
    const dot = renderToString(createElement(exported.StatusDot, { state }));
    assert.ok(dot.includes(`size-2.5 shadow-glow-hot ${fill} ${pulse}`), `StatusDot ${state} glows and pulses`);
    assert.doesNotMatch(dot, /ring-/, `StatusDot ${state} has no ring`);
    const still = renderToString(createElement(exported.StatusDot, { state, pulse: false }));
    assert.ok(still.includes(`shadow-glow-hot ${fill}"`), `StatusDot ${state} pulse:false keeps the glow`);
    assert.doesNotMatch(still, /animate/, `StatusDot ${state} pulse:false is static`);
  }
  const placed = renderToString(
    createElement(exported.StatusDot, { state: 'error', id: 'rail-dot', title: 'Error', className: 'absolute top-1' })
  );
  assert.match(
    placed,
    /^<span id="rail-dot" title="Error" aria-hidden="true" data-state="error" class="eg-status-dot /
  );
  assert.ok(placed.endsWith('bg-status-danger absolute top-1"></span>'), 'Consumer layout classes merge last');
  assert.doesNotMatch(placed, /role=|aria-label|tabindex|\spulse=|\sstate=/);
  // Kbd: one native kbd per key; a label hides the glyph and adds hidden spoken text (D2).
  const plainKey = renderToString(createElement(exported.Kbd, { children: 'Esc', id: 'escape-key' }));
  assert.equal(
    plainKey,
    '<kbd id="escape-key" class="eg-kbd inline-block whitespace-nowrap rounded-sm border border-border-subtle px-1.5 py-0.5 font-sans text-label-default text-fg-secondary">Esc</kbd>'
  );
  assert.equal(
    renderToString(createElement(exported.Kbd, { children: 'Ctrl', label: '' })).includes('aria-hidden'),
    false
  );
  const symbolKey = renderToString(createElement(exported.Kbd, { children: '⌘K', label: 'Command K' }));
  assert.match(
    symbolKey,
    /^<kbd class="eg-kbd [^"]*"><span aria-hidden="true">⌘K<\/span><span style="[^"]*clip:rect\(0, 0, 0, 0\)[^"]*">Command K<\/span><\/kbd>$/
  );
  assert.doesNotMatch(symbolKey, /role=|aria-label=|tabindex=|data-state/);
  // RadioGroup: a named Radix radiogroup with one row per option (AC-01). Without a DOM, Radix cannot
  // detect a form ancestor during SSR, so each radio is followed by its hidden radio input (AC-07).
  const radioGroup = renderToString(
    createElement(exported.RadioGroup, {
      label: 'Visibility',
      id: 'visibility',
      name: 'visibility',
      defaultValue: 'public',
      options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private', disabled: true }
      ]
    })
  );
  assert.match(radioGroup, /^<div role="radiogroup" aria-required="false" aria-orientation="vertical"[^>]*>/);
  assert.match(radioGroup, /id="visibility"/);
  assert.match(radioGroup, /aria-label="Visibility"/);
  assert.match(radioGroup, /class="eg-radio-group flex flex-col gap-1"/);
  assert.equal(radioGroup.match(/<button type="button" role="radio"/g)?.length, 2, 'One radio per option');
  assert.equal(radioGroup.match(/<input type="radio" aria-hidden="true"[^>]*name="visibility"/g)?.length, 2);
  assert.match(
    radioGroup,
    /aria-checked="true" data-state="checked" value="public" id="([^"]+)"[^>]*><span data-state="checked" class="size-2 rounded-full bg-action-primary-solid-fg"><\/span><\/button><input [^>]*checked="" value="public"\/><label for="\1" class="cursor-pointer">Public<\/label>/
  );
  assert.match(
    radioGroup,
    /aria-checked="false" data-state="unchecked" data-disabled="" disabled="" value="private" id="([^"]+)"[^>]*><\/button><input [^>]*disabled=""[^>]*value="private"\/><label for="\1" class="cursor-pointer">Private<\/label>/
  );
  const horizontalGroup = renderToString(
    createElement(exported.RadioGroup, {
      label: 'Format',
      orientation: 'horizontal',
      required: true,
      disabled: true,
      options: [{ value: 'video', label: 'Video' }]
    })
  );
  assert.match(horizontalGroup, /aria-required="true" aria-orientation="horizontal" data-disabled=""/);
  assert.match(horizontalGroup, /class="eg-radio-group flex flex-wrap gap-x-6 gap-y-1"/);
  // Switch: one Radix switch button with its thumb (AC-01). Without a DOM, Radix cannot detect a form
  // ancestor during SSR, so it always emits its hidden bubble input after the button (AC-08).
  const offSwitch = renderToString(createElement(exported.Switch, { 'aria-label': 'Stream alerts', id: 'alerts' }));
  assert.match(offSwitch, /^<button type="button" role="switch" aria-checked="false"[^>]*>/);
  assert.match(offSwitch, /data-state="unchecked"/);
  assert.match(offSwitch, /value="on"/);
  assert.match(offSwitch, /id="alerts"/);
  assert.match(offSwitch, /aria-label="Stream alerts"/);
  assert.match(offSwitch, /class="eg-switch /);
  assert.match(
    offSwitch,
    /<span data-state="unchecked" class="absolute top-0\.5 left-0\.5 size-3\.5 [^"]*"><\/span><\/button><input type="checkbox" aria-hidden="true" tabindex="-1" [^>]*value="on"\/>$/
  );
  assert.doesNotMatch(offSwitch, /disabled=""|data-disabled|checked=""/);
  const onSwitch = renderToString(
    createElement(exported.Switch, { 'aria-label': 'Overlay', defaultChecked: true, disabled: true })
  );
  assert.match(onSwitch, /aria-checked="true"/);
  assert.match(onSwitch, /disabled=""/);
  assert.match(onSwitch, /data-disabled=""/);
  assert.equal(onSwitch.match(/data-state="checked"/g)?.length, 2, 'Root and thumb expose the checked state');
  const formSwitch = renderToString(
    createElement('form', null, createElement(exported.Switch, { 'aria-label': 'Alerts', name: 'alerts' }))
  );
  assert.match(
    formSwitch,
    /<input type="checkbox" aria-hidden="true"[^>]*name="alerts"/,
    'Form switches add Radix bubble input'
  );
  // Tooltip: closed on the server; only the consumer trigger renders, with Radix's closed state (D2, D7).
  const tooltipHtml = renderToString(
    createElement(exported.Tooltip, {
      content: 'Search the catalogue',
      children: createElement('button', { type: 'button', 'aria-label': 'Search' }, '⌕')
    })
  );
  assert.equal(tooltipHtml, '<button type="button" aria-label="Search" data-state="closed">⌕</button>');
  assert.doesNotMatch(tooltipHtml, /role="tooltip"|eg-tooltip|aria-describedby|Search the catalogue/);
  // ProgressBar: Radix progressbar in percent, decorative without a label (D4), fill driven by one custom property (D8).
  const announced = renderToString(
    createElement(exported.ProgressBar, { label: 'Upload progress', value: 45, id: 'upload-progress' })
  );
  for (const text of [
    'role="progressbar"',
    'aria-valuemin="0"',
    'aria-valuemax="100"',
    'aria-valuenow="45"',
    'aria-valuetext="45%"',
    'aria-label="Upload progress"',
    'data-state="loading"',
    'id="upload-progress"',
    'style="--eg-progress-value:0.45"'
  ]) {
    assert.ok(announced.includes(text), `ProgressBar SSR must render ${text}`);
  }
  assert.match(
    announced,
    /^<div [^>]*class="eg-progress [^"]*"[^>]*><div [^>]*class="eg-progress-fill [^"]*"[^>]*><\/div><\/div>$/
  );
  assert.doesNotMatch(announced, /aria-hidden|tabindex=/);
  const decorative = renderToString(createElement(exported.ProgressBar, { value: 140 }));
  assert.ok(decorative.includes('aria-hidden="true"') && decorative.includes('data-state="complete"'));
  assert.ok(decorative.includes('aria-valuenow="100"') && decorative.includes('style="--eg-progress-value:1"'));
  const unknown = renderToString(createElement(exported.ProgressBar, { label: 'Sync', value: Number.NaN }));
  assert.ok(unknown.includes('data-state="indeterminate"') && unknown.includes('style="--eg-progress-value:0"'));
  assert.doesNotMatch(unknown, /aria-valuenow|aria-valuetext/);
  assert.match(
    renderToString(createElement(exported.ProgressBar, { label: 'Goal', value: 74, valueText: '37 of 50' })),
    /aria-valuetext="37 of 50"/
  );
  assert.equal(
    exported.progressBarVariants({ size: 'sm', edge: true }),
    'eg-progress block overflow-hidden h-0.5 absolute inset-x-0 bottom-0 w-auto rounded-none bg-bg-glass pointer-events-none'
  );
  // Textarea: one native textarea root with the public marker first and layout classes last (D9).
  const textareaHtml = renderToString(
    createElement(exported.Textarea, {
      'aria-label': 'Notes',
      'aria-invalid': true,
      rows: 3,
      maxLength: 1250,
      defaultValue: 'Draft',
      className: 'mt-2 mt-4'
    })
  );
  assert.match(textareaHtml, /^<textarea [^>]*class="eg-textarea [^"]* mt-4"[^>]*>Draft<\/textarea>$/);
  for (const text of ['aria-label="Notes"', 'aria-invalid="true"', 'rows="3"', 'maxLength="1250"']) {
    assert.ok(textareaHtml.includes(text), `Textarea SSR must forward ${text}`);
  }
  assert.doesNotMatch(textareaHtml, / mt-2 |variant=|data-state|role=|tabindex=/);
  for (const [variant, utility] of [
    ['default', 'bg-surface-0'],
    ['code', 'bg-primitive-neutral-950'],
    ['prose', 'bg-surface-1']
  ]) {
    const variantHtml = renderToString(createElement(exported.Textarea, { 'aria-label': variant, variant }));
    assert.ok(variantHtml.includes(utility), `Textarea ${variant} must render ${utility}`);
  }
  // Input: span.eg-input root, native input with forwarded attributes, className on the root only (D3).
  const field = renderToString(
    createElement(exported.Input, { 'aria-label': 'Title', name: 'title', placeholder: 'Untitled', className: 'w-64' })
  );
  assert.match(
    field,
    /^<span class="eg-input relative flex items-center [^"]*w-64"><input [^>]*class="box-border w-full [^"]*"[^>]*\/><\/span>$/
  );
  for (const attribute of ['aria-label="Title"', 'name="title"', 'placeholder="Untitled"', 'type="text"']) {
    assert.ok(field.split('<input')[1].includes(attribute), `Input must forward ${attribute} to the native input`);
  }
  assert.ok(!field.split('<input')[0].includes('w-full'), 'Consumer width replaces the root full width');
  for (const utility of [
    'min-h-11',
    'px-3',
    'py-2',
    'text-body-default',
    'bg-surface-0',
    'shadow-[var(--shadow-well)]'
  ]) {
    assert.ok(field.includes(utility), `Input md/default must render ${utility}`);
  }
  assert.doesNotMatch(field, /aria-hidden|data-state|role=|\ssize=/);
  const search = renderToString(
    createElement(exported.Input, {
      'aria-label': 'Search',
      type: 'search',
      size: 'sm',
      variant: 'code',
      icon: createElement('svg', { viewBox: '0 0 16 16' })
    })
  );
  assert.match(search, /^<span class="eg-input [^"]*"><span aria-hidden="true" class="[^"]*absolute left-3[^"]*"><svg/);
  assert.match(search, /type="search"/);
  for (const utility of ['min-h-9', 'pl-9', 'font-mono', 'text-code', 'bg-primitive-neutral-950']) {
    assert.ok(search.includes(utility), `Input sm/code/icon must render ${utility}`);
  }
  for (const utility of ['font-sans', 'bg-surface-0', 'text-label-default', 'font-[var(']) {
    assert.ok(!search.includes(` ${utility}`), `Input code must replace ${utility}`);
  }
  const geometry = [
    ['line', 'sm', 'h-3', 'rounded-sm'],
    ['line', 'md', 'h-4', 'rounded-sm'],
    ['line', 'lg', 'h-5', 'rounded-sm'],
    ['block', 'sm', 'h-12', 'rounded-md'],
    ['block', 'md', 'h-20', 'rounded-md'],
    ['block', 'lg', 'h-24', 'rounded-md'],
    ['circle', 'sm', 'size-8', 'rounded-full'],
    ['circle', 'md', 'size-12', 'rounded-full'],
    ['circle', 'lg', 'size-16', 'rounded-full']
  ];
  for (const [variant, size, dimension, radius] of geometry) {
    const shape = renderToString(createElement(exported.Skeleton, { variant, size }));
    assert.match(
      shape,
      /^<span aria-hidden="true" class="eg-skeleton /,
      `Skeleton ${variant}/${size} must keep the stable root class`
    );
    assert.ok(shape.includes(dimension), `Skeleton ${variant}/${size} must render ${dimension}`);
    assert.ok(shape.includes(radius), `Skeleton ${variant}/${size} must render ${radius}`);
    assert.equal(shape.includes('w-full'), variant !== 'circle', `Skeleton ${variant}/${size} width ownership`);
    assert.ok(shape.endsWith('></span>'), `Skeleton ${variant}/${size} must stay an empty span`);
    assert.match(shape, /aria-hidden="true"/);
    assert.match(
      shape,
      /animate-pulse motion-reduce:animate-none/,
      `Skeleton ${variant}/${size} must pulse by default with the reduced-motion opt-out`
    );
    assert.doesNotMatch(shape, /aria-live|aria-busy|role=|tabindex|data-state|transition/);
    assert.doesNotMatch(shape, /\spulse=/, 'The pulse switch must never reach the DOM');
  }
  const skeletonStatic = renderToString(
    createElement(exported.Skeleton, { variant: 'line', size: 'md', pulse: false })
  );
  assert.ok(skeletonStatic.includes('eg-skeleton'), 'pulse:false must keep the stable root class');
  assert.doesNotMatch(skeletonStatic, /animate-/, 'pulse:false must render fully static');
  const skeletonNative = renderToString(
    createElement(exported.Skeleton, {
      id: 'consumer-skeleton',
      title: 'Decorative placeholder',
      className: 'w-3/4 mt-2'
    })
  );
  assert.ok(skeletonNative.includes('id="consumer-skeleton"'), 'Native span id must survive');
  assert.ok(skeletonNative.includes('title="Decorative placeholder"'), 'Native span title must survive');
  assert.ok(
    skeletonNative.includes('w-3/4') && skeletonNative.includes('mt-2'),
    'Supported width override must survive'
  );
  assert.ok(!skeletonNative.includes('w-full'), 'Consumer width must replace the preset full width');
  assert.ok(skeletonNative.endsWith('></span>'), 'Native props must not add content');
});

test('UI VisuallyHidden renders non-visual content without shipped CSS or Tailwind', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { VisuallyHidden } = exported;
  const note = renderToString(createElement(VisuallyHidden, { id: 'hint', className: 'extra' }, 'Screen reader note'));
  // Radix applies the hiding geometry inline; the class is the stable public marker only.
  assert.match(note, /<span id="hint" class="eg-visually-hidden extra" style="[^"]*position:absolute/);
  assert.match(note, /clip:rect\(0, 0, 0, 0\)/);
  assert.match(note, />Screen reader note<\/span>/);
  const slotted = renderToString(
    createElement(VisuallyHidden, { asChild: true }, createElement('h2', { id: 'slotted' }, 'Hidden heading'))
  );
  assert.match(slotted, /^<h2 id="slotted" class="eg-visually-hidden" style="[^"]*position:absolute/);
  assert.match(slotted, /clip:rect\(0, 0, 0, 0\)[^"]*">Hidden heading<\/h2>$/);
  assert.doesNotMatch(slotted, /<span/, 'asChild must not keep a wrapping span');
  const styles = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  assert.ok(
    !styles.includes('.eg-visually-hidden'),
    'Hiding geometry is inline Radix behavior; shipped CSS must stay untouched'
  );
});

test('UI ships Checkbox static state, focus, geometry and decorative glyph utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const rule = (selector) => cssBlock(css, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{}]*\\{`));
  assert.match(rule(String.raw`.size-4\.5`), /width:\s*calc\(var\(--space-1\)\s*\*\s*4\.5\)/);
  assert.match(rule('.size-3'), /width:\s*var\(--space-3\)/);
  assert.match(rule('.inline-grid'), /display:\s*inline-grid/);
  assert.match(rule('.box-border'), /box-sizing:\s*border-box/);
  assert.match(rule('.border-solid'), /border-style:\s*solid/);
  assert.match(rule('.p-0'), /padding:\s*(?:0|0px|var\(--space-0\))/);
  for (const state of ['checked', 'indeterminate']) {
    const prefix = `.data-\\[state\\=${state}\\]\\:`;
    const fill = rule(`${prefix}bg-\\[image\\:var\\(--gradient-btn-primary\\)\\]`);
    assert.ok(fill.includes(`data-state=\"${state}\"`) || fill.includes(`data-state=${state}`));
    assert.match(fill, /background-image:\s*var\(--gradient-btn-primary\)/);
    assert.match(
      rule(`${prefix}shadow-\\[var\\(--shadow-btn-primary\\)\\]`),
      /--tw-shadow:\s*var\(--shadow-btn-primary\)/
    );
    const focus = rule(`${prefix}focus-visible\\:shadow-\\[var\\(--shadow-focus\\)\\]`);
    assert.match(focus, /:focus-visible/);
    assert.match(focus, /--tw-shadow:\s*var\(--shadow-focus\)/);
  }
  assert.match(rule(String.raw`.disabled\:opacity-45`), /:disabled[\s\S]*opacity:\s*(?:45%|0?\.45)/);
  assert.match(
    rule(String.raw`.aria-invalid\:data-\[state\=unchecked\]\:border-status-danger`),
    /border-color:\s*var\(--color-status-danger/
  );
  for (const [state, child] of [
    ['checked', 'last'],
    ['indeterminate', 'first']
  ]) {
    const glyph = rule(`.data-\\[state\\=${state}\\]\\:\\[\\&\\>svg\\:${child}-child\\]\\:hidden`);
    assert.match(glyph, new RegExp(`svg:${child}-child`));
    assert.match(glyph, /display:\s*none/);
  }
  assert.doesNotMatch(css, /\.eg-checkbox\s*[,{]/, 'Checkbox has no stylesheet or public part selectors');
});

test('UI Checkbox SSR retains binary/mixed semantics, private recipes and form integration', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  for (const [checked, aria, state] of [
    [false, 'false', 'unchecked'],
    [true, 'true', 'checked'],
    ['indeterminate', 'mixed', 'indeterminate']
  ]) {
    const html = renderToString(
      createElement(
        'form',
        null,
        createElement(exported.Checkbox, {
          'aria-label': 'Select rows',
          checked,
          name: 'rows',
          value: 'selected',
          required: true
        })
      )
    );
    for (const text of [
      '<button',
      'eg-checkbox',
      'role="checkbox"',
      `aria-checked="${aria}"`,
      `data-state="${state}"`,
      'type="checkbox"',
      'name="rows"',
      'value="selected"',
      'required=""'
    ]) {
      assert.ok(html.includes(text), `Checkbox SSR ${state} must render ${text}`);
    }
    if (checked) {
      assert.match(html, /aria-hidden="true"/);
      assert.equal((html.match(/<svg /g) ?? []).length, 2, 'Radix state utilities select the visible decorative glyph');
    } else {
      assert.doesNotMatch(html, /<svg /);
    }
  }
  for (const name of ['checkboxVariants', 'checkboxIndicatorVariants', 'checkboxIconVariants', 'useCheckbox']) {
    assert.equal(exported[name], undefined, `${name} stays private`);
  }
});

test('GaugeDock ships scanned layout utilities and independent passive SSR semantics', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const html = renderToStaticMarkup(
    h(exported.GaugeDock, {
      label: 'Usage detail actions',
      children: [
        h(exported.GaugeDockItem, {
          key: 'pair',
          children: [
            h(exported.Gauge, { key: 'meter', label: 'Provider A session', value: 0 }),
            h(exported.Button, { key: 'action', children: 'Open Provider A details' })
          ]
        }),
        h(exported.GaugeDockSeparator, { key: 'separator' })
      ]
    })
  );
  assert.match(html, /role="toolbar"/);
  assert.match(html, /aria-label="Usage detail actions"/);
  assert.match(html, /role="meter"[^>]*aria-label="Provider A session"[^>]*aria-valuenow="0"/);
  assert.match(html, /<\/div><button[^>]*type="button"/);
  assert.match(html, /data-orientation="vertical"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /eg-gauge-strip/);
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/molecules/gauge-dock/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let parts = 0;
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      const base = node.arguments[0];
      assert.ok(base && ts.isStringLiteral(base));
      parts++;
      for (const name of base.text.split(/\s+/).filter((name) => !name.startsWith('eg-') && name !== 'group')) {
        const selector = `.${name.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`;
        assert.ok(utilities.includes(selector), `Missing GaugeDock utility ${name}`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.equal(parts, 3);
  assert.match(css, /background-color:\s*var\(--color-border-hairline[,)]/);
  assert.doesNotMatch(css, /\.eg-gauge-dock(?:-item|-separator)?\s*\{/);
  for (const name of ['useGaugeDock', 'gaugeDockVariants', 'gaugeDockItemVariants', 'gaugeDockSeparatorVariants']) {
    assert.equal(exported[name], undefined, `${name} stays internal`);
  }
});

test('HoverCard ships every static CVA utility, Radix bounds and opacity-only entry', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/molecules/hover-card/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let parts = 0;
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      parts++;
      const collect = (value) => {
        if (ts.isStringLiteral(value)) {
          for (const name of value.text.split(/\s+/).filter(Boolean)) {
            if (name === 'eg-hover-card') {
              continue;
            }
            const selector = `.${name.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`;
            assert.ok(css.includes(selector), `Missing HoverCard utility ${name}`);
          }
        } else {
          ts.forEachChild(value, collect);
        }
      };
      collect(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(parts, 2, 'Trigger and Content recipes must both ship');
  assert.match(css, /width:\s*calc\([^;]*var\(--space-24\)[^;]*\)/);
  assert.match(css, /max-width:\s*var\(--radix-hover-card-content-available-width\)/);
  assert.match(css, /max-height:\s*var\(--radix-hover-card-content-available-height\)/);
  assert.match(css, /overflow-y:\s*auto/);
  assert.match(css, /overflow-wrap:\s*break-word/);
  assert.match(css, /@starting-style/);
  assert.match(css, /transition-duration:\s*var\(--duration-fast\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /\.eg-hover-card\s*[,{]/, 'No HoverCard stylesheet or local Material recipe');
});

test('HoverCard exports its bounded composition with native link SSR and private helpers', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  assert.equal(typeof exported.HoverCard, 'function');
  assert.equal(typeof exported.HoverCardContent, 'function');
  assert.equal(exported.HoverCardTrigger.$$typeof, Symbol.for('react.forward_ref'));
  const html = renderToString(
    createElement(
      exported.HoverCard,
      { defaultOpen: true },
      createElement(exported.HoverCardTrigger, { href: '#details', id: 'preview' }, 'Usage preview'),
      createElement(exported.HoverCardContent, null, 'Read-only usage')
    )
  );
  assert.match(html, /^<a /, 'Root adds no DOM');
  assert.match(html, /href="#details"/);
  assert.match(html, /data-state="open"/);
  assert.match(html, />Usage preview<\/a>$/);
  assert.doesNotMatch(html, /Read-only usage|aria-expanded|aria-controls|aria-describedby|role="(?:dialog|tooltip)"/);
  const slotted = renderToString(
    createElement(
      exported.HoverCard,
      null,
      createElement(exported.HoverCardTrigger, { asChild: true }, createElement('a', { href: '#details' }, 'Details'))
    )
  );
  assert.equal((slotted.match(/<a /g) ?? []).length, 1);
  assert.match(slotted, /href="#details"/);
  for (const name of [
    'useHoverCard',
    'useHoverCardContent',
    'useHoverCardTrigger',
    'hoverCardContentVariants',
    'hoverCardTriggerVariants'
  ]) {
    assert.equal(exported[name], undefined, `${name} stays internal`);
  }
});

for (const subpath of ['./tokens.css', './theme.css', './native.css']) {
  test(`Tokens ${subpath} export resolves to a nonempty file`, () => {
    artifact('tokens', tokens.exports[subpath]);
  });
}

test('Tokens ships a compiled native artifact under dist without @theme', () => {
  assert.equal(tokens.exports['./tokens.css'], './dist/tokens.css', 'native import must be the compiled artifact');
  const entry = artifact('tokens', tokens.exports['./tokens.css']);
  assert.doesNotMatch(readFileSync(entry, 'utf8'), /@theme/, 'compiled artifact must not keep the @theme at-rule');
});

test('Tokens retires the JSON export and its source file', () => {
  assert.equal(tokens.exports['./tokens.json'], undefined, 'tokens.json export must be retired');
  assert.equal(
    existsSync(resolve(root, 'packages/tokens/src/tokens.json')),
    false,
    'tokens.json source must be removed, not just unexported'
  );
});

test('UI ships the Slider well, range and raised thumb utilities without a Slider-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}(?::[a-z-]+|\\[data-disabled\\])?\\s*\\{`));
  };
  assert.match(rule('.touch-none'), /touch-action:\s*none\s*;/);
  assert.match(rule('.select-none'), /user-select:\s*none\s*;/);
  assert.match(rule('.h-6'), /height:\s*var\(--space-6\)\s*;/);
  assert.match(rule('.h-1'), /height:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.size-4'), /width:\s*var\(--space-4\)\s*;\s*height:\s*var\(--space-4\)\s*;/);
  assert.match(rule('.grow'), /flex-grow:\s*1\s*;/);
  assert.match(rule(String.raw`.data-\[disabled\]\:opacity-45`), /opacity:\s*45%\s*;/);
  assert.match(rule(String.raw`.data-\[disabled\]\:pointer-events-none`), /pointer-events:\s*none\s*;/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-fg-brand-default'), /background-color:\s*var\(--color-fg-brand-default[,)]/);
  assert.match(rule('.bg-fg-default'), /background-color:\s*var\(--color-fg-default[,)]/);
  // Material shadows stay token references instead of copied literal values.
  for (const token of ['shadow-well', 'shadow-elev-1']) {
    assert.match(rule(`.shadow-\\[var\\(--${token}\\)\\]`), new RegExp(`--tw-shadow:\\s*var\\(--${token}\\)\\s*;`));
  }
  assert.match(
    rule(String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`),
    /--tw-shadow:\s*var\(--shadow-focus\)\s*;/
  );
  assert.match(rule('.transition-shadow'), /transition-property:\s*box-shadow\s*;/);
  assert.match(
    rule(String.raw`.duration-\[var\(--duration-fast\)\]`),
    /transition-duration:\s*var\(--duration-fast\)\s*;/
  );
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)\s*;/);
  assert.match(rule('.cursor-grab'), /cursor:\s*grab\s*;/);
  assert.match(rule(String.raw`.active\:cursor-grabbing`), /cursor:\s*grabbing\s*;/);
  // The 44px touch target applies only on coarse pointers (D9); reduced motion drops the transition.
  assert.match(
    utilities,
    /@media \(pointer: coarse\)\s*\{\s*\.pointer-coarse\\:h-11\s*\{\s*height:\s*calc\(var\(--space-1\)\s*\*\s*11\)\s*;/
  );
  assert.match(
    utilities,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/
  );
  assert.match(css, /@property --tw-shadow\s*\{[^}]*initial-value:\s*0 0 #0000/);
  // Scan the real static CVA calls as well: every production part class must ship, not just a sample.
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/atoms/slider/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let parts = 0;
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      const base = node.arguments[0];
      assert.ok(base && ts.isStringLiteral(base), 'Slider CVA bases must be static strings');
      parts++;
      for (const name of base.text.split(/\s+/).filter((name) => name !== 'eg-slider')) {
        const selector = `.${name.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`;
        assert.ok(utilities.includes(selector), `Missing Slider CVA utility ${name}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(parts, 4, 'Root, track, range and thumb must all be scanned');
  // D11 no stylesheet: the marker carries no rule of its own.
  assert.doesNotMatch(css, /\.eg-slider[^{]*\{/, 'Slider has no stylesheet: its marker carries no rule');
});

test('Popover ships every static CVA utility, Radix bounds and Surface composition without a stylesheet', async () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/molecules/popover/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let parts = 0;
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      const base = node.arguments[0];
      assert.ok(ts.isArrayLiteralExpression(base), 'Popover CVA bases are static string arrays');
      parts++;
      for (const item of base.elements) {
        assert.ok(ts.isStringLiteral(item));
        for (const name of item.text.split(/\s+/).filter((name) => name !== 'eg-popover')) {
          const selector = `.${name.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`;
          assert.ok(utilities.includes(selector), `Missing Popover CVA utility ${name}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(parts, 2);
  assert.match(utilities, /width:\s*calc\(var\(--space-24\)\s*\*\s*4\)/);
  assert.match(utilities, /max-width:\s*var\(--radix-popover-content-available-width\)/);
  assert.match(utilities, /max-height:\s*var\(--radix-popover-content-available-height\)/);
  assert.match(utilities, /outline-color:\s*var\(--color-focus-ring[,)]/);
  assert.doesNotMatch(css, /\.eg-popover\s*[,{]/);
  const exported = await import(artifact('ui', ui.exports['.'].import));
  for (const name of [
    'usePopover',
    'usePopoverContent',
    'PopoverModalityContext',
    'popoverButtonVariants',
    'popoverContentVariants',
    'UserMenu'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} is not public`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(
    createElement(exported.Popover, {
      children: [
        createElement(exported.PopoverTrigger, { key: 'trigger', children: 'Display settings' }),
        createElement(exported.PopoverContent, { key: 'content', label: 'Display settings', children: 'Details' })
      ]
    })
  );
  assert.match(html, /<button[^>]*type="button"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, />Display settings<\/button>/);
  assert.doesNotMatch(html, /role="dialog"|Details|eg-popover/);
});

test('Carousel ships static layout, snap, drag, focus and token geometry without a stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  for (const selector of [
    '.basis-full',
    '.snap-x',
    '.snap-mandatory',
    '.snap-center',
    '.scroll-auto',
    String.raw`.group-data-\[state\=dragging\]\:snap-none`,
    String.raw`.group-data-\[state\=dragging\]\:cursor-grabbing`,
    String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`,
    String.raw`.max-w-\[calc\(var\(--space-20\)\*4\)\]`
  ]) {
    assert.ok(css.includes(selector), `Missing Carousel utility ${selector}`);
  }
  assert.match(cssBlock(css, /\.gap-7\s*\{/), /gap:\s*var\(--space-7[,)]/);
  assert.doesNotMatch(css, /\.eg-carousel[^{]*\{/);
  assert.equal(existsSync(resolve(root, 'packages/ui/src/molecules/carousel/carousel.css')), false);
});

test('Carousel public exports preserve deterministic named groups and composed atoms in SSR', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(
    createElement(exported.Carousel, {
      label: 'Highlights',
      items: [
        { value: 'alpha', label: 'Alpha', children: 'First information' },
        { value: 'beta', label: 'Beta', children: 'Second information' }
      ]
    })
  );
  assert.match(html, /eg-carousel/);
  assert.match(html, /aria-roledescription="carousel"/);
  assert.match(html, /aria-label="1 of 2: Alpha"/);
  assert.match(html, /aria-label="2 of 2: Beta"/);
  assert.match(html, /eg-icon-btn/);
  assert.match(html, /eg-progress/);
  assert.match(html.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ''), /01 \/ 02/);
  assert.equal((html.match(/tabindex="0"/g) ?? []).length, 1);
  for (const name of ['useCarousel', 'carouselVariants', 'defaultCarouselMessages']) {
    assert.equal(Object.hasOwn(exported, name), false, `${name} remains internal`);
  }
});

test('FieldMessage public build preserves independent tone, glyph and announcement semantics', async () => {
  const { FieldMessage, Field, Input } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  assert.equal(renderToString(createElement(FieldMessage, { children: '', tone: 'error', role: 'alert' })), '');
  for (const [tone, color, hasIcon] of [
    ['description', 'text-fg-muted', false],
    ['info', 'text-status-info', true],
    ['warning', 'text-status-warning', true],
    ['success', 'text-status-success', true],
    ['error', 'text-status-danger', true]
  ]) {
    const dom = new JSDOM(
      renderToString(createElement(FieldMessage, { children: 'Readable guidance', tone, id: 'guidance' }))
    );
    try {
      const root = dom.window.document.getElementById('guidance');
      assert.equal(root.tagName, 'P');
      assert.ok(root.classList.contains('eg-field-message') && root.classList.contains(color));
      assert.equal(root.textContent, 'Readable guidance');
      assert.equal(root.querySelector('svg') !== null, hasIcon);
      if (hasIcon) {
        assert.equal(root.querySelector('svg').getAttribute('aria-hidden'), 'true');
      }
      assert.equal(root.getAttribute('role'), null);
      assert.equal(root.getAttribute('aria-live'), null);
    } finally {
      dom.window.close();
    }
  }
  for (const hintTone of ['description', 'info', 'warning', 'success']) {
    const dom = new JSDOM(
      renderToString(
        createElement(Field, { label: 'Name', hint: 'Helpful guidance', hintTone, children: createElement(Input) })
      )
    );
    try {
      const control = dom.window.document.querySelector('input');
      const message = dom.window.document.getElementById(control.getAttribute('aria-describedby'));
      assert.equal(message.textContent, 'Helpful guidance');
      assert.equal(control.getAttribute('aria-invalid'), null);
      assert.equal(dom.window.document.querySelector('.eg-field').getAttribute('data-state'), null);
    } finally {
      dom.window.close();
    }
  }
});

test('Indicator ships physical corners, compact Material and no utility-layer marker engine', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  for (const selector of [
    '.-top-1',
    '.-right-1',
    '.-bottom-1',
    '.-left-1',
    '.size-2',
    String.raw`.size-2\.5`,
    String.raw`.min-w-4\.5`,
    String.raw`.min-h-5\.5`,
    '.pointer-events-none',
    '.select-none',
    '.outline-bg-surface',
    String.raw`.outline-\[length\:var\(--focus-width\)\]`,
    String.raw`.shadow-\[var\(--shadow-edge\)\,var\(--shadow-elev-1\)\]`
  ]) {
    assert.ok(utilities.includes(selector), 'Missing Indicator utility ' + selector);
  }
  for (const token of [
    '--color-status-info',
    '--color-status-success',
    '--color-status-warning',
    '--color-status-danger',
    '--gradient-sheen',
    '--focus-width'
  ]) {
    assert.ok(utilities.includes('var(' + token), 'Missing Indicator token reference ' + token);
  }
  assert.doesNotMatch(utilities, /\.eg-indicator[^{}]*\{/);
  assert.equal(existsSync(resolve(root, 'packages/ui/src/atoms/indicator/indicator.css')), false);
});
test('Indicator package preserves a passive wrapper and suppresses only invalid-count markers in SSR', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { JSDOM } = await import('jsdom');
  assert.equal(typeof exported.Indicator, 'function');
  for (const name of [
    'useIndicator',
    'indicatorRootVariants',
    'indicatorPositionVariants',
    'indicatorMarkerGeometryVariants',
    'indicatorGlyphVariants',
    'indicatorMarkerPaintVariants'
  ]) {
    assert.equal(Object.hasOwn(exported, name), false, name + ' is private');
  }
  for (const [count, expected] of [
    [100, '99+'],
    [0, null],
    [NaN, null]
  ]) {
    const dom = new JSDOM(
      renderToString(
        createElement(exported.Indicator, {
          variant: 'count',
          count,
          position: 'bottom-left',
          children: createElement('button', { type: 'button', children: 'Inbox, actual total supplied by consumer' })
        })
      )
    );
    try {
      const wrapper = dom.window.document.querySelector('.eg-indicator');
      assert.ok(wrapper);
      assert.equal(wrapper.firstElementChild.tagName, 'BUTTON');
      for (const attr of ['role', 'tabindex', 'aria-label', 'aria-live']) {
        assert.equal(wrapper.hasAttribute(attr), false);
      }
      const marker = wrapper.querySelector(':scope > span');
      if (expected === null) {
        assert.equal(marker, null);
      } else {
        assert.equal(marker.textContent, expected);
        assert.equal(marker.getAttribute('aria-hidden'), 'true');
        assert.ok(marker.classList.contains('-bottom-1') && marker.classList.contains('-left-1'));
      }
    } finally {
      dom.window.close();
    }
  }
});
