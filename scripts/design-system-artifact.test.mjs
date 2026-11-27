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

test('Carousel publishes the opt-in current-slide emphasis variant and its recipes without changing the defaults (#557)', () => {
  const artifact = read('packages/system/design-system.json');
  const carousel = artifact.components.find(({ name }) => name === 'Carousel');
  assert.ok(carousel);
  const variant = carousel.props.find(({ name }) => name === 'variant');
  assert.ok(variant, 'Carousel must publish its variant prop');
  assert.equal(variant.type, 'enum');
  assert.equal(variant.required, false);
  assert.equal(variant.default, 'default');
  assert.match(variant.description, /current-emphasis/);
  assert.match(variant.description, /full-width/);
  // The existing prop and every other Carousel prop stay published.
  assert.deepEqual(carousel.props.map(({ name }) => name).sort(), [
    'defaultValue',
    'items',
    'label',
    'messages',
    'onValueChange',
    'trackLayout',
    'value',
    'variant'
  ]);
  const classes = (recipeName) => {
    const recipe = carousel.variants.find(({ name }) => name === recipeName);
    assert.ok(recipe, recipeName);
    return recipe.classes.join(' ').split(/\s+/).filter(Boolean);
  };
  const slide = classes('carouselSlideVariants');
  for (const utility of [
    'rounded-xl',
    'border',
    'border-solid',
    'border-transparent',
    'transition-[border-color,box-shadow]',
    'duration-[var(--duration-base)]',
    'ease-[var(--ease-out)]',
    'focus-visible:transition-none',
    'motion-reduce:transition-none',
    'aria-[current=true]:border-border-brand',
    'aria-[current=true]:shadow-[var(--shadow-glow-base)]',
    'aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-base)]',
    'forced-colors:aria-[current=true]:outline-solid',
    'forced-colors:aria-[current=true]:outline-(length:--focus-width)',
    'forced-colors:aria-[current=true]:outline-[color:Highlight]'
  ]) {
    assert.ok(slide.includes(utility), `carouselSlideVariants must list ${utility}`);
  }
  // The default recipes are still published next to the emphasis padding.
  const track = classes('carouselTrackVariants');
  for (const utility of ['gap-7', 'p-2', 'gap-0', 'p-0', 'px-6', 'pt-5', 'pb-7']) {
    assert.ok(track.includes(utility), `carouselTrackVariants must list ${utility}`);
  }
  assert.ok(slide.includes('rounded-lg') && slide.includes('focus-visible:shadow-[var(--shadow-focus)]'));
  const convention = artifact.propNaming.find(({ id }) => id === 'visual-treatment');
  assert.ok(convention, 'the visual-treatment convention is published');
  assert.ok(convention.components.includes('Carousel'), 'the visual-treatment convention lists Carousel');
});

test('Link publishes the quiet variant and keeps each variant ink in its own recipe literal (#562)', () => {
  const artifact = read('packages/system/design-system.json');
  const link = artifact.components.find(({ name }) => name === 'Link');
  assert.ok(link);
  const variant = link.props.find(({ name }) => name === 'variant');
  assert.ok(variant, 'Link must publish its variant prop');
  assert.equal(variant.type, 'enum');
  assert.equal(variant.required, false);
  assert.equal(variant.default, 'plain');
  assert.match(variant.description, /quiet/);
  assert.match(variant.description, /underlined/);
  assert.doesNotMatch(variant.description, /only treatment/);
  // The builder reads string literals inside the cva call and does not follow module-level constants. The three
  // recipes therefore stay inline literals: a refactor into shared constants would drop every Link ink from here.
  const recipe = link.variants.find(({ name }) => name === 'linkVariants');
  assert.ok(recipe, 'Link must publish linkVariants');
  const [base = ''] = recipe.classes;
  assert.ok(!base.split(/\s+/).includes('text-link-default'), 'the shared base no longer carries the ink');
  const published = recipe.classes.join(' ').split(/\s+/).filter(Boolean);
  for (const utility of ['text-link-default', 'text-fg-default', 'decoration-fg-brand-default']) {
    assert.ok(published.includes(utility), `linkVariants must list ${utility}`);
  }
  const anatomy = link.anatomy.find(({ name }) => name === 'linkVariants');
  assert.ok(anatomy, 'Link must publish the linkVariants anatomy');
  assert.deepEqual(Object.keys(anatomy.variants.variant).sort(), ['plain', 'quiet', 'underlined']);
  const convention = artifact.propNaming.find(({ id }) => id === 'visual-treatment');
  assert.ok(convention?.components.includes('Link'), 'the visual-treatment convention lists Link');
});

test('Footer publishes wrap and register, the register recipe axis and the wrapper recipe (#561, #565)', () => {
  const artifact = read('packages/system/design-system.json');
  const footer = artifact.components.find(({ name }) => name === 'Footer');
  assert.ok(footer);
  assert.deepEqual(
    footer.props.map(({ name }) => name),
    ['children', 'register', 'wrap']
  );
  const wrap = footer.props.find(({ name }) => name === 'wrap');
  const register = footer.props.find(({ name }) => name === 'register');
  assert.deepEqual([wrap.type, wrap.required, wrap.default], ['boolean', false, 'false']);
  assert.deepEqual([register.type, register.required, register.default], ['enum', false, 'none']);
  assert.match(wrap.description, /centered content wrapper/);
  assert.match(register.description, /Grafito reading wash/);
  // The builder reads string literals inside the cva calls, so the register axis and the wrapper stay inline literals.
  const root = footer.variants.find(({ name }) => name === 'footerVariants');
  assert.ok(root, 'Footer must publish footerVariants');
  const published = root.classes.join(' ').split(/\s+/).filter(Boolean);
  for (const utility of [
    'text-fg-default',
    'bg-surface-0/50',
    'bg-none',
    '[@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
  ]) {
    assert.ok(published.includes(utility), `footerVariants must list ${utility}`);
  }
  const wrapper = footer.variants.find(({ name }) => name === 'footerWrapVariants');
  assert.ok(wrapper, 'Footer must publish footerWrapVariants');
  assert.deepEqual(wrapper.classes.join(' ').split(/\s+/).filter(Boolean), [
    'eg-footer__wrap',
    'box-border',
    'w-full',
    'max-w-[var(--content-max)]',
    'mx-auto',
    'px-[var(--gutter)]'
  ]);
  const axis = footer.anatomy.find(({ name }) => name === 'footerVariants');
  assert.deepEqual(Object.keys(axis.variants.register).sort(), ['grafito', 'none']);
  assert.ok(footer.anatomy.some(({ name }) => name === 'footerWrapVariants'));
  // Both section conventions are widened to the site footer and keep SectionShell.
  for (const id of ['section-register', 'section-content-wrap']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.ok(convention, id);
    assert.deepEqual(convention.components, ['Footer', 'SectionShell'], id);
  }
});

