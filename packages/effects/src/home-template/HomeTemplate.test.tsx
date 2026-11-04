import { fireEvent, render } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { HomeTemplate } from './HomeTemplate';
import { HomeTemplateAnchor } from './HomeTemplateAnchor';
import type { HomeTemplateZone } from './types';

const table: HomeTemplateZone[] = [{ id: 'hero', isotipo: true, scene: 'hero' }, { id: 'read' }];
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it('renders the inert layers in order with their own static recipes and visible fallback', () => {
  const change = vi.fn();
  const { container } = render(
    <HomeTemplate zoneTable={table} onZoneChange={change}>
      <HomeTemplateAnchor zone='hero'>Fallback</HomeTemplateAnchor>
    </HomeTemplate>
  );
  const root = container.firstElementChild as HTMLElement;
  expect(root).toHaveClass('eg-home-template', 'relative', 'isolate', 'block', 'w-full');
  const [ambient, vignette, isotipo, content] = Array.from(root.children) as [
    HTMLElement,
    HTMLElement,
    HTMLElement,
    HTMLElement
  ];
  expect(root.children).toHaveLength(4);
  expect([ambient.tagName, vignette.tagName, isotipo.tagName, content.tagName]).toEqual([
    'CANVAS',
    'DIV',
    'CANVAS',
    'DIV'
  ]);
  for (const layer of [ambient, vignette, isotipo]) {
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer).toHaveClass('fixed', 'inset-0', 'pointer-events-none');
  }
  expect(ambient).toHaveClass(
    'z-0',
    'block',
    'w-full',
    'h-full',
    'bg-transparent',
    'opacity-[var(--eg-home-ambient-opacity)]'
  );
  expect(isotipo).toHaveClass(
    'z-[1]',
    'block',
    'w-full',
    'h-full',
    'bg-transparent',
    'opacity-[var(--eg-home-isotipo-opacity)]'
  );
  expect(vignette).toHaveClass('z-0', 'bg-[image:var(--gradient-vignette)]');
  expect(ambient.style.getPropertyValue('--eg-home-ambient-opacity')).toBe('0');
  expect(isotipo.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
  expect(content).toHaveClass('relative', 'z-[2]', 'block', 'overflow-x-clip');
  const anchor = content.firstElementChild as HTMLElement;
  expect(anchor).toHaveClass('eg-home-template-anchor', 'relative', 'block');
  expect(anchor.firstElementChild).toHaveClass('block', 'data-[state=painted]:opacity-0');
  expect(anchor.firstElementChild).not.toHaveAttribute('data-state');
  expect(anchor).toHaveTextContent('Fallback');
  expect(root).not.toHaveAttribute('data-state');
  expect(change).not.toHaveBeenCalled();
});

it('forwards safe native attributes and protects owned attributes and merge invariants', () => {
  const ref = createRef<HTMLDivElement>();
  const click = vi.fn();
  const unsafe = {
    role: 'button',
    style: { color: 'red' },
    dangerouslySetInnerHTML: { __html: 'unsafe' },
    ref,
    asChild: true,
    'data-state': 'fake',
    'data-motion': 'fake'
  };
  const { container, getByText } = render(
    <HomeTemplate
      {...unsafe}
      zoneTable={table}
      className='m-4 self-center absolute inline w-4'
      id='root'
      aria-label='Page'
      onClick={click}
    >
      <HomeTemplateAnchor {...unsafe} zone='hero' className='w-24 h-24 absolute inline' id='anchor'>
        Safe
      </HomeTemplateAnchor>
    </HomeTemplate>
  );
  const root = container.firstElementChild as HTMLElement;
  const anchor = getByText('Safe').parentElement as HTMLElement;
  expect(root).toHaveAttribute('id', 'root');
  expect(root).toHaveAttribute('aria-label', 'Page');
  for (const element of [root, anchor]) {
    expect(element).not.toHaveAttribute('role');
    expect(element).not.toHaveAttribute('style');
    expect(element).not.toHaveAttribute('asChild');
    expect(element).not.toHaveAttribute('zone');
    expect(element).not.toHaveAttribute('zoneTable');
    expect(element).not.toHaveAttribute('onZoneChange');
  }
  expect(root).not.toHaveAttribute('data-state');
  expect(root).not.toHaveAttribute('data-motion');
  expect(ref.current).toBeNull();
  expect(root).toHaveClass('m-4', 'self-center', 'relative', 'block', 'w-full');
  expect(root).not.toHaveClass('absolute', 'inline', 'w-4');
  expect(anchor).toHaveClass('w-24', 'h-24', 'relative', 'block');
  expect(anchor).not.toHaveClass('absolute', 'inline');
  fireEvent.click(root);
  expect(click).toHaveBeenCalledTimes(1);
});

