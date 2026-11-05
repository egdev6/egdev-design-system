import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  assertContract,
  docsPageId,
  enumeratePublicComponents,
  normalizeComponentName,
  parseDocsList,
  parseMdxTitle,
  readExceptions,
  readMdxDocs,
  readStoryMeta,
  readStoryMetas,
  reconcile,
  slugifyTitle,
  validateExceptions
} from './storybook-mcp-contract.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = (name) => readFileSync(new URL(`./fixtures/storybook-mcp/${name}`, import.meta.url), 'utf8');

const baseStories = () => [
  {
    file: 'packages/ui/src/atoms/gauge/Gauge.stories.tsx',
    title: 'Atoms/Gauge',
    id: 'atoms-gauge',
    component: 'Gauge',
    subcomponents: []
  },
  {
    file: 'packages/ui/src/atoms/icon-button/IconButton.stories.tsx',
    title: 'Atoms/IconButton',
    id: 'atoms-iconbutton',
    component: 'IconButton',
    subcomponents: []
  },
  {
    file: 'packages/ui/src/molecules/table/Table.stories.tsx',
    title: 'Molecules/Table',
    id: 'molecules-table',
    component: 'Table',
    subcomponents: []
  },
  {
    file: 'packages/ui/src/recipes/scene-recipes.stories.tsx',
    title: 'Recipes/Scene recipes',
    id: 'recipes-scene-recipes',
    component: undefined,
    subcomponents: []
  }
];

const baseDocs = () => [
  { file: './docs/storybook/welcome.mdx', title: 'Welcome', id: 'welcome--docs' },
  {
    file: './docs/storybook/scene-recipes.mdx',
    title: 'Foundations/Scene recipes',
    id: 'foundations-scene-recipes--docs'
  }
];

const baseExceptions = () => ({
  manifestOnly: [{ id: 'recipes-scene-recipes', name: 'Scenerecipes', reason: 'component-less recipe story' }],
  undocumented: [{ name: 'Ghost', reason: 'exported helper part without a story component' }]
});

const baseInput = (overrides = {}) => ({
  exports: ['Gauge', 'IconButton', 'Table', 'Ghost'],
  stories: baseStories(),
  docs: baseDocs(),
  exceptions: baseExceptions(),
  manifest: parseDocsList(fixture('docs-list.md')),
  index: JSON.parse(fixture('index.json')),
  ...overrides
});

const problemsOf = (overrides) => reconcile(baseInput(overrides));

test('component ids are lowercased, dash-normalised story title slugs', () => {
  assert.equal(slugifyTitle('Foundations/Scene recipes'), 'foundations-scene-recipes');
  assert.equal(slugifyTitle('Atoms/Isotipo3D'), 'atoms-isotipo3d');
  assert.equal(slugifyTitle('Molecules/AlertDialog'), 'molecules-alertdialog');
  assert.equal(slugifyTitle('  Web  Section  '), 'web-section');
  assert.equal(slugifyTitle('Welcome'), 'welcome');
  assert.equal(docsPageId('Foundations/Scene recipes'), 'foundations-scene-recipes--docs');
});

test('generic parameters are stripped before names are compared', () => {
  assert.equal(normalizeComponentName('Table<Row>'), 'Table');
  assert.equal(normalizeComponentName('Table<Row<string>>'), 'Table');
  assert.equal(normalizeComponentName('Gauge'), 'Gauge');
});

test('docs-list markdown parses into components, their stories and the docs section', () => {
  const { components, docs } = parseDocsList(fixture('docs-list.md'));
  assert.deepEqual(
    components.map(({ name, id, stories }) => [name, id, stories.map((story) => story.id)]),
    [
      ['Gauge', 'atoms-gauge', ['atoms-gauge--default', 'atoms-gauge--value-limits']],
      ['IconButton', 'atoms-iconbutton', ['atoms-iconbutton--default']],
      ['Table<Row>', 'molecules-table', ['molecules-table--default']],
      ['Scenerecipes', 'recipes-scene-recipes', ['recipes-scene-recipes--about-scene']]
    ]
  );
  assert.deepEqual(docs, [
    { name: 'Welcome', id: 'welcome--docs' },
    { name: 'Foundations/Scene recipes', id: 'foundations-scene-recipes--docs' }
  ]);
});