test('SectionNav keeps its ten props, documents the zero-padded numbers and publishes the number and label recipes (#563)', () => {
  const artifact = read('packages/system/design-system.json');
  const nav = artifact.components.find(({ name }) => name === 'SectionNav');
  assert.ok(nav);
  assert.deepEqual(
    nav.props.map(({ name }) => name),
    [
      'activeId',
      'defaultOpen',
      'disclosureLabel',
      'items',
      'label',
      'nextLabel',
      'onNavigate',
      'onOpenChange',
      'open',
      'value'
    ]
  );
  assert.match(nav.props.find(({ name }) => name === 'items').description, /zero-padded/);
  const classes = (recipeName) => {
    const recipe = nav.variants.find(({ name }) => name === recipeName);
    assert.ok(recipe, `SectionNav must publish ${recipeName}`);
    return recipe.classes.join(' ').split(/\s+/).filter(Boolean);
  };
  assert.deepEqual(classes('sectionNavNumberVariants'), [
    'font-display',
    'text-meta',
    'tabular-nums',
    'text-fg-brand-raised'
  ]);
  assert.deepEqual(classes('sectionNavLabelVariants'), ['font-display', 'text-meta', 'uppercase']);
  // The trigger keeps its reset baseline next to the new part recipes.
  const trigger = classes('sectionNavTriggerVariants');
  for (const utility of ['font-sans', 'text-body-default']) {
    assert.ok(trigger.includes(utility), `sectionNavTriggerVariants must still list ${utility}`);
  }
  for (const name of ['sectionNavNumberVariants', 'sectionNavLabelVariants']) {
    assert.ok(
      nav.anatomy.some((entry) => entry.name === name),
      `SectionNav anatomy must include ${name}`
    );
  }
  const expressions = nav.layout.map(({ expression }) => expression);
  for (const expression of ['cn(sectionNavNumberVariants())', 'cn(sectionNavLabelVariants())']) {
    assert.ok(expressions.includes(expression), `SectionNav layout must include ${expression}`);
  }
});

test('Prose publishes its three own props, the static descendant recipe, the measure token and the reused conventions (#569)', () => {
  const artifact = read('packages/system/design-system.json');
  const prose = artifact.components.find(({ name }) => name === 'Prose');
  assert.ok(prose, 'the artifact lists Prose');
  assert.equal(prose.package, '@egdev/ui');
  assert.equal(prose.source, 'packages/ui/src/primitives/prose/types.ts');
  assert.deepEqual(
    prose.props.map(({ name }) => name),
    ['children', 'size', 'tone']
  );
  const [children, size, tone] = ['children', 'size', 'tone'].map((name) =>
    prose.props.find((prop) => prop.name === name)
  );
  assert.deepEqual([children.type, children.required, children.default], ['ReactNode', true, null]);
  assert.deepEqual([size.type, size.required, size.default], ['enum', false, 'md']);
  assert.deepEqual([tone.type, tone.required, tone.default], ['enum', false, 'canvas']);
  assert.match(size.description, /Root body step and unit of the ch measure/);
  assert.match(tone.description, /brand colour of inline code/);
  // No landmark role, accessible name, HTML string, ref or asChild: the root is a generic div over React children.
  for (const name of ['role', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML', 'ref', 'asChild']) {
    assert.ok(!prose.props.some((prop) => prop.name === name), `Prose must not publish ${name}`);
  }
  // One private descendant recipe, built from static string literals with the measure and representative selectors.
  assert.deepEqual(
    prose.variants.map(({ name }) => name),
    ['proseVariants']
  );
  const published = new Set(prose.variants[0].classes.join(' ').split(/\s+/).filter(Boolean));
  for (const utility of [
    'eg-prose',
    'max-w-prose',
    'min-w-0',
    'text-body-large',
    'text-body-default',
    '[&>:first-child]:mt-0',
    '[&_h2]:text-heading-section',
    '[&_a]:text-link-default',
    '[&_a:focus-visible]:[box-shadow:var(--shadow-focus)]',
    '[&_pre]:shadow-[var(--shadow-well)]',
    '[&_th]:bg-surface-2',
    '[&_code:not(pre_code)]:text-fg-brand-default',
    '[&_code:not(pre_code)]:text-fg-brand-raised'
  ]) {
    assert.ok(published.has(utility), `The Prose recipe lists ${utility}`);
  }
  // The component is passive and self-contained: no parts, composition, Surface use or class-name allowance.
  assert.deepEqual(prose.parts, []);
  assert.deepEqual(prose.composedOf, []);
  assert.deepEqual(prose.surfaceUsage, []);
  assert.equal(Object.hasOwn(prose, 'classNameAllows'), false);
  // Token-backed utilities resolve to their tokens, including the owner-confirmed reading measure.
  // The builder indexes typography, radius, shadow and padding utilities; named container utilities such as
  // max-w-prose (like max-w-quote-pull) and colour utilities are listed in the recipe but not indexed.
  const indexed = prose.anatomy[0].base.map((index) => artifact.anatomyUtilities[index]);
  for (const [className, tokens] of [
    ['[&_h2]:text-heading-section', ['--text-heading-section']],
    ['[&_pre]:shadow-[var(--shadow-well)]', ['--shadow-well']],
    ['[&_a:focus-visible]:[box-shadow:var(--shadow-focus)]', ['--shadow-focus']]
  ]) {
    assert.deepEqual(indexed.find((utility) => utility.className === className)?.tokens, tokens, className);
  }
  // The only unresolved flags are the six keyword utilities that are not tokens (text-wrap and text-align), the same
  // heuristic that already flags Table's text-start; no token-backed utility is unresolved.
  assert.deepEqual(
    indexed
      .filter(({ unresolved }) => unresolved)
      .map(({ className }) => className)
      .sort(),
    [
      '[&_h2]:text-balance',
      '[&_h3]:text-balance',
      '[&_h4]:text-balance',
      '[&_td]:text-start',
      '[&_th]:text-start',
      'text-pretty'
    ]
  );
  assert.deepEqual(
    artifact.tokens.find(({ name }) => name === '--container-prose'),
    {
      name: '--container-prose',
      value: '65ch',
      group: 'theme'
    }
  );
  // The two reused conventions keep their approved status and list Prose beside the other components.
  for (const id of ['preset-dimensions', 'surface-material-tone']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('Prose'), id);
  }
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'Prose'),
    {
      name: 'Prose',
      level: 'primitive',
      package: '@egdev/ui',
      radix: '—',
      composes: [],
      action: 'nuevo',
      available: true
    }
  );
});

