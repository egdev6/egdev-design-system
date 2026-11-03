import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectionShell } from './SectionShell';

const recipes = {
  pro: ['bg-transparent', 'bg-none', 'text-fg-default'],
  show: ['bg-transparent', 'bg-[image:var(--gradient-section-show)]', 'text-fg-default'],
  flood: ['bg-bg-flood', 'bg-none', 'text-fg-on-flood'],
  deep: ['bg-bg-deep', 'bg-none', 'text-fg-default'],
  grafito: [
    'bg-surface-0/50',
    'bg-none',
    'text-fg-default',
    '[@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
  ]
} as const;

describe('SectionShell', () => {
  it('keeps host naming, native attributes and child focus without synthesizing a name (SS-01)', async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(
      <SectionShell aria-label='Reading' id='reading' data-zone='zone-a' title='Host title'>
        <button type='button'>Child action</button>
      </SectionShell>
    );
    const section = screen.getByRole('region', { name: 'Reading' });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('id', 'reading');
    expect(section).toHaveAttribute('data-zone', 'zone-a');
    expect(section).toHaveAttribute('title', 'Host title');
    expect(section).not.toHaveAttribute('tabindex');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Child action' })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    rerender(
      <SectionShell aria-labelledby='heading'>
        <h2 id='heading'>Heading name</h2>
      </SectionShell>
    );
    expect(screen.getByRole('region', { name: 'Heading name' })).toHaveAttribute('aria-labelledby', 'heading');
    rerender(<SectionShell data-zone='not-a-name'>Content</SectionShell>);
    expect(container.querySelector('section')).not.toHaveAttribute('aria-label');
    expect(container.querySelector('section')).not.toHaveAttribute('aria-labelledby');
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('keeps role, inline style and raw HTML protected from native pass-through (SS-01)', () => {
    const unsafe = {
      role: 'presentation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as Record<string, unknown>;
    render(
      <SectionShell aria-label='Protected' {...unsafe}>
        <p>Content</p>
      </SectionShell>
    );
    const section = screen.getByRole('region', { name: 'Protected' });
    expect(section).not.toHaveAttribute('role');
    expect(section).not.toHaveAttribute('style');
    expect(section.querySelector('b')).toBeNull();
    expect(within(section).getByText('Content')).toBeInTheDocument();
  });

  it('selects the default and five static recipes without changing the content (SS-02)', () => {
    const { rerender } = render(
      <SectionShell aria-label='Section'>
        <p>Content</p>
      </SectionShell>
    );
    expect(screen.getByRole('region')).toHaveClass(...recipes.pro);
    for (const register of Object.keys(recipes) as (keyof typeof recipes)[]) {
      rerender(
        <SectionShell aria-label='Section' register={register}>
          <p>Content</p>
        </SectionShell>
      );
      const section = screen.getByRole('region');
      expect(section).toHaveClass(...recipes[register]);
      expect(within(section).getByText('Content')).toBeInTheDocument();
      expect(section).not.toHaveAttribute('data-state');
      expect(section).not.toHaveAttribute('data-zone');
    }
  });

  it('wraps by default or explicitly, and keeps self-wrapped children in order without a second wrapper (SS-03)', () => {
    const children = (
      <>
        <div className='self-wrapped'>First</div>
        <p>Second</p>
      </>
    );
    const { rerender } = render(<SectionShell aria-label='Section'>{children}</SectionShell>);
    const section = screen.getByRole('region');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild).toHaveClass('eg-section__wrap');
    expect(section.firstElementChild?.textContent).toBe('FirstSecond');
    rerender(
      <SectionShell aria-label='Section' wrap={true}>
        {children}
      </SectionShell>
    );
    expect(section.querySelectorAll('.eg-section__wrap')).toHaveLength(1);
    rerender(
      <SectionShell aria-label='Section' wrap={false}>
        {children}
      </SectionShell>
    );
    expect(section.querySelectorAll('.eg-section__wrap')).toHaveLength(0);
    expect(section.children).toHaveLength(2);
    expect(section.children[0]).toHaveClass('self-wrapped');
    expect(section.textContent).toBe('FirstSecond');
  });

  it('uses local legacy resets and no legacy modifiers for any register (SS-05, SS-06)', () => {
    const { rerender } = render(<SectionShell aria-label='Section'>Content</SectionShell>);
    const section = screen.getByRole('region');
    expect(section).toHaveClass(
      'eg-section',
      'box-border',
      'relative',
      'isolate',
      'flex',
      'flex-col',
      'justify-center',
      'min-h-[var(--section-min-height)]',
      'pt-[calc(var(--nav-height)+var(--space-8))]',
      'pb-8'
    );
    expect(section.firstElementChild).toHaveClass(
      'eg-section__wrap',
      'box-border',
      'w-full',
      'max-w-[var(--content-max)]',
      'mx-auto',
      'px-[var(--gutter)]'
    );
    for (const register of Object.keys(recipes) as (keyof typeof recipes)[]) {
      rerender(
        <SectionShell aria-label='Section' register={register} wrap={false}>
          Content
        </SectionShell>
      );
      expect(section).toHaveClass('[&>*]:w-auto');
      expect([...section.classList].some((cls) => cls.startsWith('eg-section--'))).toBe(false);
    }
  });
});
