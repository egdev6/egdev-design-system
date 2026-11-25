import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import docgen from 'react-docgen-typescript';
import ts from 'typescript';
import { renderSystemMd } from '../packages/system/src/render-system-md.mjs';
import { extractGroupedDeclarations } from '../packages/tokens/scripts/token-css.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

// Override only type-level JSDoc in memory; the generator's output is captured, never written.
function artifactWithTags(entries) {
  const files = new Map();
  for (const { path, alias, tags } of entries) {
    const text = files.get(path) ?? readFileSync(path, 'utf8');
    const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find((item) => ts.isTypeAliasDeclaration(item) && item.name.text === alias);
    const jsDoc = declaration?.jsDoc?.at(-1);
    assert.ok(jsDoc, `${path}: ${alias} must have type-level JSDoc`);
    const comment = ['/** Fixture type description.', ...tags.map((tag) => ` * ${tag}`), ' */'].join('\n');
    files.set(path, text.slice(0, jsDoc.getStart(source)) + comment + text.slice(jsDoc.getEnd()));
  }
  const loader = `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { resolve } from 'node:path';
    const read = fs.readFileSync;
    const write = fs.writeFileSync;
    const changes = new Map(Object.entries(${JSON.stringify(Object.fromEntries(files))}).map(([path, text]) => [resolve(path), text]));
    const target = resolve('packages/system/design-system.json');
    fs.readFileSync = function (path, options) {
      const value = read.call(this, path, options);
      const text = typeof path === 'string' && changes.get(resolve(path));
      return text === undefined || text === false ? value : typeof value === 'string' ? text : Buffer.from(text);
    };
    fs.writeFileSync = function (path, value, ...rest) {
      if (typeof path === 'string' && resolve(path) === target) { process.stdout.write(value); return; }
      return write.call(this, path, value, ...rest);
    };
    syncBuiltinESMExports();
  `;
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript;base64,${Buffer.from(loader).toString('base64')}`,
      'scripts/build-artifact.mjs',
      '--write'
    ],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
  return result;
}

const buttonFixture = { path: 'packages/ui/src/atoms/button/types.ts', alias: 'ButtonProps' };

test('Icon name remains a required enum without inventing a glyph-value list', () => {
  const artifact = read('packages/system/design-system.json');
  const icon = artifact.components.find(({ name }) => name === 'Icon');
  assert.ok(icon);
  const name = icon.props.find((prop) => prop.name === 'name');
  assert.ok(name);
  assert.equal(name.type, 'enum');
  assert.equal(name.required, true);
  assert.equal(name.default, null);
  assert.ok(!Object.hasOwn(name, 'values'));
  assert.ok(!artifact.types.some((type) => type.name === 'IconName'));
});

test('IconButton hit-area facts and composition spacing are source-derived without new public props', () => {
  const artifact = read('packages/system/design-system.json');
  const component = (name) => {
    const item = artifact.components.find((entry) => entry.name === name);
    assert.ok(item, name);
    return item;
  };
  const recipe = (name, recipeName) => {
    const item = component(name).variants.find((entry) => entry.name === recipeName);
    assert.ok(item, recipeName);
    return item.classes.join(' ');
  };
  const icon = component('IconButton');
  assert.deepEqual(icon.props.map(({ name }) => name).sort(), [
    'asChild',
    'children',
    'icon',
    'label',
    'size',
    'variant'
  ]);
  assert.match(icon.props.find(({ name }) => name === 'size').description, /one spacing token above the sum/);
  const root = recipe('IconButton', 'iconButtonVariants');
  assert.match(root, /after:size-14/);
  assert.match(root, /after:left-\[calc\(50%_-_var\(--space-14\)_\/_2\)\]/);
  assert.match(root, /\[\[data-icon-button-target=compact\]>&\]:after:content-none/);
  assert.doesNotMatch(root, /scale-94|ease-spring/);
  assert.doesNotMatch(recipe('ButtonGroup', 'buttonGroupVariants'), /\[&>\.eg-icon-btn\]/);
  assert.doesNotMatch(recipe('Tabs', 'tabsScrollAreaVariants'), /\[&>\.eg-icon-btn\]/);
  assert.match(recipe('ListItemActions', 'listItemPartVariants'), /eg-list-item__acts[^']*gap-5/);
  assert.match(recipe('Carousel', 'carouselControlsVariants'), /gap-3/);
  const gap = component('SocialLinks').props.find(({ name }) => name === 'gap');
  assert.equal(gap.default, '2');
  assert.match(gap.description, /gap-5 \(16px\).*gap-3 \(9\.6px\)/s);
});

test('classNameAllows publishes sorted unique CSS properties on roots and their own or shared parts', () => {
  const result = artifactWithTags([
    {
      ...buttonFixture,
      tags: [
        '@classNameAllows z-index width max-width width inline-size inset-inline-start grid-template-columns scroll-margin-top'
      ]
    },
    {
      path: 'packages/ui/src/molecules/collapsible/types.ts',
      alias: 'CollapsibleHeaderProps',
      tags: ['@classNameAllows min-width']
    },
    {
      path: 'packages/ui/src/molecules/list-item/types.ts',
      alias: 'ListItemPartProps',
      tags: ['@classNameAllows grid-template-columns']
    }
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  const { components } = JSON.parse(result.stdout);
  const component = (name) => components.find((item) => item.name === name);
  assert.deepEqual(component('Button').classNameAllows, [
    'grid-template-columns',
    'inline-size',
    'inset-inline-start',
    'max-width',
    'scroll-margin-top',
    'width',
    'z-index'
  ]);
  assert.deepEqual(component('CollapsibleHeader').classNameAllows, ['min-width']);
  for (const name of [
    'ListItemActions',
    'ListItemBody',
    'ListItemContent',
    'ListItemFooter',
    'ListItemLeading',
    'ListItemMedia',
    'ListItemMeta',
    'ListItemTrailing'
  ]) {
    assert.deepEqual(component(name).classNameAllows, ['grid-template-columns'], name);
  }
  assert.ok(!Object.hasOwn(component('ListItemTitle'), 'classNameAllows'));
  for (const item of components) {
    assert.ok(!JSON.stringify(item.props).includes('@classNameAllows'), item.name);
    assert.ok(!JSON.stringify(item.parts).includes('@classNameAllows'), item.name);
  }
});

test('classNameAllows is omitted when a props type has no tag', () => {
  const result = artifactWithTags([{ ...buttonFixture, tags: [] }]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.ok(
    !Object.hasOwn(
      JSON.parse(result.stdout).components.find(({ name }) => name === 'Button'),
      'classNameAllows'
    )
  );
});

for (const [label, tags, diagnostic] of [
  [
    'unknown property',
    ['@classNameAllows width definitely-not-a-property'],
    /Unknown CSS property.*definitely-not-a-property/
  ],
  ['non-lowercase property', ['@classNameAllows Width'], /Unknown CSS property.*Width/],
  ['empty tag', ['@classNameAllows'], /Empty @classNameAllows/],
  ['duplicate tags', ['@classNameAllows width', '@classNameAllows max-width'], /Duplicate @classNameAllows/]
]) {
  test(`classNameAllows rejects ${label} without writing`, () => {
    const result = artifactWithTags([{ ...buttonFixture, tags }]);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, diagnostic);
    assert.match(result.stderr, /ButtonProps/);
  });
}

test('classNameAllows publishes the complete SelectTile width and column contract', () => {
  const { components } = read('packages/system/design-system.json');
  assert.deepEqual(components.find(({ name }) => name === 'SelectTile').classNameAllows, [
    'grid-template-columns',
    'inline-size',
    'max-inline-size',
    'max-width',
    'min-inline-size',
    'min-width',
    'width'
  ]);
});

test('classNameAllows preserves the reviewed component and part inventory', () => {
  const { components } = read('packages/system/design-system.json');
  const widths = ['inline-size', 'max-inline-size', 'max-width', 'min-inline-size', 'min-width', 'width'];
  const widthComponents = [
    'ArticleFeature',
    'ArticleFeatureCover',
    'AttachmentField',
    'Button',
    'Carousel',
    'ChipGroup',
    'Collapsible',
    'CollapsibleHeader',
    'ColorSwatchGroup',
    'CommandPalette',
    'CommunityCard',
    'CommunityCardAction',
    'CommunityCardMark',
    'Dropzone',
    'Field',
    'Heading',
    'ListItem',
    'ListItemActions',
    'ListItemBody',
    'ListItemContent',
    'ListItemFooter',
    'ListItemLeading',
    'ListItemMedia',
    'ListItemMeta',
    'ListItemTrailing',
    'LiveBandField',
    'MeterRow',
    'NavList',
    'NotesBoard',
    'Notice',
    'NowCard',
    'NowCardBody',
    'NowCardDetail',
    'NowCardFooter',
    'NowStrip',
    'PageHeader',
    'ProgressBar',
    'ProjectCard',
    'ProjectCardCode',
    'ProjectCardFooter',
    'ProjectCardTags',
    'SearchTrigger',
    'SectionHeader',
    'SocialLinks',
    'Tabs',
    'TerminalCard',
    'Text',
    'Timeline',
    'TipCard'
  ];
  const expected = new Map(widthComponents.map((name) => [name, widths]));
  expected.set('SelectTile', ['grid-template-columns', ...widths]);
  expected.set('TopBar', ['z-index']);
  const tagged = components.filter((item) => Object.hasOwn(item, 'classNameAllows'));
  assert.deepEqual(
    tagged.map(({ name }) => name),
    [...expected.keys()].sort()
  );
  for (const { name, classNameAllows } of tagged) {
    assert.deepEqual(classNameAllows, expected.get(name), name);
  }
  for (const name of ['ListItemTitle', 'Menu', 'PopoverContent', 'Tooltip', 'Icon']) {
    assert.ok(
      !Object.hasOwn(
        components.find((item) => item.name === name),
        'classNameAllows'
      ),
      name
    );
  }
  assert.ok(!expected.get('ProgressBar').includes('position'));
});

test('Logo assets preserve both source variants and token-backed SVGs', () => {
  const artifact = read('packages/system/design-system.json');
  assert.deepEqual(
    artifact.assets.map(({ variant }) => variant),
    ['mark', 'wordmark']
  );
  for (const asset of artifact.assets) {
    assert.equal(asset.component, 'Logo');
    assert.ok(asset.sources.includes('packages/ui/src/atoms/logo/logo-artwork.ts'));
    const svg = gunzipSync(Buffer.from(asset.svgGzipBase64, 'base64')).toString('utf8');
    assert.match(svg, /^<svg\b/);
    assert.match(svg, /role="img" aria-label="egdev"/);
    assert.match(svg, /fill="var\(--logo-red\)"/);
    assert.ok(asset.tokens.includes('--logo-red-shade'));
    for (const token of asset.tokens) {
      assert.ok(artifact.tokens.some(({ name }) => name === token));
    }
  }
  assert.ok(artifact.assets.find(({ variant }) => variant === 'wordmark').tokens.includes('--color-primitive-white'));
});

test('--check detects Logo artwork drift without writing', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/logo-drift.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('composition recipes reference only exported components and reject drift', () => {
  const artifact = read('packages/system/design-system.json');
  const recipes = read('packages/system/src/composition-recipes.json');
  assert.deepEqual(artifact.compositionRecipes, recipes);
  const names = new Set(artifact.components.filter((item) => item.package === '@egdev/ui').map((item) => item.name));
  for (const recipe of recipes) {
    for (const name of recipe.components) {
      assert.ok(names.has(name), name);
    }
  }
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/recipe-drift.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Non-exported component: MissingRecipeComponent/);
});

test('artifact identifies the design system and its package version set', () => {
  const artifact = read('packages/system/design-system.json');
  assert.equal(artifact.name, 'egdev-design-system');
  assert.equal(artifact.schemaVersion, '1.0.0');
  assert.deepEqual(
    artifact.packages,
    ['effects', 'tokens', 'ui'].map((name) => {
      const manifest = read(`packages/${name}/package.json`);
      return { name: manifest.name, version: manifest.version };
    })
  );
});

test('artifact includes public component exports and their own props', () => {
  const artifact = read('packages/system/design-system.json');
  const gauge = artifact.components.find(({ name }) => name === 'Gauge');
  assert.ok(gauge, 'Gauge is a public export');
  assert.ok(
    gauge.props.some(({ name }) => name === 'value'),
    'Gauge documents its own value prop'
  );
});

test('compound parts expose source descriptions and child constraints', () => {
  const components = read('packages/system/design-system.json').components;
  const part = (parent, name) =>
    components.find((item) => item.name === parent).parts.find((item) => item.name === name);
  const topBar = components.find((item) => item.name === 'TopBar');
  assert.deepEqual(
    topBar.parts.map(({ name }) => name),
    ['TopBarBrand', 'TopBarEnd', 'TopBarMobileTrigger', 'TopBarSearchCompact', 'TopBarSearchFull', 'TopBarUserMenu']
  );
  assert.match(
    topBar.props.find(({ name }) => name === 'children').description,
    /direct TopBar parts.*one brand is required/i
  );
  assert.match(part('TopBar', 'TopBarUserMenu').description, /account control/i);
  assert.match(part('TopBar', 'TopBarUserMenu').children, /controls retain their own semantics/i);
  assert.match(part('TopBar', 'TopBarEnd').description, /trailing content.*both layouts/i);
  assert.match(part('TopBar', 'TopBarEnd').children, /arbitrary nodes/i);
  for (const [name, value] of [
    ['initialBackground', 'transparent'],
    ['contentWidth', 'content']
  ]) {
    const prop = topBar.props.find((item) => item.name === name);
    assert.ok(prop, name);
    assert.equal(prop.required, false);
    assert.equal(prop.default, value);
  }
  assert.match(part('ListItem', 'ListItemActions').description, /independent trailing controls/i);
  assert.match(part('TerminalCard', 'TerminalCardBar').children, /plain text/i);
});

test('WebTemplate composition is derived from used public source imports', () => {
  const template = read('packages/system/design-system.json').components.find(({ name }) => name === 'WebTemplate');
  assert.ok(template.composedOf.some(({ name, source }) => name === 'Button' && source.endsWith('/WebTemplate.tsx')));
});

test('--check detects a changed composition import without writing', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      './scripts/fixtures/design-system-artifact/composition-drift.mjs',
      'scripts/build-artifact.mjs',
      '--check'
    ],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('typography roles resolve representative source recipes to tokens', () => {
  const roles = read('packages/system/design-system.json').typographyRoles;
  const role = (name) => roles.find((item) => item.name === name);
  assert.equal(role('Heading compact').family, '--font-display');
  assert.equal(role('Heading compact').size, '--text-heading-small');
  assert.equal(role('Heading compact').lineHeight, '--text-heading-small--line-height');
  assert.equal(role('Heading compact').weight, '--text-heading-small--font-weight');
  assert.equal(role('Heading compact').tracking, '--text-heading-small--letter-spacing');
  assert.equal(role('Heading section').family, '--font-display');
  assert.equal(role('Heading section').size, '--text-title-section');
  assert.equal(role('Heading section').lineHeight, '--text-title-section--line-height');
  assert.equal(role('Heading section').weight, '--text-title-section--font-weight');
  assert.equal(role('Heading section').tracking, '--text-title-section--letter-spacing');
  assert.equal(role('SectionHeader lede').source, 'packages/ui/src/primitives/text/types.ts');
  assert.equal(role('SectionHeader lede').family, '--font-sans');
  assert.equal(role('SectionHeader lede').size, '--text-body-muted');
  assert.equal(role('SectionHeader lede').lineHeight, '--text-body-muted--line-height');
  assert.equal(role('SectionHeader lede').weight, '--text-body-muted--font-weight');
  assert.equal(role('Hero lede').size, '--text-body-large');
  assert.equal(role('Eyebrow').family, '--font-display');
  assert.equal(role('ProjectCard code').family, '--font-mono');
});

test('Text truncation is optional, defaults false and does not widen Heading or layout permissions', () => {
  const artifact = read('packages/system/design-system.json');
  const text = artifact.components.find(({ name }) => name === 'Text');
  const heading = artifact.components.find(({ name }) => name === 'Heading');
  assert.ok(text);
  assert.ok(heading);
  const prop = text.props.find(({ name }) => name === 'truncate');
  assert.ok(prop);
  assert.equal(prop.type, 'boolean');
  assert.equal(prop.required, false);
  assert.equal(prop.default, 'false');
  assert.ok(!heading.props.some(({ name }) => name === 'truncate'));
  const widths = ['inline-size', 'max-inline-size', 'max-width', 'min-inline-size', 'min-width', 'width'];
  assert.deepEqual(text.classNameAllows, widths);
  assert.deepEqual(heading.classNameAllows, widths);
  const naming = artifact.propNaming.find(({ id }) => id === 'single-line-text-truncation');
  assert.ok(naming);
  assert.equal(naming.name, 'truncate');
  assert.equal(naming.status, 'approved');
  assert.ok(naming.components.includes('Text'));
});

test('ProjectCard statusBadge is an optional source-derived slot with three private layout recipes', () => {
  const artifact = read('packages/system/design-system.json');
  const card = artifact.components.find(({ name }) => name === 'ProjectCard');
  assert.ok(card);
  const prop = card.props.find(({ name }) => name === 'statusBadge');
  assert.ok(prop);
  assert.equal(prop.type, 'ReactNode');
  assert.equal(prop.required, false);
  assert.equal(prop.default, null);
  assert.match(prop.description, /non-interactive status node/);
  assert.match(prop.description, /header row at the inline end/);
  assert.ok(!card.props.some(({ name }) => name === 'statusClassName'));
  for (const field of ['variants', 'anatomy']) {
    const names = card[field].map(({ name }) => name);
    for (const recipe of ['projectCardHeaderVariants', 'projectCardLeadVariants', 'projectCardBadgeVariants']) {
      assert.ok(names.includes(recipe), `${field} lists ${recipe}`);
    }
  }
  assert.deepEqual(
    card.parts.map(({ name }) => name),
    ['ProjectCardBackdrop', 'ProjectCardCode', 'ProjectCardFooter', 'ProjectCardMark', 'ProjectCardTags']
  );
  // The card never imports Badge: the consumer composes it, so no composition edge appears.
  assert.deepEqual(
    card.composedOf.map(({ name }) => name),
    ['Chip']
  );
  assert.deepEqual(card.classNameAllows, [
    'inline-size',
    'max-inline-size',
    'max-width',
    'min-inline-size',
    'min-width',
    'width'
  ]);
  const naming = artifact.propNaming.find(({ id }) => id === 'leading-status-badge');
  assert.ok(naming);
  assert.deepEqual(naming.components, ['NowCard', 'ProjectCard']);
});

test('Heading and Text expose only their own and shared recipes', () => {
  const artifact = read('packages/system/design-system.json');
  const heading = artifact.components.find(({ name }) => name === 'Heading');
  const text = artifact.components.find(({ name }) => name === 'Text');
  for (const field of ['variants', 'anatomy']) {
    assert.deepEqual(
      heading[field].map(({ name }) => name),
      ['accentVariants', 'headingVariants'],
      field
    );
    assert.deepEqual(
      text[field].map(({ name }) => name),
      ['accentVariants', 'textBodyVariants', 'textVariants'],
      field
    );
  }
  assert.ok(
    heading.anatomy.every(({ name, variants }) => name !== 'textBodyVariants' && !Object.hasOwn(variants, 'truncate'))
  );
  for (const name of ['textBodyVariants', 'textVariants']) {
    assert.ok(Object.hasOwn(text.anatomy.find((recipe) => recipe.name === name).variants, 'truncate'), name);
  }
  assert.ok(
    text.anatomy
      .find(({ name }) => name === 'textVariants')
      .compounds.some(({ conditions }) => conditions.variant === 'eyebrow' && conditions.truncate === 'true')
  );
});

test('AlertDialog placement and pending are attributed only to the affected public parts', () => {
  const artifact = read('packages/system/design-system.json');
  const root = artifact.components.find(({ name }) => name === 'AlertDialog');
  const content = artifact.components.find(({ name }) => name === 'AlertDialogContent');
  const dialog = artifact.components.find(({ name }) => name === 'Dialog');
  const dialogContent = artifact.components.find(({ name }) => name === 'DialogContent');
  const pending = root.props.find(({ name }) => name === 'pending');
  assert.ok(pending);
  assert.equal(pending.type, 'boolean');
  assert.equal(pending.required, false);
  assert.equal(pending.default, 'false');
  const dialogPending = dialog.props.find(({ name }) => name === 'pending');
  assert.ok(dialogPending);
  assert.equal(dialogPending.type, 'boolean');
  assert.equal(dialogPending.required, false);
  assert.equal(dialogPending.default, 'false');
  assert.ok(!root.props.some(({ name }) => name === 'container' || name === 'overlayScope'));
  assert.ok(!content.props.some(({ name }) => name === 'pending'));
  assert.ok(!dialogContent.props.some(({ name }) => name === 'pending'));
  for (const name of ['container', 'overlayScope']) {
    const prop = content.props.find((item) => item.name === name);
    assert.ok(prop, name);
    assert.equal(prop.required, false, name);
    assert.equal(prop.default, null, name);
  }
  for (const id of ['portal-container', 'dialog-overlay-scope']) {
    assert.ok(artifact.propNaming.find((entry) => entry.id === id).components.includes('AlertDialogContent'), id);
  }
  const naming = artifact.propNaming.find(({ id }) => id === 'modal-action-pending');
  assert.equal(naming.name, 'pending');
  assert.equal(naming.status, 'approved');
  assert.deepEqual(naming.components, ['AlertDialog', 'Dialog']);
});

test('compound components expose the recipes used by their individual hooks', () => {
  const { components } = read('packages/system/design-system.json');
  const names = (name, field) =>
    components.find((component) => component.name === name)[field].map((item) => item.name);
  const expected = [
    ['ListItem', ['listItemVariants']],
    ['ListItemActions', ['listItemPartVariants']],
    ['ListItemTitle', ['listItemPartVariants']],
    ['Collapsible', ['collapsibleVariants']],
    ['CollapsibleHeader', ['collapsibleActionsVariants', 'collapsibleHeaderVariants']],
    ['CollapsibleTrigger', ['collapsibleCaretVariants', 'collapsibleLabelVariants', 'collapsibleTriggerVariants']],
    ['CollapsibleContent', ['collapsibleContentVariants']],
    ['Dialog', []],
    ['DialogTrigger', []],
    ['DialogClose', ['dialogCloseVariants']],
    [
      'DialogContent',
      [
        'dialogBodyVariants',
        'dialogDescriptionVariants',
        'dialogDismissVariants',
        'dialogFootVariants',
        'dialogHeadVariants',
        'dialogHeaderActionsVariants',
        'dialogOverlayLayout',
        'dialogPanelVariants',
        'dialogScrimVariants',
        'dialogSheetBodyMinimumVariants',
        'dialogSheetClampTitleVariants',
        'dialogSheetFullVariants',
        'dialogSheetHeadVariants',
        'dialogSheetOverflowVariants',
        'dialogStatusVariants',
        'dialogTitleRowVariants',
        'dialogTitleVariants'
      ]
    ],
    ['AlertDialog', []],
    ['AlertDialogContent', ['alertDialogHeadVariants', 'alertDialogIconVariants', 'alertDialogTitleRowVariants']]
  ];
  for (const [name, recipes] of expected) {
    for (const field of ['variants', 'anatomy']) {
      assert.deepEqual(names(name, field), recipes, `${name} ${field}`);
    }
  }
});

test('Dialog sheet options and scoped naming are derived without changing sibling APIs', () => {
  const artifact = read('packages/system/design-system.json');
  const component = (name) => {
    const result = artifact.components.find((entry) => entry.name === name);
    assert.ok(result, name);
    return result;
  };
  const dialog = component('DialogContent');
  assert.deepEqual(
    dialog.props.map(({ name }) => name).sort(),
    [
      'actions',
      'actionsPlacement',
      'bodyPadding',
      'children',
      'container',
      'description',
      'dismissLabel',
      'headerLayout',
      'overlayScope',
      'size',
      'statusText',
      'title',
      'titleOverflow',
      'variant'
    ].sort()
  );
  for (const [name, value] of [
    ['actionsPlacement', 'footer'],
    ['titleOverflow', 'default']
  ]) {
    const prop = dialog.props.find((item) => item.name === name);
    assert.equal(prop.type, 'enum');
    assert.equal(prop.required, false);
    assert.equal(prop.default, value);
  }
  assert.match(dialog.props.find(({ name }) => name === 'size').description, /omitted sheet size remains capped/i);
  assert.equal(dialog.classNameAllows, undefined);
  for (const [id, name] of [
    ['dialog-title-overflow', 'titleOverflow'],
    ['dialog-action-placement', 'actionsPlacement']
  ]) {
    const entry = artifact.propNaming.find((item) => item.id === id);
    assert.equal(entry.name, name);
    assert.equal(entry.status, 'proposed');
    assert.deepEqual(entry.components, ['DialogContent']);
  }
  for (const sibling of ['AlertDialogContent', 'CommandPalette']) {
    assert.ok(!component(sibling).props.some(({ name }) => ['titleOverflow', 'actionsPlacement'].includes(name)));
  }
});

test('shared hooks attribute only the selected part and preserve public recipe exports', () => {
  const { components } = read('packages/system/design-system.json');
  const expected = [
    ['BlogGridFeature', ['blogGridFeatureVariants']],
    ['BlogGridRow', ['blogGridRowVariants']],
    ['LiveBandList', ['liveBandListVariants']],
    ['LiveBandRow', ['liveBandRowVariants']],
    ['PanelHeader', ['panelHeaderVariants']],
    ['PanelBody', ['panelBodyVariants']],
    ['PanelFooter', ['panelFooterVariants']],
    ['TopBarBrand', ['topBarBrandVariants']],
    ['TopBarSearchCompact', ['topBarCompactVariants']],
    ['TopBarMobileTrigger', ['topBarCompactVariants']],
    ['Surface', ['surfaceVariants']],
    ['surfaceVariants', ['surfaceVariants']],
    ['Button', ['buttonIconVariants', 'buttonVariants']]
  ];
  for (const [name, recipes] of expected) {
    const item = components.find((component) => component.name === name);
    for (const field of ['variants', 'anatomy']) {
      assert.deepEqual(
        item[field].map((recipe) => recipe.name),
        recipes,
        `${name} ${field}`
      );
    }
  }
});

test('object-backed recipes and exported recipe collections retain their anatomy', () => {
  const { components } = read('packages/system/design-system.json');
  const names = (name) => components.find((component) => component.name === name).anatomy.map((recipe) => recipe.name);
  const radio = [
    'radioGroupIndicatorVariants',
    'radioGroupItemVariants',
    'radioGroupLabelVariants',
    'radioGroupRootVariants',
    'radioGroupRowVariants'
  ];
  const shell = [
    'appShellBodyVariants',
    'appShellBottomVariants',
    'appShellMainVariants',
    'appShellRootVariants',
    'appShellSideVariants',
    'appShellSkipLinkVariants',
    'appShellSkipRowVariants'
  ];
  assert.deepEqual(names('RadioGroup'), radio);
  assert.deepEqual(names('radioGroupVariants'), radio);
  assert.deepEqual(names('AppShell'), shell);
  assert.deepEqual(names('appShellVariants'), shell);
  assert.deepEqual(names('SelectTile'), [
    'badge',
    'card',
    'check',
    'control',
    'fallback',
    'image',
    'label',
    'media',
    'meta',
    'root'
  ]);
  assert.deepEqual(names('ColorSwatchGroup'), [
    'badge',
    'customFrame',
    'customInput',
    'customLabel',
    'group',
    'item',
    'legend',
    'optionLabel',
    'output',
    'patch',
    'ring',
    'root',
    'row',
    'spectrum'
  ]);
});

test('recipe attribution follows aliased and newly called recipes without modifying the artifact', () => {
  const loader = `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { resolve } from 'node:path';
    const read = fs.readFileSync;
    const write = fs.writeFileSync;
    const hook = resolve('packages/ui/src/primitives/text/useHeading.ts');
    const artifact = resolve('packages/system/design-system.json');
    fs.readFileSync = function (path, options) {
      const value = read.call(this, path, options);
      if (typeof path !== 'string' || resolve(path) !== hook) return value;
      const changed = value.toString()
        .replace('headingVariants, textForegroundClasses', 'headingVariants as headingAlias, textForegroundClasses, textBodyVariants')
        .replace('headingVariants({ variant,', 'textBodyVariants(), headingAlias({ variant,');
      return typeof value === 'string' ? changed : Buffer.from(changed);
    };
    fs.writeFileSync = function (path, value, ...rest) {
      if (typeof path === 'string' && resolve(path) === artifact) { process.stdout.write(value); return; }
      return write.call(this, path, value, ...rest);
    };
    syncBuiltinESMExports();
  `;
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript;base64,${Buffer.from(loader).toString('base64')}`,
      'scripts/build-artifact.mjs',
      '--write'
    ],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
  const heading = JSON.parse(result.stdout).components.find(({ name }) => name === 'Heading');
  for (const field of ['variants', 'anatomy']) {
    assert.deepEqual(
      heading[field].map(({ name }) => name),
      ['accentVariants', 'headingVariants', 'textBodyVariants']
    );
  }
});