test('HomeTemplateAnchor publishes its box geometry as classNameAllows and no other effects entry changes (#566)', () => {
  const { components } = read('packages/system/design-system.json');
  const effects = components.filter((item) => item.package === '@egdev/effects');
  assert.deepEqual(effects.map(({ name }) => name).sort(), [
    'AmbientBackground',
    'HomeTemplate',
    'HomeTemplateAnchor',
    'Isotipo3D',
    'ScrollReveal'
  ]);
  const anchor = effects.find(({ name }) => name === 'HomeTemplateAnchor');
  assert.deepEqual(anchor.classNameAllows, [
    'aspect-ratio',
    'block-size',
    'height',
    'inline-size',
    'max-block-size',
    'max-height',
    'max-inline-size',
    'max-width',
    'min-block-size',
    'min-height',
    'min-inline-size',
    'min-width',
    'width'
  ]);
  // The tag adds no prop row: zone stays the only own prop and the root keeps its three.
  assert.deepEqual(
    anchor.props.map(({ name }) => name),
    ['zone']
  );
  assert.deepEqual(
    effects.find(({ name }) => name === 'HomeTemplate').props.map(({ name }) => name),
    ['children', 'onZoneChange', 'zoneTable']
  );
  for (const item of effects) {
    if (item.name !== 'HomeTemplateAnchor') {
      assert.ok(!Object.hasOwn(item, 'classNameAllows'), `${item.name} has no published allowance`);
    }
    assert.ok(!JSON.stringify(item.props).includes('@classNameAllows'), item.name);
    assert.ok(!JSON.stringify(item.parts).includes('@classNameAllows'), item.name);
  }
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
    'DetailHeader',
    'Dropzone',
    'EmptyState',
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
  expected.set('HomeTemplateAnchor', [
    'aspect-ratio',
    'block-size',
    'height',
    'inline-size',
    'max-block-size',
    'max-height',
    'max-inline-size',
    'max-width',
    'min-block-size',
    'min-height',
    'min-inline-size',
    'min-width',
    'width'
  ]);
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

test('StepMeter publishes three source-derived props, two private recipes and the approved step-count convention', () => {
  const artifact = read('packages/system/design-system.json');
  const meter = artifact.components.find(({ name }) => name === 'StepMeter');
  assert.ok(meter);
  assert.equal(meter.package, '@egdev/ui');
  assert.equal(meter.source, 'packages/ui/src/atoms/step-meter/types.ts');
  assert.deepEqual(
    meter.props.map(({ name }) => name),
    ['label', 'steps', 'value']
  );
  const label = meter.props.find(({ name }) => name === 'label');
  const steps = meter.props.find(({ name }) => name === 'steps');
  const value = meter.props.find(({ name }) => name === 'value');
  assert.deepEqual([label.type, label.required, label.default], ['string', true, null]);
  assert.deepEqual([value.type, value.required, value.default], ['number', true, null]);
  assert.deepEqual([steps.type, steps.required, steps.default], ['number', false, '4']);
  assert.match(label.description, /Accessible name of the image, never rendered visibly/);
  assert.match(value.description, /floored to an integer and clamped/);
  assert.match(steps.description, /integer from 1 to 10/);
  for (const name of [
    'children',
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-hidden',
    'aria-live',
    'title',
    'tabIndex'
  ]) {
    assert.ok(!meter.props.some((prop) => prop.name === name), `StepMeter must not publish ${name}`);
  }
  assert.deepEqual(
    meter.variants.map(({ name }) => name),
    ['stepMeterStepVariants', 'stepMeterVariants']
  );
  const step = new Set(
    meter.variants
      .find(({ name }) => name === 'stepMeterStepVariants')
      .classes.join(' ')
      .split(/\s+/)
  );
  for (const utility of [
    'eg-step-meter__step',
    'w-3.5',
    'h-3.75',
    '[clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]',
    'bg-alpha-red-22',
    'data-[state=filled]:bg-fg-brand-default',
    'transition-none',
    'forced-colors:forced-color-adjust-none',
    'forced-colors:data-[state=filled]:bg-[color:CanvasText]',
    'forced-colors:data-[state=empty]:bg-transparent'
  ]) {
    assert.ok(step.has(utility), `The step recipe lists ${utility}`);
  }
  // The atom imports neither Surface nor Pixel and has no parts, no stylesheet role and no className allowance.
  assert.deepEqual(meter.parts, []);
  assert.deepEqual(meter.composedOf, []);
  assert.deepEqual(meter.surfaceUsage, []);
  assert.equal(Object.hasOwn(meter, 'classNameAllows'), false);
  const naming = artifact.propNaming.find(({ id }) => id === 'step-count');
  assert.ok(naming);
  assert.equal(naming.name, 'steps');
  // The registry promoted the entry with its own scoped receipt, so the artifact publishes the approved status.
  assert.equal(naming.status, 'approved');
  assert.deepEqual(naming.components, ['StepMeter']);
  for (const id of ['accessible-name', 'primary-value']) {
    const reused = artifact.propNaming.find((item) => item.id === id);
    assert.equal(reused.status, 'approved', id);
    assert.ok(reused.components.includes('StepMeter'), id);
  }
});

test('EmptyState publishes its five own props, the static unpainted part recipes, the className allowance and the reused conventions (#573)', () => {
  const artifact = read('packages/system/design-system.json');
  const emptyState = artifact.components.find(({ name }) => name === 'EmptyState');
  assert.ok(emptyState, 'the artifact lists EmptyState');
  assert.equal(emptyState.package, '@egdev/ui');
  assert.equal(emptyState.source, 'packages/ui/src/molecules/empty-state/types.ts');
  assert.deepEqual(
    emptyState.props.map(({ name }) => name),
    ['actions', 'description', 'icon', 'level', 'title']
  );
  const prop = (name) => emptyState.props.find((item) => item.name === name);
  assert.deepEqual([prop('title').type, prop('title').required, prop('title').default], ['string', true, null]);
  assert.deepEqual([prop('level').type, prop('level').required, prop('level').default], ['enum', false, '3']);
  assert.match(prop('level').description, /never h1/);
  for (const name of ['description', 'icon', 'actions']) {
    assert.deepEqual([prop(name).required, prop(name).default], [false, null], name);
  }
  // No content, role, accessible name, ref or asChild: the root is a passive generic container.
  for (const name of [
    'children',
    'role',
    'aria-live',
    'aria-label',
    'aria-labelledby',
    'ref',
    'asChild',
    'className'
  ]) {
    assert.ok(!emptyState.props.some((item) => item.name === name), `EmptyState must not publish ${name}`);
  }
  // The root allows outer layout and width constraints only: the six sorted width properties.
  assert.deepEqual(emptyState.classNameAllows, [
    'inline-size',
    'max-inline-size',
    'max-width',
    'min-inline-size',
    'min-width',
    'width'
  ]);
  // Five private part recipes, built from static string literals: the approved inventory and nothing else.
  assert.deepEqual(
    emptyState.variants.map(({ name }) => name),
    [
      'emptyStateActionsVariants',
      'emptyStateDescriptionVariants',
      'emptyStateIconVariants',
      'emptyStateTitleVariants',
      'emptyStateVariants'
    ]
  );
  const recipes = Object.fromEntries(
    emptyState.variants.map(({ name, classes }) => [name, classes.join(' ').split(/\s+/).filter(Boolean)])
  );
  assert.deepEqual(recipes.emptyStateVariants, [
    'eg-empty-state',
    'flex',
    'min-w-0',
    'flex-col',
    'items-center',
    'gap-3',
    'px-4',
    'py-8',
    'text-center',
    'font-sans'
  ]);
  assert.deepEqual(recipes.emptyStateIconVariants, ['inline-flex', 'shrink-0', 'text-fg-muted']);
  assert.deepEqual(recipes.emptyStateTitleVariants, [
    'm-0',
    'font-sans',
    'text-heading-small',
    'text-fg-default',
    'wrap-anywhere'
  ]);
  assert.deepEqual(recipes.emptyStateDescriptionVariants, [
    'm-0',
    'max-w-[var(--bp-sm)]',
    'font-sans',
    'text-body-default',
    'text-fg-secondary',
    'wrap-anywhere'
  ]);
  assert.deepEqual(recipes.emptyStateActionsVariants, [
    'flex',
    'min-w-0',
    'max-w-full',
    'flex-wrap',
    'items-center',
    'justify-center',
    'gap-2'
  ]);
  // The block paints nothing: no background, border, shadow, ring, outline, backdrop, filter or motion utility.
  for (const [name, classes] of Object.entries(recipes)) {
    for (const utility of classes) {
      assert.doesNotMatch(
        utility,
        /^(?:bg|border|shadow|ring|outline|backdrop|filter|transition|animate|transform|rounded)\b/,
        `${name} lists the paint utility ${utility}`
      );
    }
  }
  // It composes the Icon itself; the Button or Link action is supplied and never counted as composition.
  assert.deepEqual(emptyState.composedOf, [
    { name: 'Icon', source: 'packages/ui/src/molecules/empty-state/EmptyState.tsx' }
  ]);
  assert.deepEqual(emptyState.parts, []);
  assert.deepEqual(emptyState.surfaceUsage, []);
  // The five reused conventions keep their approved status and list EmptyState beside the other components.
  for (const id of ['heading-title', 'heading-level', 'content-description', 'trailing-actions', 'leading-icon']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('EmptyState'), id);
  }
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'EmptyState'),
    {
      name: 'EmptyState',
      level: 'molecule',
      package: '@egdev/ui',
      radix: '—',
      composes: ['Icon; consumer Button/Link action'],
      action: 'nuevo',
      available: true
    }
  );
});

