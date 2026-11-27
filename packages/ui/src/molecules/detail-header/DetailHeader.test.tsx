import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { DetailHeader } from './DetailHeader';
import {
  type DetailHeaderLink,
  type DetailHeaderMessages,
  type DetailHeaderMetadataItem,
  type DetailHeaderProps,
  detailHeaderLinkItemVariants,
  detailHeaderLinksVariants,
  detailHeaderMetaEntryVariants,
  detailHeaderMetaVariants,
  detailHeaderTagLabelVariants,
  detailHeaderTagsVariants,
  detailHeaderTermVariants,
  detailHeaderValueVariants,
  detailHeaderVariants
} from './types';
import { useDetailHeader } from './useDetailHeader';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

// The one documented cast: a JavaScript caller can pass values that the public types reject.
function untyped(props: Record<string, unknown>): DetailHeaderProps {
  return props as unknown as DetailHeaderProps;
}

const follows = (first: Node, second: Node) =>
  Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('DetailHeader heading block', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)('renders one heading at rank %s named by the title (DH-01)', (level) => {
    render(<DetailHeader title='Release notes' level={level} />);
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { level, name: 'Release notes' })).toBeInTheDocument();
  });

  it('defaults the heading to rank 1, never to the SectionHeader default of 2 (DH-01)', () => {
    render(<DetailHeader title='Release notes' />);
    expect(screen.getByRole('heading', { level: 1, name: 'Release notes' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('renders the eyebrow, the heading and the lede in that DOM order (DH-01)', () => {
    render(<DetailHeader eyebrow='Article' title='Release notes' lede='What changed this month.' />);
    const eyebrow = screen.getByText('Article');
    const heading = screen.getByRole('heading', { name: 'Release notes' });
    const lede = screen.getByText('What changed this month.');
    expect(follows(eyebrow, heading)).toBe(true);
    expect(follows(heading, lede)).toBe(true);
  });

  it('omits a blank eyebrow and a blank lede, as SectionHeader does (DH-01)', () => {
    const { container } = render(<DetailHeader eyebrow='   ' title='Release notes' lede='' />);
    const heading = screen.getByRole('heading', { name: 'Release notes' });
    expect(heading.parentElement?.children).toHaveLength(1);
    expect(container.textContent).toBe('Release notes');
  });

  it('keeps multilingual runs with their own lang spans and decorative separators (DH-01)', () => {
    render(
      <DetailHeader
        title={[
          ['Diseño ', 'es'],
          ['/ ', undefined, true],
          ['Design', 'en']
        ]}
        eyebrow={[['Nuestro trabajo', 'es']]}
        lede={[['Herramientas para equipos.', 'es']]}
      />
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.querySelector('span[lang="es"]')?.textContent).toBe('Diseño ');
    expect(heading.querySelector('span[lang="en"]')?.textContent).toBe('Design');
    expect(heading.querySelector('span[aria-hidden="true"]')?.textContent).toBe('/ ');
    expect(heading.textContent).toBe('Diseño / Design');
    expect(screen.getByText('Nuestro trabajo')).toHaveAttribute('lang', 'es');
    expect(screen.getByText('Herramientas para equipos.')).toHaveAttribute('lang', 'es');
  });

  it.each([
    ['zero', 0],
    ['seven', 7],
    ['NaN', Number.NaN],
    ['a numeric string', '2'],
    ['null', null],
    ['a fraction', 1.5]
  ])('resolves a type-erased level of %s to 1, never to an invalid heading (DH-01)', (_name, level) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', level })} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Release notes' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(1);
  });
});

const titleWarning = 'DetailHeader requires a non-blank title; nothing was rendered.';

describe('DetailHeader title gate', () => {
  it.each([
    ['blank', '  '],
    ['empty', ''],
    ['decorative-only runs', [['\u2022', undefined, true]]],
    ['whitespace-only runs', [[' ', 'en']]],
    ['an empty runs array', []],
    ['undefined', undefined],
    ['a number', 42]
  ])('renders nothing and warns exactly once when the title is %s (DH-02)', (_name, title) => {
    const { container } = render(<DetailHeader {...untyped({ title })} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('heading')).toBeNull();
    // SectionHeader is never reached, so its own warning text never appears next to this one.
    expect(consoleWarn.mock.calls).toEqual([[titleWarning]]);
  });

  it('reports only the title when the lists also hold invalid entries, because it gates before any list (DH-02)', () => {
    const { container } = render(
      <DetailHeader
        {...untyped({
          title: '   ',
          metadata: [{ label: '', value: '' }, 'not an object'],
          tags: [' ', 7],
          links: [{ label: 'Repository', href: 'http://example.com' }, null]
        })}
      />
    );
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toEqual([[titleWarning]]);
  });

  it('is silent in production and still renders nothing (DH-02)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<DetailHeader title='  ' />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('renders on a later readable title and empties again on an unreadable one (DH-02)', () => {
    const { container, rerender } = render(<DetailHeader title=' ' />);
    expect(container).toBeEmptyDOMElement();
    rerender(<DetailHeader title='Release notes' />);
    expect(screen.getByRole('heading', { level: 1, name: 'Release notes' })).toBeInTheDocument();
    rerender(<DetailHeader title='' />);
    expect(container).toBeEmptyDOMElement();
  });

  it('keeps a title that has at least one readable run, dropping malformed runs (DH-02)', () => {
    render(
      <DetailHeader {...untyped({ title: [['\u2022', undefined, true], ['Release', 'en'], 'malformed', [7]] })} />
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('\u2022Release');
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

const published: DetailHeaderMetadataItem = { label: 'Published', value: 'November 26, 2026', dateTime: '2026-11-26' };
const source: DetailHeaderMetadataItem = { label: 'Source', value: 'example.com' };
const metadataWarning = 'DetailHeader: skipping an invalid metadata entry.';

describe('DetailHeader metadata', () => {
  it('renders one description list with a term and a definition per entry, in the supplied order (DH-03)', () => {
    render(<DetailHeader title='Release notes' metadata={[published, source]} />);
    const terms = screen.getAllByRole('term');
    const definitions = screen.getAllByRole('definition');
    expect(terms.map((term) => term.textContent)).toEqual(['Published', 'Source']);
    expect(definitions.map((definition) => definition.textContent)).toEqual(['November 26, 2026', 'example.com']);
    const list = terms[0]?.closest('dl');
    expect(list?.tagName).toBe('DL');
    expect(document.querySelectorAll('dl')).toHaveLength(1);
    // One native wrapper div per fact, holding exactly its term and then its definition.
    expect(list?.children).toHaveLength(2);
    for (const [index, entry] of Array.from(list?.children ?? []).entries()) {
      expect(entry.tagName).toBe('DIV');
      expect(Array.from(entry.children).map((child) => child.tagName)).toEqual(['DT', 'DD']);
      expect(entry.children[0]).toBe(terms[index]);
      expect(entry.children[1]).toBe(definitions[index]);
    }
  });

  it('renders the list after the heading block and keeps the retained internal marker (DH-03)', () => {
    render(<DetailHeader title='Release notes' metadata={[source]} />);
    const list = document.querySelector('dl') as HTMLElement;
    expect(list).toHaveClass('eg-detail-header__meta');
    expect(follows(screen.getByRole('heading'), list)).toBe(true);
    expect(list.closest('header')).toBeNull();
  });

  it('wraps a value in a native time element only when a non-blank dateTime is supplied (DH-03)', () => {
    render(<DetailHeader title='Release notes' metadata={[published, source]} />);
    const [dated, plain] = screen.getAllByRole('definition');
    const time = dated?.querySelector('time');
    expect(time?.textContent).toBe('November 26, 2026');
    expect(time).toHaveAttribute('datetime', '2026-11-26');
    expect(dated?.children).toHaveLength(1);
    expect(plain?.querySelector('time')).toBeNull();
    expect(plain?.children).toHaveLength(0);
  });

  it('neither formats nor validates dateTime: the visible value and the attribute are exactly as supplied (DH-03)', () => {
    render(
      <DetailHeader title='Release notes' metadata={[{ label: 'When', value: 'Soon', dateTime: 'not a date' }]} />
    );
    const time = within(screen.getByRole('definition')).getByText('Soon');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', 'not a date');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['a blank', '  '],
    ['an empty', ''],
    ['a numeric', 7],
    ['a null', null]
  ])('ignores %s dateTime: the entry still renders as plain text with no warning (DH-03)', (_name, dateTime) => {
    render(
      <DetailHeader {...untyped({ title: 'Release notes', metadata: [{ label: 'When', value: 'Soon', dateTime }] })} />
    );
    expect(screen.getByRole('term').textContent).toBe('When');
    expect(screen.getByRole('definition').textContent).toBe('Soon');
    expect(document.querySelector('time')).toBeNull();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('renders the supplied label and value as DOM text, so the uppercase term is presentation only (DH-03)', () => {
    render(<DetailHeader title='Release notes' metadata={[{ label: 'Event date', value: '  Spaced  value ' }]} />);
    expect(screen.getByRole('term').textContent).toBe('Event date');
    expect(screen.getByRole('definition').textContent).toBe('  Spaced  value ');
  });

  it.each([
    ['a blank label', { label: '  ', value: 'x' }],
    ['an empty label', { label: '', value: 'x' }],
    ['a blank value', { label: 'Source', value: '   ' }],
    ['an empty value', { label: 'Source', value: '' }],
    ['a missing label', { value: 'x' }],
    ['a missing value', { label: 'Source' }],
    ['a numeric label', { label: 7, value: 'x' }],
    ['a numeric value', { label: 'Source', value: 7 }],
    ['a string entry', 'Source: example.com'],
    ['a null entry', null],
    ['a numeric entry', 42],
    ['an array entry', ['Source', 'example.com']]
  ])('skips %s with the exact warning and renders the other entries (DH-03)', (_name, entry) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', metadata: [entry, source] })} />);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual(['Source']);
    expect(screen.getAllByRole('definition').map((definition) => definition.textContent)).toEqual(['example.com']);
    expect(consoleWarn.mock.calls).toEqual([[metadataWarning]]);
  });

  it('warns once per invalid entry, in the order of the entries (DH-03)', () => {
    render(<DetailHeader {...untyped({ title: 'Release notes', metadata: [{ label: '' }, source, null, 7] })} />);
    expect(consoleWarn.mock.calls).toEqual([[metadataWarning], [metadataWarning], [metadataWarning]]);
    expect(screen.getAllByRole('term')).toHaveLength(1);
  });

  it.each([
    ['absent', undefined, 0],
    ['empty', [], 0],
    ['all invalid', [{ label: '', value: '' }, null], 2],
    ['a string', 'Published: today', 0],
    ['a plain object', { label: 'Published', value: 'today' }, 0],
    ['null', null, 0]
  ])('renders no list when metadata is %s (DH-03)', (_name, metadata, warnings) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', metadata })} />);
    expect(document.querySelector('dl')).toBeNull();
    expect(screen.queryByRole('term')).toBeNull();
    expect(screen.queryByRole('definition')).toBeNull();
    expect(consoleWarn).toHaveBeenCalledTimes(warnings);
  });

  it('renders duplicate entries as two facts with no duplicate-key error, and keeps the others after a skipped one (DH-03)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: a React key warning is asserted below.
    });
    render(<DetailHeader {...untyped({ title: 'Release notes', metadata: [source, null, source, published] })} />);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual(['Source', 'Source', 'Published']);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('follows the current metadata on rerender and leaves nothing behind (DH-03)', () => {
    const { rerender } = render(<DetailHeader title='Release notes' metadata={[published, source]} />);
    expect(screen.getAllByRole('term')).toHaveLength(2);
    rerender(<DetailHeader title='Release notes' metadata={[source]} />);
    expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual(['Source']);
    expect(document.querySelector('time')).toBeNull();
    rerender(<DetailHeader title='Release notes' />);
    expect(document.querySelector('dl')).toBeNull();
  });
});

const tagWarning = 'DetailHeader: skipping a blank tag.';

describe('DetailHeader tags', () => {
  it('renders a named list with one item per tag, in the supplied order (DH-04)', () => {
    render(<DetailHeader title='Release notes' tags={['Design', 'Systems', 'Accessibility']} />);
    const list = screen.getByRole('list', { name: 'Tags' });
    expect(list.tagName).toBe('UL');
    // The explicit role is the usual remedy for WebKit dropping list semantics under list-style: none.
    expect(list).toHaveAttribute('role', 'list');
    expect(list).toHaveClass('eg-detail-header__tags');
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(['Design', 'Systems', 'Accessibility']);
    expect(list.children).toHaveLength(3);
    expect(Array.from(list.children).map((child) => child.tagName)).toEqual(['LI', 'LI', 'LI']);
  });

  it('renders each tag as a static Chip: a plain pill with no role and nothing interactive (DH-04)', () => {
    render(<DetailHeader title='Release notes' tags={['Design', 'Systems']} />);
    const list = screen.getByRole('list', { name: 'Tags' });
    for (const item of within(list).getAllByRole('listitem')) {
      expect(item.children).toHaveLength(1);
      const chip = item.firstElementChild as HTMLElement;
      expect(chip.tagName).toBe('SPAN');
      expect(chip).toHaveClass('eg-chip');
      expect(chip).not.toHaveAttribute('role');
      expect(chip).not.toHaveAttribute('tabindex');
      expect(chip).not.toHaveAttribute('aria-pressed');
      expect(chip).not.toHaveAttribute('data-state');
    }
    expect(within(list).queryAllByRole('button')).toHaveLength(0);
    expect(within(list).queryAllByRole('link')).toHaveLength(0);
    expect(list.querySelector('a, button, [tabindex]')).toBeNull();
  });

  it('holds each tag label in a span inside the static Chip that restores wrapping (DH-04, DH-11, Amendment 2)', () => {
    const labels = ['Design', 'ReleaseBundleIdentifier0123456789abcdef0123456789abcdef0123456789abcdef'];
    render(<DetailHeader title='Release notes' tags={labels} />);
    const items = within(screen.getByRole('list', { name: 'Tags' })).getAllByRole('listitem');
    expect(items).toHaveLength(labels.length);
    items.forEach((item, index) => {
      const chip = item.firstElementChild as HTMLElement;
      expect(chip).toHaveClass('eg-chip');
      // The Chip holds exactly one child, the label span, and the text is the supplied label, unchanged.
      expect(chip.children).toHaveLength(1);
      const label = chip.firstElementChild as HTMLElement;
      expect(label.tagName).toBe('SPAN');
      expect(label.textContent).toBe(labels[index]);
      expect(chip.textContent).toBe(labels[index]);
      expect(label).toHaveClass('whitespace-normal', 'wrap-anywhere');
      // A private part: no marker, role, tab stop, inline style or state.
      expect(label.className.split(' ').filter((token) => token.startsWith('eg-'))).toEqual([]);
      for (const attribute of ['role', 'tabindex', 'style', 'data-state', 'aria-hidden']) {
        expect(label, attribute).not.toHaveAttribute(attribute);
      }
    });
  });

  it('renders duplicate tags twice with no duplicate-key error (DH-04)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: a React key warning is asserted below.
    });
    render(<DetailHeader {...untyped({ title: 'Release notes', tags: ['Design', ' ', 'Design', 'Systems'] })} />);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Design', 'Design', 'Systems']);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it.each([
    ['a blank', '   '],
    ['an empty', ''],
    ['a numeric', 7],
    ['a null', null],
    ['an object', { label: 'Design' }]
  ])('skips %s tag with the exact warning and renders the other tags (DH-04)', (_name, tag) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', tags: [tag, 'Design'] })} />);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Design']);
    expect(consoleWarn.mock.calls).toEqual([[tagWarning]]);
  });

  it('warns once per blank tag (DH-04)', () => {
    render(<DetailHeader {...untyped({ title: 'Release notes', tags: ['', 'Design', ' ', null] })} />);
    expect(consoleWarn.mock.calls).toEqual([[tagWarning], [tagWarning], [tagWarning]]);
  });

  it.each([
    ['absent', undefined, 0],
    ['empty', [], 0],
    ['all blank', ['', '  '], 2],
    ['a string', 'Design', 0],
    ['a plain object', { 0: 'Design' }, 0],
    ['null', null, 0]
  ])('renders no list when tags is %s (DH-04)', (_name, tags, warnings) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', tags })} />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(document.querySelector('ul')).toBeNull();
    expect(consoleWarn).toHaveBeenCalledTimes(warnings);
  });

  it('renders the tags after the facts and follows the current tags on rerender (DH-04)', () => {
    const { rerender } = render(
      <DetailHeader title='Release notes' metadata={[source]} tags={['Design', 'Systems']} />
    );
    expect(follows(screen.getByRole('definition'), screen.getByRole('list', { name: 'Tags' }))).toBe(true);
    rerender(<DetailHeader title='Release notes' metadata={[source]} tags={['Design']} />);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Design']);
    rerender(<DetailHeader title='Release notes' metadata={[source]} />);
    expect(screen.queryByRole('list')).toBeNull();
  });
});

