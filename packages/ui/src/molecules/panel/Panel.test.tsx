import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAccentTheme } from '@egdev/tokens/accent';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type CSSProperties, createRef, useId } from 'react';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
import { Surface } from '../../primitives/surface';
import { Heading } from '../../primitives/text';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../popover';
import * as publicAPI from '.';
import { Panel, PanelBody, PanelFooter, PanelHeader } from './Panel';
import type { PanelBodyProps, PanelProps } from './types';
import { usePanel, usePanelPart } from './usePanel';

const tones = ['surface-1', 'overlay', 'inherit'] as const;
const variants = ['default', 'banded'] as const;
const matrix = tones.flatMap((tone) => variants.map((variant) => ({ tone, variant })));
const framedTop = 'first:rounded-t-[calc(var(--radius-xl)-var(--border-width))]';
const framedBottom = 'last:rounded-b-[calc(var(--radius-xl)-var(--border-width))]';
const accentBase = [
  'relative',
  'before:absolute',
  'before:pointer-events-none',
  'before:z-10',
  "before:content-['']",
  'before:[inline-size:var(--space-1)]',
  'before:bg-fg-brand-default'
];
const framedAccent = [
  'before:[inset-inline-start:var(--border-width)]',
  'before:[inset-block:var(--border-width)]',
  'before:rounded-ss-[calc(var(--radius-xl)-var(--border-width))]',
  'before:rounded-es-[calc(var(--radius-xl)-var(--border-width))]'
];
const inheritedAccent = [
  'before:[inset-inline-start:0]',
  'before:[inset-block:0]',
  'before:rounded-ss-xl',
  'before:rounded-es-xl'
];

function panelFor(element: HTMLElement): HTMLElement {
  const root = element.closest<HTMLElement>('.eg-panel');
  if (!root) {
    throw new Error('Expected content inside a Panel.');
  }
  return root;
}

function Example(props: Omit<PanelProps, 'children'>) {
  return (
    <Panel {...props}>
      <>
        <PanelHeader>
          <h2>Workspace</h2>
        </PanelHeader>
        <PanelBody>
          <p>Content</p>
        </PanelBody>
        <PanelFooter>
          <time dateTime='2026-10-30'>Updated today</time>
        </PanelFooter>
      </>
    </Panel>
  );
}