test('Breadcrumb publishes its three own props, the six static part recipes, the entry type and the reused conventions (#570)', () => {
  const artifact = read('packages/system/design-system.json');
  const breadcrumb = artifact.components.find(({ name }) => name === 'Breadcrumb');
  assert.ok(breadcrumb, 'the artifact lists Breadcrumb');
  assert.equal(breadcrumb.package, '@egdev/ui');
  assert.equal(breadcrumb.source, 'packages/ui/src/molecules/breadcrumb/types.ts');
  assert.deepEqual(
    breadcrumb.props.map(({ name }) => name),
    ['items', 'label', 'onNavigate']
  );
  const prop = (name) => breadcrumb.props.find((item) => item.name === name);
  assert.deepEqual([prop('label').type, prop('label').required, prop('label').default], ['string', true, null]);
  assert.deepEqual([prop('items').required, prop('items').default], [true, null]);
  assert.deepEqual([prop('onNavigate').required, prop('onNavigate').default], [false, null]);
  assert.match(prop('label').description, /never rendered visibly/);
  // No content, role, accessible-name override, ref, asChild or className row: the landmark is named by label alone.
  for (const name of [
    'children',
    'role',
    'aria-label',
    'aria-labelledby',
    'dangerouslySetInnerHTML',
    'ref',
    'asChild',
    'className'
  ]) {
    assert.ok(!breadcrumb.props.some((item) => item.name === name), `Breadcrumb must not publish ${name}`);
  }
  // No @classNameAllows tag: className supports the DS046 base placement list only, so no extra property is allowed.
  assert.equal(Object.hasOwn(breadcrumb, 'classNameAllows'), false);
  // Six private part recipes, built from static string literals: the approved inventory and nothing else.
  assert.deepEqual(
    breadcrumb.variants.map(({ name }) => name),
    [
      'breadcrumbCurrentVariants',
      'breadcrumbLinkVariants',
      'breadcrumbListVariants',
      'breadcrumbSeparatorVariants',
      'breadcrumbStepVariants',
      'breadcrumbVariants'
    ]
  );
  const recipes = Object.fromEntries(
    breadcrumb.variants.map(({ name, classes }) => [name, classes.join(' ').split(/\s+/).filter(Boolean)])
  );
  assert.deepEqual(recipes.breadcrumbVariants, ['eg-breadcrumb', 'min-w-0', 'wrap-anywhere']);
  assert.deepEqual(recipes.breadcrumbListVariants, [
    'm-0',
    'p-0',
    'list-none',
    'flex',
    'flex-wrap',
    'items-center',
    'gap-x-2',
    'gap-y-1'
  ]);
  assert.deepEqual(recipes.breadcrumbStepVariants, ['flex', 'min-h-14', 'min-w-0', 'items-center', 'gap-2']);
  assert.deepEqual(recipes.breadcrumbLinkVariants, ['self-stretch']);
  assert.deepEqual(recipes.breadcrumbCurrentVariants, ['font-sans', 'text-label-default', 'text-fg-default']);
  assert.deepEqual(recipes.breadcrumbSeparatorVariants, ['self-center', '-rotate-90', 'text-fg-muted']);
  // The trail paints nothing: no background, border, shadow, ring, outline, backdrop, filter or motion utility.
  for (const [name, classes] of Object.entries(recipes)) {
    for (const utility of classes) {
      assert.doesNotMatch(
        utility,
        /^(?:bg|border|shadow|ring|outline|backdrop|filter|transition|animate|duration|ease|transform|rounded)\b/,
        `${name} lists the paint or motion utility ${utility}`
      );
    }
  }
  // It composes the exported Link and Icon itself; no Surface, no Radix part and no part marker.
  assert.deepEqual(breadcrumb.composedOf.map(({ name }) => name).sort(), ['Icon', 'Link']);
  for (const composed of breadcrumb.composedOf) {
    assert.equal(composed.source, 'packages/ui/src/molecules/breadcrumb/Breadcrumb.tsx');
  }
  assert.deepEqual(breadcrumb.parts, []);
  assert.deepEqual(breadcrumb.surfaceUsage, []);
  // The entry type is a source-derived naming type owned by Breadcrumb, in the same source file.
  const entry = artifact.types.find(({ name }) => name === 'BreadcrumbItem');
  assert.ok(entry, 'the artifact lists the BreadcrumbItem naming type');
  assert.equal(entry.owner, 'Breadcrumb');
  assert.equal(entry.source, 'packages/ui/src/molecules/breadcrumb/types.ts');
  // The three reused conventions keep their approved status and list Breadcrumb beside the other components.
  for (const id of ['collection-items', 'accessible-name', 'navigation-intent']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('Breadcrumb'), id);
  }
  assert.ok(artifact.propNaming.find(({ id }) => id === 'accessible-name').components.includes('BreadcrumbItem'));
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'Breadcrumb'),
    {
      name: 'Breadcrumb',
      level: 'molecule',
      package: '@egdev/ui',
      radix: '— (native nav, ordered list and links)',
      composes: ['Link, Icon'],
      action: 'nuevo',
      available: true
    }
  );
});

