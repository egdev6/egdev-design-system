// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';
import { buttonVariants } from '../atoms/button/types';
import { gaugeCircleVariants } from '../atoms/gauge/types';
import {
  breadcrumbCurrentVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  breadcrumbStepVariants,
  breadcrumbVariants
} from '../molecules/breadcrumb/types';
import { carouselSlideVariants, carouselTrackVariants } from '../molecules/carousel/types';
import {
  detailHeaderLinkItemVariants,
  detailHeaderLinksVariants,
  detailHeaderMetaEntryVariants,
  detailHeaderMetaVariants,
  detailHeaderTagLabelVariants,
  detailHeaderTagsVariants,
  detailHeaderTermVariants,
  detailHeaderValueVariants,
  detailHeaderVariants
} from '../molecules/detail-header/types';
import {
  dialogCloseVariants,
  dialogHeaderActionsVariants,
  dialogOverlayVariants,
  dialogScrimVariants,
  dialogSheetBodyMinimumVariants,
  dialogSheetClampTitleVariants,
  dialogSheetFullVariants,
  dialogSheetOverflowVariants
} from '../molecules/dialog/types';
import {
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateVariants
} from '../molecules/empty-state/types';
import {
  paginationEllipsisVariants,
  paginationIconVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationListVariants,
  paginationPlaceholderVariants,
  paginationVariants
} from '../molecules/pagination/types';
import { proseVariants } from '../primitives/prose/types';
import { textBodyVariants, textVariants } from '../primitives/text/types';

let css: string;

// Limited, comment-free emitted CSS: nonempty double-quoted charset strings (no escapes or
// line breaks), and comma-separated dotted ASCII layer names starting with a letter/underscore.
// This checks statement syntax/position, not encoding labels, reserved names or charset ordering.
function isImportPreamble(prefix: string): boolean {
  let position = 0;
  const skipWhitespace = () => {
    while (position < prefix.length && /[ \t\r\n\f]/.test(prefix[position] ?? '')) {
      position++;
    }
  };

  // The cursor only advances; all character tests and keyword lookups have bounded length.
  while (true) {
    skipWhitespace();
    if (position === prefix.length) {
      return true;
    }
    const charset = prefix.startsWith('@charset', position);
    if (!charset && !prefix.startsWith('@layer', position)) {
      return false;
    }
    position += charset ? 8 : 6;
    const keywordEnd = position;
    skipWhitespace();
    if (position === keywordEnd) {
      return false;
    }

    if (charset) {
      if (prefix[position] !== '"') {
        return false;
      }
      position++;
      const stringStart = position;
      while (position < prefix.length && prefix[position] !== '"') {
        if (/[\\\r\n\f]/.test(prefix[position] ?? '')) {
          return false;
        }
        position++;
      }
      if (position === stringStart || position === prefix.length) {
        return false;
      }
      position++;
    } else {
      while (true) {
        if (!/[A-Za-z_]/.test(prefix[position] ?? '')) {
          return false;
        }
        position++;
        while (position < prefix.length && /[A-Za-z0-9_-]/.test(prefix[position] ?? '')) {
          position++;
        }
        if (prefix[position] === '.') {
          position++;
          continue;
        }
        skipWhitespace();
        if (prefix[position] !== ',') {
          break;
        }
        position++;
        skipWhitespace();
      }
    }
    skipWhitespace();
    if (prefix[position] !== ';') {
      return false;
    }
    position++;
  }
}

describe('font import preamble validation', () => {
  it.each([
    '',
    ' \t\r\n\f',
    '@charset "UTF-8";',
    '@charset "semi;colon";',
    '@layer reset;',
    '@layer _reset-2, theme.components;',
    '@layer reset, theme.components, utilities;',
    ' \n@charset "UTF-8";\n@layer reset; @layer theme.components;\n'
  ])('accepts the supported preamble %j', (prefix) => {
    expect(isImportPreamble(prefix)).toBe(true);
  });

  it.each([
    'body { color: red; }',
    '@layer reset {}',
    '@media print {}',
    '@import "other.css";',
    '@charset "UTF-8"',
    '@layer reset',
    '@charset;',
    '@layer;',
    '@charset   ;',
    '@layer \t ;',
    '@charset "";',
    '@charset UTF-8;',
    '@charset "UTF-8;',
    '@charset "UTF-8" extra;',
    '@charset "UTF\n8";',
    '@charset "UTF\\8";',
    "@charset 'UTF-8';",
    '@layered reset;',
    '@charsetx "UTF-8";',
    '@layer reset,;',
    '@layer reset..theme;',
    '@layer reset.;',
    '@layer reset .theme;',
    '@layer 2reset;',
    '@layer reset theme;',
    '@layer "reset";',
    '@layer reset};',
    '@layer reset; body {}'
  ])('rejects the malformed or disallowed preamble %j', (prefix) => {
    expect(isImportPreamble(prefix)).toBe(false);
  });

  it('handles long whitespace and missing delimiters without backtracking', () => {
    const whitespace = ' '.repeat(100_000);
    expect(isImportPreamble(whitespace)).toBe(true);
    expect(isImportPreamble(`@layer ${whitespace};`)).toBe(false);
    expect(isImportPreamble(`@charset ${whitespace}`)).toBe(false);
    expect(isImportPreamble(`@charset "${'a'.repeat(100_000)}`)).toBe(false);
    expect(isImportPreamble(`@layer ${'a'.repeat(100_000)}`)).toBe(false);
    expect(isImportPreamble('@layer reset;\n'.repeat(10_000))).toBe(true);
  });
});

