import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { renderSystemMd } from '../src/render-system-md.mjs';

const artifact = {
  name: 'Example',
  schemaVersion: '1',
  packages: [{ name: '@egdev/ui', version: '1' }],
  tokens: [
    { name: '--color-example', value: '#123456', group: 'root' },
    { name: '--other', value: '2px', group: 'root' }
  ],
  materialRecipes: [{ id: 'Example recipe', semantics: 'Example semantics', tokens: ['--color-example'] }],
  catalog: [
    { name: 'Button', package: '@egdev/ui', available: true },
    { name: 'Missing', available: false }
  ],
  components: [{ name: 'Button', package: '@egdev/ui', source: 'button.ts', props: [] }],
  propNaming: [{ id: 'example', name: 'label', status: 'approved', components: ['Button'] }],
  thirdParty: 'NEVER_RENDER'
};

test('composition guide leads and prioritizes catalog levels with explicit proposals', () => {
  const copy = structuredClone(artifact);
  copy.catalog = [
    { name: 'Atom', package: '@egdev/ui', level: 'atom', available: true },
    { name: 'Molecule', package: '@egdev/ui', level: 'molecule', available: true },
    { name: 'Organism', package: '@egdev/ui', level: 'organism', available: true },
    { name: 'Template', package: '@egdev/ui', level: 'template', available: true }
  ];
  copy.components = copy.catalog.map(({ name, package: pkg }) => ({
    name,
    package: pkg,
    source: 'source.tsx',
    props: [],
    composedOf: name === 'Organism' ? [{ name: 'Molecule', source: 'source.tsx' }] : []
  }));
  const text = renderSystemMd(copy);
  assert.ok(text.startsWith('## Composition guide\n'));
  assert.match(text, /organism[\s\S]*molecule[\s\S]*propose.*organism/i);
  assert.match(text, /atom[\s\S]*repeat/i);
  assert.match(text, /data-proposal/);
  assert.match(text, /docs\/CATALOGACION\.md/);
  assert.ok(text.indexOf('### Template') < text.indexOf('### Organism'));
  assert.ok(text.indexOf('### Organism') < text.indexOf('### Molecule'));
  assert.ok(text.indexOf('### Molecule') < text.indexOf('### Atom'));
  assert.match(text, /Composes:.*Molecule.*source\.tsx/);
});