test('story metadata is read from the meta object, including generics and subcomponents', () => {
  assert.deepEqual(
    readStoryMeta(
      'packages/ui/src/molecules/table/Table.stories.tsx',
      "const meta = {\n  title: 'Molecules/Table',\n  component: Table<Row>,\n  tags: ['autodocs']\n} satisfies Meta;"
    ),
    {
      file: 'packages/ui/src/molecules/table/Table.stories.tsx',
      title: 'Molecules/Table',
      id: 'molecules-table',
      component: 'Table',
      subcomponents: []
    }
  );
  assert.deepEqual(
    readStoryMeta(
      'packages/ui/src/molecules/popover/Popover.stories.tsx',
      "const meta = {\n  title: 'Molecules/Popover',\n  component: Popover,\n  subcomponents: { popoverTrigger: PopoverTrigger, popoverContent: PopoverContent }\n};"
    ),
    {
      file: 'packages/ui/src/molecules/popover/Popover.stories.tsx',
      title: 'Molecules/Popover',
      id: 'molecules-popover',
      component: 'Popover',
      subcomponents: ['PopoverTrigger', 'PopoverContent']
    }
  );
  assert.equal(
    readStoryMeta(
      'packages/ui/src/recipes/scene-recipes.stories.tsx',
      "const meta = {\n  title: 'Recipes/Scene recipes'\n} satisfies Meta;"
    ).component,
    undefined
  );
});

test('docs section ids come from MDX Meta titles', () => {
  assert.equal(parseMdxTitle('<Meta title="Foundations/Scene recipes" />'), 'Foundations/Scene recipes');
  assert.equal(parseMdxTitle("<Meta title='Welcome' />"), 'Welcome');
  assert.equal(parseMdxTitle('# No meta here'), undefined);
});

test('the exception registry requires a reviewed reason for every entry', () => {
  assert.deepEqual(validateExceptions({ manifestOnly: [], undocumented: [] }), { manifestOnly: [], undocumented: [] });
  assert.throws(() => validateExceptions({ undocumented: [{ name: 'Ghost' }] }), /reason/);
  assert.throws(() => validateExceptions({ undocumented: [{ reason: 'no name' }] }), /name/);
  assert.throws(() => validateExceptions({ manifestOnly: [{ reason: 'no id' }] }), /id/);
  assert.throws(() => validateExceptions({ undocumented: [{ name: 'Ghost', reason: '   ' }] }), /reason/);
  assert.throws(() => validateExceptions({ manifestOnly: {}, undocumented: [] }), /manifestOnly/);
});

test('the fixture manifest reconciles with the fixture exports, stories and docs', () => {
  assert.deepEqual(problemsOf(), []);
  assert.doesNotThrow(() => assertContract(baseInput()));
});

test('declared public subcomponents are documented only through their listed parent', () => {
  const stories = baseStories();
  stories[0].subcomponents = ['GaugePart'];
  const exports = ['Gauge', 'GaugePart', 'IconButton', 'Table', 'Ghost'];
  assert.deepEqual(problemsOf({ stories, exports }), []);
  const manifest = parseDocsList(fixture('docs-list.md'));
  assert.deepEqual(problemsOf({ stories, exports, manifest }), []);
  manifest.components = manifest.components.filter(({ id }) => id !== 'atoms-gauge');
  assert.ok(problemsOf({ stories, exports, manifest }).some((problem) => /GaugePart/.test(problem)));
  assert.ok(
    problemsOf({ stories, exports: exports.filter((name) => name !== 'GaugePart') }).some((problem) =>
      /GaugePart/.test(problem)
    )
  );
  const exceptions = baseExceptions();
  exceptions.undocumented.push({ name: 'GaugePart', reason: 'stale' });
  assert.ok(
    problemsOf({ stories, exports, exceptions }).some(
      (problem) => /GaugePart/.test(problem) && /document/i.test(problem)
    )
  );
});