test('DetailHeader publishes its nine own props, the nine static part recipes, the width allowance and its conventions (#572)', () => {
  const artifact = read('packages/system/design-system.json');
  const header = artifact.components.find(({ name }) => name === 'DetailHeader');
  assert.ok(header, 'the artifact lists DetailHeader');
  assert.equal(header.package, '@egdev/ui');
  assert.equal(header.source, 'packages/ui/src/molecules/detail-header/types.ts');
  assert.deepEqual(
    header.props.map(({ name }) => name),
    ['eyebrow', 'lede', 'level', 'links', 'messages', 'metadata', 'newTabText', 'tags', 'title']
  );
  const prop = (name) => header.props.find((item) => item.name === name);
  // Only the required title lacks a default, and only the two constants publish one.
  assert.equal(prop('title').required, true);
  for (const name of ['eyebrow', 'lede', 'level', 'links', 'messages', 'metadata', 'newTabText', 'tags']) {
    assert.equal(prop(name).required, false, name);
  }
  assert.deepEqual(
    header.props.map(({ name, default: value }) => [name, value]).filter(([, value]) => value !== null),
    [
      ['level', '1'],
      ['newTabText', '(opens in a new tab)']
    ]
  );
  assert.equal(prop('newTabText').type, 'string');
  assert.equal(prop('tags').type, 'string[]');
  assert.match(prop('links').type, /DetailHeaderLink\[\]/);
  assert.match(prop('metadata').type, /DetailHeaderMetadataItem\[\]/);
  assert.match(prop('messages').type, /DetailHeaderMessages/);
  assert.match(prop('title').description, /page heading/);
  // No content, role, accessible-name override, inline style, ref or asChild row: the heading names the content.
  for (const name of [
    'children',
    'role',
    'aria-label',
    'aria-labelledby',
    'dangerouslySetInnerHTML',
    'style',
    'ref',
    'asChild'
  ]) {
    assert.ok(!header.props.some((item) => item.name === name), `DetailHeader must not publish ${name}`);
  }
  // The root className contract is the six width and size properties, sorted and unique.
  assert.deepEqual(header.classNameAllows, [
    'inline-size',
    'max-inline-size',
    'max-width',
    'min-inline-size',
    'min-width',
    'width'
  ]);
  // Nine private part recipes, built from static string literals: the approved inventory and nothing else.
  assert.deepEqual(
    header.variants.map(({ name }) => name),
    [
      'detailHeaderLinkItemVariants',
      'detailHeaderLinksVariants',
      'detailHeaderMetaEntryVariants',
      'detailHeaderMetaVariants',
      'detailHeaderTagLabelVariants',
      'detailHeaderTagsVariants',
      'detailHeaderTermVariants',
      'detailHeaderValueVariants',
      'detailHeaderVariants'
    ]
  );
  const recipes = Object.fromEntries(
    header.variants.map(({ name, classes }) => [name, classes.join(' ').split(/\s+/).filter(Boolean)])
  );
  assert.deepEqual(recipes.detailHeaderVariants, ['eg-detail-header', 'flex', 'min-w-0', 'flex-col', 'gap-6']);
  assert.deepEqual(recipes.detailHeaderMetaVariants, [
    'eg-detail-header__meta',
    'm-0',
    'flex',
    'min-w-0',
    'flex-wrap',
    'gap-x-8',
    'gap-y-4'
  ]);
  assert.deepEqual(recipes.detailHeaderMetaEntryVariants, ['flex', 'min-w-0', 'flex-col', 'gap-1']);
  assert.deepEqual(recipes.detailHeaderTermVariants, [
    'm-0',
    'font-display',
    'text-label-eyebrow',
    'uppercase',
    'text-fg-muted'
  ]);
  assert.deepEqual(recipes.detailHeaderValueVariants, [
    'm-0',
    'min-w-0',
    'font-sans',
    'text-body-default',
    'text-fg-default',
    'wrap-anywhere'
  ]);
  assert.deepEqual(recipes.detailHeaderTagsVariants, [
    'eg-detail-header__tags',
    'm-0',
    'flex',
    'min-w-0',
    'list-none',
    'flex-wrap',
    'gap-1.5',
    'p-0'
  ]);
  assert.deepEqual(recipes.detailHeaderLinksVariants, [
    'eg-detail-header__links',
    'm-0',
    'flex',
    'min-w-0',
    'list-none',
    'flex-wrap',
    'gap-x-6',
    'gap-y-3',
    'p-0'
  ]);
  assert.deepEqual(recipes.detailHeaderLinkItemVariants, ['min-w-0', 'wrap-anywhere']);
  assert.deepEqual(recipes.detailHeaderTagLabelVariants, ['whitespace-normal', 'wrap-anywhere']);
  // The header paints nothing: no background, border, shadow, ring, outline, backdrop, filter or motion utility.
  for (const [name, classes] of Object.entries(recipes)) {
    for (const utility of classes) {
      assert.doesNotMatch(
        utility,
        /^(?:bg|border|shadow|ring|outline|backdrop|filter|transition|animate|duration|ease|transform|rounded)\b/,
        `${name} lists the paint or motion utility ${utility}`
      );
    }
  }
  // It composes the exported SectionHeader, Chip and Link itself; no Surface, no Radix part and no part marker.
  assert.deepEqual(header.composedOf.map(({ name }) => name).sort(), ['Chip', 'Link', 'SectionHeader']);
  for (const composed of header.composedOf) {
    assert.equal(composed.source, 'packages/ui/src/molecules/detail-header/DetailHeader.tsx');
  }
  assert.deepEqual(header.parts, []);
  assert.deepEqual(header.surfaceUsage, []);
  // Three new conventions, approved by their own receipt; each lists DetailHeader as its only component.
  for (const [id, name] of [
    ['content-metadata', 'metadata'],
    ['content-tags', 'tags'],
    ['external-links', 'links']
  ]) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.ok(convention, id);
    assert.equal(convention.name, name, id);
    assert.equal(convention.status, 'approved', id);
    assert.deepEqual(convention.components, ['DetailHeader'], id);
  }
  // The six reused conventions keep their approved status and list DetailHeader beside the other components.
  for (const id of [
    'heading-title',
    'heading-level',
    'heading-eyebrow',
    'section-lede',
    'localized-messages',
    'new-tab-notice'
  ]) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('DetailHeader'), id);
  }
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'DetailHeader'),
    {
      name: 'DetailHeader',
      level: 'molecule',
      package: '@egdev/ui',
      radix: '—',
      composes: ['SectionHeader, Chip, Link'],
      action: 'nuevo',
      available: true
    }
  );
});

