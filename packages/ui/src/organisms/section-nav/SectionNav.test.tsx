import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { SectionNav } from '.';
import storyMeta, { ManySections } from './SectionNav.stories';
import type { SectionNavProps } from './types';

const items = [
  { id: 'a', label: 'Alpha', href: '#alpha' },
  { id: 'b', label: 'Beta', href: '#beta' },
  { id: 'c', label: 'Gamma', href: '#gamma' }
];
const props = {
  label: 'Sections',
  disclosureLabel: 'Open sections',
  nextLabel: 'Go to Gamma',
  items,
  activeId: 'b',
  value: 50
};

describe('SectionNav story canvas', () => {
  it('uses fullscreen layout and reserves the approved clearance around every story', () => {
    expect(storyMeta.parameters.layout).toBe('fullscreen');
    const decorator = storyMeta.decorators[0];
    if (!decorator) {
      throw new Error('Missing story canvas decorator');
    }
    const { container } = render(decorator(() => <span>Story content</span>));
    expect(container.firstElementChild).toHaveClass('min-h-[calc(var(--space-24)*6)]', 'pb-24');
    expect(screen.getByText('Story content')).toBeInTheDocument();
  });
});

describe('SectionNav', () => {
  it('resets user-agent paint on its own controls and links with token ink (no preflight)', async () => {
    render(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    expect(trigger).toHaveClass(
      'border-0',
      'bg-transparent',
      'p-0',
      'font-sans',
      'text-body-default',
      'text-fg-default',
      'cursor-pointer'
    );
    expect(screen.getByRole('link', { name: props.nextLabel })).toHaveClass('text-fg-default');
    await userEvent.click(trigger);
    const links = within(await screen.findByRole('dialog')).getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveClass('text-fg-default', 'no-underline', 'aria-[current=location]:underline');
    }
  });
  it('renders named navigation and the next native link', () => {
    render(<SectionNav {...props} />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Gamma' })).toHaveAttribute('href', '#gamma');
  });
  it('opens an ordered index with one current location and decorative markers', async () => {
    const user = userEvent.setup();
    render(<SectionNav {...props} />);
    await user.click(screen.getByRole('button', { name: 'Open sections' }));
    const dialog = screen.getByRole('dialog', { name: 'Sections' });
    expect(dialog.querySelectorAll('a')).toHaveLength(3);
    expect(screen.getByRole('link', { name: /Beta/ })).toHaveAttribute('aria-current', 'location');
    expect(dialog.querySelectorAll('.eg-pixel[aria-hidden="true"]')).toHaveLength(3);
  });
  it.each(['empty', 'unmatched', 'closed', 'open'] as const)(
    'has one navigation landmark in the %s state',
    async (state) => {
      const user = userEvent.setup();
      render(
        <SectionNav
          {...props}
          items={state === 'empty' ? [] : items}
          activeId={state === 'unmatched' ? 'missing' : 'b'}
        />
      );
      if (state === 'open' || state === 'unmatched') {
        await user.click(screen.getByRole('button', { name: 'Open sections' }));
        const dialog = screen.getByRole('dialog', { name: 'Sections' });
        expect(dialog.querySelector('ol')?.parentElement).toBe(dialog);
        expect([...dialog.querySelectorAll('ol a')].map((link) => link.getAttribute('href'))).toEqual([
          '#alpha',
          '#beta',
          '#gamma'
        ]);
      }
      expect(screen.getAllByRole('navigation', { name: 'Sections' })).toHaveLength(1);
    }
  );
  it.each([
    ['a', '#beta'],
    ['b', '#gamma'],
    ['c', '#alpha']
  ])('derives next and index state for %s', async (activeId, href) => {
    const user = userEvent.setup();
    render(<SectionNav {...props} activeId={activeId} />);
    expect(screen.getByRole('link', { name: props.nextLabel })).toHaveAttribute('href', href);
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    const dialog = screen.getByRole('dialog');
    const links = within(dialog).getAllByRole('link');
    expect(links.filter((link) => link.getAttribute('aria-current') === 'location')).toHaveLength(1);
    const index = items.findIndex((item) => item.id === activeId);
    expect(links.map((link) => link.querySelector('.eg-pixel')?.getAttribute('data-state'))).toEqual(
      items.map((_, i) => (i < index ? 'past' : i === index ? 'active' : 'idle'))
    );
    expect(dialog.closest('nav')).toBeNull();
  });
  it('handles unmatched and empty destinations without guessing', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SectionNav {...props} activeId='missing' />);
    expect(screen.queryByRole('link', { name: props.nextLabel })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    expect(screen.getAllByRole('link').every((link) => !link.hasAttribute('aria-current'))).toBe(true);
    rerender(<SectionNav {...props} items={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it.each(['{Enter}', ' '])('opens by %s with Radix relationships', async (key) => {
    const user = userEvent.setup();
    render(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    trigger.focus();
    await user.keyboard(key);
    const dialog = screen.getByRole('dialog', { name: props.label });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(document.body).toContainElement(dialog);
    expect(screen.getByRole('navigation')).not.toContainElement(dialog);
  });
  it('reports native click and closes without overriding a focused destination', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <>
        <main id='alpha' tabIndex={-1}>
          Destination
        </main>
        <SectionNav {...props} onNavigate={onNavigate} />
      </>
    );
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    const link = within(screen.getByRole('dialog')).getByRole('link', { name: /Alpha/ });
    fireEvent.click(link);
    screen.getByText('Destination').focus();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate.mock.calls[0]?.[0]).toEqual(items[0]);
    await waitFor(() => expect(screen.getByText('Destination')).toHaveFocus());
  });
  it('updates current destination and value from the host without moving focus', () => {
    const { rerender, container } = render(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    trigger.focus();
    rerender(<SectionNav {...props} activeId='c' value={100} nextLabel='Go to Alpha' />);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveTextContent('Gamma');
    expect(screen.getByRole('link', { name: 'Go to Alpha' })).toHaveAttribute('href', '#alpha');
    expect(container.querySelector('.eg-progress')?.firstElementChild).toHaveStyle({ '--eg-progress-value': '1' });
  });
  it('forwards next activation and its original native anchor event', () => {
    const onNavigate = vi.fn((_item, event) => event.preventDefault());
    render(<SectionNav {...props} onNavigate={onNavigate} />);
    const link = screen.getByRole('link', { name: props.nextLabel });
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate.mock.calls[0]?.[0]).toEqual(items[2]);
    expect(onNavigate.mock.calls[0]?.[1].currentTarget).toBeNull();
    expect(onNavigate.mock.calls[0]?.[1].defaultPrevented).toBe(true);
  });
  it('preserves prevented and modified clicks without forcing native navigation', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_item, event) => event.preventDefault());
    render(<SectionNav {...props} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    const link = within(screen.getByRole('dialog')).getByRole('link', { name: /Alpha/ });
    fireEvent.click(link, { ctrlKey: true });
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate.mock.calls[0]?.[1].ctrlKey).toBe(true);
  });
  it('notifies middle-click activation without intercepting its native event or closing the index', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<SectionNav {...props} onNavigate={onNavigate} />);
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    const link = within(screen.getByRole('dialog')).getByRole('link', { name: /Alpha/ });
    expect(fireEvent(link, new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }))).toBe(true);
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate.mock.calls[0]?.[0]).toEqual(items[0]);
    expect(onNavigate.mock.calls[0]?.[1].button).toBe(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('closes after a prevented primary index click while preserving the original event', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_item, event) => event.preventDefault());
    render(<SectionNav {...props} onNavigate={onNavigate} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    await user.click(trigger);
    const link = within(screen.getByRole('dialog')).getByRole('link', { name: /Alpha/ });
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate.mock.calls[0]?.[1].defaultPrevented).toBe(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('keeps controlled requests separate from acknowledgement', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<SectionNav {...props} open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(<SectionNav {...props} open={true} onOpenChange={onOpenChange} />);
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(<SectionNav {...props} open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('dismisses outside without stealing the outside focus', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SectionNav {...props} />
        <button type='button'>Outside</button>
      </>
    );
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });
  it('cycles focus in the index', async () => {
    const user = userEvent.setup();
    render(<SectionNav {...props} />);
    await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
    const links = within(screen.getByRole('dialog')).getAllByRole('link');
    links[0]?.focus();
    expect(links[0]).toHaveFocus();
    await user.tab({ shift: true });
    expect(links[2]).toHaveFocus();
    await user.tab();
    expect(links[0]).toHaveFocus();
  });
  it('hides an open controlled panel and requests closure', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<SectionNav {...props} open={true} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(<SectionNav {...props} open={true} hidden={true} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it.each([
    [0, '0'],
    [50, '0.5'],
    [100, '1'],
    [-1, '0'],
    [101, '1'],
    [Number.NaN, '0']
  ])('forwards progress %s decoratively', (value, fill) => {
    const { container } = render(<SectionNav {...props} value={value} />);
    const progress = container.querySelector('.eg-progress');
    expect(progress).toHaveAttribute('aria-hidden', 'true');
    expect(progress?.firstElementChild).toHaveStyle({ '--eg-progress-value': fill });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  it('retains approved classes and protects native semantics', () => {
    const { container } = render(
      <SectionNav
        {...props}
        {...({
          role: 'alert',
          'aria-label': 'wrong',
          dangerouslySetInnerHTML: { __html: 'bad' }
        } as unknown as SectionNavProps)}
        className='mt-4'
      />
    );
    const root = screen.getByRole('navigation', { name: props.label });
    expect(root).toHaveClass('eg-section-nav', 'before:content-none', 'mt-4');
    expect(root).not.toHaveAttribute('role');
    expect(container.querySelector('[class*="eg-section-nav__"]')).toBeNull();
    expect(root.querySelector('button a, a button')).toBeNull();
    expect(root).toHaveClass(
      'right-[calc(var(--space-6)+env(safe-area-inset-right,0px))]',
      'bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))]',
      'motion-reduce:transition-none'
    );
    const pill = root.querySelector('.eg-surface');
    expect(pill).toHaveClass(
      'h-14',
      '[@media(width<=520px)]:h-14',
      '[@media(width<=520px)]:px-3',
      'bg-surface-overlay',
      'not-supports-[backdrop-filter]:bg-surface-2'
    );
    for (const control of [
      screen.getByRole('button', { name: props.disclosureLabel }),
      screen.getByRole('link', { name: props.nextLabel })
    ]) {
      expect(control).toHaveClass(
        'min-h-14',
        'min-w-14',
        '[@media(width<=520px)]:min-h-14',
        '[@media(width<=520px)]:min-w-14'
      );
    }
    expectTypeOf<SectionNavProps>().not.toHaveProperty('children');
    expectTypeOf<SectionNavProps>().not.toHaveProperty('role');
    expectTypeOf<SectionNavProps>().not.toHaveProperty('dangerouslySetInnerHTML');
    expectTypeOf<SectionNavProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<SectionNavProps['disclosureLabel']>().toEqualTypeOf<string>();
    expectTypeOf<SectionNavProps['nextLabel']>().toEqualTypeOf<string>();
  });
  it('does not open on hover or global shortcut', async () => {
    const user = userEvent.setup();
    render(<SectionNav {...props} />);
    await user.hover(screen.getByRole('button', { name: props.disclosureLabel }));
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('restores trigger focus after Escape', async () => {
    const user = userEvent.setup();
    render(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: 'Open sections' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});

// v0.3 (#563): zero-padded brand numbers and uppercase display labels. Class assertions name the recipe
// utilities per part, never a full class string; browser paint and geometry are not claimed from jsdom.
const sections = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `section-${index + 1}`,
    label: `Section ${index + 1}`,
    href: `#section-${index + 1}`
  }));
const alpha = { id: 'a', label: 'Alpha', href: '#alpha' };
const gamma = { id: 'c', label: 'Gamma', href: '#gamma' };
const delta = { id: 'd', label: 'Delta', href: '#delta' };
const openIndex = async (ui: ReactElement) => {
  const user = userEvent.setup();
  const view = render(ui);
  await user.click(screen.getByRole('button', { name: props.disclosureLabel }));
  return { ...view, user, dialog: await screen.findByRole('dialog', { name: props.label }) };
};
const rowTexts = (dialog: HTMLElement) =>
  within(dialog)
    .getAllByRole('link')
    .map((link) => link.textContent);

describe('SectionNav numbers and labels (v0.3, #563)', () => {
  it('names each index link with its two-digit position, one space and the label', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} />);
    for (const [index, name] of ['01 Alpha', '02 Beta', '03 Gamma'].entries()) {
      const link = within(dialog).getByRole('link', { name });
      expect(link.textContent, name).toBe(name);
      expect(link).toHaveAttribute('href', items[index]?.href);
    }
  });
  it('pads to two digits and never truncates across the 09 and 10 boundary', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} items={sections(12)} activeId='section-10' />);
    expect(rowTexts(dialog)).toEqual([
      '01 Section 1',
      '02 Section 2',
      '03 Section 3',
      '04 Section 4',
      '05 Section 5',
      '06 Section 6',
      '07 Section 7',
      '08 Section 8',
      '09 Section 9',
      '10 Section 10',
      '11 Section 11',
      '12 Section 12'
    ]);
    for (const name of ['09 Section 9', '10 Section 10', '12 Section 12']) {
      expect(within(dialog).getByRole('link', { name })).toBeInTheDocument();
    }
  });
  it('shows every digit from the hundredth section and never starts a number with 00', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} items={sections(100)} activeId='section-100' />);
    const links = within(dialog).getAllByRole('link');
    expect(links).toHaveLength(100);
    expect(links[8]?.textContent).toBe('09 Section 9');
    expect(links[98]?.textContent).toBe('99 Section 99');
    expect(links[99]?.textContent).toBe('100 Section 100');
    expect(links.some((link) => link.textContent?.startsWith('00'))).toBe(false);
  });
  it('follows array order after the host reorders, inserts and removes items, never the id', async () => {
    const { rerender } = await openIndex(<SectionNav {...props} />);
    rerender(<SectionNav {...props} items={[gamma, delta, alpha]} activeId='d' />);
    const dialog = screen.getByRole('dialog', { name: props.label });
    expect(rowTexts(dialog)).toEqual(['01 Gamma', '02 Delta', '03 Alpha']);
    expect(screen.getByRole('button', { name: props.disclosureLabel }).textContent).toBe('02 Delta');
  });
  it('shows the padded number and label of the active item and follows the host without moving focus', () => {
    const { rerender } = render(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    expect(trigger.textContent).toBe('02 Beta');
    trigger.focus();
    rerender(<SectionNav {...props} activeId='c' nextLabel='Go to Alpha' />);
    expect(trigger.textContent).toBe('03 Gamma');
    expect(trigger).toHaveFocus();
  });
  it('shows no disclosure number when unmatched or empty, while each open row keeps its own number', async () => {
    const { rerender } = render(<SectionNav {...props} activeId='missing' />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    expect(trigger.textContent).toBe('');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: props.label });
    expect(rowTexts(dialog)).toEqual(['01 Alpha', '02 Beta', '03 Gamma']);
    expect(
      within(dialog)
        .getAllByRole('link')
        .some((link) => link.hasAttribute('aria-current'))
    ).toBe(false);
    rerender(<SectionNav {...props} items={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/00/);
  });
  it('keeps the disclosure, next and landmark names and leaves the number in the accessible name', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    expect(screen.getByRole('navigation', { name: props.label })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: props.nextLabel })).toHaveAttribute('href', '#gamma');
    expect(within(dialog).getByRole('link', { name: '02 Beta' })).toHaveAttribute('aria-current', 'location');
    for (const surface of [trigger, ...within(dialog).getAllByRole('link')]) {
      expect(within(surface).getByText(/^\d+$/)).not.toHaveAttribute('aria-hidden');
    }
    for (const link of within(dialog).getAllByRole('link')) {
      expect(link.querySelector('.eg-pixel')).toHaveAttribute('aria-hidden', 'true');
    }
  });
  it('keeps casing in CSS and reports the host item rather than a formatted string', async () => {
    const onNavigate = vi.fn();
    const { dialog } = await openIndex(<SectionNav {...props} onNavigate={onNavigate} />);
    const link = within(dialog).getByRole('link', { name: /Beta/ });
    const label = within(link).getByText('Beta');
    expect(label.textContent).toBe('Beta');
    expect(label).toHaveClass('uppercase');
    fireEvent.click(link);
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate.mock.calls[0]?.[0]).toBe(items[1]);
  });
  it('applies the number and label recipes to the pill and to a row, and the root className to neither', async () => {
    const { container, dialog } = await openIndex(<SectionNav {...props} className='mt-4' />);
    const trigger = screen.getByRole('button', { name: props.disclosureLabel });
    const row = within(dialog).getByRole('link', { name: /Beta/ });
    for (const surface of [trigger, row]) {
      const number = within(surface).getByText('02');
      const label = within(surface).getByText('Beta');
      expect(number).toHaveClass('font-display', 'text-meta', 'tabular-nums', 'text-fg-brand-raised');
      expect(label).toHaveClass('font-display', 'text-meta', 'uppercase');
      for (const part of [number, label]) {
        for (const absent of ['font-sans', 'text-body-default', 'mt-4']) {
          expect(part, absent).not.toHaveClass(absent);
        }
        expect(part.className).not.toContain('[');
      }
    }
    expect(container.querySelector('[class*="eg-section-nav__"]')).toBeNull();
    expect(dialog.querySelector('[class*="eg-section-nav__"]')).toBeNull();
  });
  it('gives every row number the same classes so the colour carries no state', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} />);
    const rows = within(dialog).getAllByRole('link');
    const numbers = rows.map((row) => within(row).getByText(/^\d+$/));
    expect(new Set(numbers.map((number) => number.className)).size).toBe(1);
    for (const number of numbers) {
      expect(number).toHaveClass('text-fg-brand-raised');
    }
    const current = rows.find((row) => row.getAttribute('aria-current') === 'location');
    expect(current).toHaveClass('aria-[current=location]:underline');
    expect(current?.querySelector('.eg-pixel')).toHaveAttribute('data-state', 'active');
  });
  it('ships the ManySections story: twelve sections, the tenth current and the index open', async () => {
    expect(ManySections?.args).toMatchObject({ defaultOpen: true, activeId: 'section-10' });
    expect(ManySections?.args?.items).toHaveLength(12);
    render(<SectionNav {...storyMeta.args} {...ManySections?.args} />);
    const dialog = await screen.findByRole('dialog', { name: storyMeta.args.label });
    expect(within(dialog).getByRole('link', { name: '09 Section 9' })).not.toHaveAttribute('aria-current');
    expect(within(dialog).getByRole('link', { name: '10 Section 10' })).toHaveAttribute('aria-current', 'location');
  });
});

