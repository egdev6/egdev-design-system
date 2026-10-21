import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Cluster } from './Cluster';
import { layoutGapClasses } from './types';

describe('Cluster public contract', () => {
  it('defaults to a centered wrapping row with the token gap and marker', () => {
    render(
      <Cluster data-testid='cluster'>
        <span>One</span>
        <span>Two</span>
      </Cluster>
    );
    const root = screen.getByTestId('cluster');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass(
      'eg-cluster',
      'flex',
      'min-w-0',
      'flex-row',
      'flex-wrap',
      'gap-4',
      'items-center',
      'justify-start'
    );
  });

  it('maps every gap key to an existing spacing token', () => {
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../../packages/tokens/src/theme.css'), 'utf8');
    for (const key of Object.keys(layoutGapClasses)) {
      expect(theme, `gap-${key} must map to --space-${key}`).toMatch(new RegExp(`--space-${key}:\\s`));
    }
    expect(
      Object.keys(layoutGapClasses)
        .map(Number)
        .sort((a, b) => a - b)
    ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24]);
  });

  it('applies alignment and distribution choices without touching order', () => {
    render(
      <Cluster gap={0} alignItems='baseline' justifyContent='between' data-testid='aligned'>
        <span>One</span>
        <span>Two</span>
      </Cluster>
    );
    const root = screen.getByTestId('aligned');
    expect(root).toHaveClass('gap-0', 'items-baseline', 'justify-between', 'flex-row');
    expect([...root.children].map((child) => child.textContent)).toEqual(['One', 'Two']);
  });

  it('renders flex items only for real children, never phantom spacers', () => {
    render(
      <Cluster data-testid='sparse'>
        {null}
        <span>Only</span>
        {false}
      </Cluster>
    );
    const root = screen.getByTestId('sparse');
    expect(root.children).toHaveLength(1);
    expect(root).toHaveTextContent('Only');
  });

  it('supports supported root sizing classes and keeps the marker', () => {
    render(
      <Cluster className='w-full' data-testid='sized'>
        <span>Item</span>
      </Cluster>
    );
    expect(screen.getByTestId('sized')).toHaveClass('eg-cluster', 'w-full');
  });

  it('passes native attributes, events and focusable children unchanged', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <Cluster aria-label='Actions' onClick={clicked}>
        <button type='button'>First</button>
        <button type='button'>Second</button>
      </Cluster>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Second' }));
    expect(clicked).toHaveBeenCalledTimes(1);
    const root = screen.getByLabelText('Actions');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('merges layout onto one slotted element without a wrapper', () => {
    render(
      <Cluster asChild={true}>
        <ul aria-label='Links'>
          <li>One</li>
          <li>Two</li>
        </ul>
      </Cluster>
    );
    const list = screen.getByRole('list', { name: 'Links' });
    expect(list).toHaveClass('eg-cluster', 'flex', 'flex-row', 'flex-wrap', 'gap-4', 'items-center');
    expect(list.children).toHaveLength(2);
    expect(list.parentElement?.tagName).toBe('DIV');
    expect(list.querySelector('[data-slot]')).toBeNull();
  });
});