test('Pagination publishes its six own props, the seven static part recipes, its two new conventions and the reused ones (#571)', () => {
  const artifact = read('packages/system/design-system.json');
  const pagination = artifact.components.find(({ name }) => name === 'Pagination');
  assert.ok(pagination, 'the artifact lists Pagination');
  assert.equal(pagination.package, '@egdev/ui');
  assert.equal(pagination.source, 'packages/ui/src/molecules/pagination/types.ts');
  assert.deepEqual(
    pagination.props.map(({ name }) => name),
    ['getHref', 'label', 'messages', 'onNavigate', 'pageCount', 'value']
  );
  const prop = (name) => pagination.props.find((item) => item.name === name);
  // The four own inputs are required; none of the six has a constant default.
  assert.deepEqual([prop('label').type, prop('label').required], ['string', true]);
  assert.deepEqual([prop('value').type, prop('value').required], ['number', true]);
  assert.deepEqual([prop('pageCount').type, prop('pageCount').required], ['number', true]);
  assert.equal(prop('getHref').required, true);
  assert.match(prop('getHref').type, /\(page: number\) => string/);
  assert.equal(prop('onNavigate').required, false);
  // The artifact prints the checker's expanded form, which adds the default type argument of MouseEvent.
  assert.match(
    prop('onNavigate').type,
    /\(page: number, event: MouseEvent<HTMLAnchorElement(?:, MouseEvent)?>\) => void/
  );
  assert.equal(prop('messages').required, false);
  assert.match(prop('messages').type, /PaginationMessages/);
  for (const { name, default: value } of pagination.props) {
    assert.equal(value, null, `${name} has no constant default`);
  }
  assert.match(prop('label').description, /never rendered visibly/);
  assert.match(prop('getHref').description, /crawlable link/);
  // No content, role, accessible-name override, ref, asChild, uncontrolled value or change callback row.
  for (const name of [
    'children',
    'role',
    'aria-label',
    'aria-labelledby',
    'dangerouslySetInnerHTML',
    'ref',
    'asChild',
    'className',
    'style',
    'defaultValue',
    'onValueChange'
  ]) {
    assert.ok(!pagination.props.some((item) => item.name === name), `Pagination must not publish ${name}`);
  }
  // No @classNameAllows tag: className supports the DS046 base placement list only, so no extra property is allowed.
  assert.equal(Object.hasOwn(pagination, 'classNameAllows'), false);
  // Seven private part recipes, built from static string literals: the approved inventory and nothing else.
  assert.deepEqual(
    pagination.variants.map(({ name }) => name),
    [
      'paginationEllipsisVariants',
      'paginationIconVariants',
      'paginationItemVariants',
      'paginationLinkVariants',
      'paginationListVariants',
      'paginationPlaceholderVariants',
      'paginationVariants'
    ]
  );
  const recipes = Object.fromEntries(
    pagination.variants.map(({ name, classes }) => [name, classes.join(' ').split(/\s+/).filter(Boolean)])
  );
  assert.deepEqual(recipes.paginationVariants, ['eg-pagination']);
  assert.deepEqual(recipes.paginationListVariants, [
    'm-0',
    'p-0',
    'list-none',
    'flex',
    'flex-wrap',
    'items-center',
    'justify-center',
    'gap-1'
  ]);
  assert.deepEqual(recipes.paginationItemVariants, [
    'box-border',
    'inline-flex',
    'min-h-10',
    'min-w-10',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-md',
    'border',
    'border-solid',
    'border-transparent',
    'px-2',
    'pointer-coarse:min-h-14',
    'pointer-coarse:min-w-14',
    'font-display',
    'text-meta'
  ]);
  assert.deepEqual(recipes.paginationLinkVariants, [
    'text-fg-secondary',
    'no-underline',
    'transition-colors',
    'duration-(--duration-fast)',
    'ease-(--ease-out)',
    'motion-reduce:transition-none',
    'hover:bg-surface-2',
    'hover:text-fg-default',
    'aria-[current=page]:border-state-selected',
    'aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
    'aria-[current=page]:shadow-[var(--shadow-edge-strong)]',
    'aria-[current=page]:text-fg-default',
    'focus-visible:outline-none',
    'focus-visible:shadow-focus',
    'aria-[current=page]:focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-solid',
    'forced-colors:focus-visible:outline-(length:--focus-width)',
    'forced-colors:focus-visible:outline-[color:Highlight]',
    'forced-colors:aria-[current=page]:outline-solid',
    'forced-colors:aria-[current=page]:outline-(length:--focus-width)',
    'forced-colors:aria-[current=page]:outline-[color:Highlight]',
    'tabular-nums',
    'uppercase'
  ]);
  assert.deepEqual(recipes.paginationEllipsisVariants, ['text-fg-muted']);
  assert.deepEqual(recipes.paginationPlaceholderVariants, [
    'uppercase',
    'text-fg-secondary',
    'data-[disabled]:opacity-45'
  ]);
  assert.deepEqual(recipes.paginationIconVariants, ['rtl:rotate-180']);
  // Only the link recipe carries the selected-pill paint (R1), and only behind aria-current; the root, the row, the
  // ellipsis and the arrows paint nothing, and no recipe moves, animates or scales.
  const paint =
    /^(?:bg|border|shadow|ring|outline|backdrop|filter|transition|animate|duration|ease|transform|rounded)\b/;
  for (const name of [
    'paginationVariants',
    'paginationListVariants',
    'paginationEllipsisVariants',
    'paginationIconVariants',
    'paginationPlaceholderVariants'
  ]) {
    for (const utility of recipes[name]) {
      assert.doesNotMatch(utility, paint, `${name} lists the paint or motion utility ${utility}`);
    }
  }
  for (const utility of recipes.paginationLinkVariants.filter((name) =>
    /state-selected|gradient-chip|edge-strong/.test(name)
  )) {
    assert.ok(utility.startsWith('aria-[current=page]:'), `${utility} must sit behind aria-current`);
  }
  for (const classes of Object.values(recipes)) {
    for (const utility of classes) {
      assert.doesNotMatch(utility, /(?:^|:)(?:animate|transform|translate|scale|skew)\b/, utility);
    }
  }
  // It composes the exported Icon itself; no Surface, no Radix part and no part marker.
  assert.deepEqual(
    pagination.composedOf.map(({ name }) => name),
    ['Icon']
  );
  assert.equal(pagination.composedOf[0].source, 'packages/ui/src/molecules/pagination/Pagination.tsx');
  assert.deepEqual(pagination.parts, []);
  assert.deepEqual(pagination.surfaceUsage, []);
  // Two new conventions, approved by their own receipt; each lists Pagination as its only component.
  for (const [id, name] of [
    ['page-count', 'pageCount'],
    ['page-href', 'getHref']
  ]) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.ok(convention, id);
    assert.equal(convention.name, name, id);
    assert.equal(convention.status, 'approved', id);
    assert.deepEqual(convention.components, ['Pagination'], id);
  }
  // The four reused conventions keep their approved status and list Pagination beside the other components.
  for (const id of ['accessible-name', 'primary-value', 'localized-messages', 'navigation-intent']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('Pagination'), id);
  }
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'Pagination'),
    {
      name: 'Pagination',
      level: 'molecule',
      package: '@egdev/ui',
      radix: '— (native nav, list and anchors)',
      composes: ['Icon'],
      action: 'nuevo',
      available: true
    }
  );
});