const repository: DetailHeaderLink = { label: 'Repository', href: 'https://example.com/repository' };
const demo: DetailHeaderLink = { label: 'Live demo', href: 'https://example.org/demo' };
const linkWarning = 'DetailHeader: skipping an invalid link entry.';

describe('DetailHeader links', () => {
  it('renders a named list of links, in the supplied order, each in its own list item (DH-05)', () => {
    render(<DetailHeader title='Release notes' links={[repository, demo]} />);
    const list = screen.getByRole('list', { name: 'Links' });
    expect(list.tagName).toBe('UL');
    expect(list).toHaveAttribute('role', 'list');
    expect(list).toHaveClass('eg-detail-header__links');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(Array.from(list.children).map((child) => child.tagName)).toEqual(['LI', 'LI']);
    expect(within(items[0] as HTMLElement).getAllByRole('link')).toHaveLength(1);
    expect(within(items[1] as HTMLElement).getAllByRole('link')).toHaveLength(1);
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      'https://example.com/repository',
      'https://example.org/demo'
    ]);
  });

  it('renders each link through the exported Link with a new tab, safe rel and the hidden notice (DH-05)', () => {
    render(<DetailHeader title='Release notes' links={[repository]} />);
    const link = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expect(link).toHaveClass('eg-link');
    expect(link).toHaveAttribute('target', '_blank');
    const rel = (link.getAttribute('rel') ?? '').split(/\s+/);
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
    // The label stays the visible text, the notice is visually hidden, and the arrow is decorative.
    expect(link.textContent).toBe('Repository (opens in a new tab)');
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('trims surrounding whitespace from a valid destination, as SocialLinks does (DH-05)', () => {
    render(
      <DetailHeader
        title='Release notes'
        links={[{ label: 'Repository', href: '  https://example.com/repository  ' }]}
      />
    );
    expect(screen.getByRole('link', { name: /Repository/ })).toHaveAttribute('href', 'https://example.com/repository');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['a blank label', { label: '   ', href: 'https://example.com/a' }],
    ['an empty label', { label: '', href: 'https://example.com/a' }],
    ['a missing label', { href: 'https://example.com/a' }],
    ['a numeric label', { label: 7, href: 'https://example.com/a' }],
    ['a relative path', { label: 'Page', href: '/repository' }],
    ['a relative segment', { label: 'Page', href: 'repository' }],
    ['a protocol-relative URL', { label: 'Page', href: '//example.com/repository' }],
    ['an http URL', { label: 'Page', href: 'http://example.com/repository' }],
    ['a javascript URL', { label: 'Page', href: 'javascript:alert(1)' }],
    ['a data URL', { label: 'Page', href: 'data:text/html,hello' }],
    ['a credentialed URL', { label: 'Page', href: 'https://user:secret@example.com/repository' }],
    ['a username-only URL', { label: 'Page', href: 'https://user@example.com/repository' }],
    ['a URL without a host', { label: 'Page', href: 'https:///' }],
    ['an empty href', { label: 'Page', href: '' }],
    ['a whitespace-only href', { label: 'Page', href: '   ' }],
    ['a missing href', { label: 'Page' }],
    ['a NUL character', { label: 'Page', href: 'https://example.com/\u0000repository' }],
    ['a DEL character', { label: 'Page', href: 'https://example.com/\u007frepository' }],
    ['a C1 control character', { label: 'Page', href: 'https://example.com/\u009frepository' }],
    ['a numeric href', { label: 'Page', href: 42 }],
    ['a string entry', 'https://example.com/repository'],
    ['a null entry', null],
    ['a numeric entry', 7]
  ])('skips %s with the exact warning and renders the other links (DH-05)', (_name, entry) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', links: [entry, demo] })} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Live demo (opens in a new tab)' })).toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[linkWarning]]);
  });

  it('warns once per invalid link entry (DH-05)', () => {
    render(<DetailHeader {...untyped({ title: 'Release notes', links: [{ label: '' }, repository, null, 7] })} />);
    expect(consoleWarn.mock.calls).toEqual([[linkWarning], [linkWarning], [linkWarning]]);
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('never puts a rejected destination in the DOM (DH-05)', () => {
    const { container } = render(
      <DetailHeader
        {...untyped({
          title: 'Release notes',
          links: [
            { label: 'Script', href: 'javascript:alert(1)' },
            { label: 'Plain', href: 'http://example.com' },
            { label: 'Relative', href: '/repository' }
          ]
        })}
      />
    );
    expect(container.querySelector('a')).toBeNull();
    expect(container.innerHTML).not.toContain('javascript');
    expect(container.innerHTML).not.toContain('http://');
  });

  it.each([
    ['absent', undefined, 0],
    ['empty', [], 0],
    ['all invalid', [{ label: '', href: '' }, null], 2],
    ['a string', 'https://example.com/repository', 0],
    ['a plain object', { label: 'Repository', href: 'https://example.com/repository' }, 0],
    ['null', null, 0]
  ])('renders no list when links is %s (DH-05)', (_name, links, warnings) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', links })} />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(consoleWarn).toHaveBeenCalledTimes(warnings);
  });

  it('renders duplicate links twice with no duplicate-key error (DH-05)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: a React key warning is asserted below.
    });
    render(<DetailHeader {...untyped({ title: 'Release notes', links: [repository, null, repository, demo] })} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('renders the links after the tags and follows the current links on rerender (DH-05)', () => {
    const { rerender } = render(<DetailHeader title='Release notes' tags={['Design']} links={[repository, demo]} />);
    expect(follows(screen.getByRole('list', { name: 'Tags' }), screen.getByRole('list', { name: 'Links' }))).toBe(true);
    rerender(<DetailHeader title='Release notes' tags={['Design']} links={[demo]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    rerender(<DetailHeader title='Release notes' tags={['Design']} />);
    expect(screen.queryByRole('list', { name: 'Links' })).toBeNull();
  });
});

const blankWarning = (prop: string) => `DetailHeader: ${prop} must not be blank; using its default.`;

describe('DetailHeader localization', () => {
  it('renames both lists and every link notice from messages and newTabText (DH-06)', () => {
    render(
      <DetailHeader
        title='Release notes'
        tags={['Design']}
        links={[repository, demo]}
        messages={{ tags: 'Topics', links: 'Related pages' }}
        newTabText='(opens in a new window)'
      />
    );
    expect(screen.getByRole('list', { name: 'Topics' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Related pages' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Tags' })).toBeNull();
    expect(screen.queryByRole('list', { name: 'Links' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Repository (opens in a new window)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Live demo (opens in a new window)' })).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('opens in a new tab');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('keeps the other default when messages is partial (DH-06)', () => {
    const { rerender } = render(
      <DetailHeader title='Release notes' tags={['Design']} links={[repository]} messages={{ tags: 'Topics' }} />
    );
    expect(screen.getByRole('list', { name: 'Topics' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Links' })).toBeInTheDocument();
    rerender(
      <DetailHeader title='Release notes' tags={['Design']} links={[repository]} messages={{ links: 'Related' }} />
    );
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Related' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('uses the English defaults, without a warning, when nothing is supplied (DH-06)', () => {
    render(<DetailHeader title='Release notes' tags={['Design']} links={[repository]} />);
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Links' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Repository (opens in a new tab)' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['a blank', '   '],
    ['an empty', ''],
    ['a numeric', 7],
    ['a null', null]
  ])('falls back to the default notice, with one warning, for %s newTabText (DH-06)', (_name, newTabText) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', links: [repository], newTabText })} />);
    expect(screen.getByRole('link', { name: 'Repository (opens in a new tab)' })).toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[blankWarning('newTabText')]]);
  });

  it.each([
    ['a blank', '   '],
    ['an empty', ''],
    ['a numeric', 7],
    ['a null', null]
  ])('falls back to the default name, with one warning, for %s messages.tags (DH-06)', (_name, tags) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', tags: ['Design'], messages: { tags } })} />);
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[blankWarning('messages.tags')]]);
  });

  it.each([
    ['a blank', '   '],
    ['an empty', ''],
    ['a numeric', 7],
    ['a null', null]
  ])('falls back to the default name, with one warning, for %s messages.links (DH-06)', (_name, links) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', links: [repository], messages: { links } })} />);
    expect(screen.getByRole('list', { name: 'Links' })).toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[blankWarning('messages.links')]]);
  });

  it('warns for every blank value and keeps the other overrides (DH-06)', () => {
    render(
      <DetailHeader
        {...untyped({
          title: 'Release notes',
          tags: ['Design'],
          links: [repository],
          newTabText: ' ',
          messages: { tags: '', links: 'Related' }
        })}
      />
    );
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Related' })).toBeInTheDocument();
    expect(consoleWarn.mock.calls.map(([message]) => message).sort()).toEqual(
      [blankWarning('newTabText'), blankWarning('messages.tags')].sort()
    );
  });

  it('reports a blank localized value even when its list does not render (DH-06)', () => {
    render(<DetailHeader {...untyped({ title: 'Release notes', messages: { tags: ' ' }, newTabText: '' })} />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(consoleWarn.mock.calls.map(([message]) => message).sort()).toEqual(
      [blankWarning('newTabText'), blankWarning('messages.tags')].sort()
    );
  });

  it.each([
    ['a string', 'Topics'],
    ['null', null],
    ['a number', 7],
    ['an array', ['Topics']]
  ])('treats %s messages as absent: the defaults apply and nothing is reported (DH-06)', (_name, messages) => {
    render(<DetailHeader {...untyped({ title: 'Release notes', tags: ['Design'], links: [repository], messages })} />);
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Links' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('treats an undefined key as absent and is silent in production for a blank one (DH-06)', () => {
    const { rerender } = render(
      <DetailHeader title='Release notes' tags={['Design']} messages={{ tags: undefined, links: undefined }} />
    );
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
    vi.stubEnv('NODE_ENV', 'production');
    rerender(<DetailHeader {...untyped({ title: 'Release notes', tags: ['Design'], messages: { tags: ' ' } })} />);
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('follows the current localized props on rerender and leaves nothing behind (DH-06)', () => {
    const { rerender } = render(
      <DetailHeader
        title='Release notes'
        tags={['Design']}
        links={[repository]}
        messages={{ tags: 'Topics', links: 'Related pages' }}
        newTabText='(opens in a new window)'
      />
    );
    expect(screen.getByRole('list', { name: 'Topics' })).toBeInTheDocument();
    rerender(<DetailHeader title='Release notes' tags={['Design']} links={[repository]} />);
    expect(screen.queryByRole('list', { name: 'Topics' })).toBeNull();
    expect(screen.getByRole('list', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Repository (opens in a new tab)' })).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('new window');
  });
});

const full = (
  <DetailHeader
    eyebrow='Event'
    title='Conference'
    lede='Two days of talks.'
    metadata={[published, source]}
    tags={['Design', 'Systems']}
    links={[repository, demo]}
  />
);

describe('DetailHeader structure', () => {
  it('renders a plain div root with no role or name, holding the heading block then the three lists (DH-07)', () => {
    const { container } = render(full);
    const root = container.firstElementChild as HTMLElement;
    expect(container.children).toHaveLength(1);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-detail-header');
    for (const attribute of ['role', 'aria-label', 'aria-labelledby', 'title', 'tabindex', 'style']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(Array.from(root.children).map((child) => child.tagName)).toEqual(['HEADER', 'DL', 'UL', 'UL']);
  });

  it('has exactly one header, never nested, and no fact, tag or link inside it (DH-07)', () => {
    const { container } = render(full);
    expect(container.querySelectorAll('header')).toHaveLength(1);
    const header = container.querySelector('header') as HTMLElement;
    expect(header.parentElement?.closest('header')).toBeNull();
    expect(header.querySelector('dl, ul, ol, li, a, time')).toBeNull();
    // The heading block holds the eyebrow, the title and the lede only.
    expect(Array.from(header.children).map((child) => child.tagName)).toEqual(['P', 'H1', 'P']);
  });

  it('keeps the DOM order eyebrow, title, lede, facts, tags, links (DH-07)', () => {
    render(full);
    const sequence = [
      screen.getByText('Event'),
      screen.getByRole('heading', { name: 'Conference' }),
      screen.getByText('Two days of talks.'),
      document.querySelector('dl') as HTMLElement,
      screen.getByRole('list', { name: 'Tags' }),
      screen.getByRole('list', { name: 'Links' })
    ];
    for (const [index, node] of sequence.entries()) {
      const next = sequence[index + 1];
      if (next) {
        expect(follows(node, next), `${index} before ${index + 1}`).toBe(true);
      }
    }
  });

  it('never forwards role, aria-label, aria-labelledby, style, children or dangerouslySetInnerHTML (DH-07)', () => {
    const { container } = render(
      <DetailHeader
        {...untyped({
          title: 'Release notes',
          role: 'region',
          'aria-label': 'Custom name',
          'aria-labelledby': 'external-heading',
          style: { color: 'red' },
          children: <p>Injected child</p>,
          dangerouslySetInnerHTML: { __html: '<p>Injected html</p>' }
        })}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    for (const attribute of ['role', 'aria-label', 'aria-labelledby', 'style']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(screen.queryByRole('region')).toBeNull();
    expect(container.textContent).toBe('Release notes');
    expect(container.innerHTML).not.toContain('Injected');
  });

  it('uses the own title as the heading text, so the root carries no title attribute (DH-07)', () => {
    const { container } = render(<DetailHeader title='Release notes' />);
    expect(container.querySelector('[title]')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Release notes' })).toBeInTheDocument();
  });

  it('drops a ref at an untyped boundary, so the root never receives it: there is no public ref (DH-07)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DetailHeader {...untyped({ title: 'Release notes', ref })} />);
    expect(ref.current).toBeNull();
  });
});

describe('DetailHeader root props', () => {
  it('forwards id, lang, dir, data attributes and handlers to the root (DH-08)', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <DetailHeader
        title='Release notes'
        id='page-header'
        lang='en'
        dir='ltr'
        data-section='posts'
        aria-describedby='intro'
        onClick={onClick}
      />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('id', 'page-header');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveAttribute('dir', 'ltr');
    expect(root).toHaveAttribute('data-section', 'posts');
    expect(root).toHaveAttribute('aria-describedby', 'intro');
    await userEvent.click(root);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges className last on the root and keeps the stable marker and a width constraint (DH-08)', () => {
    const { container } = render(<DetailHeader title='Release notes' className='mt-6 max-w-prose min-w-[16rem]' />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('eg-detail-header', 'mt-6', 'max-w-prose', 'min-w-[16rem]');
    // twMerge resolves the recognized min-width conflict in favor of the consumer, never the other way round.
    expect(root).not.toHaveClass('min-w-0');
    expect([...root.classList].slice(-3)).toEqual(['mt-6', 'max-w-prose', 'min-w-[16rem]']);
  });

  it('keeps the stable marker when a consumer class conflicts with a root utility (DH-08)', () => {
    const { container } = render(<DetailHeader title='Release notes' className='gap-2 flex-row' />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('eg-detail-header', 'gap-2', 'flex-row');
    expect(root).not.toHaveClass('gap-6');
  });

  it('puts the consumer class on the root only, never on a part or a composed component (DH-08)', () => {
    const { container } = render(
      <DetailHeader
        eyebrow='Event'
        title='Conference'
        lede='Two days of talks.'
        metadata={[published]}
        tags={['Design']}
        links={[repository]}
        className='consumer-class'
      />
    );
    const marked = container.querySelectorAll('.consumer-class');
    expect(marked).toHaveLength(1);
    expect(marked[0]).toBe(container.firstElementChild);
  });

  it('keeps the three retained list markers on the three lists (DH-08)', () => {
    const { container } = render(
      <DetailHeader title='Release notes' metadata={[published]} tags={['Design']} links={[repository]} />
    );
    expect(container.querySelectorAll('.eg-detail-header__meta')).toHaveLength(1);
    expect(container.querySelectorAll('.eg-detail-header__tags')).toHaveLength(1);
    expect(container.querySelectorAll('.eg-detail-header__links')).toHaveLength(1);
    expect(container.querySelector('.eg-detail-header__meta')?.tagName).toBe('DL');
    expect(container.querySelector('.eg-detail-header__tags')?.tagName).toBe('UL');
    expect(container.querySelector('.eg-detail-header__links')?.tagName).toBe('UL');
  });
});

describe('DetailHeader recipes', () => {
  it('keeps the type and colour utilities of the term and the value after cn merging (DH-09)', () => {
    render(<DetailHeader title='Release notes' metadata={[published]} />);
    expect(screen.getByRole('term')).toHaveClass(
      'm-0',
      'font-display',
      'text-label-eyebrow',
      'uppercase',
      'text-fg-muted'
    );
    expect(screen.getByRole('definition')).toHaveClass(
      'm-0',
      'min-w-0',
      'font-sans',
      'text-body-default',
      'text-fg-default',
      'wrap-anywhere'
    );
  });

  it('keeps the list reset and the wrapping row on every list (DH-09)', () => {
    render(<DetailHeader title='Release notes' metadata={[published]} tags={['Design']} links={[repository]} />);
    expect(screen.getByRole('list', { name: 'Tags' })).toHaveClass(
      'm-0',
      'p-0',
      'list-none',
      'flex',
      'flex-wrap',
      'gap-1.5'
    );
    expect(screen.getByRole('list', { name: 'Links' })).toHaveClass(
      'm-0',
      'p-0',
      'list-none',
      'flex',
      'flex-wrap',
      'gap-x-6',
      'gap-y-3'
    );
    expect(document.querySelector('dl')).toHaveClass('m-0', 'flex', 'flex-wrap', 'gap-x-8', 'gap-y-4');
    expect(document.querySelector('dl > div')).toHaveClass('flex', 'min-w-0', 'flex-col', 'gap-1');
    expect(screen.getAllByRole('listitem').at(-1)).toHaveClass('min-w-0');
  });

  it('lets an unbroken link label wrap: the link item keeps min-w-0 and carries wrap-anywhere (DH-11, Amendment 1)', () => {
    render(<DetailHeader title='Release notes' links={[repository]} />);
    const item = screen.getByRole('link').closest('li');
    expect(item).toHaveClass('min-w-0', 'wrap-anywhere');
    expect(detailHeaderLinkItemVariants().split(' ')).toEqual(['min-w-0', 'wrap-anywhere']);
  });

  it('sets no inline style and mirrors no state on any element DetailHeader owns (DH-09)', () => {
    const { container } = render(full);
    const owned = container.querySelectorAll('.eg-detail-header, dl, dl > div, dt, dd, time, ul, li, .eg-chip > span');
    expect(owned.length).toBeGreaterThan(0);
    for (const element of owned) {
      expect(element, element.tagName).not.toHaveAttribute('style');
      expect(element, element.tagName).not.toHaveAttribute('data-state');
    }
    expect(container.innerHTML).not.toMatch(/\bis-[a-z]/);
  });

  it('declares only static string recipes in types.ts, with no template, arbitrary value or inline style (DH-09)', () => {
    const path = resolve(import.meta.dirname, 'types.ts');
    const file = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    const recipes: string[] = [];
    const templates: ts.Node[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'cva') {
        expect(node.arguments).toHaveLength(1);
        const [argument] = node.arguments;
        expect(argument && ts.isStringLiteral(argument)).toBe(true);
        if (argument && ts.isStringLiteral(argument)) {
          recipes.push(argument.text);
        }
      }
      if (ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        templates.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(recipes).toHaveLength(9);
    expect(templates).toHaveLength(0);
    for (const recipe of recipes) {
      expect(recipe).not.toContain('[');
      expect(recipe).not.toContain('!');
      expect(recipe).not.toMatch(/\$\{/);
    }
    expect(recipes.filter((recipe) => recipe.startsWith('eg-detail-header'))).toHaveLength(4);
  });

  it('is exactly the nine recipes of the approved spec and nothing else (DH-09)', () => {
    expect(detailHeaderVariants()).toContain('eg-detail-header');
    expect(detailHeaderMetaVariants()).toContain('eg-detail-header__meta');
    expect(detailHeaderTagsVariants()).toContain('eg-detail-header__tags');
    expect(detailHeaderLinksVariants()).toContain('eg-detail-header__links');
    for (const recipe of [
      detailHeaderMetaEntryVariants,
      detailHeaderTermVariants,
      detailHeaderValueVariants,
      detailHeaderTagLabelVariants,
      detailHeaderLinkItemVariants
    ]) {
      expect(recipe()).not.toContain('eg-');
    }
    // The tag label restores wrapping that Chip turns off on itself; no min-w-0 is needed (Amendment 2).
    expect(detailHeaderTagLabelVariants().split(' ')).toEqual(['whitespace-normal', 'wrap-anywhere']);
  });

  it('adds no paint, border, shadow, transition or animation utility to anything it owns (DH-09)', () => {
    const owned = [
      detailHeaderVariants(),
      detailHeaderMetaVariants(),
      detailHeaderMetaEntryVariants(),
      detailHeaderTermVariants(),
      detailHeaderValueVariants(),
      detailHeaderTagsVariants(),
      detailHeaderTagLabelVariants(),
      detailHeaderLinksVariants(),
      detailHeaderLinkItemVariants()
    ].flatMap((classes) => classes.split(' '));
    for (const utility of owned) {
      expect(utility).not.toMatch(
        /^(?:transition|animate|duration|ease|delay|bg|border|shadow|ring|outline|backdrop|filter|rounded|opacity|transform)\b/
      );
    }
  });

  it('has no stylesheet: the folder holds no css file (DH-09)', () => {
    expect(readdirSync(import.meta.dirname).filter((name) => name.endsWith('.css'))).toEqual([]);
  });
});

describe('DetailHeader keyboard order', () => {
  it('moves no focus when it renders (DH-10)', () => {
    render(full);
    expect(document.body).toHaveFocus();
  });

  it('visits each link once with Tab, in DOM order, and nothing else, then leaves the component (DH-10)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        {full}
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Repository (opens in a new tab)' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Live demo (opens in a new tab)' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Live demo (opens in a new tab)' })).toHaveFocus();
  });

  it('makes no heading, term, value or chip focusable and adds no tabindex (DH-10)', () => {
    const { container } = render(full);
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
    const focusable = container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]');
    expect(focusable).toHaveLength(2);
    for (const element of focusable) {
      expect(element.tagName).toBe('A');
    }
  });
});

describe('DetailHeader hook', () => {
  it('returns the root props and the heading props for the component to render (DH-01)', () => {
    const { result } = renderHook(() =>
      useDetailHeader({ title: 'Release notes', eyebrow: 'Article', lede: 'Summary', level: 3 })
    );
    expect(result.current.renderRoot).toBe(true);
    if (!result.current.renderRoot) {
      throw new Error('The hook must render a readable title.');
    }
    expect(result.current.rootProps.className).toContain('eg-detail-header');
    expect(result.current.headingProps).toEqual({
      title: 'Release notes',
      eyebrow: 'Article',
      lede: 'Summary',
      level: 3
    });
  });

  it('defaults the level to 1 and resolves an out-of-range level to 1 (DH-01)', () => {
    const { result, rerender } = renderHook((props: DetailHeaderProps) => useDetailHeader(props), {
      initialProps: { title: 'Release notes' } as DetailHeaderProps
    });
    expect(result.current.renderRoot && result.current.headingProps.level).toBe(1);
    rerender(untyped({ title: 'Release notes', level: 9 }));
    expect(result.current.renderRoot && result.current.headingProps.level).toBe(1);
    rerender({ title: 'Release notes', level: 6 });
    expect(result.current.renderRoot && result.current.headingProps.level).toBe(6);
  });
});

describe('DetailHeader hook lists', () => {
  it('returns the validated lists with the explicit list role and the localized names (DH-03, DH-04, DH-05, DH-06)', () => {
    const { result } = renderHook(() =>
      useDetailHeader({
        title: 'Release notes',
        metadata: [published, source],
        tags: ['Design'],
        links: [repository],
        messages: { tags: 'Topics' },
        newTabText: '(opens in a new window)'
      })
    );
    expect(Object.keys(result.current).sort()).toEqual([
      'headingProps',
      'links',
      'metadata',
      'renderRoot',
      'rootProps',
      'tags'
    ]);
    if (!result.current.renderRoot) {
      throw new Error('The hook must render a readable title.');
    }
    const { metadata, tags, links } = result.current;
    expect(metadata?.entries).toEqual([
      { key: '0:Published', label: 'Published', value: 'November 26, 2026', dateTime: '2026-11-26' },
      { key: '1:Source', label: 'Source', value: 'example.com', dateTime: undefined }
    ]);
    // A description list needs no role; the two unordered lists carry the explicit one with their names.
    expect(metadata?.listProps.role).toBeUndefined();
    expect(tags?.listProps).toMatchObject({ role: 'list', 'aria-label': 'Topics' });
    expect(tags?.entries).toEqual([{ key: '0:Design', label: 'Design' }]);
    expect(tags?.labelClassName.split(' ')).toEqual(['whitespace-normal', 'wrap-anywhere']);
    expect(links?.listProps).toMatchObject({ role: 'list', 'aria-label': 'Links' });
    expect(links?.newTabText).toBe('(opens in a new window)');
    expect(links?.entries).toEqual([
      { key: '0:Repository', label: 'Repository', href: 'https://example.com/repository' }
    ]);
  });

  it('keys every kept entry by its original position, so a skipped entry shifts no key (DH-03, DH-04, DH-05)', () => {
    const { result } = renderHook(() =>
      useDetailHeader(
        untyped({
          title: 'Release notes',
          metadata: [null, source],
          tags: [' ', 'Design', 'Design'],
          links: [null, repository]
        })
      )
    );
    if (!result.current.renderRoot) {
      throw new Error('The hook must render a readable title.');
    }
    expect(result.current.metadata?.entries.map(({ key }) => key)).toEqual(['1:Source']);
    expect(result.current.tags?.entries.map(({ key }) => key)).toEqual(['1:Design', '2:Design']);
    expect(result.current.links?.entries.map(({ key }) => key)).toEqual(['1:Repository']);
  });

  it('omits every absent or invalid list from the result and gives the empty result for an unreadable title (DH-02)', () => {
    const bare = renderHook(() => useDetailHeader({ title: 'Release notes' }));
    expect(bare.result.current).toMatchObject({
      renderRoot: true,
      metadata: undefined,
      tags: undefined,
      links: undefined
    });
    const invalid = renderHook(() =>
      useDetailHeader(
        untyped({ title: 'Release notes', metadata: [null], tags: [''], links: [{ label: '', href: '' }] })
      )
    );
    expect(invalid.result.current).toMatchObject({
      renderRoot: true,
      metadata: undefined,
      tags: undefined,
      links: undefined
    });
    const unreadable = renderHook(() => useDetailHeader(untyped({ title: '  ' })));
    expect(unreadable.result.current).toEqual({ renderRoot: false });
  });

  it('strips the protected keys from the root props and keeps the rest (DH-07, DH-08)', () => {
    const { result } = renderHook(() =>
      useDetailHeader(
        untyped({
          title: 'Release notes',
          role: 'region',
          'aria-label': 'Custom name',
          'aria-labelledby': 'other',
          children: 'injected',
          dangerouslySetInnerHTML: { __html: 'injected' },
          style: { color: 'red' },
          ref: createRef(),
          id: 'kept',
          'data-section': 'posts'
        })
      )
    );
    if (!result.current.renderRoot) {
      throw new Error('The hook must render a readable title.');
    }
    for (const key of [
      'children',
      'role',
      'aria-label',
      'aria-labelledby',
      'dangerouslySetInnerHTML',
      'style',
      'ref',
      'title',
      'metadata',
      'tags',
      'links',
      'messages',
      'newTabText',
      'level'
    ]) {
      expect(result.current.rootProps, key).not.toHaveProperty(key);
    }
    expect(result.current.rootProps).toMatchObject({ id: 'kept', 'data-section': 'posts' });
  });

  it('stores nothing between renders: the result follows the current props (DH-01)', () => {
    const { result, rerender } = renderHook((props: DetailHeaderProps) => useDetailHeader(props), {
      initialProps: { title: 'Release notes', tags: ['Design'] } as DetailHeaderProps
    });
    expect(result.current.renderRoot && result.current.tags?.entries).toHaveLength(1);
    rerender({ title: 'Release notes', level: 4 });
    expect(result.current.renderRoot && result.current.tags).toBeUndefined();
    expect(result.current.renderRoot && result.current.headingProps.level).toBe(4);
    rerender(untyped({ title: ' ' }));
    expect(result.current).toEqual({ renderRoot: false });
    rerender({ title: 'Back again' });
    expect(result.current.renderRoot && result.current.headingProps.title).toBe('Back again');
  });
});

describe('DetailHeader rendering targets', () => {
  it('renders the same markup on the server and on the client (DH-16)', () => {
    const element = (
      <DetailHeader eyebrow='Event' title='Conference' metadata={[published]} tags={['Design']} links={[repository]} />
    );
    const server = renderToStaticMarkup(element);
    expect(renderToStaticMarkup(element)).toBe(server);
    const { container } = render(element);
    // Both sides go through the HTML parser, which lowercases dateTime and normalizes entities. The one inline style
    // belongs to the visually hidden notice of the composed Link (Radix), not to an element DetailHeader owns.
    const normalize = (html: string) => {
      const scratch = document.createElement('div');
      scratch.innerHTML = html;
      for (const element of scratch.querySelectorAll('[style]')) {
        element.removeAttribute('style');
      }
      return scratch.innerHTML;
    };
    expect(normalize(container.innerHTML)).toBe(normalize(server));
    expect(server).toContain('eg-detail-header');
    expect(server).toContain('<dl');
    expect(normalize(server)).toContain('datetime="2026-11-26"');
    expect(server).toContain('target="_blank"');
  });

  it('renders nothing on the server for an unreadable title and drops invalid entries (DH-02, DH-16)', () => {
    expect(renderToStaticMarkup(<DetailHeader {...untyped({ title: '  ', tags: ['Design'] })} />)).toBe('');
    const markup = renderToStaticMarkup(
      <DetailHeader
        {...untyped({ title: 'Release notes', links: [{ label: 'Plain', href: 'http://example.com' }], tags: [' '] })}
      />
    );
    expect(markup).not.toContain('<ul');
    expect(markup).not.toContain('http://');
  });

  it('warns during render only, so a StrictMode double render repeats the same exact messages (DH-03)', () => {
    render(
      <StrictMode>
        <DetailHeader {...untyped({ title: 'Release notes', metadata: [null, source], tags: [' '], links: [null] })} />
      </StrictMode>
    );
    expect(new Set(consoleWarn.mock.calls.map(([message]) => message))).toEqual(
      new Set([metadataWarning, tagWarning, linkWarning])
    );
  });

  it('is silent in production for every entry and list rule (DH-03, DH-04, DH-05)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    render(
      <DetailHeader
        {...untyped({
          title: 'Release notes',
          metadata: [null, source],
          tags: [' ', 'Design'],
          links: [null, repository],
          newTabText: ' ',
          messages: { tags: '' }
        })}
      />
    );
    expect(screen.getAllByRole('term')).toHaveLength(1);
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

describe('DetailHeader public types', () => {
  it('excludes the protected props, a ref and asChild from the public type, and types every field (DH-07)', () => {
    expectTypeOf<
      Extract<
        keyof DetailHeaderProps,
        'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'style' | 'ref' | 'asChild'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<DetailHeaderProps['metadata']>().toEqualTypeOf<DetailHeaderMetadataItem[] | undefined>();
    expectTypeOf<DetailHeaderProps['tags']>().toEqualTypeOf<string[] | undefined>();
    expectTypeOf<DetailHeaderProps['links']>().toEqualTypeOf<DetailHeaderLink[] | undefined>();
    expectTypeOf<DetailHeaderProps['messages']>().toEqualTypeOf<Partial<DetailHeaderMessages> | undefined>();
    expectTypeOf<DetailHeaderProps['newTabText']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<DetailHeaderProps['level']>().toEqualTypeOf<1 | 2 | 3 | 4 | 5 | 6 | undefined>();
    // @ts-expect-error The root has no role: the heading names the content.
    const withRole: DetailHeaderProps = { title: 'x', role: 'region' };
    // @ts-expect-error The root has no name override: the heading names the content.
    const withAriaLabel: DetailHeaderProps = { title: 'x', 'aria-label': 'x' };
    // @ts-expect-error The root has no aria-labelledby: the heading names the content.
    const withLabelledBy: DetailHeaderProps = { title: 'x', 'aria-labelledby': 'x' };
    // @ts-expect-error The content comes from props: there are no children.
    const withChildren: DetailHeaderProps = { title: 'x', children: 'x' };
    // @ts-expect-error Raw HTML is protected.
    const withHtml: DetailHeaderProps = { title: 'x', dangerouslySetInnerHTML: { __html: 'x' } };
    // @ts-expect-error The component paints no inline appearance: there is no style.
    const withStyle: DetailHeaderProps = { title: 'x', style: { color: 'red' } };
    // @ts-expect-error There is no root ref in this API.
    const withRef: DetailHeaderProps = { title: 'x', ref: null };
    // @ts-expect-error There is no Slot composition.
    const withAsChild: DetailHeaderProps = { title: 'x', asChild: true };
    // @ts-expect-error The title is required.
    const withoutTitle: DetailHeaderProps = {};
    // @ts-expect-error A heading rank is 1 to 6.
    const badLevel: DetailHeaderProps = { title: 'x', level: 7 };
    // @ts-expect-error A fact needs a value.
    const noValue: DetailHeaderProps = { title: 'x', metadata: [{ label: 'x' }] };
    // @ts-expect-error A fact needs a label.
    const noLabel: DetailHeaderProps = { title: 'x', metadata: [{ value: 'x' }] };
    // @ts-expect-error A link needs a destination.
    const noHref: DetailHeaderProps = { title: 'x', links: [{ label: 'x' }] };
    // @ts-expect-error A tag is a plain string, not an object.
    const objectTag: DetailHeaderProps = { title: 'x', tags: [{ label: 'x' }] };
    // @ts-expect-error The list names are the two documented keys only.
    const extraMessage: DetailHeaderProps = { title: 'x', messages: { footer: 'x' } };
    expect([
      withRole,
      withAriaLabel,
      withLabelledBy,
      withChildren,
      withHtml,
      withStyle,
      withRef,
      withAsChild,
      withoutTitle,
      badLevel,
      noValue,
      noLabel,
      noHref,
      objectTag,
      extraMessage
    ]).toHaveLength(15);
  });
});
