import assert from 'node:assert/strict';
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
    const next = text.indexOf(`## ${name}`);
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