test('renders source-derived typography roles and supports older artifacts', () => {
  const copy = structuredClone(artifact);
  copy.typographyRoles = [
    {
      name: 'Heading section',
      source: 'text.ts',
      family: '--font-display',
      size: '--text-title-section',
      lineHeight: '--text-title-section--line-height',
      weight: '--text-title-section--font-weight',
      tracking: '--text-title-section--letter-spacing'
    },
    {
      name: 'Body',
      source: 'body.ts',
      family: '--font-sans',
      size: null,
      lineHeight: null,
      weight: null,
      tracking: null
    }
  ];
  const text = renderSystemMd(copy);
  assert.match(text, /Composition guide[\s\S]*Typography roles/);
  assert.match(text, /Heading section.*--font-display.*--text-title-section.*text\.ts/);
  assert.match(text, /Body.*--font-sans.*unresolved.*body\.ts/);
  assert.match(renderSystemMd(artifact), /## Typography roles\n\nEmpty\./);
});

test('renders sorted source-derived compound parts under their parent', () => {
  const copy = structuredClone(artifact);
  copy.components[0].parts = [
    { name: 'ButtonAction', description: 'An action', children: 'One control', source: 'action.tsx' }
  ];
  const text = renderSystemMd(copy);
  assert.match(text, /ButtonAction.*An action.*One control.*action\.tsx/);
  assert.doesNotMatch(renderSystemMd(artifact), /ButtonAction/);
});

test('renders deterministic sections and artifact facts only', () => {
  const text = renderSystemMd(artifact);
  assert.equal(text, renderSystemMd(artifact));
  assert.ok(text.endsWith('\n'));
  let position = -1;
  for (const name of [
    'Header',
    'Colours',
    'Typography',
    'Spacing',
    'Radius',
    'Shadows and effects',
    'Material rules',
    'Components',
    'Usage rules',
    'Other tokens'
  ]) {
    const next = text.indexOf(`## ${name}\n`);
    assert.ok(next > position, name);
    position = next;
  }
  for (const value of [
    '--color-example',
    '#123456',
    '--other',
    'Example recipe',
    'Button',
    'Missing',
    'button.ts',
    'label'
  ]) {
    assert.ok(text.includes(value), value);
  }
  assert.ok(!text.includes('NEVER_RENDER'));
  assert.match(renderSystemMd({}), /## Typography\n\nEmpty\./);
});

test('renders source-backed layout facts inside anatomy and preserves empty legacy artifacts', () => {
  const copy = structuredClone(artifact);
  copy.components[0].layout = [{ source: 'component.tsx', expression: 'slots: [header, body]' }];
  assert.match(renderSystemMd(copy), /Visual anatomy[\s\S]*slots: \[header, body\][\s\S]*component\.tsx/);
  assert.match(renderSystemMd(artifact), /No statically extracted anatomy/);
});

test('generated WebTemplate and WebSection show extracted anatomy', () => {
  const text = readFileSync(new URL('../system.md', import.meta.url), 'utf8');
  for (const name of ['WebTemplate', 'WebSection']) {
    const section = text.split(`### ${name}\n`)[1].split('\n### ')[0];
    assert.match(section, /Visual anatomy[\s\S]*Layout source/);
    assert.doesNotMatch(section, /No statically extracted anatomy/);
  }
});

test('renders anatomy branches, unresolved utilities and Surface use from artifact', () => {
  const copy = structuredClone(artifact);
  copy.components[0].anatomy = [
    {
      name: 'buttonVariants',
      base: [0, 2],
      variants: { size: { sm: [1] } },
      compounds: []
    }
  ];
  copy.anatomyUtilities = [
    { className: 'rounded-md', tokens: ['--radius-md'], unresolved: false },
    { className: 'px-mystery', tokens: [], unresolved: true },
    { className: 'shadow-mixed', tokens: ['--shadow-edge'], unresolved: true }
  ];
  copy.components[0].surfaceUsage = [{ source: 'button.ts', arguments: "{ tone: 'well' }" }];
  copy.components.push({
    name: 'Uncatalogued',
    package: '@egdev/ui',
    source: 'other.ts',
    props: [],
    anatomy: copy.components[0].anatomy
  });
  const text = renderSystemMd(copy);
  assert.match(text, /Visual anatomy/);
  assert.match(text, /rounded-md.*--radius-md/);
  assert.match(text, /size=sm.*px-mystery.*unresolved/);
  assert.match(text, /shadow-mixed.*--shadow-edge.*unresolved/);
  assert.match(text, /### Uncatalogued[\s\S]*Visual anatomy[\s\S]*rounded-md/);
  assert.match(text, /surfaceVariants.*tone: 'well'/);
});

test('each mapped token appears in the correct section and unknown recipe references are not invented', () => {
  const copy = structuredClone(artifact);
  copy.tokens.push(
    ...[
      '--font-a',
      '--text-a',
      '--leading-a',
      '--tracking-a',
      '--spacing-a',
      '--radius-a',
      '--shadow-a',
      '--gradient-a',
      '--blur-a',
      '--ease-a',
      '--duration-a'
    ].map((name) => ({ name, value: '1px', group: 'test' }))
  );
  copy.materialRecipes[0].tokens.push('--not-in-artifact');
  const text = renderSystemMd(copy);
  const sections = Object.fromEntries(
    text
      .split(/^## /m)
      .slice(1)
      .map((s) => [s.slice(0, s.indexOf('\n')), s])
  );
  for (const [section, names] of [
    ['Colours', ['--color-example']],
    ['Typography', ['--font-a', '--text-a', '--leading-a', '--tracking-a']],
    ['Spacing', ['--spacing-a']],
    ['Radius', ['--radius-a']],
    ['Shadows and effects', ['--shadow-a', '--gradient-a', '--blur-a', '--ease-a', '--duration-a']],
    ['Other tokens', ['--other']]
  ]) {
    for (const name of names) {
      assert.ok(sections[section].includes(name), `${section}: ${name}`);
    }
  }
  for (const section of [
    'Typography',
    'Spacing',
    'Radius',
    'Shadows and effects',
    'Material rules',
    'Components',
    'Usage rules',
    'Other tokens'
  ]) {
    assert.match(renderSystemMd({}), new RegExp(`## ${section}\\n\\nEmpty\\.`));
  }
  assert.ok(!text.includes('--not-in-artifact'));
});
