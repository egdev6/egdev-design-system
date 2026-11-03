import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { SectionNav } from '.';
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

describe('SectionNav', () => {
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
