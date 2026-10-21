import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Cluster } from './Cluster';
import { Stack } from './Stack';
import { layoutGapClasses } from './types';

describe('Stack public contract', () => {
  it('defaults to a stretching vertical flow with the token gap and marker', () => {
    render(
      <Stack data-testid='stack'>
        <span>One</span>
        <span>Two</span>
      </Stack>
    );
    const root = screen.getByTestId('stack');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass(
      'eg-stack',
      'flex',
      'min-w-0',
      'flex-col',
      'flex-nowrap',
      'gap-4',
      'items-stretch',
      'justify-start'
    );
  });

  it('maps every gap key to an existing spacing token', () => {
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../../packages/tokens/src/theme.css'), 'utf8');
    for (const key of Object.keys(layoutGapClasses)) {
      expect(theme, `gap-${key} must map to --space-${key}`).toMatch(new RegExp(`--space-${key}:\\s`));
    }
  });

  it('applies alignment and distribution choices without touching order', () => {
    render(
      <Stack gap={6} alignItems='start' justifyContent='end' data-testid='aligned'>
        <span>One</span>
        <span>Two</span>
      </Stack>
    );
    const root = screen.getByTestId('aligned');
    expect(root).toHaveClass('gap-6', 'items-start', 'justify-end', 'flex-col', 'flex-nowrap');
    expect([...root.children].map((child) => child.textContent)).toEqual(['One', 'Two']);
  });

  it('renders flex items only for real children, never phantom spacers', () => {
    render(
      <Stack data-testid='sparse'>
        {null}
        <span>Only</span>
        {false}
      </Stack>
    );
    const root = screen.getByTestId('sparse');
    expect(root.children).toHaveLength(1);
    expect(root).toHaveTextContent('Only');
  });

  it('supports supported root sizing classes and keeps the marker', () => {
    render(
      <Stack className='h-full' data-testid='sized'>
        <span>Item</span>
      </Stack>
    );
    expect(screen.getByTestId('sized')).toHaveClass('eg-stack', 'h-full');
  });

  it('passes native attributes, events and focusable children unchanged', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <Stack aria-label='Sections' onClick={clicked}>
        <button type='button'>Top</button>
        <button type='button'>Bottom</button>
      </Stack>
    );
    expect(screen.getByTestId).toBeDefined();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Top' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Bottom' }));
    expect(clicked).toHaveBeenCalledTimes(1);
    const root = screen.getByLabelText('Sections');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('merges layout onto one slotted element without a wrapper', () => {
    render(
      <Stack asChild={true}>
        <section aria-label='Intro'>
          <p>One</p>
          <p>Two</p>
        </section>
      </Stack>
    );
    const section = screen.getByRole('region', { name: 'Intro' });
    expect(section).toHaveClass('eg-stack', 'flex', 'flex-col', 'flex-nowrap', 'gap-4', 'items-stretch');
    expect(section.children).toHaveLength(2);
    expect(section.querySelector('[data-slot]')).toBeNull();
  });

  it('exposes no public ref, keeping refs with the asChild child through Slot', () => {
    render(
      <Stack data-testid='no-ref'>
        <span>Static</span>
      </Stack>
    );
    expect(screen.getByTestId('no-ref').tagName).toBe('DIV');
  });

  it('keeps nested stacks and clusters independent', () => {
    render(
      <Stack data-testid='outer'>
        <Cluster data-testid='inner'>
          <span>Leaf</span>
        </Cluster>
      </Stack>
    );
    expect(screen.getByTestId('outer')).toHaveClass('flex-col');
    expect(screen.getByTestId('inner')).toHaveClass('flex-row', 'flex-wrap');
  });
});