test('Embed publishes its six own props, the four static recipes, the Surface well it composes, its new convention and the reused ones (#574)', () => {
  const artifact = read('packages/system/design-system.json');
  const embed = artifact.components.find(({ name }) => name === 'Embed');
  assert.ok(embed, 'the artifact lists Embed');
  assert.equal(embed.package, '@egdev/ui');
  assert.equal(embed.source, 'packages/ui/src/atoms/embed/types.ts');
  // The six own props, merged across the two union branches; the native iframe picks come from node_modules.
  assert.deepEqual(
    embed.props.map(({ name }) => name),
    ['children', 'fallback', 'label', 'loading', 'ratio', 'src']
  );
  const prop = (name) => embed.props.find((item) => item.name === name);
  assert.deepEqual([prop('label').type, prop('label').required], ['string', true]);
  assert.deepEqual([prop('ratio').type, prop('ratio').required], ['number', false]);
  assert.deepEqual([prop('src').type, prop('src').required], ['string', false]);
  assert.equal(prop('fallback').required, false);
  assert.equal(prop('children').required, false);
  // The artifact names an enum prop by its docgen type; the allowed values are pinned by the Controls suite.
  assert.equal(prop('loading').type, 'enum');
  assert.equal(prop('loading').required, false);
  // Only the two constants carry a default.
  assert.deepEqual(
    embed.props.map(({ name, default: value }) => [name, value]),
    [
      ['children', null],
      ['fallback', null],
      ['label', null],
      ['loading', 'lazy'],
      ['ratio', '16 / 9'],
      ['src', null]
    ]
  );
  assert.match(prop('label').description, /never rendered visibly/);
  assert.match(prop('src').description, /http: and https: URLs are accepted/);
  assert.match(prop('fallback').description, /There is no built-in text/);
  // No title, role, naming attribute, handler, inline style, ref, asChild or appearance axis is published.
  for (const name of [
    'title',
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-hidden',
    'aria-busy',
    'tabIndex',
    'style',
    'dangerouslySetInnerHTML',
    'onClick',
    'onKeyDown',
    'onError',
    'srcDoc',
    'ref',
    'asChild',
    'className',
    'variant',
    'size',
    'tone'
  ]) {
    assert.ok(!embed.props.some((item) => item.name === name), `Embed must not publish ${name}`);
  }
  // No @classNameAllows tag: className supports the DS046 base placement list only, so no extra property is allowed.
  assert.equal(Object.hasOwn(embed, 'classNameAllows'), false);
  // Four private static recipes: the approved inventory and nothing else, and no stylesheet part.
  assert.deepEqual(
    embed.variants.map(({ name }) => name),
    ['embedFallbackVariants', 'embedFrameVariants', 'embedLoadingVariants', 'embedVariants']
  );
  const recipes = Object.fromEntries(
    embed.variants.map(({ name, classes }) => [name, classes.join(' ').split(/\s+/).filter(Boolean)])
  );
  assert.deepEqual(recipes.embedVariants, ['eg-embed', 'min-w-0', 'overflow-hidden']);
  assert.deepEqual(recipes.embedLoadingVariants, [
    'absolute',
    'inset-0',
    'grid',
    'place-items-center',
    'text-fg-muted'
  ]);
  assert.deepEqual(recipes.embedFrameVariants, ['relative', 'block', 'size-full', 'border-0']);
  assert.deepEqual(recipes.embedFallbackVariants, [
    'box-border',
    'grid',
    'size-full',
    'place-items-center',
    'p-6',
    'text-center',
    'font-sans',
    'text-body-default',
    'text-fg-muted'
  ]);
  // Nothing in the recipes paints Material, transitions, transforms or animates: the Material is the Surface well.
  for (const classes of Object.values(recipes)) {
    for (const utility of classes) {
      assert.doesNotMatch(
        utility,
        /^(?:bg|shadow|ring|backdrop|filter|transition|animate|duration|ease|transform|translate|scale|rotate|rounded)\b/,
        utility
      );
    }
  }
  assert.deepEqual(embed.parts, []);
  // It composes the exported AspectRatio and Spinner (read from the JSX tags) and one Surface well recipe in the hook.
  assert.deepEqual(embed.composedOf.map(({ name }) => name).sort(), ['AspectRatio', 'Spinner']);
  for (const { source } of embed.composedOf) {
    assert.equal(source, 'packages/ui/src/atoms/embed/Embed.tsx');
  }
  assert.deepEqual(embed.surfaceUsage, [
    {
      source: 'packages/ui/src/atoms/embed/useEmbed.ts',
      arguments: "{ tone: 'well', padding: 'none', radius: 'xl' }"
    }
  ]);
  // The new convention is approved by its own receipt and lists Embed as its only component.
  const fallback = artifact.propNaming.find((item) => item.id === 'unavailable-content-fallback');
  assert.ok(fallback);
  assert.equal(fallback.name, 'fallback');
  assert.equal(fallback.status, 'approved');
  assert.deepEqual(fallback.components, ['Embed']);
  // The two reused conventions keep their approved status and list Embed beside the other components.
  for (const id of ['accessible-name', 'aspect-ratio']) {
    const convention = artifact.propNaming.find((item) => item.id === id);
    assert.equal(convention.status, 'approved', id);
    assert.ok(convention.components.includes('Embed'), id);
  }
  // src, children, loading and the iframe attributes are native or general: no convention names them.
  assert.ok(!artifact.propNaming.some((item) => item.name === 'src' && item.components.includes('Embed')));
  assert.deepEqual(
    artifact.catalog.find(({ name }) => name === 'Embed'),
    {
      name: 'Embed',
      level: 'atom',
      package: '@egdev/ui',
      radix: 'AspectRatio',
      // Like every multi-part cell of the catalog, the composition is one comma-separated entry.
      composes: ['Spinner, Surface recipe'],
      action: 'nuevo',
      available: true
    }
  );
});