test('factored Text body recipes retain their classes in the artifact', () => {
  const artifact = read('packages/system/design-system.json');
  const text = artifact.components.find(({ name }) => name === 'Text');
  const flattened = text.variants.find(({ name }) => name === 'textBodyVariants');
  for (const name of ['text-body-default', 'text-body-large', 'text-body-muted']) {
    assert.ok(flattened.classes.includes(name), name);
  }
  const recipe = text.anatomy.find(({ name }) => name === 'textBodyVariants');
  for (const [variant, name] of [
    ['body', 'text-body-default'],
    ['body-large', 'text-body-large'],
    ['lede', 'text-body-muted']
  ]) {
    assert.ok(
      recipe.variants.variant[variant].some((id) => artifact.anatomyUtilities[id].className === name),
      variant
    );
  }
});

test('--check detects typography role font drift without writing', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      './scripts/fixtures/design-system-artifact/typography-drift.mjs',
      'scripts/build-artifact.mjs',
      '--check'
    ],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('Storybook hidden own props do not appear in Chip', () => {
  const chip = read('packages/system/design-system.json').components.find(({ name }) => name === 'Chip');
  assert.ok(!chip.props.some(({ name }) => name === 'type'));
  assert.ok(!chip.props.some(({ name }) => name === 'aria-pressed'));
});