// Match emitted static selectors, not class strings in source files or a full CSS snapshot.
function rule(selector: string, source: string = css) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // The installed optimizer may emit both a fallback and an @supports rule for one selector.
  const matches = [...source.matchAll(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]+)\\}`, 'g'))];
  expect(matches.length, `Missing compiled preview rule ${selector}`).toBeGreaterThan(0);
  return matches.map((match) => match[1]).join('\n');
}

// Declarations of every flat rule whose selector list holds this exact selector, wherever it sits in the list.
// Selector lists split at their top-level commas only: `:where(:dir(rtl), [dir="rtl"])` keeps its own. The lookbehind
// is zero-width, so adjacent rules never consume each other's delimiter.
function emitted(selector: string, source: string = css) {
  const declarations: string[] = [];
  for (const [, list = '', body = ''] of source.matchAll(/(?<=^|[{}])\s*([^{}]+?)\s*\{([^{}]*)\}/g)) {
    const selectors: string[] = [];
    let depth = 0;
    let start = 0;
    for (const [index, character] of [...list].entries()) {
      if (character === '(' || character === '[') {
        depth += 1;
      } else if (character === ')' || character === ']') {
        depth -= 1;
      } else if (character === ',' && depth === 0) {
        selectors.push(list.slice(start, index).trim());
        start = index + 1;
      }
    }
    selectors.push(list.slice(start).trim());
    if (selectors.includes(selector)) {
      declarations.push(body);
    }
  }
  expect(declarations.length, `Missing compiled preview rule ${selector}`).toBeGreaterThan(0);
  return declarations.join('\n');
}

// Inner text of every `@media <query> {…}` block, by brace matching; the rules inside stay flat.
function mediaBlocks(query: string): string[] {
  const opening = `@media ${query} {`;
  const blocks: string[] = [];
  for (let start = css.indexOf(opening); start >= 0; start = css.indexOf(opening, start + opening.length)) {
    let depth = 1;
    let end = start + opening.length;
    while (depth > 0 && end < css.length) {
      const char = css[end];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
      }
      end += 1;
    }
    blocks.push(css.slice(start + opening.length, end - 1));
  }
  expect(blocks.length, `Missing @media ${query} block`).toBeGreaterThan(0);
  return blocks;
}

// Specificity (classes, attributes and pseudo-classes) of one compound selector as the optimizer emits it.
function specificity(selector: string): number {
  const bare = selector.replace(/\\./g, '_');
  const attributes = bare.match(/\[[^\]]*\]/g)?.length ?? 0;
  const withoutAttributes = bare.replace(/\[[^\]]*\]/g, '');
  const pseudoClasses = withoutAttributes.match(/(?<!:):[a-z-]+/g)?.length ?? 0;
  const classes = withoutAttributes.match(/\.[A-Za-z_][\w-]*/g)?.length ?? 0;
  return attributes + pseudoClasses + classes;
}

describe('Storybook preview CSS', () => {
  it('emits marker-free sheet opt-in utilities from the production Dialog recipes', () => {
    expect(rule('.line-clamp-2')).toMatch(/-webkit-line-clamp:\s*2/);
    expect(rule('.wrap-anywhere')).toMatch(/overflow-wrap:\s*anywhere/);
    expect(rule('.basis-0')).toMatch(/flex-basis:/);
    expect(rule('.box-border')).toMatch(/box-sizing:\s*border-box/);
    expect(rule('.max-w-none')).toMatch(/max-width:\s*none/);
    for (const recipe of [
      dialogSheetClampTitleVariants(),
      dialogSheetFullVariants(),
      dialogSheetOverflowVariants(),
      dialogSheetBodyMinimumVariants(),
      dialogHeaderActionsVariants()
    ]) {
      expect(recipe).not.toMatch(/\beg-dialog/);
    }
  });

  it('compiles the shared AlertDialog placement and scrim from production sources without story scanning', {
    timeout: 30_000
  }, async () => {
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss({ optimize: false })],
      logLevel: 'warn',
      build: {
        write: false,
        minify: false,
        cssMinify: false,
        rolldownOptions: {
          input: fileURLToPath(new URL('../styles/compiled.css', import.meta.url))
        }
      }
    });
    const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const stylesheet = assets.find((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
    if (stylesheet?.type !== 'asset') {
      throw new Error('The production UI CSS build must emit a stylesheet');
    }
    const production = String(stylesheet.source);
    expect(production).toMatch(/\.absolute\s*\{[^}]*position:\s*absolute/);
    expect(production).toMatch(/\.fixed\s*\{[^}]*position:\s*fixed/);
    expect(production).toMatch(/\.inset-0\s*\{[^}]*inset:\s*(?:var\(--space-0\)|0)/);
    expect(production).toContain(String.raw`.bg-bg-scrim\/72`);
    const pendingSelector = String.raw`.aria-disabled\:\[\&\:not\(\:disabled\)\]\:pointer-events-auto`;
    const pendingPosition = production.indexOf(pendingSelector);
    expect(pendingPosition).toBeGreaterThanOrEqual(0);
    expect(production.slice(pendingPosition, pendingPosition + 250)).toMatch(/pointer-events:\s*auto/);
    expect(dialogCloseVariants({ pending: true })).toBe('aria-disabled:[&:not(:disabled)]:pointer-events-auto');
    expect(dialogCloseVariants({ pending: false })).toBe('');
    expect(dialogOverlayVariants({ scope: 'container', flush: false }).split(' ')).toContain('absolute');
    expect(dialogOverlayVariants({ scope: 'viewport', flush: false }).split(' ')).toContain('fixed');
    expect(dialogScrimVariants()).not.toContain('eg-');
  });

  it('compiles compact Heading metrics and display family from existing tokens', () => {
    const compact = rule('.text-heading-small');
    for (const [property, token] of [
      ['font-size', '--text-heading-small'],
      ['line-height', '--text-heading-small--line-height'],
      ['font-weight', '--text-heading-small--font-weight'],
      ['letter-spacing', '--text-heading-small--letter-spacing']
    ]) {
      expect(compact).toMatch(new RegExp(`${property}:[^;]*var\\(${token}[,)]`));
    }
    expect(rule('.font-display')).toMatch(/font-family:\s*var\(--font-display[,)]/);
  });
  it('compiles Text body typography, semantic foregrounds and descendant emphasis', () => {
    for (const size of ['body-default', 'body-large', 'body-muted']) {
      expect(rule(`.text-${size}`)).toMatch(new RegExp(`font-size:\\s*var\\(--text-${size}[,)]`));
    }
    for (const color of ['fg-default', 'fg-secondary', 'fg-muted', 'status-warning', 'status-danger', 'fg-on-flood']) {
      expect(rule(`.text-${color}`)).toMatch(new RegExp(`color:\\s*var\\(--color-${color}[,)]`));
    }
    const selector = String.raw`.\[\&_strong\]\:\[font-weight\:var\(--text-heading-small--font-weight\)\]`;
    const index = css.indexOf(selector);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(css.slice(index, index + 300)).toMatch(
      /strong[\s\S]*font-weight:\s*var\(--text-heading-small--font-weight\)/
    );
  });
  it('compiles Text truncation and eyebrow utilities from the static Text recipes', () => {
    expect(rule('.block')).toMatch(/display:\s*block/);
    expect(rule('.min-w-0')).toMatch(/min-width:\s*var\(--space-0[,)]/);
    const truncate = rule('.truncate');
    expect(truncate).toMatch(/overflow:\s*hidden/);
    expect(truncate).toMatch(/text-overflow:\s*ellipsis/);
    expect(truncate).toMatch(/white-space:\s*nowrap/);
    for (const [selector, declaration] of [
      [String.raw`.before\:inline-block`, /display:\s*inline-block/],
      [String.raw`.before\:me-2\.5`, /margin-inline-end:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)/]
    ] as const) {
      const index = css.indexOf(selector);
      expect(index, selector).toBeGreaterThanOrEqual(0);
      expect(css.slice(index, index + 500)).toMatch(declaration);
    }
    for (const name of ['block', 'min-w-0', 'truncate']) {
      expect(textVariants({ variant: 'eyebrow', truncate: true }).split(/\s+/)).toContain(name);
      expect(textBodyVariants({ variant: 'body', truncate: true }).split(/\s+/)).toContain(name);
    }
    for (const name of ['before:inline-block', 'before:me-2.5']) {
      expect(textVariants({ variant: 'eyebrow', truncate: true }).split(/\s+/)).toContain(name);
    }
  });

  it('compiles Collapsible retained presence, spacing and motion reset selectors', () => {
    expect(rule('.p-2')).toMatch(/padding:\s*var\(--space-2[,)]/);
    const transitionReset = css.indexOf(String.raw`.\[transition-property\:none\]`);
    expect(transitionReset).toBeGreaterThanOrEqual(0);
    expect(css.slice(transitionReset, transitionReset + 250)).toMatch(/transition-property:\s*none/);
    const closed = css.indexOf(String.raw`.data-\[state\=closed\]\:hidden`);
    expect(closed).toBeGreaterThanOrEqual(0);
    expect(css.slice(closed, closed + 200)).toMatch(/display:\s*none/);
    for (const selector of [
      String.raw`.data-\[state\=closed\]\:hidden`,
      String.raw`.\[\&\:not\(\[aria-disabled\=true\]\)\:active\]\:translate-none`,
      String.raw`.\[\&\:not\(\[aria-disabled\=true\]\)\:active\]\:scale-100`,
      String.raw`.group-data-\[state\=open\]\/collapsible\:rotate-0`,
      String.raw`.\[\&\>\:first-child\]\:grow`,
      String.raw`.\[\&\>\:first-child\]\:basis-14`,
      String.raw`.\[\&\>\:first-child\]\:min-w-14`
    ]) {
      expect(css.includes(selector), selector).toBe(true);
    }
  });
  it('compiles the Switch thumb logical inset and RTL travel (#432)', () => {
    expect(rule('.start-0\\.5')).toMatch(/inset-inline-start:\s*calc\(var\(--space-1\)\s*\*\s*0?\.5\)/);
    const selector = String.raw`.rtl\:data-\[state\=checked\]\:-translate-x-4`;
    const index = css.indexOf(selector);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(css.slice(index, index + 400)).toMatch(/dir\(rtl\)|\[dir=["']?rtl/);
    // The RTL rule must move the thumb in the negative inline direction.
    expect(css.slice(index, index + 400)).toMatch(/--tw-translate-x:\s*calc\([^;]*\*\s*-1\)/);
  });
  it('emits Button label wrapping utilities from the production scan', () => {
    expect(rule('.whitespace-normal')).toMatch(/white-space:\s*normal/);
    expect(rule('.wrap-anywhere')).toMatch(/overflow-wrap:\s*anywhere/);
    expect(rule('.text-center')).toMatch(/text-align:\s*center/);
    for (const utility of ['whitespace-normal', 'wrap-anywhere', 'text-center']) {
      expect(buttonVariants({ labelWrap: true }).split(/\s+/)).toContain(utility);
    }
  });
  it('emits PageHeader intrinsic geometry, token typography and constrained story layout', () => {
    expect(rule(String.raw`.basis-\[calc\(var\(--space-24\)\*3\)\]`)).toMatch(
      /flex-basis:\s*calc\(var\(--space-24\)\s*\*\s*3\)/
    );
    expect(rule(String.raw`.max-w-\[calc\(var\(--space-24\)\*3\)\]`)).toMatch(
      /max-width:\s*calc\(var\(--space-24\)\s*\*\s*3\)/
    );
    expect(rule('.gap-x-6')).toMatch(/column-gap:\s*var\(--space-6[,)]/);
    expect(rule('.gap-y-4')).toMatch(/row-gap:\s*var\(--space-4[,)]/);
    expect(rule('.text-heading-small')).toMatch(/font-size:\s*var\(--text-heading-small[,)]/);
    expect(rule('.text-label-eyebrow')).toMatch(/font-size:\s*var\(--text-label-eyebrow[,)]/);
    expect(rule('.text-body-default')).toMatch(/font-size:\s*var\(--text-body-default[,)]/);
    expect(rule('.text-fg-secondary')).toMatch(/color:\s*var\(--color-fg-secondary[,)]/);
    expect(rule('.gap-3')).toMatch(/gap:\s*var\(--space-3[,)]/);
    expect(rule('.items-start')).toMatch(/align-items:\s*flex-start/);
    expect(rule('.flex-none')).toMatch(/flex:\s*none/);
    expect(rule('.flex-1')).toMatch(/flex:\s*1/);
    expect(rule('.wrap-anywhere')).toMatch(/overflow-wrap:\s*anywhere/);
    expect(css).not.toMatch(/\.eg-page-header\s*[,{]/);
  });
  beforeAll(async () => {
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss()],
      logLevel: 'warn',
      build: {
        write: false,
        minify: false,
        cssMinify: false,
        rolldownOptions: {
          input: fileURLToPath(new URL('../../../../.storybook/preview.css', import.meta.url))
        }
      }
    });
    const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const stylesheet = assets.find((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
    if (stylesheet?.type !== 'asset') {
      throw new Error('The actual Storybook preview must emit a CSS asset');
    }
    css = String(stylesheet.source).replace(/\/\*[\s\S]*?\*\//g, '');
  }, 30_000);

  it.each([
    ['.w-75', /width:\s*calc\(var\(--space-1\)\s*\*\s*75\)/],
    [String.raw`.min-w-\[calc\(var\(--space-1\)\*7\.5\)\]`, /min-width:\s*calc\(var\(--space-1\)\s*\*\s*7\.5\)/],
    [String.raw`.py-\[calc\(var\(--space-1\)\*1\.5625\)\]`, /padding-block:\s*calc\(var\(--space-1\)\s*\*\s*1\.5625\)/],
    [String.raw`.mt-\[calc\(var\(--space-1\)\*5\.625\)\]`, /margin-top:\s*calc\(var\(--space-1\)\s*\*\s*5\.625\)/],
    [String.raw`.mb-\[calc\(var\(--space-1\)\*1\.875\)\]`, /margin-bottom:\s*calc\(var\(--space-1\)\s*\*\s*1\.875\)/],
    ['.gap-0', /gap:\s*var\(--space-0[,)]/],
    [String.raw`.px-\[calc\(var\(--space-1\)\*2\.5\)\]`, /padding-inline:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)/],
    [String.raw`.py-\[calc\(var\(--space-1\)\*2\.1875\)\]`, /padding-block:\s*calc\(var\(--space-1\)\s*\*\s*2\.1875\)/],
    [String.raw`.gap-\[calc\(var\(--space-1\)\*3\.125\)\]`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*3\.125\)/],
    [
      String.raw`.border-s-\[length\:calc\(var\(--space-1\)\*0\.625\)\]`,
      /border-inline-start-width:\s*calc\(var\(--space-1\)\s*\*\s*0?\.625\)/
    ],
    ['.border-bg-flood', /border-color:\s*var\(--color-bg-flood[,)]/],
    ['.border-transparent', /border-color:\s*(?:transparent|#0000(?:0000)?)/],
    [String.raw`.size-\(--icon-size\)`, /width:\s*var\(--icon-size\)/]
  ])('emits NavList/Sidebar token geometry for %s', (selector, declaration) => {
    expect(rule(selector)).toMatch(declaration);
  });

  it('emits the NavList typography, Surface and attribute-driven hover/current paint', () => {
    const surfacePadding = css.indexOf('.p-0 {');
    const rowPaddingX = css.indexOf(String.raw`.px-\[calc\(var\(--space-1\)\*2\.5\)\] {`);
    const rowPaddingY = css.indexOf(String.raw`.py-\[calc\(var\(--space-1\)\*2\.1875\)\] {`);
    expect(surfacePadding).toBeGreaterThanOrEqual(0);
    expect(rowPaddingX).toBeGreaterThan(surfacePadding);
    expect(rowPaddingY).toBeGreaterThan(surfacePadding);
    expect(rule('.text-nav-row')).toMatch(/font-size:\s*var\(--text-nav-row[,)]/);
    expect(rule('.text-nav-count')).toMatch(/font-size:\s*var\(--text-nav-count[,)]/);
    expect(rule('.font-mono')).toMatch(/font-family:\s*var\(--font-mono[,)]/);
    expect(rule(String.raw`.leading-\[var\(--text-nav-group--line-height\)\]`)).toContain(
      'var(--text-nav-group--line-height)'
    );
    expect(rule(String.raw`.font-\[var\(--text-label-default--font-weight\)\]`)).toContain(
      'var(--text-label-default--font-weight)'
    );
    const firstGroup = css.indexOf(String.raw`.group-\[\:nth-child\(1_of_\[data-nav-group\]\)\]\/nav-group\:mt-`);
    expect(firstGroup).toBeGreaterThanOrEqual(0);
    expect(css.slice(firstGroup, firstGroup + 500)).toMatch(/:nth-child\(1\s+of\s+\[data-nav-group\]\)/);
    expect(css.slice(firstGroup, firstGroup + 500)).toMatch(/margin-top:\s*calc\(var\(--space-1\)\s*\*\s*1\.25\)/);
    const group = rule('.text-nav-group');
    expect(group).toMatch(/font-size:\s*var\(--text-nav-group[,)]/);
    expect(group).toContain('var(--text-nav-group--line-height');
    expect(group).toContain('var(--text-nav-group--letter-spacing');
    expect(rule(String.raw`.leading-\[var\(--text-label-default--line-height\)\]`)).toContain(
      'var(--text-label-default--line-height)'
    );
    expect(rule(String.raw`.tracking-\[var\(--text-label-default--letter-spacing\)\]`)).toContain(
      'var(--text-label-default--letter-spacing)'
    );
    expect(rule(String.raw`.font-\[var\(--text-body-muted--font-weight\)\]`)).toContain(
      'var(--text-body-muted--font-weight)'
    );
    expect(rule(String.raw`.font-\[var\(--text-label-eyebrow--font-weight\)\]`)).toContain(
      'var(--text-label-eyebrow--font-weight)'
    );
    expect(rule(String.raw`.size-\(--icon-size\)`)).toMatch(/height:\s*var\(--icon-size\)/);
    expect(rule('.bg-surface-2')).toMatch(/background-color:\s*var\(--color-surface-2[,)]/);
    expect(rule(String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`)).toContain('var(--gradient-sheen)');
    const edge = rule('.shadow-edge');
    expect(edge).toMatch(/--tw-shadow:\s*inset 0 1px 0/);
    expect(edge).not.toContain('--shadow-elev-');
    expect(rule('.border-0')).toMatch(/border-width:\s*0(?:px)?\s*;/);
    expect(css.indexOf(String.raw`.border-s-\[length\:calc\(var\(--space-1\)\*0\.625\)\] {`)).toBeGreaterThan(
      css.indexOf('.border-0 {')
    );
    const hover = css.indexOf(String.raw`.hover\:bg-surface-2`);
    expect(hover).toBeGreaterThanOrEqual(0);
    expect(css.slice(hover, hover + 300)).toMatch(/background-color:\s*var\(--color-surface-2[,)]/);
    for (const selector of [
      String.raw`.group-aria-\[current\=page\]\/nav-link\:block`,
      String.raw`.focus-visible\:outline-\[var\(--color-focus-ring-inverse\)\]`
    ]) {
      expect(css, selector).toContain(selector);
    }
  });

  it('emits TopBar v0.3 typography, bottom indicator, Surface backing and state overrides', () => {
    const text = rule('.text-body-large');
    expect(text).toContain('var(--text-body-large');
    expect(text).toContain('var(--text-body-large--line-height');
    expect(text).toContain('var(--text-body-large--font-weight');
    expect(text).toContain('var(--text-body-large--letter-spacing');
    expect(rule('.gap-8')).toMatch(/gap:\s*var\(--space-8[,)]/);
    expect(rule('.bg-surface-1')).toContain('var(--color-surface-1');
    expect(rule(String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`)).toContain('var(--gradient-sheen)');
    for (const selector of [
      String.raw`.after\:-bottom-px`,
      String.raw`.after\:h-\[calc\(var\(--space-1\)\*0\.625\)\]`,
      String.raw`.after\:w-full`,
      String.raw`.aria-\[current\=page\]\:after\:bg-bg-flood`,
      String.raw`.aria-\[current\=page\]\:font-\[var\(--text-label-default--font-weight\)\]`,
      String.raw`.data-\[state\=glass\]\:bg-none`,
      String.raw`.data-\[state\=transparent\]\:bg-none`,
      String.raw`.data-\[state\=transparent\]\:bg-transparent`
    ]) {
      expect(css, selector).toContain(selector);
    }
    const declarationAfter = (selector: string) => css.slice(css.indexOf(selector), css.indexOf(selector) + 700);
    expect(declarationAfter(String.raw`.after\:h-\[calc\(var\(--space-1\)\*0\.625\)\]`)).toMatch(
      /height:\s*calc\(var\(--space-1\)\s*\*\s*0?\.625\)/
    );
    expect(declarationAfter(String.raw`.aria-\[current\=page\]\:after\:bg-bg-flood`)).toContain('--color-bg-flood');
    expect(
      declarationAfter(String.raw`.aria-\[current\=page\]\:font-\[var\(--text-label-default--font-weight\)\]`)
    ).toContain('--text-label-default--font-weight');
  });

  it('compiles Toast floating elevation, viewport sizing, swipe and reduced-motion utilities', () => {
    expect(rule(String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`)).toMatch(
      /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)/
    );
    expect(rule(String.raw`.w-\[min\(calc\(100vw-2\*var\(--space-6\)\)\,calc\(var\(--space-24\)\*4\)\)\]`)).toMatch(
      /width:\s*min\(calc\(100vw\s*-\s*2\s*\*\s*var\(--space-6\)\)/
    );
    for (const selector of [
      String.raw`.starting\:opacity-0`,
      String.raw`.data-\[swipe\=move\]\:translate-x-\[var\(--radix-toast-swipe-move-x\)\]`,
      String.raw`.data-\[swipe\=cancel\]\:translate-x-0`,
      String.raw`.data-\[swipe\=cancel\]\:transition-transform`,
      String.raw`.motion-reduce\:transition-none`,
      String.raw`.motion-reduce\:data-\[swipe\=cancel\]\:transition-none`
    ]) {
      expect(css).toContain(selector);
    }
    expect(css).toContain('@starting-style');
    expect(rule('.bottom-6')).toMatch(/bottom:\s*var\(--space-6[,)]/);
    expect(rule('.end-6')).toMatch(/inset-inline-end:\s*var\(--space-6[,)]/);
  });

  it('compiles Timeline viewport caps, legacy geometry resets and inset focus from static CVA', () => {
    for (const multiplier of [2, 3, 4]) {
      expect(rule(`.max-h-\\[calc\\(var\\(--space-24\\)\\*${multiplier}\\)\\]`)).toMatch(
        new RegExp(String.raw`max-height:\s*calc\(var\(--space-24\)\s*\*\s*${multiplier}\)`)
      );
    }
    expect(rule('.block')).toMatch(/display:\s*block/);
    expect(rule('.whitespace-normal')).toMatch(/white-space:\s*normal/);
    expect(rule('.\\[overflow-wrap\\:anywhere\\]')).toMatch(/overflow-wrap:\s*anywhere/);
    expect(rule('.focus-visible\\:-outline-offset-\\(--focus-width\\):focus-visible')).toMatch(
      /outline-offset:\s*calc\(var\(--focus-width\)\s*\*\s*-1\)/
    );
  });

  it('no longer compiles retired HoverCard bounds or root utilities (#220)', () => {
    expect(css).not.toMatch(/--radix-hover-card-content-available-(?:width|height)/);
    expect(css).not.toMatch(/\.eg-hover-card\s*[,{]/);
  });

  it('compiles SocialLinks resets, caption typography and delegated wrapping layouts alongside legacy styles', () => {
    expect(rule('.list-none')).toMatch(/list-style-type:\s*none/);
    expect(rule('.shrink-0')).toMatch(/flex-shrink:\s*0/);
    expect(rule('.text-label-eyebrow')).toMatch(/font-size:\s*var\(--text-label-eyebrow[,)]/);
    expect(rule('.text-label-eyebrow')).toMatch(
      /letter-spacing:\s*(?:var\(--tw-tracking,\s*)?var\(--text-label-eyebrow--letter-spacing[,)]/
    );
    expect(rule('.text-fg-secondary')).toMatch(/color:\s*var\(--color-fg-secondary[,)]/);
    expect(rule('.font-display')).toMatch(/font-family:\s*var\(--font-display[,)]/);
    for (const gap of [1, 2, 3, 4]) {
      expect(rule(`.gap-${gap}`)).toMatch(new RegExp(`gap:\\s*var\\(--space-${gap}[,)]`));
    }
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap/);
    expect(rule('.flex-row')).toMatch(/flex-direction:\s*row/);
    expect(css).toMatch(/\.eg-social__list>li|\.eg-social__list\s*>\s*li/);
  });

  it('compiles MeterRow wrapping, typography and key utilities from its production CVA source', () => {
    expect(rule('.gap-x-3')).toMatch(/column-gap:\s*var\(--space-3[,)]/);
    expect(rule('.gap-y-1')).toMatch(/row-gap:\s*var\(--space-1[,)]/);
    expect(rule(String.raw`.\[overflow-wrap\:anywhere\]`)).toMatch(/overflow-wrap:\s*anywhere/);
    expect(rule('.text-label-default')).toMatch(/font-size:\s*var\(--text-label-default[,)]/);
    expect(rule(String.raw`.leading-\[var\(--text-body-default--line-height\)\]`)).toMatch(
      /line-height:\s*var\(--text-body-default--line-height[,)]/
    );
    expect(rule(String.raw`.font-\[var\(--text-body-muted--font-weight\)\]`)).toMatch(
      /font-weight:\s*var\(--text-body-muted--font-weight[,)]/
    );
    expect(rule('.bg-fg-brand-default')).toMatch(/background-color:\s*var\(--color-fg-brand-default[,)]/);
    expect(rule('.bg-fg-muted')).toMatch(/background-color:\s*var\(--color-fg-muted[,)]/);
  });

  it('compiles Notice tint opacity, token typography and responsive basis from molecule sources', () => {
    for (const color of ['fg-secondary', 'status-info', 'status-success', 'status-warning', 'status-danger']) {
      for (const [prefix, opacity] of [
        ['border', 30],
        ['from', 11],
        ['to', 4]
      ] as const) {
        const emitted = rule(`.${prefix}-${color}\\/${opacity}`);
        expect(emitted).toContain(`var(--color-${color}`);
        expect(emitted).toContain(`${opacity}%, transparent)`);
      }
    }
    expect(rule('.bg-linear-to-b')).toMatch(/background-image:\s*linear-gradient/);
    expect(rule(String.raw`.basis-\[calc\(var\(--space-24\)\*2\.5\)\]`)).toMatch(
      /flex-basis:\s*calc\(var\(--space-24\)\s*\*\s*2\.5\)/
    );
    expect(rule('.text-body-default')).toContain('var(--text-body-default');
    expect(rule('.text-label-default')).toContain('var(--text-label-default');
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap/);
  });

  it('compiles Gauge geometry and the static utilities that make its ring valid', () => {
    expect(rule('.inline-flex')).toMatch(/display:\s*inline-flex\s*;/);
    expect(rule('.w-auto')).toMatch(/width:\s*auto\s*;/);
    expect(rule('.h-auto')).toMatch(/height:\s*auto\s*;/);
    expect(rule('.relative')).toMatch(/position:\s*relative\s*;/);
    expect(rule('.border-0')).toMatch(/border-(?:width|style):/);
    for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
      for (const [prefix, property] of [
        ['w', 'width'],
        ['h', 'height']
      ]) {
        expect(rule(`.${prefix}-\\[var\\(--${size}\\)\\]`)).toMatch(
          new RegExp(`${property}:\\s*var\\(--${size}\\)\\s*;`)
        );
      }
    }
    for (const stroke of ['3px', '4px', '6px']) {
      expect(rule(`.\\[--eg-gauge-stroke\\:${stroke}\\]`)).toContain(`--eg-gauge-stroke: ${stroke};`);
    }
    expect(rule(String.raw`.\[--eg-gauge-stroke\:calc\(var\(--eg-gauge-size\)\/14\)\]`)).toMatch(
      /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)\s*;/
    );
    expect(rule(String.raw`.\[--eg-gauge-fill\:var\(--color-fg-brand-default\)\]`)).toMatch(
      /--eg-gauge-fill:\s*var\(--color-fg-brand-default\)\s*;/
    );
    expect(rule(String.raw`.\[--eg-gauge-track\:--alpha\(var\(--color-fg-default\)\/10\%\)\]`)).toMatch(
      /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)\s*;/
    );
    expect(css).not.toMatch(/--alpha\s*\(/);
    const arc = rule('.eg-gauge-arc');
    expect(arc).toMatch(/position:\s*absolute\s*;/);
    expect(arc).toMatch(/inset:\s*0\s*;/);
    expect(arc).toMatch(
      /background:\s*conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\), var\(--eg-gauge-track\) 0\)\s*;/
    );
    expect(arc).toMatch(/mask:\s*radial-gradient\([^;]*var\(--eg-gauge-stroke\)/);
    expect(rule('.eg-gauge-center')).toMatch(/inset:\s*30%\s*;/);
  });

  it.each([
    ['box-border', '.box-border', /box-sizing:\s*border-box\s*;/],
    ['p-0', '.p-0', /padding:\s*var\(--space-0\)\s*;/],
    ['border-0', '.border-0', /border-width:\s*0(?:px)?\s*;/],
    ['border-solid', '.border-solid', /border-style:\s*solid\s*;/],
    [
      'border-[var(--color-border-hairline)]',
      String.raw`.border-\[var\(--color-border-hairline\)\]`,
      /border-color:\s*var\(--color-border-hairline\)\s*;/
    ],
    [
      'rounded-[var(--radius-full)]',
      String.raw`.rounded-\[var\(--radius-full\)\]`,
      /border-radius:\s*var\(--radius-full\)\s*;/
    ],
    ['bg-transparent', '.bg-transparent', /background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/],
    ['bg-none', '.bg-none', /background-image:\s*none\s*;/],
    ['[box-shadow:none]', String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none\s*;/],
    [
      'text-fg-default',
      '.text-fg-default',
      /color:\s*var\(--color-fg-default(?:,\s*var\(--color-primitive-white\))?\)\s*;/
    ]
  ])('emits the native Gauge transparent-frame utility %s', (utility, selector, declaration) => {
    // Inspect the exact emitted utility, not a legacy or retired component's Material recipe.
    expect(rule(selector)).toMatch(declaration);
    expect(gaugeCircleVariants().split(/\s+/)).toContain(utility);
  });

  it('compiles GaugeGroup slot and shared-center geometry alongside the Gauge engine', () => {
    expect(rule('.eg-gauge-group-slot')).toMatch(/position:\s*absolute\s*;/);
    expect(rule('.eg-gauge-group-slot')).toMatch(/inset:\s*var\(--eg-gauge-group-slot-inset\)/);
    expect(rule('.eg-gauge-group-center')).toMatch(/inset:\s*var\(--eg-gauge-group-center-inset\)/);
    expect(rule('.eg-gauge-group-center')).toMatch(/display:\s*grid\s*;/);
    expect(rule('.eg-gauge-arc')).toMatch(/conic-gradient/);
    expect(css).toMatch(/--eg-gauge-group-slot-inset:\s*var\(--space-0\)/);
    expect(css).toMatch(/--eg-gauge-group-slot-inset:\s*calc\(var\(--space-1\)\s*\+\s*var\(--space-1\)\)/);
    expect(css).toMatch(/--eg-gauge-group-slot-inset:\s*calc\(\(var\(--space-1\)\s*\+\s*var\(--space-1\)\)\s*\*\s*2\)/);
    for (const inset of [3, 5]) {
      expect(css).toContain(`--eg-gauge-group-center-inset: var(--space-${inset})`);
    }
  });

  it('no longer compiles retired GaugeDock axis or separator utilities (#220)', () => {
    expect(css).not.toMatch(/eg-gauge-dock/);
    expect(css).not.toContain(String.raw`.data-\[orientation\=vertical\]\:h-6`);
    expect(css).not.toContain(String.raw`.data-\[orientation\=horizontal\]\:w-6`);
  });

  it('keeps Gauge independent of Surface imports and class identities', () => {
    for (const file of ['Gauge.tsx', 'types.ts', 'useGauge.ts']) {
      const source = readFileSync(new URL(`../atoms/gauge/${file}`, import.meta.url), 'utf8');
      expect(source).not.toMatch(/(?:from\s*['"][^'"]*surface|\beg-surface\b|<Surface\b)/i);
    }
  });

  it('preserves the original half-pixel inner-edge smoothing without changing the stroke origin', () => {
    const arc = rule('.eg-gauge-arc');
    expect(arc).toMatch(/transparent calc\(100% - var\(--eg-gauge-stroke\)\)/);
    expect(arc).toMatch(/(?:black|#000(?:000)?) calc\(100% - var\(--eg-gauge-stroke\) \+ 0?\.5px\)/);
  });

  it('compiles ModuleCard production states and molecule story layout without a stylesheet', () => {
    expect(rule('.col-span-full')).toMatch(/grid-column:\s*1\s*\/\s*-1/);
    expect(rule('.grid-cols-2')).toMatch(/grid-template-columns:/);
    expect(rule('.transform-none')).toMatch(/transform:\s*none/);
    expect(rule('.overflow-visible')).toMatch(/overflow:\s*visible/);
    for (const selector of [
      String.raw`.data-\[state\=stopped\]\:bg-transparent`,
      String.raw`.data-\[state\=stopped\]\:bg-none`,
      String.raw`.data-\[state\=stopped\]\:shadow-none`,
      String.raw`.data-\[state\=stopped\]\:border-dashed`,
      String.raw`.data-\[tone\=overlay\]\:bg-none`,
      String.raw`.group-data-\[tone\=overlay\]\/module-card\:px-5`
    ]) {
      expect(css, selector).toContain(selector);
    }
    const preview = readFileSync(new URL('../../../../.storybook/preview.css', import.meta.url), 'utf8');
    expect(preview).toContain('@source "../packages/ui/src/molecules/**/*.stories.tsx";');
    expect(preview).toContain('@source "../packages/ui/src/templates/app-shell/AppShell.stories.tsx";');
  });

  it('emits the AppShell literal viewport threshold and docking utilities from the template scan', () => {
    // #130 D3–D5: the approved threshold is a literal arbitrary media variant, so a missing
    // at-rule must fail loudly instead of silently producing no CSS.
    for (const selector of [String.raw`.min-\[56rem\]\:block`, String.raw`.min-\[56rem\]\:hidden`]) {
      expect(css, selector).toContain(selector);
    }
    expect(css).toContain(String.raw`.max-\[56rem\]\:hidden`);
    const threshold = css.indexOf(String.raw`.min-\[56rem\]\:block`);
    const prelude = css.slice(Math.max(0, threshold - 200), threshold).replace(/\s+/g, ' ');
    expect(prelude, prelude).toMatch(/\(width\s*>=\s*56rem\)|\(min-width:\s*56rem\)/);
    expect(rule('.sticky')).toMatch(/position:\s*sticky/);
    expect(rule('.h-dvh')).toMatch(/height:\s*100dvh/);
    expect(rule('.min-w-0')).toMatch(/min-width:\s*var\(--space-0[,)]/);
  });

  it('compiles the Footer HostFade host utility only because the preview scans the story source (#565)', () => {
    // HostFade documents the host-owned fade: the host hides the footer's own wash through the stable eg-footer marker.
    // Production code never uses this utility, so it exists only when the preview scans Footer.stories.tsx.
    expect(rule(String.raw`.\[\&_\.eg-footer\]\:bg-transparent .eg-footer`)).toMatch(
      /background-color:\s*(?:transparent|#0000(?:0000)?)/
    );
    const preview = readFileSync(new URL('../../../../.storybook/preview.css', import.meta.url), 'utf8');
    expect(preview).toContain('@source "../packages/ui/src/organisms/footer/Footer.stories.tsx";');
  });

  it('compiles the Prose measure and every descendant selector from the production recipe (#569)', () => {
    // Every utility of the recipe is emitted as `.<escaped class> <target>`; each row names the property it must set
    // and the token it must read. The completeness check below fails if a recipe utility has no row.
    const escapeClass = (token: string) => `.${token.replace(/[^\w-]/g, (character) => `\\${character}`)}`;
    const space = (step: string) => `var\\(--space-${step}[,)]`;
    const color = (token: string) => `color:\\s*var\\(--color-${token}[,)]`;
    const face = (token: string) => `font-family:\\s*var\\(--font-${token}[,)]`;
    const step = (token: string) => `font-size:\\s*var\\(--text-${token}[,)]`;
    const weight = 'font-weight:\\s*var\\(--text-heading-small--font-weight\\)';
    const focus = 'box-shadow:\\s*var\\(--shadow-focus\\)';
    const noOutline = 'outline-style:\\s*none';
    const rows: readonly (readonly [token: string, target: string, declaration: string])[] = [
      ['max-w-prose', '', 'max-width:\\s*var\\(--container-prose,\\s*65ch\\)'],
      ['box-border', '', 'box-sizing:\\s*border-box'],
      ['min-w-0', '', `min-width:\\s*${space('0')}`],
      ['font-sans', '', face('sans')],
      ['wrap-break-word', '', 'overflow-wrap:\\s*break-word'],
      ['text-pretty', '', 'text-wrap:\\s*pretty'],
      ['text-body-large', '', step('body-large')],
      ['text-body-default', '', step('body-default')],
      ['[&>:first-child]:mt-0', '> :first-child', `margin-top:\\s*${space('0')}`],
      ['[&>:last-child]:mb-0', '> :last-child', `margin-bottom:\\s*${space('0')}`],
      ['[&_h2]:m-0', 'h2', `margin:\\s*${space('0')}`],
      ['[&_h2]:mt-12', 'h2', `margin-top:\\s*${space('12')}`],
      ['[&_h2]:mb-4', 'h2', `margin-bottom:\\s*${space('4')}`],
      ['[&_h2]:font-display', 'h2', face('display')],
      ['[&_h2]:uppercase', 'h2', 'text-transform:\\s*uppercase'],
      ['[&_h2]:text-balance', 'h2', 'text-wrap:\\s*balance'],
      ['[&_h2]:text-heading-section', 'h2', step('heading-section')],
      ['[&_h2]:text-fg-default', 'h2', color('fg-default')],
      ['[&_h3]:m-0', 'h3', `margin:\\s*${space('0')}`],
      ['[&_h3]:mt-8', 'h3', `margin-top:\\s*${space('8')}`],
      ['[&_h3]:mb-3', 'h3', `margin-bottom:\\s*${space('3')}`],
      ['[&_h3]:font-sans', 'h3', face('sans')],
      ['[&_h3]:normal-case', 'h3', 'text-transform:\\s*none'],
      ['[&_h3]:text-balance', 'h3', 'text-wrap:\\s*balance'],
      ['[&_h3]:text-heading-small', 'h3', step('heading-small')],
      ['[&_h3]:text-fg-default', 'h3', color('fg-default')],
      ['[&_h4]:m-0', 'h4', `margin:\\s*${space('0')}`],
      ['[&_h4]:mt-6', 'h4', `margin-top:\\s*${space('6')}`],
      ['[&_h4]:mb-2', 'h4', `margin-bottom:\\s*${space('2')}`],
      ['[&_h4]:font-sans', 'h4', face('sans')],
      ['[&_h4]:normal-case', 'h4', 'text-transform:\\s*none'],
      ['[&_h4]:text-balance', 'h4', 'text-wrap:\\s*balance'],
      ['[&_h4]:text-body-large', 'h4', step('body-large')],
      ['[&_h4]:text-fg-default', 'h4', color('fg-default')],
      ['[&_h4]:[font-weight:var(--text-heading-small--font-weight)]', 'h4', weight],
      ['[&_p]:m-0', 'p', `margin:\\s*${space('0')}`],
      ['[&_p]:mb-5', 'p', `margin-bottom:\\s*${space('5')}`],
      ['[&_a]:text-link-default', 'a', color('link-default')],
      ['[&_a]:underline', 'a', 'text-decoration-line:\\s*underline'],
      ['[&_a]:underline-offset-(--space-1)', 'a', 'text-underline-offset:\\s*var\\(--space-1\\)'],
      ['[&_a:hover]:no-underline', 'a:hover', 'text-decoration-line:\\s*none'],
      ['[&_a:focus-visible]:outline-none', 'a:focus-visible', noOutline],
      ['[&_a:focus-visible]:rounded-sm', 'a:focus-visible', 'border-radius:\\s*var\\(--radius-sm[,)]'],
      ['[&_a:focus-visible]:[box-shadow:var(--shadow-focus)]', 'a:focus-visible', focus],
      ['[&_strong]:[font-weight:var(--text-heading-small--font-weight)]', 'strong', weight],
      ['[&_ul]:m-0', 'ul', `margin:\\s*${space('0')}`],
      ['[&_ul]:mb-5', 'ul', `margin-bottom:\\s*${space('5')}`],
      ['[&_ul]:ps-7', 'ul', `padding-inline-start:\\s*${space('7')}`],
      ['[&_ul]:list-disc', 'ul', 'list-style-type:\\s*disc'],
      ['[&_ol]:m-0', 'ol', `margin:\\s*${space('0')}`],
      ['[&_ol]:mb-5', 'ol', `margin-bottom:\\s*${space('5')}`],
      ['[&_ol]:ps-7', 'ol', `padding-inline-start:\\s*${space('7')}`],
      ['[&_ol]:list-decimal', 'ol', 'list-style-type:\\s*decimal'],
      ['[&_li]:mt-2', 'li', `margin-top:\\s*${space('2')}`],
      ['[&_li:first-child]:mt-0', 'li:first-child', `margin-top:\\s*${space('0')}`],
      ['[&_li::marker]:text-fg-muted', 'li::marker', color('fg-muted')],
      ['[&_blockquote]:m-0', 'blockquote', `margin:\\s*${space('0')}`],
      ['[&_blockquote]:my-8', 'blockquote', `margin-block:\\s*${space('8')}`],
      ['[&_blockquote]:ps-4.5', 'blockquote', `padding-inline-start:\\s*calc\\(var\\(--space-1\\)\\s*\\*\\s*4\\.5\\)`],
      ['[&_blockquote]:text-fg-secondary', 'blockquote', color('fg-secondary')],
      [
        '[&_blockquote]:border-s-[length:calc(var(--border-width)*2)]',
        'blockquote',
        'border-inline-start-width:\\s*calc\\(var\\(--border-width\\)\\s*\\*\\s*2\\)'
      ],
      ['[&_blockquote]:border-fg-brand-default', 'blockquote', 'border-color:\\s*var\\(--color-fg-brand-default[,)]'],
      ['[&_code]:font-mono', 'code', face('mono')],
      ['[&_code]:text-code', 'code', step('code')],
      ['[&_code:not(pre_code)]:text-fg-brand-default', 'code:not(pre code)', color('fg-brand-default')],
      ['[&_code:not(pre_code)]:text-fg-brand-raised', 'code:not(pre code)', color('fg-brand-raised')],
      ['[&_pre]:my-6', 'pre', `margin-block:\\s*${space('6')}`],
      ['[&_pre]:overflow-x-auto', 'pre', 'overflow-x:\\s*auto'],
      ['[&_pre]:rounded-md', 'pre', 'border-radius:\\s*var\\(--radius-md[,)]'],
      ['[&_pre]:border', 'pre', 'border-width:\\s*1px'],
      ['[&_pre]:border-border-hairline', 'pre', 'border-color:\\s*var\\(--color-border-hairline[,)]'],
      ['[&_pre]:bg-surface-0', 'pre', 'background-color:\\s*var\\(--color-surface-0[,)]'],
      ['[&_pre]:p-4', 'pre', `padding:\\s*${space('4')}`],
      ['[&_pre]:shadow-[var(--shadow-well)]', 'pre', '--tw-shadow:\\s*var\\(--shadow-well\\)'],
      ['[&_pre]:font-mono', 'pre', face('mono')],
      ['[&_pre]:text-code', 'pre', step('code')],
      ['[&_pre]:text-fg-secondary', 'pre', color('fg-secondary')],
      ['[&_pre:focus-visible]:outline-none', 'pre:focus-visible', noOutline],
      ['[&_pre:focus-visible]:[box-shadow:var(--shadow-focus)]', 'pre:focus-visible', focus],
      ['[&_img]:block', 'img', 'display:\\s*block'],
      ['[&_img]:h-auto', 'img', 'height:\\s*auto'],
      ['[&_img]:max-w-full', 'img', 'max-width:\\s*100%'],
      ['[&_img]:rounded-md', 'img', 'border-radius:\\s*var\\(--radius-md[,)]'],
      ['[&_figure]:m-0', 'figure', `margin:\\s*${space('0')}`],
      ['[&_figure]:my-8', 'figure', `margin-block:\\s*${space('8')}`],
      ['[&_figcaption]:mt-2', 'figcaption', `margin-top:\\s*${space('2')}`],
      ['[&_figcaption]:text-body-default', 'figcaption', step('body-default')],
      ['[&_figcaption]:text-fg-muted', 'figcaption', color('fg-muted')],
      ['[&_table]:my-8', 'table', `margin-block:\\s*${space('8')}`],
      ['[&_table]:w-full', 'table', 'width:\\s*100%'],
      ['[&_table]:border-collapse', 'table', 'border-collapse:\\s*collapse'],
      ['[&_th]:border-b', 'th', 'border-bottom-width:\\s*1px'],
      ['[&_th]:border-border-default', 'th', 'border-color:\\s*var\\(--color-border-default[,)]'],
      ['[&_th]:bg-surface-2', 'th', 'background-color:\\s*var\\(--color-surface-2[,)]'],
      ['[&_th]:px-4', 'th', `padding-inline:\\s*${space('4')}`],
      ['[&_th]:py-2.5', 'th', 'padding-block:\\s*calc\\(var\\(--space-1\\)\\s*\\*\\s*2\\.5\\)'],
      ['[&_th]:text-start', 'th', 'text-align:\\s*start'],
      ['[&_th]:font-display', 'th', face('display')],
      ['[&_th]:text-label-eyebrow', 'th', step('label-eyebrow')],
      ['[&_th]:uppercase', 'th', 'text-transform:\\s*uppercase'],
      ['[&_th]:text-fg-muted', 'th', color('fg-muted')],
      ['[&_td]:border-b', 'td', 'border-bottom-width:\\s*1px'],
      ['[&_td]:border-border-subtle', 'td', 'border-color:\\s*var\\(--color-border-subtle[,)]'],
      ['[&_td]:px-4', 'td', `padding-inline:\\s*${space('4')}`],
      ['[&_td]:py-3', 'td', `padding-block:\\s*${space('3')}`],
      ['[&_td]:text-start', 'td', 'text-align:\\s*start'],
      ['[&_td]:align-top', 'td', 'vertical-align:\\s*top'],
      ['[&_td]:wrap-break-word', 'td', 'overflow-wrap:\\s*break-word'],
      ['[&_td]:text-body-default', 'td', step('body-default')],
      ['[&_td]:text-fg-secondary', 'td', color('fg-secondary')],
      ['[&_hr]:m-0', 'hr', `margin:\\s*${space('0')}`],
      ['[&_hr]:my-10', 'hr', `margin-block:\\s*${space('10')}`],
      ['[&_hr]:border-0', 'hr', 'border-width:\\s*0'],
      ['[&_hr]:border-t', 'hr', 'border-top-width:\\s*1px'],
      ['[&_hr]:border-solid', 'hr', 'border-style:\\s*solid'],
      ['[&_hr]:border-border-hairline', 'hr', 'border-color:\\s*var\\(--color-border-hairline[,)]']
    ];
    const recipe = new Set(
      (['sm', 'md'] as const)
        .flatMap((size) => (['canvas', 'raised'] as const).map((tone) => proseVariants({ size, tone })))
        .flatMap((classes) => classes.split(' '))
        .filter((token) => token !== 'eg-prose')
    );
    expect([...recipe].sort()).toEqual(rows.map(([token]) => token).sort());
    for (const [token, target, declaration] of rows) {
      const selector = target === '' ? escapeClass(token) : `${escapeClass(token)} ${target}`;
      expect(rule(selector), token).toMatch(new RegExp(declaration));
    }
    // The root marker is public API but carries no rule of its own: Prose has no stylesheet.
    expect(css).not.toMatch(/\.eg-prose\b/);
  });

  it('emits every EmptyState recipe utility from the production recipes and no rule for its marker (#573)', () => {
    // Every utility of the five part recipes is emitted with the property and token the approved recipe names; the
    // completeness check below fails if a recipe utility has no row.
    const escapeClass = (token: string) => `.${token.replace(/[^\w-]/g, (character) => `\\${character}`)}`;
    const space = (step: string) => `var\\(--space-${step}[,)]`;
    const rows: readonly (readonly [token: string, declaration: string])[] = [
      ['flex', 'display:\\s*flex'],
      ['inline-flex', 'display:\\s*inline-flex'],
      ['flex-col', 'flex-direction:\\s*column'],
      ['flex-wrap', 'flex-wrap:\\s*wrap'],
      ['items-center', 'align-items:\\s*center'],
      ['justify-center', 'justify-content:\\s*center'],
      ['shrink-0', 'flex-shrink:\\s*0'],
      ['min-w-0', `min-width:\\s*${space('0')}`],
      ['max-w-full', 'max-width:\\s*100%'],
      ['text-center', 'text-align:\\s*center'],
      ['gap-3', `gap:\\s*${space('3')}`],
      ['gap-2', `gap:\\s*${space('2')}`],
      ['px-4', `padding-inline:\\s*${space('4')}`],
      ['py-8', `padding-block:\\s*${space('8')}`],
      ['m-0', `margin:\\s*${space('0')}`],
      ['wrap-anywhere', 'overflow-wrap:\\s*anywhere'],
      ['font-sans', 'font-family:\\s*var\\(--font-sans[,)]'],
      ['text-heading-small', 'font-size:\\s*var\\(--text-heading-small[,)]'],
      ['text-body-default', 'font-size:\\s*var\\(--text-body-default[,)]'],
      ['text-fg-default', 'color:\\s*var\\(--color-fg-default[,)]'],
      ['text-fg-secondary', 'color:\\s*var\\(--color-fg-secondary[,)]'],
      ['text-fg-muted', 'color:\\s*var\\(--color-fg-muted[,)]'],
      ['max-w-[var(--bp-sm)]', 'max-width:\\s*var\\(--bp-sm\\)']
    ];
    const recipe = new Set(
      [
        emptyStateVariants(),
        emptyStateIconVariants(),
        emptyStateTitleVariants(),
        emptyStateDescriptionVariants(),
        emptyStateActionsVariants()
      ]
        .flatMap((classes) => classes.split(' '))
        .filter((token) => token !== 'eg-empty-state')
    );
    expect([...recipe].sort()).toEqual(rows.map(([token]) => token).sort());
    for (const [token, declaration] of rows) {
      expect(rule(escapeClass(token)), token).toMatch(new RegExp(declaration));
    }
    // The block paints nothing and ships no stylesheet: its public marker carries no rule of its own.
    expect(css).not.toMatch(/\.eg-empty-state\b/);
  });

  it('emits every Breadcrumb recipe utility from the production recipes and no rule for its marker (#570)', () => {
    // Every utility of the six part recipes is emitted with the property and token the approved recipe names; the
    // completeness check below fails if a recipe utility has no row.
    const escapeClass = (token: string) => `.${token.replace(/[^\w-]/g, (character) => `\\${character}`)}`;
    const space = (step: string) => `var\\(--space-${step}[,)]`;
    const rows: readonly (readonly [token: string, declaration: string])[] = [
      ['min-w-0', `min-width:\\s*${space('0')}`],
      ['wrap-anywhere', 'overflow-wrap:\\s*anywhere'],
      ['m-0', `margin:\\s*${space('0')}`],
      ['p-0', `padding:\\s*${space('0')}`],
      ['list-none', 'list-style-type:\\s*none'],
      ['flex', 'display:\\s*flex'],
      ['flex-wrap', 'flex-wrap:\\s*wrap'],
      ['items-center', 'align-items:\\s*center'],
      ['gap-x-2', `column-gap:\\s*${space('2')}`],
      ['gap-y-1', `row-gap:\\s*${space('1')}`],
      ['gap-2', `gap:\\s*${space('2')}`],
      ['min-h-14', `min-height:\\s*${space('14')}`],
      ['self-stretch', 'align-self:\\s*stretch'],
      ['self-center', 'align-self:\\s*center'],
      ['font-sans', 'font-family:\\s*var\\(--font-sans[,)]'],
      ['text-label-default', 'font-size:\\s*var\\(--text-label-default[,)]'],
      ['text-fg-default', 'color:\\s*var\\(--color-fg-default[,)]'],
      ['text-fg-muted', 'color:\\s*var\\(--color-fg-muted[,)]'],
      ['-rotate-90', 'rotate:\\s*-90deg']
    ];
    const recipe = new Set(
      [
        breadcrumbVariants(),
        breadcrumbListVariants(),
        breadcrumbStepVariants(),
        breadcrumbLinkVariants(),
        breadcrumbCurrentVariants(),
        breadcrumbSeparatorVariants()
      ]
        .flatMap((classes) => classes.split(' '))
        .filter((token) => token !== 'eg-breadcrumb')
    );
    expect([...recipe].sort()).toEqual(rows.map(([token]) => token).sort());
    for (const [token, declaration] of rows) {
      expect(rule(escapeClass(token)), token).toMatch(new RegExp(declaration));
    }
    // The type step carries the line height and weight of the label token too, not only its size.
    expect(rule('.text-label-default')).toMatch(/line-height:[^;}]*--text-label-default--line-height/);
    expect(rule('.text-label-default')).toMatch(/font-weight:[^;}]*--text-label-default--font-weight/);
    // The trail paints nothing and ships no stylesheet: its public marker carries no rule of its own.
    expect(css).not.toMatch(/\.eg-breadcrumb\b/);
  });

  it('emits every DetailHeader recipe utility from the production recipes and no rule for its markers (#572)', () => {
    // Every utility of the nine recipes is emitted with the property and token the approved recipe names; the
    // completeness check below fails if a recipe utility has no row.
    const escapeClass = (token: string) => `.${token.replace(/[^\w-]/g, (character) => `\\${character}`)}`;
    const space = (step: string) => `var\\(--space-${step}[,)]`;
    const rows: readonly (readonly [token: string, declaration: string])[] = [
      ['flex', 'display:\\s*flex'],
      ['min-w-0', `min-width:\\s*${space('0')}`],
      ['flex-col', 'flex-direction:\\s*column'],
      ['flex-wrap', 'flex-wrap:\\s*wrap'],
      ['gap-6', `gap:\\s*${space('6')}`],
      ['gap-1', `gap:\\s*${space('1')}`],
      // The 1.5 step is derived from the --space-1 token, not a token of its own: the utility Chip and the ProjectCard
      // tag list already ship.
      ['gap-1.5', 'gap:\\s*calc\\(var\\(--space-1\\)\\s*\\*\\s*1\\.5\\)'],
      ['gap-x-8', `column-gap:\\s*${space('8')}`],
      ['gap-x-6', `column-gap:\\s*${space('6')}`],
      ['gap-y-4', `row-gap:\\s*${space('4')}`],
      ['gap-y-3', `row-gap:\\s*${space('3')}`],
      ['m-0', `margin:\\s*${space('0')}`],
      ['p-0', `padding:\\s*${space('0')}`],
      ['list-none', 'list-style-type:\\s*none'],
      ['font-display', 'font-family:\\s*var\\(--font-display[,)]'],
      ['font-sans', 'font-family:\\s*var\\(--font-sans[,)]'],
      ['text-label-eyebrow', 'font-size:\\s*var\\(--text-label-eyebrow[,)]'],
      ['text-body-default', 'font-size:\\s*var\\(--text-body-default[,)]'],
      ['uppercase', 'text-transform:\\s*uppercase'],
      ['text-fg-muted', 'color:\\s*var\\(--color-fg-muted[,)]'],
      ['text-fg-default', 'color:\\s*var\\(--color-fg-default[,)]'],
      ['whitespace-normal', 'white-space:\\s*normal'],
      ['wrap-anywhere', 'overflow-wrap:\\s*anywhere']
    ];
    const recipe = new Set(
      [
        detailHeaderVariants(),
        detailHeaderMetaVariants(),
        detailHeaderMetaEntryVariants(),
        detailHeaderTermVariants(),
        detailHeaderValueVariants(),
        detailHeaderTagsVariants(),
        detailHeaderTagLabelVariants(),
        detailHeaderLinksVariants(),
        detailHeaderLinkItemVariants()
      ]
        .flatMap((classes) => classes.split(' '))
        .filter((token) => !token.startsWith('eg-detail-header'))
    );
    expect([...recipe].sort()).toEqual(rows.map(([token]) => token).sort());
    for (const [token, declaration] of rows) {
      expect(rule(escapeClass(token)), token).toMatch(new RegExp(declaration));
    }
    // The two type steps carry the line height and weight of their token too, not only the size.
    for (const step of ['label-eyebrow', 'body-default']) {
      expect(rule(`.text-${step}`)).toMatch(new RegExp(`line-height:[^;}]*--text-${step}--line-height`));
      expect(rule(`.text-${step}`)).toMatch(new RegExp(`font-weight:[^;}]*--text-${step}--font-weight`));
    }
    // The header paints nothing and ships no stylesheet: none of its four markers carries a rule of its own.
    expect(css).not.toMatch(/\.eg-detail-header\b/);
  });

  it('keeps the colours DetailHeader owns at 4.5:1 or better on solid surface-0 to surface-3 (DH-12)', () => {
    const theme = readFileSync(fileURLToPath(new URL('../../../tokens/src/theme.css', import.meta.url)), 'utf8');
    const declared = (name: string) => new RegExp(`${name}:\\s*([^;]+);`).exec(theme)?.[1]?.trim();
    // Resolve a token through its var() aliases down to a plain hex value; anything else cannot be measured here.
    const hex = (name: string): string => {
      let value = declared(name);
      for (let hops = 0; hops < 6 && value?.startsWith('var(') === true; hops += 1) {
        value = declared(/^var\((--[\w-]+)\)$/.exec(value)?.[1] ?? '');
      }
      expect(value, `${name} must resolve to a plain hex colour`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      return value ?? '';
    };
    const luminance = (colour: string) => {
      const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((start) => {
        const channel = Number.parseInt(colour.slice(start, start + 2), 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const contrast = (foreground: string, background: string) => {
      const [light = 0, dark = 0] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (light + 0.05) / (dark + 0.05);
    };
    // The colour utilities of the term and the value recipes: a text-* utility whose token is a colour, not a size.
    const owned = [
      ...new Set(
        [detailHeaderTermVariants(), detailHeaderValueVariants()]
          .flatMap((classes) => classes.split(' '))
          .filter((token) => token.startsWith('text-'))
          .map((token) => token.slice('text-'.length))
          .filter((name) => declared(`--color-${name}`) !== undefined && declared(`--text-${name}`) === undefined)
      )
    ].sort();
    expect(owned).toEqual(['fg-default', 'fg-muted']);
    const expected: Record<string, number[]> = {
      'fg-default': [18.26, 17.02, 15.5, 13.55],
      'fg-muted': [7.17, 6.69, 6.09, 5.32]
    };
    for (const name of owned) {
      const foreground = hex(`--color-${name}`);
      for (const [tone, surface] of ['surface-0', 'surface-1', 'surface-2', 'surface-3'].entries()) {
        const ratio = contrast(foreground, hex(`--color-${surface}`));
        expect(ratio, `${name} on ${surface}`).toBeGreaterThanOrEqual(4.5);
        // The figures of the approved spec, computed here from the resolved tokens, to two decimals.
        expect(ratio, `${name} on ${surface}`).toBeCloseTo(expected[name]?.[tone] ?? 0, 2);
      }
    }
  });

  it('emits every Pagination recipe utility with its token declaration, in the right media block, and no rule for its marker (#571, E1)', () => {
    const escapeClass = (token: string) => `.${token.replace(/[^\w-]/g, (character) => `\\${character}`)}`;
    // Split a class name into its variants and its base utility at the top-level colons only: the arbitrary values
    // `[background:var(…)]` and `(length:--focus-width)` keep their own colon.
    const splitVariants = (token: string) => {
      const parts: string[] = [];
      let depth = 0;
      let start = 0;
      for (const [index, character] of [...token].entries()) {
        if (character === '[' || character === '(') {
          depth += 1;
        } else if (character === ']' || character === ')') {
          depth -= 1;
        } else if (character === ':' && depth === 0) {
          parts.push(token.slice(start, index));
          start = index + 1;
        }
      }
      // The last segment is the base utility; everything before it is a variant.
      parts.push(token.slice(start));
      return parts;
    };
    // How the installed optimizer serializes each variant: a selector suffix, a media block, or both.
    const variantShape: Record<string, { suffix?: string; media?: string }> = {
      hover: { suffix: ':hover', media: '(hover: hover)' },
      'focus-visible': { suffix: ':focus-visible' },
      'aria-[current=page]': { suffix: '[aria-current="page"]' },
      'data-[disabled]': { suffix: '[data-disabled]' },
      rtl: { suffix: ':where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)' },
      'forced-colors': { media: '(forced-colors: active)' },
      'pointer-coarse': { media: '(pointer: coarse)' },
      'motion-reduce': { media: '(prefers-reduced-motion: reduce)' }
    };
    // The focus ring is the system token, resolved inline by the installed utility: derive it from theme.css.
    const theme = readFileSync(fileURLToPath(new URL('../../../tokens/src/theme.css', import.meta.url)), 'utf8');
    const focusRing = /--shadow-focus:\s*([^;]+);/.exec(theme)?.[1]?.trim();
    expect(focusRing, '--shadow-focus must exist in theme.css').toBeDefined();
    const tokenRing = (focusRing ?? '')
      .split(/\s*,\s*/)
      .map((layer) => layer.replace(/(#[0-9A-Fa-f]{3,8})$/, (hex) => `var(--tw-shadow-color, ${hex.toLowerCase()})`))
      .join(', ');
    const space = (step: string) => `var\\(--space-${step}[,)]`;
    const rows: readonly (readonly [token: string, declaration: RegExp])[] = [
      ['m-0', new RegExp(`margin:\\s*${space('0')}`)],
      ['p-0', new RegExp(`padding:\\s*${space('0')}`)],
      ['list-none', /list-style-type:\s*none/],
      ['flex', /display:\s*flex/],
      ['flex-wrap', /flex-wrap:\s*wrap/],
      ['items-center', /align-items:\s*center/],
      ['justify-center', /justify-content:\s*center/],
      ['gap-1', new RegExp(`gap:\\s*${space('1')}`)],
      ['gap-2', new RegExp(`gap:\\s*${space('2')}`)],
      ['box-border', /box-sizing:\s*border-box/],
      ['inline-flex', /display:\s*inline-flex/],
      ['min-h-10', new RegExp(`min-height:\\s*${space('10')}`)],
      ['min-w-10', new RegExp(`min-width:\\s*${space('10')}`)],
      ['rounded-md', /border-radius:\s*var\(--radius-md[,)]/],
      ['border', /border-width:\s*1px/],
      ['border-solid', /border-style:\s*solid/],
      ['border-transparent', /border-color:\s*(?:transparent|#0000(?:0000)?)/],
      ['px-2', new RegExp(`padding-inline:\\s*${space('2')}`)],
      ['pointer-coarse:min-h-14', new RegExp(`min-height:\\s*${space('14')}`)],
      ['pointer-coarse:min-w-14', new RegExp(`min-width:\\s*${space('14')}`)],
      ['font-display', /font-family:\s*var\(--font-display[,)]/],
      ['text-meta', /font-size:\s*var\(--text-meta[,)]/],
      ['text-meta', /line-height:[^;}]*--text-meta--line-height/],
      ['text-meta', /letter-spacing:[^;}]*--text-meta--letter-spacing/],
      ['text-meta', /font-weight:[^;}]*--text-meta--font-weight/],
      ['tabular-nums', /--tw-numeric-spacing:\s*tabular-nums/],
      ['uppercase', /text-transform:\s*uppercase/],
      ['text-fg-secondary', /color:\s*var\(--color-fg-secondary[,)]/],
      ['text-fg-muted', /color:\s*var\(--color-fg-muted[,)]/],
      ['no-underline', /text-decoration-line:\s*none/],
      ['transition-colors', /transition-property:\s*color,\s*background-color,\s*border-color/],
      ['duration-(--duration-fast)', /transition-duration:\s*var\(--duration-fast\)/],
      ['ease-(--ease-out)', /transition-timing-function:\s*var\(--ease-out\)/],
      ['motion-reduce:transition-none', /transition-property:\s*none/],
      ['hover:bg-surface-2', /background-color:\s*var\(--color-surface-2[,)]/],
      ['hover:text-fg-default', /color:\s*var\(--color-fg-default[,)]/],
      ['aria-[current=page]:border-state-selected', /border-color:\s*var\(--color-state-selected[,)]/],
      [
        'aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
        /background:\s*var\(--gradient-chip-active\),\s*var\(--color-surface-1\)/
      ],
      ['aria-[current=page]:shadow-[var(--shadow-edge-strong)]', /--tw-shadow:\s*var\(--shadow-edge-strong\)/],
      ['aria-[current=page]:shadow-[var(--shadow-edge-strong)]', /box-shadow:[^;}]*var\(--tw-shadow\)/],
      ['aria-[current=page]:text-fg-default', /color:\s*var\(--color-fg-default[,)]/],
      ['focus-visible:outline-none', /outline-style:\s*none/],
      ['focus-visible:shadow-focus', new RegExp(`--tw-shadow:\\s*${tokenRing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)],
      ['focus-visible:shadow-focus', /box-shadow:[^;}]*var\(--tw-shadow\)/],
      [
        'aria-[current=page]:focus-visible:shadow-focus',
        new RegExp(`--tw-shadow:\\s*${tokenRing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`)
      ],
      ['aria-[current=page]:focus-visible:shadow-focus', /box-shadow:[^;}]*var\(--tw-shadow\)/],
      ['forced-colors:focus-visible:outline-solid', /outline-style:\s*solid/],
      ['forced-colors:focus-visible:outline-(length:--focus-width)', /outline-width:\s*var\(--focus-width\)/],
      ['forced-colors:focus-visible:outline-[color:Highlight]', /outline-color:\s*highlight/i],
      ['forced-colors:aria-[current=page]:outline-solid', /outline-style:\s*solid/],
      ['forced-colors:aria-[current=page]:outline-(length:--focus-width)', /outline-width:\s*var\(--focus-width\)/],
      ['forced-colors:aria-[current=page]:outline-[color:Highlight]', /outline-color:\s*highlight/i],
      ['data-[disabled]:opacity-45', /opacity:\s*\.45/],
      ['rtl:rotate-180', /rotate:\s*180deg/]
    ];
    const recipe = new Set(
      [
        paginationVariants(),
        paginationListVariants(),
        paginationItemVariants(),
        paginationLinkVariants({ kind: 'page' }),
        paginationLinkVariants({ kind: 'step' }),
        paginationEllipsisVariants(),
        paginationPlaceholderVariants(),
        paginationIconVariants()
      ]
        .flatMap((classes) => classes.split(' '))
        .filter((token) => token !== 'eg-pagination')
    );
    // Completeness: a recipe utility without a row fails here, and so does a row without a recipe utility.
    expect([...recipe].sort()).toEqual([...new Set(rows.map(([token]) => token))].sort());
    for (const [token, declaration] of rows) {
      const variants = splitVariants(token).slice(0, -1);
      const selector = `${escapeClass(token)}${variants.map((variant) => variantShape[variant]?.suffix ?? '').join('')}`;
      for (const variant of variants) {
        expect(variantShape[variant], `${token}: unknown variant ${variant}`).toBeDefined();
      }
      const media = variants.map((variant) => variantShape[variant]?.media).filter((query) => query !== undefined);
      expect(media.length, `${token} sits in at most one media block`).toBeLessThanOrEqual(1);
      const source = media[0] === undefined ? css : mediaBlocks(media[0]).join('\n');
      expect(emitted(selector, source), `${token} (${selector})`).toMatch(declaration);
    }
    // No stylesheet: nothing in the compiled preview selects the stable marker.
    expect(css).not.toMatch(/\.eg-pagination\b/);
  });

  it('keeps the Pagination focus ring above the current-page shadow by specificity and the outline rules after outline-none (#571, E2)', () => {
    const plain = String.raw`.focus-visible\:shadow-focus:focus-visible`;
    const currentOnly = String.raw`.aria-\[current\=page\]\:shadow-\[var\(--shadow-edge-strong\)\][aria-current="page"]`;
    const compound = String.raw`.aria-\[current\=page\]\:focus-visible\:shadow-focus[aria-current="page"]:focus-visible`;
    // A plain aria utility ties with the focus rule, so only the compound rule is a guarantee that the ring wins.
    expect(specificity(currentOnly)).toBe(specificity(plain));
    expect(specificity(compound)).toBeGreaterThan(specificity(plain));
    expect(specificity(compound)).toBeGreaterThan(specificity(currentOnly));
    // The compound ring is the same token ring as the plain one, painted through the same box-shadow property.
    const ring = /--tw-shadow:\s*([^;]+);/;
    expect(ring.exec(emitted(compound))?.[1]).toBe(ring.exec(emitted(plain))?.[1]);
    expect(emitted(compound)).toMatch(/box-shadow:[^;}]*var\(--tw-shadow\)/);
    expect(emitted(currentOnly)).toMatch(/--tw-shadow:\s*var\(--shadow-edge-strong\)/);
    // The compound is also emitted last, so the ring would win even a tie.
    expect(css.indexOf(compound)).toBeGreaterThan(css.indexOf(currentOnly));
    expect(css.indexOf(compound)).toBeGreaterThan(css.indexOf(plain));
    // The recipe pairs the compound with the plain ring, so both utilities are always emitted together.
    const link = paginationLinkVariants({ kind: 'page' }).split(/\s+/);
    expect(link).toContain('focus-visible:shadow-focus');
    expect(link).toContain('aria-[current=page]:focus-visible:shadow-focus');
    // Forced colours: the outline rules share the specificity of `outline-none` while focused, so they must come after.
    const none = css.indexOf(String.raw`.focus-visible\:outline-none:focus-visible`);
    expect(none).toBeGreaterThanOrEqual(0);
    const forcedFocus = String.raw`.forced-colors\:focus-visible\:outline-solid:focus-visible`;
    expect(specificity(forcedFocus)).toBe(specificity(String.raw`.focus-visible\:outline-none:focus-visible`));
    for (const selector of [
      forcedFocus,
      String.raw`.forced-colors\:focus-visible\:outline-\(length\:--focus-width\):focus-visible`,
      String.raw`.forced-colors\:focus-visible\:outline-\[color\:Highlight\]:focus-visible`
    ]) {
      expect(css.indexOf(selector), selector).toBeGreaterThan(none);
    }
    // The forced-colours rules live inside the forced-colors block and nowhere else.
    expect(mediaBlocks('(forced-colors: active)').join('\n')).toContain(forcedFocus);
    // The current page keeps its own paint while hovered: the hover background is emitted before it and ties it.
    const hover = String.raw`.hover\:bg-surface-2:hover`;
    const currentBackground = String.raw`.aria-\[current\=page\]\:\[background\:var\(--gradient-chip-active\)\,var\(--color-surface-1\)\][aria-current="page"]`;
    expect(specificity(currentBackground)).toBe(specificity(hover));
    expect(css.indexOf(currentBackground)).toBeGreaterThan(css.indexOf(hover));
    // Every other state rule outranks its rest rule outright: the current page text, border and ring.
    expect(
      specificity(String.raw`.aria-\[current\=page\]\:border-state-selected[aria-current="page"]`)
    ).toBeGreaterThan(specificity('.border-transparent'));
    expect(specificity(String.raw`.aria-\[current\=page\]\:text-fg-default[aria-current="page"]`)).toBeGreaterThan(
      specificity('.text-fg-secondary')
    );
  });

  it('compiles the Gauge story example layouts without requiring production story scanning', () => {
    expect(rule('.flex')).toMatch(/display:\s*flex\s*;/);
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap\s*;/);
    expect(rule('.items-start')).toMatch(/align-items:\s*flex-start\s*;/);
    expect(rule('.gap-4')).toMatch(/gap:\s*var\(--space-4\)\s*;/);
    expect(css).not.toMatch(/@(reference|source|tailwind)\b/);
  });

  it('compiles the first molecule source with snap, dragging, token gap and slide-focus utilities', () => {
    expect(rule('.basis-full')).toMatch(/flex-basis:\s*100%/);
    expect(rule('.snap-center')).toMatch(/scroll-snap-align:\s*center/);
    expect(rule('.scroll-auto')).toMatch(/scroll-behavior:\s*auto/);
    expect(rule('.gap-7')).toMatch(/gap:\s*var\(--space-7[,)]/);
    expect(css).toContain(String.raw`.group-data-\[state\=dragging\]\:snap-none`);
    expect(css).toContain(String.raw`.group-data-\[state\=dragging\]\:cursor-grabbing`);
    expect(css).toContain(String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`);
    expect(css).not.toMatch(/\.eg-carousel[^{]*\{/);
  });

  it('compiles SelectTile text-only logical clearance and content layout utilities', () => {
    expect(rule('.gap-1')).toMatch(/gap:\s*var\(--space-1[,)]/);
    expect(rule('.p-3')).toMatch(/padding:\s*var\(--space-3[,)]/);
    expect(rule('.pe-7')).toMatch(/padding-inline-end:\s*var\(--space-7[,)]/);
    expect(rule('.justify-center')).toMatch(/justify-content:\s*center/);
    expect(rule('.self-start')).toMatch(/align-self:\s*flex-start/);
    expect(rule('.px-1')).toMatch(/padding-inline:\s*var\(--space-1[,)]/);
    expect(rule('.min-h-14')).toMatch(/min-height:\s*(?:var\(--space-14[,)]|calc\(var\(--space-1\)\s*\*\s*14\))/);
    expect(rule('.wrap-anywhere')).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('compiles Carousel full-width scrolling, scrollbar hiding and inset focus utilities', () => {
    expect(rule('.gap-0')).toMatch(/gap:\s*var\(--space-0[,)]/);
    expect(rule('.p-0')).toMatch(/padding:\s*var\(--space-0[,)]/);
    expect(rule('.overflow-x-auto')).toMatch(/overflow-x:\s*auto/);
    expect(rule(String.raw`.\[scrollbar-width\:none\]`)).toMatch(/scrollbar-width:\s*none/);
    const webkit = css.indexOf(String.raw`.\[\&\:\:-webkit-scrollbar\]\:hidden`);
    expect(webkit).toBeGreaterThanOrEqual(0);
    expect(css.slice(webkit, webkit + 250)).toMatch(/::-webkit-scrollbar[\s\S]*display:\s*none/);
    expect(rule('.focus-visible\\:-outline-offset-\\(--focus-width\\):focus-visible')).toMatch(
      /outline-offset:\s*calc\(var\(--focus-width\)\s*\*\s*-1\)/
    );
    for (const selector of [
      String.raw`.focus-visible\:outline-solid`,
      String.raw`.focus-visible\:outline-\(length\:--focus-width\)`,
      String.raw`.focus-visible\:outline-focus-ring`
    ]) {
      expect(css).toContain(selector);
    }
  });

  it('compiles the Carousel current-slide emphasis from existing tokens, painted only under aria-current', () => {
    // Reserved frame and glow room: geometry from the spacing and radius tokens.
    expect(rule('.px-6')).toMatch(/padding-inline:\s*var\(--space-6[,)]/);
    expect(rule('.pt-5')).toMatch(/padding-top:\s*var\(--space-5[,)]/);
    expect(rule('.pb-7')).toMatch(/padding-bottom:\s*var\(--space-7[,)]/);
    expect(rule('.p-2')).toMatch(/padding:\s*var\(--space-2[,)]/);
    expect(rule('.rounded-xl')).toMatch(/border-radius:\s*var\(--radius-xl[,)]/);
    expect(rule('.border')).toMatch(/border-width:\s*1px/);
    expect(rule('.border-solid')).toMatch(/border-style:\s*solid/);
    expect(rule('.border-transparent')).toMatch(/border-color:\s*(?:transparent|#0000(?:0000)?)/);
    // Brand border and glow exist only behind [aria-current="true"]; no unscoped rule is ever emitted.
    const border = String.raw`.aria-\[current\=true\]\:border-border-brand`;
    const glow = String.raw`.aria-\[current\=true\]\:shadow-\[var\(--shadow-glow-base\)\]`;
    expect(rule(`${border}[aria-current="true"]`)).toMatch(/border-color:\s*var\(--color-border-brand[,)]/);
    const glowRule = rule(`${glow}[aria-current="true"]`);
    expect(glowRule).toMatch(/--tw-shadow:\s*var\(--shadow-glow-base\)/);
    expect(glowRule).toMatch(/box-shadow:/);
    for (const selector of [border, glow]) {
      expect(css, selector).not.toMatch(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[,{]`));
    }
    // The token transition: instant on focus and removed under reduced motion.
    expect(rule('.transition-\\[border-color\\,box-shadow\\]')).toMatch(
      /transition-property:\s*border-color,\s*box-shadow/
    );
    expect(rule(String.raw`.duration-\[var\(--duration-base\)\]`)).toMatch(
      /transition-duration:\s*var\(--duration-base\)/
    );
    // The optimizer merges this utility with its `ease-(--ease-out)` twin into one grouped selector.
    const ease = css.indexOf(String.raw`.ease-\[var\(--ease-out\)\]`);
    expect(ease).toBeGreaterThanOrEqual(0);
    expect(css.slice(ease, ease + 200)).toMatch(/\{[^}]*transition-timing-function:\s*var\(--ease-out\)/);
    expect(rule(String.raw`.focus-visible\:transition-none:focus-visible`)).toMatch(/transition-property:\s*none/);
    expect(
      rule(String.raw`.motion-reduce\:transition-none`, mediaBlocks('(prefers-reduced-motion: reduce)').join('\n'))
    ).toMatch(/transition-property:\s*none/);
    // Forced colours: a system-colour outline on the current slide only, inside the forced-colors media block.
    const forced = mediaBlocks('(forced-colors: active)').join('\n');
    for (const [utility, declaration] of [
      ['outline-solid', /outline-style:\s*solid/],
      [String.raw`outline-\(length\:--focus-width\)`, /outline-width:\s*var\(--focus-width\)/],
      [String.raw`outline-\[color\:Highlight\]`, /outline-color:\s*highlight/i]
    ] as const) {
      const selector = String.raw`.forced-colors\:aria-\[current\=true\]\:${utility}[aria-current="true"]`;
      expect(rule(selector, forced), selector).toMatch(declaration);
    }
    // The story host that the stories use for the poster-wide scenario.
    expect(rule(String.raw`.max-w-\[calc\(var\(--space-24\)\*4\)\]`)).toMatch(
      /max-width:\s*calc\(var\(--space-24\)\s*\*\s*4\)/
    );
    expect(rule('.w-full')).toMatch(/width:\s*100%/);
  });

  it('keeps the Carousel focus ring above the glow by specificity, not by source order', () => {
    const plain = String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]:focus-visible`;
    const glowOnly = String.raw`.aria-\[current\=true\]\:shadow-\[var\(--shadow-glow-base\)\][aria-current="true"]`;
    const compound = String.raw`.aria-\[current\=true\]\:focus-visible\:shadow-\[var\(--shadow-focus\)\,var\(--shadow-glow-base\)\][aria-current="true"]:focus-visible`;
    // A plain aria utility ties with the focus rule, so only the compound rule is a guarantee.
    expect(specificity(glowOnly)).toBe(specificity(plain));
    expect(specificity(compound)).toBeGreaterThan(specificity(plain));
    expect(specificity(compound)).toBeGreaterThan(specificity(glowOnly));
    const layers = rule(compound);
    expect(layers).toMatch(/--tw-shadow:\s*var\(--shadow-focus\),\s*var\(--shadow-glow-base\)/);
    expect(layers).toMatch(/box-shadow:/);
    // The slide recipe pairs the compound with the plain ring, so both utilities are always emitted together.
    const slide = carouselSlideVariants({ trackLayout: 'default', variant: 'current-emphasis' }).split(/\s+/);
    expect(slide).toContain('focus-visible:shadow-[var(--shadow-focus)]');
    expect(slide).toContain('aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-base)]');
  });

  it('keeps the Carousel emphasis track padding below the slide gap by more than the alignment tolerance (C1)', () => {
    const theme = readFileSync(fileURLToPath(new URL('../../../tokens/src/theme.css', import.meta.url)), 'utf8');
    const space = (step: string) => {
      const value = Number(new RegExp(`--space-${step}:\\s*([\\d.]+)px`).exec(theme)?.[1]);
      expect(Number.isFinite(value), `--space-${step} must be a pixel token`).toBe(true);
      return value;
    };
    const names = carouselTrackVariants({ trackLayout: 'default', variant: 'current-emphasis' }).split(/\s+/);
    const padding = names.find((name) => /^px-\d+$/.test(name));
    const gap = names.find((name) => /^gap-\d+$/.test(name));
    expect(padding, 'the variant must add a horizontal padding utility on the track').toBeDefined();
    expect(gap, 'the default track keeps its token gap').toBeDefined();
    const paddingStep = (padding ?? '').slice('px-'.length);
    const gapStep = (gap ?? '').slice('gap-'.length);
    // ALIGN_TOLERANCE in useCarousel.ts: alignment drift below 0.5px is ignored.
    expect(space(paddingStep) + 0.5).toBeLessThan(space(gapStep));
    expect(rule(`.${padding}`)).toMatch(new RegExp(`padding-inline:\\s*var\\(--space-${paddingStep}[,)]`));
    expect(rule(`.${gap}`)).toMatch(new RegExp(`gap:\\s*var\\(--space-${gapStep}[,)]`));
  });

  it('preserves the external font import in a valid position and the existing body token bindings', () => {
    const fonts = /@import\s+(?:url\()?['"]https:\/\/fonts\.googleapis\.com\/css2\?[^'"]+['"]\)?\s*;/.exec(css);
    expect(fonts, 'Google Fonts must remain imported, not silently dropped by compilation').not.toBeNull();
    if (!fonts) {
      throw new Error('Missing external font import');
    }
    // Only charset/layer statements may precede imports, never style rules or layer blocks.
    expect(isImportPreamble(css.slice(0, fonts.index))).toBe(true);
    for (const family of ['Barlow+Condensed', 'Barlow', 'JetBrains+Mono']) {
      expect(fonts[0]).toContain(`family=${family}:`);
    }
    const body = rule('body');
    expect(body).toMatch(/margin:\s*0\s*;/);
    expect(body).toMatch(/background:\s*var\(--color-bg-canvas\)\s*;/);
    expect(body).toMatch(/color:\s*var\(--color-fg-default\)\s*;/);
    expect(body).toMatch(/font-family:\s*var\(--font-sans\)\s*;/);
  });
});