test('ListItem declares and describes every exported composition part on its parent page', () => {
  const storyPath = 'packages/ui/src/molecules/list-item/ListItem.stories.tsx';
  const source = readFileSync(join(root, storyPath), 'utf8');
  const meta = readStoryMeta(storyPath, source);
  const names = enumeratePublicComponents(root).filter((name) => name.startsWith('ListItem') && name !== 'ListItem');
  assert.deepEqual([...meta.subcomponents].sort(), names);
  for (const name of names) {
    assert.ok(source.includes(`* - ${name}: `), `${name} needs a description`);
  }
  assert.match(source, /export const Anatomy: Story/);
});

test('a documented export removed from the barrels fails by component name', () => {
  const problems = problemsOf({ exports: ['IconButton', 'Table', 'Ghost'] });
  assert.ok(
    problems.some((problem) => /Gauge/.test(problem)),
    `A missing documented export must be reported by name:\n${problems.join('\n')}`
  );
});

test('a public export without a story or registry entry fails by name', () => {
  const problems = problemsOf({ exports: ['Gauge', 'IconButton', 'Table', 'Ghost', 'FreshExport'] });
  assert.ok(
    problems.some((problem) => /FreshExport/.test(problem)),
    `An unregistered undocumented export must be reported by name:\n${problems.join('\n')}`
  );
});

test('a component without a story file fails by id', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.components.push({
    name: 'Widget',
    id: 'atoms-widget',
    stories: [{ name: 'Default', id: 'atoms-widget--default' }]
  });
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /atoms-widget/.test(problem)),
    `An unexpected component must be reported by id:\n${problems.join('\n')}`
  );
});

test('a component listed under the wrong name fails with both names', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.components.find(({ id }) => id === 'molecules-table').name = 'DataTable<Row>';
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /molecules-table/.test(problem) && /DataTable/.test(problem) && /Table/.test(problem)),
    `A wrong display name must be reported with both names:\n${problems.join('\n')}`
  );
});

test('a component-less story is only accepted through the manifest-only registry', () => {
  const problems = problemsOf({ exceptions: { ...baseExceptions(), manifestOnly: [] } });
  assert.ok(
    problems.some((problem) => /recipes-scene-recipes/.test(problem)),
    `An unregistered component-less story must be reported:\n${problems.join('\n')}`
  );
});

test('a missing docs page fails by docs id', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.docs = manifest.docs.filter(({ id }) => id !== 'welcome--docs');
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /welcome--docs/.test(problem)),
    `A missing docs page must be reported by id:\n${problems.join('\n')}`
  );
});

test('an extra docs page fails by docs id', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.docs.push({ name: 'Unknown', id: 'unknown--docs' });
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /unknown--docs/.test(problem)),
    `A docs page without MDX source must be reported by id:\n${problems.join('\n')}`
  );
});

test('a docs page listed under the wrong title fails', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.docs.find(({ id }) => id === 'welcome--docs').name = 'Introduction';
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /welcome--docs/.test(problem) && /Introduction/.test(problem)),
    `A wrong docs title must be reported:\n${problems.join('\n')}`
  );
});

test('an advertised story id absent from the index fails by id', () => {
  const index = JSON.parse(fixture('index.json'));
  delete index.entries['atoms-gauge--value-limits'];
  const problems = problemsOf({ index });
  assert.ok(
    problems.some((problem) => /atoms-gauge--value-limits/.test(problem)),
    `A story id missing from the index must be reported:\n${problems.join('\n')}`
  );
});

test('an index entry that is not a story fails by id', () => {
  const index = JSON.parse(fixture('index.json'));
  index.entries['atoms-gauge--value-limits'].type = 'docs';
  const problems = problemsOf({ index });
  assert.ok(
    problems.some((problem) => /atoms-gauge--value-limits/.test(problem) && /story/.test(problem)),
    `A non-story index entry must be reported:\n${problems.join('\n')}`
  );
});

test('a story id listed under another component fails', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.components
    .find(({ id }) => id === 'atoms-gauge')
    .stories.push({ name: 'Borrowed', id: 'atoms-iconbutton--default' });
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /atoms-iconbutton--default/.test(problem) && /atoms-gauge/.test(problem)),
    `A story id borrowed from another component must be reported:\n${problems.join('\n')}`
  );
});