test('CVA recipes include class values, not default variant names', () => {
  const button = read('packages/system/design-system.json').components.find(({ name }) => name === 'Button');
  const recipe = button.variants.find(({ name }) => name === 'buttonVariants');
  assert.ok(recipe.classes.some((value) => value.includes('eg-btn')));
  assert.ok(!recipe.classes.includes('primary'));
  assert.ok(!recipe.classes.includes('md'));
});

test('template and section layout includes source-backed slots and section recipes', () => {
  const artifact = read('packages/system/design-system.json');
  const component = (name) => artifact.components.find((item) => item.name === name);
  const section = component('SectionShell');
  const classes = (ids) => ids.map((id) => artifact.anatomyUtilities[id]);
  const wrap = section.anatomy.find(({ name }) => name === 'sectionShellWrapVariants');
  assert.ok(
    classes(wrap.base).some(
      ({ className, tokens }) => className === 'max-w-[var(--content-max)]' && tokens.includes('--content-max')
    )
  );
  const root = section.anatomy.find(({ name }) => name === 'sectionShellVariants');
  assert.ok(
    classes(root.variants.register.show).some(({ className }) => className.includes('--gradient-section-show'))
  );
  assert.ok(
    component('WebTemplate').layout.some(
      ({ source, expression }) => source.endsWith('WebTemplate.tsx') && expression.includes('page.content')
    )
  );
  assert.ok(
    component('WebSection').layout.some(
      ({ source, expression }) =>
        source.endsWith('useWebSection.ts') && expression.includes('[header, media, body, actions, social]')
    )
  );
});