describe('Panel accent edge contract', () => {
  it.each(matrix)(
    'leaves omitted, undefined and invalid edges unchanged without DOM leakage for $tone / $variant',
    ({ tone, variant }) => {
      const example = (input: Record<string, unknown>) => (
        <Panel {...({ tone, variant, ...input } as unknown as PanelProps)}>
          <PanelHeader>Header</PanelHeader>
          <PanelBody>Content</PanelBody>
          <PanelFooter>Footer</PanelFooter>
        </Panel>
      );
      const { rerender } = render(example({}));
      const root = panelFor(screen.getByText('Content'));
      const original = root.outerHTML;
      expect(root).not.toHaveClass('relative');
      expect([...root.classList].filter((name) => name.startsWith('before:'))).toEqual([]);
      for (const value of [undefined, null, false, true, '', 'end', 'left', 'START', 0]) {
        rerender(example({ accentEdge: value }));
        expect(panelFor(screen.getByText('Content')).outerHTML, String(value)).toBe(original);
        expect(root).not.toHaveAttribute('accentEdge');
        expect(root).not.toHaveAttribute('accentedge');
      }
    }
  );

  it.each(matrix.flatMap((entry) => (['ltr', 'rtl'] as const).map((dir) => ({ ...entry, dir }))))(
    'adds the logical-start edge without changing $tone / $variant zones in $dir',
    ({ tone, variant, dir }) => {
      const { rerender } = render(<Example tone={tone} variant={variant} dir={dir} />);
      const root = panelFor(screen.getByText('Content'));
      const originalClasses = [...root.classList];
      const originalZones = root.innerHTML;
      expect(root).not.toHaveClass('relative');
      rerender(<Example tone={tone} variant={variant} dir={dir} accentEdge='start' />);
      expect(panelFor(screen.getByText('Content'))).toBe(root);
      expect(root).toHaveAttribute('dir', dir);
      expect(root).toHaveAttribute('data-tone', tone);
      expect(root).toHaveAttribute('data-variant', variant);
      expect(root).not.toHaveAttribute('accentedge');
      expect(root).not.toHaveAttribute('style');
      expect(root.innerHTML).toBe(originalZones);
      for (const name of originalClasses) {
        expect(root).toHaveClass(name);
      }
      expect(root).toHaveClass(...accentBase, ...(tone === 'inherit' ? inheritedAccent : framedAccent));
      for (const name of tone === 'inherit' ? framedAccent : inheritedAccent) {
        expect(root).not.toHaveClass(name);
      }
      expect(root.classList.contains('eg-surface')).toBe(tone !== 'inherit');
      expect(root).toHaveClass('overflow-visible');
      expect(root.children).toHaveLength(3);
      for (const part of root.children) {
        expect(part).toHaveClass('p-4');
        expect(part).not.toHaveClass('overflow-hidden');
      }
    }
  );

  it.each([
    { header: false, footer: false },
    { header: true, footer: false },
    { header: false, footer: true }
  ])('retains optional-zone geometry with an edge (header=$header, footer=$footer)', ({ header, footer }) => {
    render(
      <Panel variant='banded' accentEdge='start'>
        {header && <PanelHeader>Header</PanelHeader>}
        <PanelBody>Content</PanelBody>
        {footer && <PanelFooter>Footer</PanelFooter>}
      </Panel>
    );
    const root = panelFor(screen.getByText('Content'));
    expect(root).toHaveClass(...accentBase, ...framedAccent);
    expect(root.children).toHaveLength(1 + Number(header) + Number(footer));
    expect(root.firstElementChild).toHaveClass(framedTop);
    expect(root.lastElementChild).toHaveClass(framedBottom);
    expect(root.querySelector('.eg-panel__header') !== null).toBe(header);
    expect(root.querySelector('.eg-panel__footer') !== null).toBe(footer);
  });

  it('keeps nested Panel edge selections independent when each opt-in changes', () => {
    const example = (outer: boolean, inner: boolean) => (
      <Panel accentEdge={outer ? 'start' : undefined}>
        <PanelHeader>Outer</PanelHeader>
        <PanelBody>
          <Surface tone='surface-2'>
            <Panel tone='inherit' accentEdge={inner ? 'start' : undefined}>
              <PanelBody>Inner</PanelBody>
            </Panel>
          </Surface>
        </PanelBody>
      </Panel>
    );
    const { rerender } = render(example(true, false));
    const outer = panelFor(screen.getByText('Outer'));
    const inner = panelFor(screen.getByText('Inner'));
    expect(outer).toHaveClass(...accentBase, ...framedAccent);
    expect(inner).not.toHaveClass('relative');
    expect(inner).not.toHaveClass('before:absolute');
    rerender(example(false, true));
    expect(panelFor(screen.getByText('Outer'))).toBe(outer);
    expect(panelFor(screen.getByText('Inner'))).toBe(inner);
    expect(outer).not.toHaveClass('relative');
    expect(outer).not.toHaveClass('before:absolute');
    expect(inner).toHaveClass(...accentBase, ...inheritedAccent);
  });

  it('retains complete independent runtime-accent host maps and child state across updates and reset', async () => {
    const user = userEvent.setup();
    const themed = (outer: string | null) => (
      <>
        <div aria-label='Outer theme' style={createAccentTheme(outer).variables as CSSProperties}>
          <Panel accentEdge='start' variant='banded'>
            <PanelHeader>Outer panel</PanelHeader>
            <PanelBody>
              <input aria-label='Draft' />
              <div aria-label='Nested theme' style={createAccentTheme(null).variables as CSSProperties}>
                <Panel accentEdge='start'>
                  <PanelBody>Nested panel</PanelBody>
                </Panel>
              </div>
            </PanelBody>
          </Panel>
        </div>
        <div aria-label='Sibling theme' style={createAccentTheme('#00ff00').variables as CSSProperties}>
          <Panel accentEdge='start'>
            <PanelBody>Sibling panel</PanelBody>
          </Panel>
        </div>
      </>
    );
    const expectMap = (host: HTMLElement, input: string | null) => {
      const variables = createAccentTheme(input).variables;
      expect(host.style.length).toBe(Object.keys(variables).length);
      for (const [name, value] of Object.entries(variables)) {
        expect(host.style.getPropertyValue(name), name).toBe(value);
      }
    };
    const { rerender } = render(themed('#123456'));
    const outerHost = screen.getByLabelText('Outer theme');
    const nestedHost = screen.getByLabelText('Nested theme');
    const siblingHost = screen.getByLabelText('Sibling theme');
    const draft = screen.getByRole('textbox', { name: 'Draft' });
    const outer = panelFor(screen.getByText('Outer panel'));
    const nested = panelFor(screen.getByText('Nested panel'));
    const sibling = panelFor(screen.getByText('Sibling panel'));
    await user.type(draft, 'Keep this');
    for (const root of [outer, nested, sibling]) {
      expect(root).toHaveClass('before:bg-fg-brand-default');
      expect(root).not.toHaveAttribute('style');
    }
    expectMap(outerHost, '#123456');
    expectMap(nestedHost, null);
    expectMap(siblingHost, '#00ff00');
    for (const input of ['#777777', null]) {
      rerender(themed(input));
      expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
      expect(draft).toHaveValue('Keep this');
      expect(panelFor(screen.getByText('Outer panel'))).toBe(outer);
      expect(panelFor(screen.getByText('Nested panel'))).toBe(nested);
      expect(panelFor(screen.getByText('Sibling panel'))).toBe(sibling);
      expectMap(outerHost, input);
      expectMap(nestedHost, null);
      expectMap(siblingHost, '#00ff00');
    }
  });

  it('keeps a consumer-labelled section and child keyboard and pointer behavior unchanged', async () => {
    const user = userEvent.setup();
    const activate = vi.fn();
    render(
      <section aria-labelledby='workspace-heading'>
        <Panel variant='banded' accentEdge='start'>
          <PanelHeader>
            <h2 id='workspace-heading'>Workspace</h2>
            <button type='button'>Header action</button>
          </PanelHeader>
          <PanelBody>
            <button type='button' onClick={activate}>
              Body action
            </button>
          </PanelBody>
          <PanelFooter>
            <button type='button'>Footer action</button>
          </PanelFooter>
        </Panel>
      </section>
    );
    const region = screen.getByRole('region', { name: 'Workspace' });
    const heading = screen.getByRole('heading', { level: 2, name: 'Workspace' });
    const root = panelFor(heading);
    expect(region).toHaveAttribute('aria-labelledby', heading.id);
    expect(region).toContainElement(root);
    expect(root).toHaveClass(...accentBase);
    expect(root.children).toHaveLength(3);
    expect(root.querySelectorAll('button')).toHaveLength(3);
    for (const attribute of ['role', 'tabindex', 'aria-live', 'aria-label', 'style', 'accentedge']) {
      expect(root).not.toHaveAttribute(attribute);
    }
    for (const name of ['Header action', 'Body action', 'Footer action']) {
      await user.tab();
      expect(screen.getByRole('button', { name })).toHaveFocus();
    }
    await user.click(screen.getByRole('button', { name: 'Body action' }));
    await user.keyboard('{Enter}');
    expect(activate).toHaveBeenCalledTimes(2);
  });

  it('retains supported root and part layout merges with the decoration', () => {
    render(
      <Panel variant='banded' accentEdge='start' className='w-full col-span-full m-2 m-4'>
        <PanelHeader className='items-start'>Header</PanelHeader>
        <PanelBody className='grid grid-cols-2'>Body</PanelBody>
        <PanelFooter className='items-start'>Footer</PanelFooter>
      </Panel>
    );
    const root = panelFor(screen.getByText('Body'));
    expect(root).toHaveClass('eg-panel', 'eg-surface', 'w-full', 'col-span-full', 'm-4', 'bg-surface-1');
    expect(root).toHaveClass(...accentBase, ...framedAccent);
    expect(root).not.toHaveClass('m-2');
    for (const label of ['Header', 'Footer']) {
      expect(screen.getByText(label)).toHaveClass('items-start', 'p-4');
      expect(screen.getByText(label)).not.toHaveClass('items-center');
    }
    expect(screen.getByText('Body')).toHaveClass('eg-panel__body', 'grid', 'grid-cols-2', 'p-4');
    expect(screen.getByText('Body')).not.toHaveClass('flex');
  });
});