// Token arithmetic only (Amendment 1 of the spec): the documented figures of the neon brand text on the solid
// fallbacks, not rendered contrast and nothing over the translucent overlay. The colour comes from the class the
// number emits, so a changed recipe or token changes the numbers instead of leaving a free-standing check green.
describe('SectionNav number contrast on the solid fallbacks', () => {
  const theme = readFileSync(resolve(import.meta.dirname, '../../../../tokens/src/theme.css'), 'utf8');
  const declarations = new Map<string, string>();
  for (const [, name, value] of theme.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    if (name && value) {
      declarations.set(name, value.trim());
    }
  }
  const resolveToken = (name: string, seen: string[] = []): string => {
    const value = declarations.get(name);
    if (value === undefined || seen.includes(name)) {
      throw new Error(`Cannot resolve ${name} from theme.css`);
    }
    return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, target: string) => resolveToken(target, [...seen, name]));
  };
  const luminance = (hex: string) => {
    if (!/^#[\da-f]{6}$/i.test(hex)) {
      throw new Error(`Expected a six-digit hex colour, got ${hex}`);
    }
    const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((index) => {
      const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const contrast = (first: string, second: string) => {
    const [lighter = 0, darker = 0] = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  };

  it('documents about 3.92:1 on surface-2 and 3.42:1 on surface-3 for the colour the number emits', async () => {
    const { dialog } = await openIndex(<SectionNav {...props} />);
    const number = within(within(dialog).getByRole('link', { name: /Beta/ })).getByText(/^\d+$/);
    const utility = [...number.classList].find((name) => name.startsWith('text-fg-'));
    if (!utility) {
      throw new Error('The number emits no text-fg-* colour utility');
    }
    const ink = resolveToken(`--color-${utility.slice('text-'.length)}`);
    expect(ink.toLowerCase()).toBe('#ff0036');
    expect(contrast(ink, resolveToken('--color-surface-2')).toFixed(2)).toBe('3.92');
    expect(contrast(ink, resolveToken('--color-surface-3')).toFixed(2)).toBe('3.42');
  });
});
