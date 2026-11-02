import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as publicAPI from '.';
import { TerminalCard, TerminalCardBar, TerminalCardList } from './TerminalCard';
import type { TerminalCardRow } from './types';
import { useTerminalCard, useTerminalCardBar, useTerminalCardList } from './useTerminalCard';

function cardFor(label: string): HTMLElement {
  const root = screen.getByRole('group', { name: label });
  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected an HTMLElement group root.');
  }
  return root;
}

function exampleRow(overrides: Partial<TerminalCardRow> = {}): TerminalCardRow {
  return { term: 'Role', value: 'Design Engineer', ...overrides };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TerminalCard public contract', () => {
  it('owns a named group and renders nothing for a blank label (TC-01)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(
      <TerminalCard label='Profile'>
        <TerminalCardBar>~/egdev</TerminalCardBar>
        <TerminalCardList items={[exampleRow()]} />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-terminal-card');
    expect(root).not.toHaveAttribute('aria-label', '');
    expect(root).toHaveAttribute('aria-label', 'Profile');
    warnSpy.mockClear();
    rerender(
      <TerminalCard label='   '>
        <TerminalCardBar>~/egdev</TerminalCardBar>
        <TerminalCardList items={[exampleRow()]} />
      </TerminalCard>
    );
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('renders the pairs as a dl with one dt before each dd in supplied order (TC-02)', () => {
    render(
      <TerminalCard label='Profile'>
        <TerminalCardList
          items={[
            { term: 'Role', value: 'Design Engineer' },
            { term: 'Stack', value: 'React' }
          ]}
        />
      </TerminalCard>
    );
    const list = cardFor('Profile').querySelector('dl');
    expect(list).not.toBeNull();
    expect(list).toHaveClass('eg-terminal-card__list');
    const cells = [...(list as HTMLElement).querySelectorAll('dt, dd')].map((cell) => ({
      tag: cell.tagName,
      text: cell.textContent
    }));
    expect(cells).toEqual([
      { tag: 'DT', text: 'Role' },
      { tag: 'DD', text: 'Design Engineer' },
      { tag: 'DT', text: 'Stack' },
      { tag: 'DD', text: 'React' }
    ]);
  });

  it('renders the decorative glyph, the path and only a supplied shell on the bar (TC-03)', () => {
    const { rerender } = render(
      <TerminalCard label='Profile'>
        <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
      </TerminalCard>
    );
    const root = cardFor('Profile');
    const bar = root.querySelector('.eg-terminal-card__bar');
    expect(bar).not.toBeNull();
    const glyph = (bar as HTMLElement).querySelector('svg');
    expect(glyph).not.toBeNull();
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph).toHaveClass('text-fg-brand-raised');
    expect(screen.getByText('~/egdev')).toBeInTheDocument();
    expect(screen.getByText('zsh')).toHaveClass('eg-terminal-card__shell');
    rerender(
      <TerminalCard label='Profile'>
        <TerminalCardBar>~/egdev</TerminalCardBar>
      </TerminalCard>
    );
    expect(root.querySelector('.eg-terminal-card__shell')).toBeNull();
    expect(screen.queryByText('zsh')).not.toBeInTheDocument();
  });

  it('omits a whitespace-only shell entirely (TC-03, normalization)', () => {
    renderHook(() => useTerminalCardBar({ children: '~/egdev', shell: '   ' }));
    render(
      <TerminalCard label='Profile'>
        <TerminalCardBar shell='   '>~/egdev</TerminalCardBar>
      </TerminalCard>
    );
    expect(cardFor('Profile').querySelector('.eg-terminal-card__shell')).toBeNull();
  });

  it('marks success rows with data-tone and status ink while the text stays readable (TC-04)', () => {
    render(
      <TerminalCard label='Profile'>
        <TerminalCardList
          items={[
            exampleRow({ term: 'Status', value: 'online', tone: 'success' }),
            exampleRow({ term: 'Role', value: 'Design Engineer' })
          ]}
        />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    const [success, fallback] = [...root.querySelectorAll('dd')];
    expect(success).toHaveAttribute('data-tone', 'success');
    expect(success?.className).toContain('data-[tone=success]:text-status-success');
    expect(success).toHaveTextContent('online');
    expect(fallback).not.toHaveAttribute('data-tone', 'success');
    expect(fallback).toHaveTextContent('Design Engineer');
  });

  it('falls back unknown row tones to default in the hook', () => {
    const { result } = renderHook(() =>
      useTerminalCardList({ items: [{ tone: 'neon' } as unknown as TerminalCardRow, exampleRow()] })
    );
    expect(result.current.rows[0]?.tone).toBe('default');
    expect(result.current.rows[1]?.tone).toBe('default');
  });

  it('renders one decorative caret after the value, outside the accessibility tree (TC-05)', () => {
    render(
      <TerminalCard label='Profile'>
        <TerminalCardList items={[exampleRow({ term: 'Building', value: 'agent-teams', caret: true }), exampleRow()]} />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    const carets = root.querySelectorAll('.eg-terminal-card__caret');
    expect(carets).toHaveLength(1);
    const caret = carets[0] as HTMLElement;
    expect(caret).toHaveAttribute('aria-hidden', 'true');
    expect(caret).toHaveClass('animate-pulse', 'motion-reduce:animate-none');
    expect(caret.parentElement?.tagName).toBe('DD');
    expect(caret.parentElement?.lastElementChild).toBe(caret);
    expect(caret.parentElement).toHaveTextContent('agent-teams');
  });

  it('wraps long terms and values without truncation or card-level horizontal scroll (TC-06)', () => {
    render(
      <TerminalCard label='Profile' className='w-64'>
        <TerminalCardBar>~/egdev/very-long-project-directory-name</TerminalCardBar>
        <TerminalCardList
          items={[
            {
              term: 'Deployment target region',
              value: 'eu-west-1-primary-with-secondary-failover-and-managed-replication'
            }
          ]}
        />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    const value = root.querySelector('dd') as HTMLElement;
    const term = root.querySelector('dt') as HTMLElement;
    const path = screen.getByText('~/egdev/very-long-project-directory-name');
    expect(value.className).toContain('[overflow-wrap:anywhere]');
    expect(term.className).toContain('[overflow-wrap:anywhere]');
    expect(term).toHaveClass('max-w-24');
    expect(value).toHaveClass('m-0');
    expect(path.className).toContain('[overflow-wrap:anywhere]');
    expect(root).toHaveClass('min-w-0', 'overflow-hidden');
    expect(root).toHaveTextContent('eu-west-1-primary-with-secondary-failover-and-managed-replication');
    expect(root.textContent).not.toContain('…');
  });

  it('exposes no tab stop and no interactive descendant (TC-07)', async () => {
    const user = userEvent.setup();
    render(
      <TerminalCard label='Profile'>
        <TerminalCardBar>~/egdev</TerminalCardBar>
        <TerminalCardList items={[exampleRow()]} />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('has no built-in maximum width and merges consumer className last (TC-08)', () => {
    render(
      <TerminalCard label='Profile' className='w-96'>
        <TerminalCardList items={[exampleRow()]} />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    expect(root.className).not.toMatch(/max-w-/);
    expect(root).toHaveClass('w-96');
    expect(root.className.trim().endsWith('w-96')).toBe(true);
  });

  it('keeps root and bar box-border and fully passive (G7a, passivity)', () => {
    render(
      <TerminalCard label='Profile'>
        <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
        <TerminalCardList items={[exampleRow()]} />
      </TerminalCard>
    );
    const root = cardFor('Profile');
    const bar = root.querySelector('.eg-terminal-card__bar') as HTMLElement;
    expect(root).toHaveClass('box-border');
    expect(bar).toHaveClass('box-border');
    for (const node of [root, bar]) {
      expect(node.className).not.toMatch(/(?:^|\s)(?:hover:|cursor-pointer|transition)/);
    }
  });

  it('strips protected semantics from the hook even at untyped boundaries', () => {
    const injected = {
      label: 'Profile',
      children: null,
      role: 'dialog',
      tabIndex: 0,
      style: { background: 'red' },
      'aria-label': 'Injected',
      'aria-pressed': true
    } as unknown as Parameters<typeof useTerminalCard>[0];
    const { result } = renderHook(() => useTerminalCard(injected));
    expect(result.current.valid).toBe(true);
    expect(result.current.rootProps.role).toBe('group');
    expect(result.current.rootProps['aria-label']).toBe('Profile');
    for (const key of ['tabIndex', 'style', 'aria-pressed']) {
      expect(result.current.rootProps).not.toHaveProperty(key);
    }
    expect(result.current.rootProps).not.toHaveProperty('ref');
  });

  it('exports the three components and the row/tone types through the folder index', () => {
    expect(Object.keys(publicAPI).sort()).toEqual(['TerminalCard', 'TerminalCardBar', 'TerminalCardList']);
  });
});