test('layout extracts CSS declarations, custom-property assignments and unresolved dynamic classes', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/layout-extra.mjs', 'scripts/build-artifact.mjs', '--write'],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(result.status, 0, result.stderr);
  const artifact = JSON.parse(result.stdout);
  const layout = artifact.components.find(({ name }) => name === 'WebSection').layout;
  const facts = layout.flatMap((item) =>
    item.classes.map((id) => ({ ...artifact.anatomyUtilities[id], source: item.source }))
  );
  assert.ok(
    facts.some(
      ({ className, tokens, source }) =>
        className.includes('max-width: var(--content-max)') &&
        tokens.includes('--content-max') &&
        source.endsWith('web-section.css')
    )
  );
  assert.ok(layout.some(({ expression }) => expression.includes('@media (min-width: 42rem) > .eg-web-section')));
  assert.ok(facts.some(({ className, unresolved }) => className.includes('--unknown-gap') && unresolved));
  assert.ok(
    facts.some(
      ({ className, unresolved, source }) =>
        className.includes('--eg-zone-x') &&
        className.includes('props.offset') &&
        unresolved &&
        source.endsWith('useWebSection.ts')
    )
  );
  assert.ok(facts.some(({ className, unresolved }) => className === 'props.dynamicLayout' && unresolved));
  assert.ok(facts.some(({ className, unresolved }) => className === 'section.dynamicClass' && unresolved));
  const text = renderSystemMd(artifact);
  assert.match(text, /props\.dynamicLayout → unresolved/);
  assert.match(text, /--eg-zone-x[^\n]*unresolved/);
});