it('warns for duplicate and non-3D bindings and re-resolves on removal without rerender churn', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const view = render(
    <HomeTemplate zoneTable={table}>
      <HomeTemplateAnchor zone='hero'>First</HomeTemplateAnchor>
      <HomeTemplateAnchor zone='hero'>Second</HomeTemplateAnchor>
      <HomeTemplateAnchor zone='read'>Ignored</HomeTemplateAnchor>
    </HomeTemplate>
  );
  expect(warn.mock.calls.flat().join(' ')).toMatch(/duplicate/i);
  expect(warn.mock.calls.flat().join(' ')).toMatch(/non-3d/i);
  warn.mockClear();
  view.rerender(
    <HomeTemplate zoneTable={table}>
      <HomeTemplateAnchor zone='hero'>First</HomeTemplateAnchor>
      <HomeTemplateAnchor zone='hero'>Second</HomeTemplateAnchor>
      <HomeTemplateAnchor zone='read'>Ignored</HomeTemplateAnchor>
    </HomeTemplate>
  );
  expect(warn).not.toHaveBeenCalled();
  view.rerender(
    <HomeTemplate zoneTable={table}>
      <HomeTemplateAnchor zone='hero' key='second'>
        Second
      </HomeTemplateAnchor>
    </HomeTemplate>
  );
  expect(view.getByText('Second')).toBeInTheDocument();
});

it('re-evaluates anchor warnings when the zone table changes without remounting anchors', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const page = (zoneTable: HomeTemplateZone[]) => (
    <HomeTemplate zoneTable={zoneTable}>
      <HomeTemplateAnchor zone='hero'>First</HomeTemplateAnchor>
      <HomeTemplateAnchor zone='hero'>Second</HomeTemplateAnchor>
    </HomeTemplate>
  );
  const view = render(page(table));
  const first = view.getByText('First');
  expect(warn).toHaveBeenCalledWith('HomeTemplate: duplicate anchor: hero');
  warn.mockClear();
  view.rerender(page([{ id: 'hero' }]));
  expect(view.getByText('First')).toBe(first);
  expect(warn).toHaveBeenCalledWith('HomeTemplate: non-3D anchor: hero');
  expect(warn).toHaveBeenCalledTimes(1);
  warn.mockClear();
  view.rerender(page([{ id: 'hero' }]));
  expect(warn).not.toHaveBeenCalled();
  view.rerender(page(table));
  expect(view.getByText('First')).toBe(first);
  expect(warn).toHaveBeenCalledWith('HomeTemplate: duplicate anchor: hero');
  expect(warn).toHaveBeenCalledTimes(1);
});

it('is silent in production for invalid configuration and duplicate bindings', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  render(
    <HomeTemplate zoneTable={[...table, { id: 'hero', isotipo: true, scene: 'hero' }]}>
      <HomeTemplateAnchor zone='hero' />
      <HomeTemplateAnchor zone='hero' />
      <HomeTemplateAnchor zone='read' />
    </HomeTemplate>
  );
  expect(warn).not.toHaveBeenCalled();
});

it('keeps registration stable under StrictMode and avoids global writes', () => {
  const beforeKeys = Object.keys(window).sort();
  const html = document.documentElement.outerHTML.split('<head')[0];
  const body = Array.from(document.body.attributes, (a) => [a.name, a.value]);
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const view = render(
    <StrictMode>
      <HomeTemplate zoneTable={table}>
        <HomeTemplateAnchor zone='hero'>Fallback</HomeTemplateAnchor>
      </HomeTemplate>
    </StrictMode>
  );
  fireEvent.scroll(window);
  view.unmount();
  expect(warn).not.toHaveBeenCalled();
  expect(Object.keys(window).sort()).toEqual(beforeKeys);
  expect(document.documentElement.outerHTML.split('<head')[0]).toBe(html);
  expect(Array.from(document.body.attributes, (a) => [a.name, a.value])).toEqual(body);
});

it('renders content and fallback on the server and tolerates invalid rows', () => {
  const invalid = [
    null,
    undefined,
    { id: 'bad', isotipo: true, scene: 'bad' },
    { id: 'bad' }
  ] as unknown as HomeTemplateZone[];
  expect(() =>
    render(
      <HomeTemplate zoneTable={invalid}>
        <HomeTemplateAnchor zone='bad'>Fallback</HomeTemplateAnchor>Content
      </HomeTemplate>
    )
  ).not.toThrow();
  const html = renderToString(
    <HomeTemplate zoneTable={table}>
      <HomeTemplateAnchor zone='hero'>Fallback</HomeTemplateAnchor>Content
    </HomeTemplate>
  );
  expect(html).toContain('Fallback');
  expect(html).toContain('Content');
  expect(html).not.toContain('data-state="painted"');
});