test('a component that advertises no story ids fails', () => {
  const manifest = parseDocsList(fixture('docs-list.md'));
  manifest.components.find(({ id }) => id === 'molecules-table').stories = [];
  const problems = problemsOf({ manifest });
  assert.ok(
    problems.some((problem) => /molecules-table/.test(problem) && /story/.test(problem)),
    `A component without advertised stories must be reported:\n${problems.join('\n')}`
  );
});

test('stale registry entries fail by name', () => {
  const problems = problemsOf({
    exceptions: {
      manifestOnly: baseExceptions().manifestOnly,
      undocumented: [
        { name: 'Ghost', reason: 'exported helper part' },
        { name: 'Gauge', reason: 'now documented by a story' },
        { name: 'Deleted', reason: 'no longer exported' }
      ]
    }
  });
  assert.ok(
    problems.some((problem) => /Gauge/.test(problem) && /document/i.test(problem)),
    `A now-documented export must make its registry entry stale:\n${problems.join('\n')}`
  );
  assert.ok(
    problems.some((problem) => /Deleted/.test(problem) && /export/i.test(problem)),
    `A registry entry for a vanished export must be reported:\n${problems.join('\n')}`
  );
});

test('a manifest-only entry whose story declares a component fails', () => {
  const problems = problemsOf({
    exceptions: {
      manifestOnly: [
        ...baseExceptions().manifestOnly,
        { id: 'atoms-gauge', name: 'Gauge', reason: 'wrongly registered as component-less' }
      ],
      undocumented: baseExceptions().undocumented
    }
  });
  assert.ok(
    problems.some((problem) => /atoms-gauge/.test(problem) && /component/.test(problem)),
    `A manifest-only entry that is not component-less must be reported:\n${problems.join('\n')}`
  );
});

test('assertContract reports every violation in one error', () => {
  assert.throws(
    () => assertContract(baseInput({ exports: ['IconButton', 'Table', 'Ghost', 'FreshExport'] })),
    (error) => /Storybook MCP contract violations/.test(error.message) && /FreshExport/.test(error.message)
  );
});

test('the real repository sources reconcile offline without a server', () => {
  const exports = enumeratePublicComponents(root);
  const stories = readStoryMetas(root);
  const docs = readMdxDocs(root);
  const exceptions = readExceptions(join(root, 'scripts/storybook-mcp-exceptions.json'));

  assert.deepEqual(reconcile({ exports, stories, docs, exceptions }), []);
  assert.ok(exports.length > 0 && stories.length > 0 && docs.length > 0);

  for (const removed of ['Gauge', 'Table', 'WebTemplate']) {
    const problems = reconcile({
      exports: exports.filter((name) => name !== removed),
      stories,
      docs,
      exceptions
    });
    assert.ok(
      problems.some((problem) => problem.includes(removed)),
      `Removing the documented export ${removed} must fail by name:\n${problems.join('\n')}`
    );
  }

  const added = reconcile({ exports: [...exports, 'BrandNewPart'], stories, docs, exceptions });
  assert.ok(
    added.some((problem) => /BrandNewPart/.test(problem)),
    `An unregistered new export must fail by name:\n${added.join('\n')}`
  );
});

test('every committed MDX guide has a unique Meta title and every story a unique slug', () => {
  const stories = readStoryMetas(root);
  const docs = readMdxDocs(root);
  assert.equal(new Set(stories.map(({ id }) => id)).size, stories.length);
  assert.equal(new Set(docs.map(({ id }) => id)).size, docs.length);
  const mdxFiles = listMdx(root);
  assert.deepEqual(
    docs.map(({ file }) => file.replace(/^\.\//, '')),
    mdxFiles,
    'Every *.mdx under docs/ must contribute a Meta title'
  );
});

function listMdx(directory) {
  const files = [];
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) {
        visit(child);
      } else if (entry.name.endsWith('.mdx')) {
        files.push(relative(directory, child).split(sep).join('/'));
      }
    }
  };
  visit(join(directory, 'docs'));
  return files.sort();
}