describe('Panel compound contract', () => {
  it.each(tones)('composes two consumer-labelled compact regions in a %s band without changing Panel parts', (tone) => {
    function LabelledRegion({ name }: { name: string }) {
      const id = useId();
      return (
        <section aria-labelledby={id}>
          <Heading id={id} variant='compact'>
            {name}
          </Heading>
        </section>
      );
    }
    render(
      <Panel tone={tone} variant='banded'>
        <PanelHeader>
          <LabelledRegion name='Settings' />
          <LabelledRegion name='Reports' />
        </PanelHeader>
        <PanelBody>Content</PanelBody>
        <PanelFooter>Footer</PanelFooter>
      </Panel>
    );
    const first = screen.getByRole('region', { name: 'Settings' });
    const second = screen.getByRole('region', { name: 'Reports' });
    const firstHeading = screen.getByRole('heading', { level: 2, name: 'Settings' });
    const secondHeading = screen.getByRole('heading', { level: 2, name: 'Reports' });
    expect(first.getAttribute('aria-labelledby')).toBe(firstHeading.id);
    expect(second.getAttribute('aria-labelledby')).toBe(secondHeading.id);
    expect(firstHeading.id).not.toBe(secondHeading.id);
    expect(firstHeading).toHaveClass('eg-heading', 'text-heading-small');
    const root = panelFor(firstHeading);
    expect(root).toHaveClass('eg-panel');
    expect(first.parentElement).toHaveClass('eg-panel__header', 'eg-surface');
    expect(screen.getByText('Content')).toHaveClass('eg-panel__body');
    expect(screen.getByText('Footer')).toHaveClass('eg-panel__footer');
    expect(root).toHaveAttribute('data-tone', tone);
    expect(root).toHaveAttribute('data-variant', 'banded');
  });
  it('rejects an orphan Body with the exact context diagnostic', () => {
    expect(() => render(<PanelBody>Orphan body</PanelBody>)).toThrowError('Panel parts must be rendered inside Panel.');
  });

  it.each([
    { name: 'Header', component: PanelHeader },
    { name: 'Footer', component: PanelFooter }
  ])('rejects an orphan $name with the same diagnostic', ({ component: Part }) => {
    expect(() => render(<Part>Orphan</Part>)).toThrowError('Panel parts must be rendered inside Panel.');
  });

  it('renders passive defaults on one real Surface with direct fragment siblings', () => {
    render(<Example />);
    const root = panelFor(screen.getByText('Content'));
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-surface', 'bg-surface-1', 'p-0', 'rounded-xl', 'overflow-visible');
    expect(root).toHaveClass('shadow-[var(--shadow-edge),var(--shadow-elev-1)]');
    expect(root).toHaveAttribute('data-tone', 'surface-1');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect([...root.children].map((child) => child.classList.contains('eg-surface'))).toEqual([false, false, false]);
    expect([...root.children].map((child) => child.textContent)).toEqual(['Workspace', 'Content', 'Updated today']);
    expect([...root.children].every((child) => child.tagName === 'DIV')).toBe(true);
    expect(root.querySelectorAll('.eg-panel__header, .eg-panel__body, .eg-panel__footer')).toHaveLength(3);
    expect(root.querySelector('[role], [tabindex], [aria-live], [id]')).toBeNull();
    for (const attr of ['role', 'tabindex', 'aria-live', 'data-state', 'style', 'id']) {
      expect(root).not.toHaveAttribute(attr);
    }
  });

  it.each(matrix)('owns the exact $tone / $variant composition without a Body surface', ({ tone, variant }) => {
    render(
      <Surface tone='surface-2'>
        <Example tone={tone} variant={variant} />
      </Surface>
    );
    const root = panelFor(screen.getByText('Content'));
    const head = screen.getByRole('heading', { name: 'Workspace' }).parentElement;
    const body = screen.getByText('Content').parentElement;
    const foot = screen.getByText('Updated today').parentElement;
    expect(root).toHaveAttribute('data-tone', tone);
    expect(root).toHaveAttribute('data-variant', variant);
    expect(body).toHaveClass('eg-panel__body', 'p-4', 'gap-4');
    expect(body).not.toHaveClass('eg-surface');
    expect(body?.className).not.toMatch(/(?:^|\s)(?:bg-|shadow-|backdrop-)/);
    if (tone === 'inherit') {
      expect(root).not.toHaveClass('eg-surface');
      expect(root).toHaveClass('border-0', 'bg-transparent', 'bg-none', 'shadow-none', 'backdrop-filter-none');
    } else {
      expect(root).toHaveClass('eg-surface', 'rounded-xl', 'p-0');
      expect(root).not.toHaveClass('bg-transparent', 'shadow-none');
    }
    if (tone === 'overlay') {
      expect(root).toHaveClass(
        'bg-surface-overlay',
        'backdrop-blur-overlay',
        'backdrop-saturate-150',
        'border-border-hairline-strong',
        'shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
        '[@media(prefers-reduced-transparency:reduce)]:bg-surface-2',
        '[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none',
        'not-supports-[backdrop-filter]:bg-surface-2'
      );
      expect(root).not.toHaveClass('bg-[image:var(--gradient-sheen)]');
    }
    if (variant === 'banded') {
      expect(head).toHaveClass('eg-surface', tone === 'surface-1' ? 'bg-surface-2' : 'bg-surface-3');
      expect(head).toHaveClass('border-x-0', 'border-t-0', 'border-b', 'border-border-hairline', 'shadow-edge');
      expect(head).toHaveClass('bg-[image:var(--gradient-sheen)]', 'p-4');
      expect(foot).toHaveClass('eg-surface', tone === 'surface-1' ? 'bg-surface-0' : 'bg-surface-1');
      expect(foot).toHaveClass(
        'border-x-0',
        'border-b-0',
        'border-t',
        'border-border-hairline',
        'bg-none',
        'shadow-none',
        'p-4'
      );
      expect(foot).not.toHaveClass('shadow-edge', 'bg-[image:var(--gradient-sheen)]');
    } else {
      expect(head).not.toHaveClass('eg-surface', 'border-b');
      expect(foot).not.toHaveClass('eg-surface', 'border-t');
    }
    for (const zone of [head, body, foot]) {
      expect(zone).toHaveClass(tone === 'inherit' ? 'first:rounded-t-xl' : framedTop);
      expect(zone).toHaveClass(tone === 'inherit' ? 'last:rounded-b-xl' : framedBottom);
      expect(zone).not.toHaveClass('overflow-hidden');
    }
  });

  it('omits optional parts without empty wrappers or orphan bands and retains intentional empty parts', () => {
    const { rerender } = render(
      <Panel variant='banded'>
        <PanelHeader>Header</PanelHeader>
        <PanelBody>Content</PanelBody>
        <PanelFooter>Footer</PanelFooter>
      </Panel>
    );
    const root = panelFor(screen.getByText('Content'));
    rerender(
      <Panel variant='banded'>
        <PanelBody>Content</PanelBody>
      </Panel>
    );
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).toHaveClass('eg-panel__body', framedTop, framedBottom);
    expect(root.firstElementChild).not.toHaveClass('border-t', 'border-b', 'eg-surface');
    rerender(
      <Panel variant='banded'>
        <PanelBody>Content</PanelBody>
        <PanelFooter>Metadata</PanelFooter>
      </Panel>
    );
    expect(root.children).toHaveLength(2);
    expect(root.querySelector('.eg-panel__header')).toBeNull();
    expect(root.lastElementChild).toHaveClass('eg-panel__footer', 'border-t');
    rerender(
      <Panel variant='banded'>
        <PanelHeader>{null}</PanelHeader>
        <PanelBody>Content</PanelBody>
      </Panel>
    );
    expect(root.children).toHaveLength(2);
    expect(root.firstElementChild).toHaveClass('eg-panel__header', 'p-4', 'border-b');
    expect(root.firstElementChild).toBeEmptyDOMElement();
    expect(root.querySelector('.eg-panel__footer')).toBeNull();
  });

  it('keeps nested presentation local, updates variants in place, and never infers a host', () => {
    const nested = (innerTone: 'surface-1' | 'inherit', innerVariant: 'default' | 'banded') => (
      <Panel tone='overlay' variant='banded'>
        <PanelHeader>Outer header</PanelHeader>
        <PanelBody>
          <Surface tone='surface-2'>
            <Panel tone={innerTone} variant={innerVariant}>
              <PanelHeader>Inner header</PanelHeader>
              <PanelBody>Inner body</PanelBody>
              <PanelFooter>Inner footer</PanelFooter>
            </Panel>
          </Surface>
        </PanelBody>
      </Panel>
    );
    const { rerender } = render(nested('surface-1', 'default'));
    const innerBody = screen.getByText('Inner body');
    const outerHead = screen.getByText('Outer header');
    expect(outerHead).toHaveClass('bg-surface-3');
    expect(panelFor(innerBody)).toHaveAttribute('data-tone', 'surface-1');
    expect(screen.getByText('Inner header')).not.toHaveClass('eg-surface');
    rerender(nested('surface-1', 'banded'));
    expect(screen.getByText('Inner body')).toBe(innerBody);
    expect(screen.getByText('Inner header')).toHaveClass('bg-surface-2');
    // Switching frame ownership selects a different actual root component; cross-mode DOM identity is not promised.
    rerender(nested('inherit', 'banded'));
    expect(panelFor(screen.getByText('Inner body'))).not.toHaveClass('eg-surface');
    expect(screen.getByText('Inner header')).toHaveClass('bg-surface-3');
    expect(screen.getByText('Inner footer')).toHaveClass('bg-surface-1');
    expect(outerHead).toHaveClass('bg-surface-3');
  });

  it('normalizes untyped enum inputs and protects owned data attributes in the hook', () => {
    // Intentional JavaScript-boundary inputs; these are not accepted public TypeScript values.
    const props = {
      children: 'Content',
      tone: null,
      variant: 12,
      'data-tone': 'overlay',
      'data-variant': 'banded'
    } as unknown as PanelProps;
    const { result } = renderHook(() => usePanel(props));
    expect(result.current.presentation).toEqual({ tone: 'surface-1', variant: 'default' });
    expect(result.current.rootProps).toMatchObject({ 'data-tone': 'surface-1', 'data-variant': 'default' });
    expect(result.current.frameProps).toEqual({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' });
    const overlay = renderHook(() => usePanel({ children: null, tone: 'overlay', variant: 'banded' }));
    expect(overlay.result.current.frameProps).toEqual({ tone: 'overlay', padding: 'none', radius: 'xl' });
    expect(overlay.result.current.frameProps).not.toHaveProperty('elevation');
    const inherited = renderHook(() => usePanel({ children: null, tone: 'inherit' }));
    expect(inherited.result.current.unpainted).toBe(true);
    expect(inherited.result.current.frameProps).toBeUndefined();
  });

  it('resolves part classes and children from the nearest typed hook context', () => {
    const { result } = renderHook(() => usePanelPart('header', { children: 'Hook header', className: 'items-start' }), {
      wrapper: ({ children }) => (
        <Surface tone='surface-2'>
          <Panel tone='inherit' variant='banded'>
            {children}
          </Panel>
        </Surface>
      )
    });
    expect(result.current.children).toBe('Hook header');
    expect(result.current.className).toContain('bg-surface-3');
    expect(result.current.className).toContain('items-start');
    expect(result.current.className?.split(' ')).not.toContain('items-center');
  });

  it('routes compatible native attributes and observation handlers to each actual div', async () => {
    const user = userEvent.setup();
    const observe = vi.fn();
    render(
      <Panel
        id='consumer-panel'
        dir='rtl'
        lang='en'
        title='Summary'
        aria-describedby='help'
        data-owner='root'
        onClick={observe}
      >
        <PanelHeader id='consumer-head' data-owner='head'>
          Header
        </PanelHeader>
        <PanelBody id='consumer-body' aria-describedby='body-help' data-owner='body'>
          <button type='button'>Run</button>
        </PanelBody>
        <PanelFooter id='consumer-foot' data-owner='foot'>
          Footer
        </PanelFooter>
      </Panel>
    );
    const root = panelFor(screen.getByRole('button', { name: 'Run' }));
    expect(root).toHaveAttribute('id', 'consumer-panel');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveAttribute('title', 'Summary');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    expect([...root.children].map((part) => part.getAttribute('data-owner'))).toEqual(['head', 'body', 'foot']);
    expect(root.children[1]).toHaveAttribute('aria-describedby', 'body-help');
    expect([...root.children].map((part) => part.id)).toEqual(['consumer-head', 'consumer-body', 'consumer-foot']);
    await user.click(screen.getByRole('button', { name: 'Run' }));
    expect(observe).toHaveBeenCalledOnce();
  });

  it('strips protected attributes/style/refs at untyped root and part boundaries', () => {
    const ref = createRef<HTMLDivElement>();
    const unsafe = {
      role: 'dialog',
      tabIndex: 0,
      style: { background: 'red' },
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: '<button>Injected</button>' },
      ref,
      asChild: true,
      'aria-label': 'Injected',
      'aria-labelledby': 'injected',
      'aria-live': 'assertive',
      'aria-modal': true,
      'aria-disabled': true,
      'aria-selected': true,
      'aria-pressed': true
    };
    // Exercise protected inputs from untyped JavaScript without widening the actual API.
    const rootInput = { ...unsafe, 'data-tone': 'overlay', 'data-variant': 'banded' } as unknown as PanelProps;
    const partInput = unsafe as unknown as PanelBodyProps;
    render(
      <Panel {...rootInput}>
        <PanelHeader {...partInput}>Safe header</PanelHeader>
        <PanelBody {...partInput}>Safe body</PanelBody>
        <PanelFooter {...partInput}>Safe footer</PanelFooter>
      </Panel>
    );
    const root = panelFor(screen.getByText('Safe body'));
    expect(root).toHaveClass('eg-surface');
    expect(root).toHaveAttribute('data-tone', 'surface-1');
    expect(root).toHaveAttribute('data-variant', 'default');
    for (const node of [root, ...root.children]) {
      for (const attr of [
        'role',
        'tabindex',
        'style',
        'contenteditable',
        'aria-label',
        'aria-labelledby',
        'aria-live',
        'aria-modal',
        'aria-disabled',
        'aria-selected',
        'aria-pressed',
        'aschild'
      ]) {
        expect(node).not.toHaveAttribute(attr);
      }
    }
    expect(screen.queryByText('Injected')).not.toBeInTheDocument();
    expect(ref.current).toBeNull();
  });

  it('preserves supported per-part layout merges and required Material/markers', () => {
    render(
      <Panel variant='banded' className='w-full col-span-full m-2 m-4'>
        <PanelHeader className='items-start'>Header</PanelHeader>
        <PanelBody className='grid grid-cols-2'>Body</PanelBody>
        <PanelFooter className='items-start'>Footer</PanelFooter>
      </Panel>
    );
    const root = panelFor(screen.getByText('Body'));
    expect(root).toHaveClass('eg-panel', 'eg-surface', 'w-full', 'col-span-full', 'm-4', 'bg-surface-1');
    expect(root).not.toHaveClass('m-2');
    for (const label of ['Header', 'Footer']) {
      expect(screen.getByText(label)).toHaveClass('items-start', 'p-4');
      expect(screen.getByText(label)).not.toHaveClass('items-center');
    }
    expect(screen.getByText('Body')).toHaveClass('eg-panel__body', 'grid', 'grid-cols-2', 'p-4');
    expect(screen.getByText('Body')).not.toHaveClass('flex');
  });

  it('leaves tab order, native activation and disabled child behavior to supplied controls', async () => {
    const user = userEvent.setup();
    const activate = vi.fn();
    render(
      <Panel>
        <PanelHeader>
          <button type='button'>Header action</button>
        </PanelHeader>
        <PanelBody>
          <button type='button' onClick={activate}>
            Body action
          </button>
          <button type='button' disabled={true}>
            Unavailable
          </button>
        </PanelBody>
        <PanelFooter>
          <button type='button'>Footer action</button>
        </PanelFooter>
      </Panel>
    );
    for (const label of ['Header action', 'Body action', 'Footer action']) {
      await user.tab();
      expect(screen.getByRole('button', { name: label })).toHaveFocus();
    }
    await user.click(screen.getByRole('button', { name: 'Body action' }));
    await user.keyboard('{Enter}');
    expect(activate).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    const root = panelFor(screen.getByRole('button', { name: 'Body action' }));
    await user.hover(root);
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('data-state');
    expect(root).not.toHaveAttribute('aria-disabled');
  });

  it('inherits inside real Popover Content without changing its frame, name, padding or dismissal', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open summary</PopoverTrigger>
        <PopoverContent label='Workspace summary'>
          <Panel tone='inherit' variant='banded'>
            <PanelHeader>Context</PanelHeader>
            <PanelBody>
              <button type='button'>Keep open</button>
            </PanelBody>
            <PanelFooter>
              <PopoverClose>Close summary</PopoverClose>
            </PanelFooter>
          </Panel>
        </PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Open summary' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Workspace summary' });
    expect(dialog).toHaveClass('eg-popover', 'eg-surface', 'bg-surface-overlay', 'p-6');
    const root = panelFor(screen.getByRole('button', { name: 'Keep open' }));
    expect(root.parentElement).toBe(dialog);
    expect(root).not.toHaveClass('eg-surface');
    expect(root).not.toHaveAttribute('role');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Keep open' }));
    expect(dialog).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('keeps every referenced geometry token in the existing token source and exports only four components', () => {
    const source = readFileSync(resolve(import.meta.dirname, 'types.ts'), 'utf8');
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../tokens/src/theme.css'), 'utf8');
    for (const [, token] of source.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      expect(theme).toContain(`${token}:`);
    }
    expect(Object.keys(publicAPI).sort()).toEqual(['Panel', 'PanelBody', 'PanelFooter', 'PanelHeader']);
  });

  it('checks strict positive and negative native/public types in a scoped in-memory consumer', () => {
    const file = resolve(import.meta.dirname, 'panel-contract-fixture.tsx');
    const propsTypes = ['PanelProps', 'PanelHeaderProps', 'PanelBodyProps', 'PanelFooterProps'];
    const omitted = [
      'style',
      'dangerouslySetInnerHTML',
      'contentEditable',
      'role',
      'tabIndex',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-modal',
      'aria-disabled',
      'aria-selected',
      'aria-pressed',
      'ref',
      'asChild'
    ];
    const negatives = propsTypes.flatMap((type, index) => [
      `// @ts-expect-error ${type} requires children.\nconst missing${index}: ${type} = {};`,
      ...omitted.map(
        (key, keyIndex) =>
          `// @ts-expect-error ${type} excludes ${key}.\nconst rejected${index}_${keyIndex}: ${type} = { children: null, '${key}': undefined };`
      )
    ]);
    const fixture = `
      import { Panel, PanelHeader, PanelBody, PanelFooter } from './index';
      import type { PanelProps, PanelHeaderProps, PanelBodyProps, PanelFooterProps, PanelTone, PanelVariant } from './index';
      const tones: PanelTone[] = ['surface-1', 'overlay', 'inherit'];
      const variants: PanelVariant[] = ['default', 'banded'];
      const root: PanelProps = { children: null, dir: 'rtl', id: 'consumer', title: 'Summary', 'aria-describedby': 'help', onClick(event) { const div: HTMLDivElement = event.currentTarget; void div; } };
      const edged: PanelProps = { children: null, accentEdge: 'start', tone: 'overlay', variant: 'banded' };
      const omittedEdge: PanelProps = { children: null, accentEdge: undefined };
      // @ts-expect-error The only supported edge is logical start.
      const edgeEnd: PanelProps = { children: null, accentEdge: 'end' };
      // @ts-expect-error A physical edge is not supported.
      const edgeLeft: PanelProps = { children: null, accentEdge: 'left' };
      // @ts-expect-error Null is an untyped-boundary fallback, not a public value.
      const edgeNull: PanelProps = { children: null, accentEdge: null };
      // @ts-expect-error Boolean edge controls are not supported.
      const edgeFalse: PanelProps = { children: null, accentEdge: false };
      // @ts-expect-error Edge is a Panel-only presentation choice.
      const partEdge: PanelHeaderProps = { children: null, accentEdge: 'start' };
      const header: PanelHeaderProps = { children: 'Header', className: 'items-start' };
      const body: PanelBodyProps = { children: null };
      const footer: PanelFooterProps = { children: 'Metadata' };
      const valid = <Panel {...root}><><PanelHeader {...header} /><PanelBody {...body} /><PanelFooter {...footer} /></></Panel>;
      // @ts-expect-error Panel exposes no size preset.
      const size: PanelProps = { children: null, size: 'sm' };
      // @ts-expect-error Panel does not own visibility.
      const open: PanelProps = { children: null, open: true };
      // @ts-expect-error Panel exposes no Surface elevation.
      const elevation: PanelProps = { children: null, elevation: 1 };
      // @ts-expect-error Parts cannot choose their own tone.
      const partTone: PanelHeaderProps = { children: null, tone: 'overlay' };
      // @ts-expect-error Parts cannot choose their own variant.
      const partVariant: PanelFooterProps = { children: null, variant: 'banded' };
      // @ts-expect-error No legacy or arbitrary tone value.
      const unknownTone: PanelTone = 'glass';
      // @ts-expect-error No arbitrary variant value.
      const unknownVariant: PanelVariant = 'quiet';
      ${negatives.join('\n')}
      void [tones, variants, valid, edged, omittedEdge];
    `;
    const options: ts.CompilerOptions = {
      strict: true,
      noUncheckedIndexedAccess: true,
      noEmit: true,
      skipLibCheck: false,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      types: ['react', 'node'],
      paths: { '@/*': [resolve(import.meta.dirname, '../../*')] }
    };
    const host = ts.createCompilerHost(options);
    const originalGetSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (path, languageVersion, onError, shouldCreateNewSourceFile) =>
      path === file
        ? ts.createSourceFile(path, fixture, languageVersion, true, ts.ScriptKind.TSX)
        : originalGetSourceFile(path, languageVersion, onError, shouldCreateNewSourceFile);
    const program = ts.createProgram([file], options, host);
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    expect(diagnostics).toEqual([]);
  }, 15000);
});