test('The four scenes publish titleVariant with its default and gain no recipe axis, and its convention lists them (#560)', () => {
  const artifact = read('packages/system/design-system.json');
  // The own props of each scene before #560, plus the one new prop, in the artifact's alphabetical order.
  const scenes = [
    ['Hero', ['accent', 'children', 'eyebrow', 'id', 'lede', 'level', 'media', 'social', 'title']],
    ['Closing', ['accent', 'children', 'eyebrow', 'id', 'lede', 'level', 'media', 'title']],
    ['ChapterBreak', ['accent', 'eyebrow', 'id', 'lede', 'level', 'media', 'title']],
    ['LabStage', ['accent', 'children', 'eyebrow', 'id', 'lede', 'level', 'media', 'title']]
  ];
  for (const [name, previous] of scenes) {
    const scene = artifact.components.find((item) => item.name === name);
    assert.ok(scene, `the artifact lists ${name}`);
    assert.deepEqual(
      scene.props.map((item) => item.name),
      [...previous, 'titleVariant'],
      name
    );
    const prop = scene.props.find((item) => item.name === 'titleVariant');
    assert.equal(prop.type, 'enum', name);
    assert.equal(prop.required, false, name);
    assert.equal(prop.default, 'hero', name);
    assert.equal(prop.deprecated, false, name);
    assert.match(prop.description, /hero/, name);
    assert.match(prop.description, /show/, name);
    // The choice is Heading's static recipe map: no scene recipe gains an axis or a title class string.
    for (const recipe of scene.variants) {
      for (const classes of recipe.classes) {
        assert.doesNotMatch(classes, /text-title-/, `${name} ${recipe.name}`);
      }
      assert.doesNotMatch(recipe.name, /title/i, `${name} ${recipe.name}`);
    }
  }
  const convention = artifact.propNaming.find((item) => item.id === 'heading-title-variant');
  assert.ok(convention, 'the artifact lists the heading-title-variant convention');
  assert.equal(convention.name, 'titleVariant');
  assert.equal(convention.status, 'approved');
  assert.deepEqual(convention.components, ['ChapterBreak', 'Closing', 'Hero', 'LabStage']);
});

test('NowCard footer documents one optional StepMeter without a prop, part or composition change', () => {
  const artifact = read('packages/system/design-system.json');
  const card = artifact.components.find(({ name }) => name === 'NowCard');
  assert.ok(card);
  // v0.3 is documentation only: the card gains no prop, no part and no composition edge.
  assert.deepEqual(
    card.props.map(({ name }) => name),
    ['children', 'level', 'size', 'statusBadge', 'title']
  );
  assert.deepEqual(
    card.parts.map(({ name }) => name),
    ['NowCardBody', 'NowCardDetail', 'NowCardFooter']
  );
  assert.deepEqual(card.composedOf, []);
  assert.deepEqual(card.classNameAllows, [
    'inline-size',
    'max-inline-size',
    'max-width',
    'min-inline-size',
    'min-width',
    'width'
  ]);
  const footer = card.parts.find(({ name }) => name === 'NowCardFooter');
  assert.match(footer.children, /optionally one StepMeter/);
  assert.match(footer.children, /at most one other child/);
  assert.match(footer.children, /never inspects, reorders or limits its children/);
  assert.ok(!artifact.components.some(({ name }) => name === 'NowCardMeter'));
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

test('Chip link recipe lists the current-state utilities and the merged aria-current declaration stays out of props (#576)', () => {
  const chip = read('packages/system/design-system.json').components.find(({ name }) => name === 'Chip');
  const recipe = chip.variants.find(({ name }) => name === 'chipVariants');
  assert.equal(recipe.classes.length, 4);
  const [base, toggle, , link] = recipe.classes.map((value) => value.split(/\s+/).filter(Boolean));
  // The link entry keeps its 11 v0.2 utilities and gains the 19 of recipe R1.
  assert.equal(link.length, 30);
  for (const utility of [
    'aria-[current=page]:border-state-selected',
    'aria-[current=true]:border-state-selected',
    'aria-[current=true]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
    'aria-[current=true]:shadow-[var(--shadow-edge-strong)]',
    'aria-[current=true]:text-fg-default',
    'aria-[current=true]:focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-[color:Highlight]',
    'forced-colors:aria-[current=true]:outline-[color:Highlight]'
  ]) {
    assert.ok(link.includes(utility), `link recipe lists ${utility}`);
  }
  // The shared base and the toggle recipe carry no current-state utility.
  assert.equal(
    [...base, ...toggle].some((value) => value.includes('aria-[current')),
    false
  );
  // The merged union row of aria-current starts at React's AriaAttributes, so the own-prop filter drops it.
  assert.ok(!chip.props.some(({ name }) => name === 'aria-current'));
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
    ['BreadcrumbItem', 'Breadcrumb'],
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
