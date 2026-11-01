import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from '.';
import type { CommandPaletteItem, CommandPaletteProps } from './types';

// @ts-expect-error The palette requires items.
const missingItems: CommandPaletteProps = {};
// @ts-expect-error The palette owns its keyboard interface.
const invalidHotkey: CommandPaletteProps = { items: [], hotkey: 'mod+k' };
// @ts-expect-error The palette does not expose native style overrides.
const invalidStyle: CommandPaletteProps = { items: [], style: {} };
void [missingItems, invalidHotkey, invalidStyle];

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const items: [CommandPaletteItem, CommandPaletteItem, CommandPaletteItem] = [
  { id: 'one', label: 'Café', category: 'Actions', keywords: ['drink'], shortcut: '⌘K', onSelect: vi.fn() },
  { id: 'two', label: 'Disabled', disabled: true, onSelect: vi.fn() },
  { id: 'three', label: 'Settings', onSelect: vi.fn() }
];

describe('CommandPalette', () => {
  it('opens with a labelled input, an enabled active option and restores launcher focus on Escape', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette items={items}>
        <button type='button'>Launch</button>
      </CommandPalette>
    );
    const trigger = screen.getByRole('button', { name: 'Launch' });
    await user.click(trigger);
    const input = screen.getByRole('combobox', { name: 'Search' });
    expect(input).toHaveFocus();
    const list = screen.getByRole('listbox');
    expect(input).toHaveAttribute('aria-controls', list.id);
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Café Actions' }).id)
    );
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('updates the active descendant to an enabled option when items change', async () => {
    const { rerender } = render(<CommandPalette defaultOpen={true} items={items} />);
    const input = screen.getByRole('combobox');
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Café Actions' }).id)
    );
    rerender(<CommandPalette defaultOpen={true} items={[items[1], items[2]]} />);
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Settings' }).id)
    );
    rerender(<CommandPalette defaultOpen={true} items={[items[1]]} />);
    await waitFor(() => expect(input).not.toHaveAttribute('aria-activedescendant'));
  });

  it('updates the active descendant after keyboard navigation and filtering', async () => {
    const user = userEvent.setup();
    render(<CommandPalette defaultOpen={true} items={items} />);
    const input = screen.getByRole('combobox');
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Café Actions' }).id)
    );
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Settings' }).id)
    );
    await user.type(input, 'cafe');
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Café Actions' }).id)
    );
  });

  it('filters accent-insensitively by keywords and category, reports edits and resets on reopening', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    render(
      <CommandPalette items={items} onQueryChange={onQueryChange}>
        <button type='button'>Launch</button>
      </CommandPalette>
    );
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    const input = screen.getByRole('combobox');
    await user.type(input, 'cafe');
    expect(screen.getByRole('option', { name: 'Café Actions' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Settings' })).not.toBeInTheDocument();
    expect(onQueryChange).toHaveBeenCalledTimes(4);
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(onQueryChange).toHaveBeenCalledTimes(4);
  });

  it('skips disabled rows and selects with Enter before closing', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette
        defaultOpen={true}
        onOpenChange={onOpenChange}
        items={[items[0], items[1], { ...items[2], onSelect: select }]}
      />
    );
    await screen.findByRole('combobox');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(select).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(select.mock.invocationCallOrder[0] ?? 0).toBeLessThan(onOpenChange.mock.invocationCallOrder[0] ?? 0);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('wraps arrows, supports Home and End, and moves highlight on pointer hover without activating disabled options', async () => {
    const user = userEvent.setup();
    render(<CommandPalette defaultOpen={true} items={items} />);
    const input = screen.getByRole('combobox');
    const first = screen.getByRole('option', { name: 'Café Actions' });
    const last = screen.getByRole('option', { name: 'Settings' });
    const disabled = screen.getByRole('option', { name: 'Disabled' });
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    await user.keyboard('{ArrowDown}{End}');
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    await user.keyboard('{Home}');
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await user.pointer({ target: disabled });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await user.pointer({ target: last });
    expect(input).toHaveAttribute('aria-activedescendant', last.id);
    expect(last).toHaveAttribute('aria-selected', 'true');
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
  });

  it('restores pre-open focus without a launcher', async () => {
    const { rerender } = render(
      <>
        <button type='button'>Previous</button>
        <CommandPalette open={false} items={items} />
      </>
    );
    const previous = screen.getByRole('button', { name: 'Previous' });
    previous.focus();
    rerender(
      <>
        <button type='button'>Previous</button>
        <CommandPalette open={true} items={items} />
      </>
    );
    expect(screen.getByRole('combobox')).toHaveFocus();
    rerender(
      <>
        <button type='button'>Previous</button>
        <CommandPalette open={false} items={items} />
      </>
    );
    await waitFor(() => expect(previous).toHaveFocus());
  });

  it('does not select a command on an IME keyCode 229 Enter', () => {
    const select = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette
        defaultOpen={true}
        items={[{ id: 'item', label: 'Item', onSelect: select }]}
        onOpenChange={onOpenChange}
      />
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter', keyCode: 229 });
    expect(select).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows empty and busy messages and a decorative shortcut', async () => {
    const { rerender } = render(<CommandPalette defaultOpen={true} items={items} />);
    expect(await screen.findByText('⌘K')).toBeInTheDocument();
    expect(screen.getByText('⌘K').closest('[aria-hidden="true"]')).not.toBeNull();
    rerender(<CommandPalette defaultOpen={true} items={[]} busy={true} />);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    expect(within(screen.getByRole('listbox')).getByText('Loading results…')).toBeInTheDocument();
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
    rerender(<CommandPalette defaultOpen={true} items={[]} />);
    expect(within(screen.getByRole('listbox')).getByText('No results.')).toBeInTheDocument();
  });
});