test('--check detects section wrapper width drift without writing', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/layout-drift.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('Button anatomy identifies its shared rounded-md token and size-specific spacing', () => {
  const artifact = read('packages/system/design-system.json');
  const button = artifact.components.find(({ name }) => name === 'Button');
  const recipe = button.anatomy.find(({ name }) => name === 'buttonVariants');
  const facts = (ids) => ids.map((id) => artifact.anatomyUtilities[id]);
  assert.ok(
    facts(recipe.base).some(({ className, tokens }) => className === 'rounded-md' && tokens.includes('--radius-md'))
  );
  assert.ok(
    facts(recipe.variants.size.md).some(
      ({ className, tokens }) => className === 'py-3' && tokens.includes('--spacing-3')
    )
  );
  assert.ok(
    facts(recipe.variants.size.sm).some(
      ({ className, tokens }) => className === 'px-4' && tokens.includes('--spacing-4')
    )
  );
  assert.ok(
    facts(recipe.variants.variant.dark).some(({ className, tokens }) => className === 'shadow-none' && !tokens.length)
  );
});

test('Tabs edge-fade compounds expand without unresolved identifiers', () => {
  const artifact = read('packages/system/design-system.json');
  const tabs = artifact.components.find(({ name }) => name === 'Tabs');
  const recipe = tabs.anatomy.find(({ name }) => name === 'tabsListVariants');
  const facts = (ids) => ids.map((id) => artifact.anatomyUtilities[id]);
  const underline = recipe.compounds.find(({ conditions }) => conditions.variant === 'underline');
  const fullWidth = recipe.compounds.filter(
    ({ conditions }) => conditions.variant === "['segmented', 'outline']" && conditions.fullWidth === 'true'
  );
  const classes = [
    ...recipe.base,
    ...Object.values(recipe.variants).flatMap((values) => Object.values(values).flat()),
    ...recipe.compounds.flatMap(({ classes }) => classes)
  ];
  assert.equal(fullWidth.length, 2);
  assert.ok(
    !facts(classes).some(({ className }) => className === 'tabsEdgeFade'),
    'tabsEdgeFade is no longer unresolved'
  );
  assert.deepEqual(facts(underline.classes), []);
  assert.deepEqual(facts(fullWidth[1].classes), []);
});

test('same-file literal constants produce the same anatomy as inline classes', () => {
  const fixture = [
    "import { artifactExternalClass } from '../../primitives/text/types';",
    "const artifactString = 'p-3 shadow-edge';",
    'const artifactTemplate = `px-4 gap-2`;',
    "const artifactNested = ['py-2', ['rounded-md', `font-sans`]];",
    "let artifactMutable = 'p-5';",
    "const artifactCall = String('p-6');",
    'const artifactSubstituted = `p-${3}`;',
    'const artifactAlias = artifactString;',
    "const artifactMixed = ['p-7', artifactString];",
    'const artifactCycle = [artifactCycle];',
    "const artifactShadowed = 'p-9';",
    "export const artifactFixtureVariants = cva('', { variants: { fixture: {",
    '  string: artifactString,',
    "  inlineString: 'p-3 shadow-edge',",
    '  template: artifactTemplate,',
    '  inlineTemplate: `px-4 gap-2`,',
    '  nested: artifactNested,',
    "  inlineNested: ['py-2', ['rounded-md', `font-sans`]],",
    "  arrayMember: ['p-2', artifactString],",
    "  inlineArrayMember: ['p-2', 'p-3 shadow-edge'],",
    "  inlineShadow: 'p-4',",
    '  imported: artifactExternalClass,',
    '  mutable: artifactMutable,',
    '  call: artifactCall,',
    '  substituted: artifactSubstituted,',
    '  alias: artifactAlias,',
    '  mixed: artifactMixed,',
    '  cycle: artifactCycle,',
    "  directCall: String('p-6'),",
    '  directTemplate: `p-${3}`',
    '} } });',
    "export function artifactFixtureShadow() { const artifactShadowed = 'p-4'; const artifactShadowVariants = cva(artifactShadowed); return artifactShadowVariants(); }"
  ].join('\n');
  const loader = `
    import fs from 'node:fs';
    import { syncBuiltinESMExports } from 'node:module';
    import { resolve } from 'node:path';
    const read = fs.readFileSync;
    const write = fs.writeFileSync;
    const button = resolve('packages/ui/src/atoms/button/types.ts');
    const hook = resolve('packages/ui/src/atoms/button/useButton.ts');
    const external = resolve('packages/ui/src/primitives/text/types.ts');
    const artifact = resolve('packages/system/design-system.json');
    fs.readFileSync = function (path, options) {
      const value = read.call(this, path, options);
      if (typeof path !== 'string') return value;
      const target = resolve(path);
      if (target === hook) {
        const changed = "import { artifactFixtureVariants, artifactFixtureShadow } from './types';\\n" +
          value.toString().replace('cn(buttonVariants({ variant, size, labelWrap }), className)',
            'cn(artifactFixtureVariants(), artifactFixtureShadow(), buttonVariants({ variant, size, labelWrap }), className)');
        return typeof value === 'string' ? changed : Buffer.from(changed);
      }
      const addition = target === button ? ${JSON.stringify(fixture)} :
        target === external ? "\\nexport const artifactExternalClass = 'p-8';\\n" : null;
      if (addition === null) return value;
      const changed = value.toString() + '\\n' + addition;
      return typeof value === 'string' ? changed : Buffer.from(changed);
    };
    fs.writeFileSync = function (path, value, ...rest) {
      if (typeof path === 'string' && resolve(path) === artifact) {
        process.stdout.write(value);
        return;
      }
      return write.call(this, path, value, ...rest);
    };
    syncBuiltinESMExports();
  `;
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript;base64,${Buffer.from(loader).toString('base64')}`,
      'scripts/build-artifact.mjs',
      '--write'
    ],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
  const artifact = JSON.parse(result.stdout);
  const button = artifact.components.find(({ name }) => name === 'Button');
  const recipe = button.anatomy.find(({ name }) => name === 'artifactFixtureVariants');
  const values = recipe.variants.fixture;
  const facts = (ids) => ids.map((id) => artifact.anatomyUtilities[id]);
  const unresolved = (className) => [{ className, tokens: [], unresolved: true }];
  for (const [key, className] of [
    ['imported', 'artifactExternalClass'],
    ['mutable', 'artifactMutable'],
    ['call', 'artifactCall'],
    ['substituted', 'artifactSubstituted'],
    ['alias', 'artifactAlias'],
    ['mixed', 'artifactMixed'],
    ['cycle', 'artifactCycle'],
    ['directCall', "String('p-6')"],
    ['directTemplate', '`p-${3}`']
  ]) {
    assert.deepEqual(facts(values[key]), unresolved(className), key);
  }
  assert.deepEqual(facts(values.inlineString), [
    { className: 'p-3', tokens: ['--spacing-3'], unresolved: false },
    { className: 'shadow-edge', tokens: ['--shadow-edge'], unresolved: false }
  ]);
  assert.deepEqual(facts(values.inlineNested), [
    { className: 'py-2', tokens: ['--spacing-2'], unresolved: false },
    { className: 'rounded-md', tokens: ['--radius-md'], unresolved: false },
    { className: 'font-sans', tokens: ['--font-sans'], unresolved: false }
  ]);
  for (const [actual, inline] of [
    ['string', 'inlineString'],
    ['template', 'inlineTemplate'],
    ['nested', 'inlineNested'],
    ['arrayMember', 'inlineArrayMember']
  ]) {
    assert.deepEqual(facts(values[actual]), facts(values[inline]), actual);
  }
  const shadow = button.anatomy.find(({ name }) => name === 'artifactShadowVariants');
  assert.deepEqual(facts(shadow.base), facts(values.inlineShadow));
});

test('--check accepts the current artifact without writing', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(process.execPath, ['scripts/build-artifact.mjs', '--check'], {
    encoding: 'utf8',
    timeout: 120_000
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('Surface anatomy retains compound conditions and source-proven composition', () => {
  const artifact = read('packages/system/design-system.json');
  const { components } = artifact;
  const surface = components.find(({ name }) => name === 'Surface');
  const recipe = surface.anatomy.find(({ name }) => name === 'surfaceVariants');
  assert.ok(
    recipe.compounds.some(
      ({ conditions, classes }) =>
        conditions.elevation === '1' &&
        classes.some((id) => artifact.anatomyUtilities[id].tokens.includes('--shadow-elev-1'))
    )
  );
  const card = components.find(({ name }) => name === 'CommunityCard');
  assert.ok(card.surfaceUsage.some(({ arguments: args }) => args.includes("tone: 'surface-1'")));
});

test('--check detects Button radius source drift without changing files', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/radius-drift.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
});

test('mixed known and unknown token references are explicitly unresolved', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/mixed.mjs', 'scripts/build-artifact.mjs', '--write'],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(result.status, 0, result.stderr);
  const artifact = JSON.parse(result.stdout);
  const fact = artifact.anatomyUtilities.find(({ className }) => className.includes('--unknown-mixed'));
  assert.deepEqual(fact.tokens, ['--shadow-edge']);
  assert.equal(fact.unresolved, true);
});

test('every shipped system JSON stays within the 768 KiB budget', () => {
  const root = new URL('../packages/system/', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  const shipped = ['package.json'];
  for (const entry of manifest.files) {
    if (entry.endsWith('.json')) {
      shipped.push(entry);
    } else if (statSync(new URL(entry, root)).isDirectory()) {
      shipped.push(
        ...readdirSync(new URL(`${entry}/`, root), { recursive: true })
          .filter((path) => path.endsWith('.json'))
          .map((path) => `${entry}/${path}`)
      );
    }
  }
  for (const path of shipped) {
    const bytes = readFileSync(new URL(path, root));
    assert.ok(bytes.length <= 768 * 1024, `${path}: ${bytes.length} bytes exceeds 768 KiB`);
  }
});

test('anatomy utilities are shared and the artifact stays below one MiB', () => {
  const bytes = readFileSync(new URL('../packages/system/design-system.json', import.meta.url));
  const artifact = JSON.parse(bytes);
  assert.ok(bytes.length < 1_048_576, `${bytes.length} bytes`);
  assert.equal(
    new Set(artifact.anatomyUtilities.map(({ className }) => className)).size,
    artifact.anatomyUtilities.length
  );
  assert.ok(artifact.components.find(({ name }) => name === 'Button').anatomy[0].base.every(Number.isInteger));
});

test('all L9 naming types retain their source and owner', () => {
  const artifact = read('packages/system/design-system.json');
  const usages = read('skills/_shared/prop-naming.json').flatMap((entry) => entry.usages);
  // Explicit owner inventory: the independent oracle for the builder's owner inference.
  // Every registry naming type must appear here, so a new type requires a reviewed owner.
  const owners = new Map([
    ['CalendarGridEntry', 'CalendarGrid'],
    ['CarouselItem', 'Carousel'],
    ['ChipGroupOption', 'ChipGroup'],
    ['ColorSwatchGroupOption', 'ColorSwatchGroup'],
    ['CommandPaletteItem', 'CommandPalette'],
    ['FooterNavigationItem', 'FooterNavigation'],
    ['GaugeGroupRing', 'GaugeGroup'],
    ['MenuEntry', 'Menu'],
    ['MenuSubmenuItem', 'Menu'],
    ['SelectTileOption', 'SelectTile'],
    ['SocialLinkItem', 'SocialLinks'],
    ['TabBarItem', 'TabBar'],
    ['TerminalCardRow', 'TerminalCard'],
    ['Toast', 'Toast']
  ]);
  // Naming types are the registry usages whose component is not a public component export.
  const publicNames = new Set(artifact.components.map(({ name }) => name));
  const registryTypes = [...new Set(usages.map(({ component }) => component))]
    .filter((name) => !publicNames.has(name))
    .sort();
  assert.ok(registryTypes.length > 0);
  assert.deepEqual(artifact.types.map(({ name }) => name).sort(), registryTypes);
  assert.deepEqual([...owners.keys()].sort(), registryTypes);
  for (const entry of artifact.types) {
    assert.equal(entry.owner, owners.get(entry.name), entry.name);
    const sources = usages.filter((usage) => usage.component === entry.name).map((usage) => usage.source.path);
    assert.ok(sources.length > 0);
    assert.ok(
      sources.every((source) => source === entry.source),
      entry.name
    );
    assert.ok(existsSync(resolve(entry.source)), entry.source);
  }
});

test('--check rejects stale artifact bytes without modifying the worktree', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/stale.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
});

test('--check detects a part removed from source without writing the artifact', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/removed-part.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('artifact schema and total ordering match the contract', () => {
  const artifact = read('packages/system/design-system.json');
  const keys = (item, expected) => assert.deepEqual(Object.keys(item).sort(), expected.slice().sort());
  const sorted = (items, key) =>
    assert.deepEqual(
      items.map((item) => item[key]),
      items.map((item) => item[key]).sort()
    );
  keys(artifact, [
    'name',
    'assets',
    'schemaVersion',
    'packages',
    'catalog',
    'components',
    'anatomyUtilities',
    'typographyRoles',
    'compositionRecipes',
    'types',
    'tokens',
    'materialRecipes',
    'propNaming'
  ]);
  assert.match(artifact.schemaVersion, /^\d+\.\d+\.\d+$/);
  for (const [field, key, fields] of [
    ['packages', 'name', ['name', 'version']],
    ['catalog', 'name', ['name', 'level', 'package', 'radix', 'composes', 'action', 'available']],
    [
      'components',
      'name',
      ['name', 'package', 'source', 'props', 'variants', 'parts', 'anatomy', 'layout', 'surfaceUsage', 'composedOf']
    ],
    ['types', 'name', ['name', 'owner', 'source']],
    ['tokens', 'name', ['name', 'value', 'group']],
    ['materialRecipes', 'id', ['id', 'semantics', 'tokens']],
    ['propNaming', 'id', ['id', 'name', 'status', 'components']]
  ]) {
    sorted(artifact[field], key);
    for (const item of artifact[field]) {
      keys(
        item,
        field === 'components' && Object.hasOwn(item, 'classNameAllows') ? [...fields, 'classNameAllows'] : fields
      );
    }
  }
  for (const item of artifact.components) {
    if (Object.hasOwn(item, 'classNameAllows')) {
      assert.ok(item.classNameAllows.length > 0);
      assert.deepEqual(item.classNameAllows, [...new Set(item.classNameAllows)].sort());
    }
    sorted(item.parts, 'name');
    for (const part of item.parts) {
      keys(part, ['name', 'source', 'description', 'children']);
    }
    sorted(item.props, 'name');
    sorted(item.variants, 'name');
    for (const prop of item.props) {
      keys(prop, ['name', 'type', 'required', 'default', 'description', 'deprecated']);
    }
    for (const variant of item.variants) {
      keys(variant, ['name', 'classes']);
    }
  }
  assert.throws(() => keys({ ...artifact, unexpected: true }, Object.keys(artifact)));
});

test('every catalog availability is joined to the correct package exports', () => {
  const artifact = read('packages/system/design-system.json');
  const catalog = read('docs/catalog.json').filter((row) => ['ui', 'effects'].includes(row.destino));
  const exports = new Set(artifact.components.map((entry) => `${entry.package}:${entry.name}`));
  const expected = catalog
    .map((row) => ({
      name: row.nombre,
      package: `@egdev/${row.destino}`,
      available: row.nombre.split(/\s*\/\s*/).every((name) => exports.has(`@egdev/${row.destino}:${name}`))
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const actual = artifact.catalog.map(({ name, package: pkg, available }) => ({ name, package: pkg, available }));
  assert.deepEqual(actual, expected);
  assert.throws(() =>
    assert.deepEqual([{ ...actual[0], available: !actual[0].available }, ...actual.slice(1)], expected)
  );
});

test('naming usages resolve and recipes are present', () => {
  const artifact = read('packages/system/design-system.json');
  const registry = read('skills/_shared/prop-naming.json');
  const names = new Set([...artifact.components, ...artifact.types].map(({ name }) => name));
  for (const { usages } of registry) {
    for (const usage of usages) {
      assert.ok(names.has(usage.component), `Missing ${usage.component}`);
    }
  }
  assert.ok(artifact.materialRecipes.length > 0);
});

test('public output tracks exports, sources, catalog, recipes and token declarations', () => {
  const artifact = read('packages/system/design-system.json');
  const expectedTokens = extractGroupedDeclarations(
    readFileSync(new URL('../packages/tokens/src/theme.css', import.meta.url), 'utf8')
  );
  const sorted = (items) => [...items].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const assertTokens = (candidate) => assert.deepEqual(candidate.tokens, sorted(expectedTokens));
  assertTokens(artifact);
  assert.throws(() => assertTokens({ ...artifact, tokens: artifact.tokens.slice(1) }));
  const catalog = read('docs/catalog.json').filter((row) => row.destino === 'ui' || row.destino === 'effects');
  const assertCatalog = (candidate) =>
    assert.deepEqual(candidate.catalog.map((row) => row.name).sort(), catalog.map((row) => row.nombre).sort());
  assertCatalog(artifact);
  assert.throws(() => assertCatalog({ ...artifact, catalog: artifact.catalog.slice(1) }));
  const barrels = ['packages/ui/src/index.ts', 'packages/effects/src/index.ts'].map((path) => resolve(path));
  const program = ts.createProgram(barrels, {
    jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    skipLibCheck: true
  });
  const checker = program.getTypeChecker();
  const names = barrels
    .flatMap((barrel) =>
      checker
        .getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(barrel)))
        .filter((item) => {
          const target = item.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(item) : item;
          return Boolean(target.flags & ts.SymbolFlags.Value);
        })
        .map((item) => item.name)
    )
    .sort();
  const assertExports = (candidate) => assert.deepEqual(candidate.components.map((entry) => entry.name).sort(), names);
  assertExports(artifact);
  assert.throws(() => assertExports({ ...artifact, components: artifact.components.slice(1) }));
  for (const entry of artifact.types) {
    assert.ok(existsSync(resolve(entry.source)), entry.source);
  }
  const material = readFileSync(new URL('../docs/MATERIAL.md', import.meta.url), 'utf8').toLowerCase();
  const tokens = new Set(artifact.tokens.map((entry) => entry.name));
  for (const recipe of artifact.materialRecipes) {
    assert.ok(material.includes(recipe.id.toLowerCase()), recipe.id);
    for (const token of recipe.tokens) {
      assert.ok(tokens.has(token), token);
    }
  }
});

test('own props match docgen for every exported props alias and reject removal or type drift', () => {
  const artifact = read('packages/system/design-system.json');
  const config = ts.readConfigFile(resolve('tsconfig.json'), ts.sys.readFile);
  const options = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd()).options;
  const virtualPath = resolve('__artifact_props_test__.ts');
  const sourceText = artifact.components
    .map((component, index) =>
      component.source.endsWith('/types.ts')
        ? `declare const p${index}: import('./${component.source.replace(/\.ts$/, '')}').${component.name}Props;`
        : ''
    )
    .join('\n');
  const host = ts.createCompilerHost(options);
  const getSource = host.getSourceFile.bind(host);
  host.getSourceFile = (file, version, ...rest) =>
    file === virtualPath ? ts.createSourceFile(file, sourceText, version, true) : getSource(file, version, ...rest);
  const program = ts.createProgram([virtualPath], options, host);
  const checker = program.getTypeChecker();
  const parser = new docgen.Parser(program, {
    shouldIncludePropTagMap: true,
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true
  });
  let checked = 0;
  for (const statement of program.getSourceFile(virtualPath).statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      const index = Number(declaration.name.getText().slice(1));
      const component = artifact.components[index];
      const actual = Object.values(parser.getPropsInfo(checker.getSymbolAtLocation(declaration.name)))
        .filter(
          (prop) =>
            (!prop.parent || resolve(prop.parent.fileName) === resolve(component.source)) &&
            !(component.name === 'Chip' && ['type', 'aria-pressed'].includes(prop.name))
        )
        .map((prop) => ({
          name: prop.name,
          type: prop.type.name,
          required: prop.required,
          default: prop.defaultValue?.value ?? null
        }))
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      const observed = component.props.map(({ name, type, required, default: value }) => ({
        name,
        type,
        required,
        default: value
      }));
      assert.deepEqual(observed, actual, component.name);
      if (actual.length) {
        assert.throws(() => assert.deepEqual(observed.slice(1), actual));
        assert.throws(() => assert.deepEqual([{ ...observed[0], type: 'changed' }, ...observed.slice(1)], actual));
        checked++;
      }
    }
  }
  assert.ok(checked > 0);
});

test('artifact contains the complete token source', () => {
  const artifact = read('packages/system/design-system.json');
  const source = extractGroupedDeclarations(
    readFileSync(new URL('../packages/tokens/src/theme.css', import.meta.url), 'utf8')
  );
  assert.ok(source.length > 0);
  assert.equal(artifact.tokens.length, source.length);
  assert.equal(new Set(artifact.tokens.map(({ name }) => name)).size, source.length);
  assert.deepEqual(new Set(artifact.tokens.map(({ group }) => group)), new Set(['theme', 'root', 'inline']));
  assert.deepEqual(new Set(source.map(({ group }) => group)), new Set(['theme', 'root', 'inline']));
});
