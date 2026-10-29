import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Notice, type NoticeTone } from '@/molecules/notice';
import { useNotice } from '@/molecules/notice/useNotice';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';

afterEach(() => vi.unstubAllEnvs());

const tones: NoticeTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];

describe('Notice public contract', () => {
  it('renders defaults, native attributes and the bold lead before detail', () => {
    render(
      <Notice
        summary='Queue ready.'
        id='queue'
        title='Queue state'
        data-source='queue'
        aria-describedby='help'
        className='mt-4'
      >
        Waiting for work.
      </Notice>
    );
    const root = screen.getByRole('status');
    expect(root).toHaveClass('eg-notice', 'eg-surface', 'mt-4', 'flex-wrap', 'text-body-default');
    expect(root).toHaveAttribute('data-tone', 'neutral');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('id', 'queue');
    expect(root).toHaveAttribute('title', 'Queue state');
    expect(root).toHaveAttribute('data-source', 'queue');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    const summary = screen.getByText('Queue ready.');
    expect(summary.tagName).toBe('STRONG');
    expect(summary.parentElement).toHaveTextContent('Queue ready. Waiting for work.');
    expect(summary.parentElement).toHaveClass('eg-notice__text', 'grow', 'basis-[calc(var(--space-24)*2.5)]');
    expect(root.querySelector('.eg-notice__actions')).toBeNull();
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('aria-live');
    expect(root.querySelector('[role], [aria-live]')).toBeNull();
  });

  it.each(tones)('derives the role and a decorative default icon for %s', (tone) => {
    render(<Notice summary='Current state.' tone={tone} />);
    const root = screen.getByRole(tone === 'danger' ? 'alert' : 'status');
    expect(root).toHaveAttribute('data-tone', tone);
    expect(root.className).not.toContain('eg-notice--');
    const icon = root.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.parentElement).toHaveAttribute('aria-hidden', 'true');
    const { result } = renderHook(() => useNotice({ summary: 'Current state.', tone }));
    expect(result.current.iconName).toBe(
      tone === 'success' ? 'check' : tone === 'warning' || tone === 'danger' ? 'alert' : 'bell'
    );
  });

  it('honors either native role override without creating another announcer', () => {
    const { rerender } = render(<Notice summary='Network unavailable.' tone='danger' role='status' />);
    const root = screen.getByRole('status');
    rerender(<Notice summary='Action required.' tone='info' role='alert' />);
    expect(screen.getByRole('alert')).toBe(root);
    expect(root.querySelector('[role], [aria-live]')).toBeNull();
  });

  it('replaces the default icon with the supplied decorative content', () => {
    render(<Notice summary='Simulation active.' icon={<Icon name='flask' />} />);
    const root = screen.getByRole('status');
    expect(root.querySelectorAll('svg')).toHaveLength(1);
    expect(root.querySelector('svg')?.parentElement).toHaveAttribute('aria-hidden', 'true');
    const { result } = renderHook(() => useNotice({ summary: 'Simulation active.', icon: 'Custom glyph' }));
    expect(result.current.icon).toBe('Custom glyph');
  });

  it('keeps system actions operable in normal keyboard order without owning focus', async () => {
    const user = userEvent.setup();
    const resume = vi.fn();
    render(
      <Notice
        summary='Queue paused.'
        tone='warning'
        actions={
          <>
            <Button size='sm' variant='secondary' onClick={resume}>
              Resume
            </Button>
            <Link href='#queue'>View queue</Link>
          </>
        }
      />
    );
    const root = screen.getByRole('status');
    const button = within(root).getByRole('button', { name: 'Resume' });
    expect(button.parentElement).toHaveClass('eg-notice__actions', 'm-0', 'ms-auto', 'flex');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(resume).toHaveBeenCalledOnce();
    await user.tab();
    expect(screen.getByRole('link', { name: 'View queue' })).toHaveFocus();
  });

  it.each([undefined, null, false])('omits an absent actions slot (%s)', (actions) => {
    render(<Notice summary='Import complete.' actions={actions} />);
    expect(screen.getByRole('status').querySelector('.eg-notice__actions')).toBeNull();
  });

  it('applies compact geometry and preserves supported consumer layout', () => {
    render(<Notice summary='Queue paused.' size='sm' className='w-full self-start mt-3' />);
    const root = screen.getByRole('status');
    expect(root).toHaveAttribute('data-size', 'sm');
    expect(root).toHaveClass('eg-notice', 'gap-2', 'px-3', 'py-2', 'rounded-md', 'w-full', 'self-start', 'mt-3');
    expect(root.querySelector('svg')?.parentElement).toHaveClass('size-4');
    expect(root.querySelector('svg')).toHaveClass('size-4');
  });

  it.each(['', '   '])('warns for a blank summary without rendering a bold part (%j)', (summary) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Notice summary={summary}>Explanation remains readable.</Notice>);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/Notice.*summary/));
    expect(screen.getByRole('status').querySelector('strong')).toBeNull();
    expect(screen.getByText('Explanation remains readable.')).toBeVisible();
    warn.mockRestore();
  });

  it('does not warn for an empty summary in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Notice summary='' />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('retains the same single status owner and focus across genuine content updates', async () => {
    const user = userEvent.setup();
    const actions = (
      <Button size='sm' variant='ghost'>
        Inspect queue
      </Button>
    );
    const { rerender } = render(
      <Notice role='status' summary='Queue ready.' actions={actions}>
        Waiting for work.
      </Notice>
    );
    const root = screen.getByRole('status');
    await user.tab();
    const focused = document.activeElement;
    rerender(
      <Notice role='status' summary='Queue paused.' actions={actions}>
        Resume when ready.
      </Notice>
    );
    expect(screen.getByRole('status')).toBe(root);
    expect(root).toHaveTextContent('Queue paused. Resume when ready.');
    expect(document.activeElement).toBe(focused);
    expect(root.querySelector('[role], [aria-live]')).toBeNull();
    expect(document.querySelectorAll('[role="status"], [role="alert"], [aria-live]')).toHaveLength(1);
  });

  it('keeps newly inserted status and alert content readable without DOM speech claims', () => {
    const { rerender } = render(<main />);
    rerender(
      <main>
        <Notice summary='Import complete.' tone='success' />
      </main>
    );
    expect(screen.getByRole('status')).toHaveTextContent('Import complete.');
    rerender(
      <main>
        <Notice summary='Sign in required.' tone='danger' />
      </main>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Sign in required.');
    expect(document.activeElement).toBe(document.body);
  });
});
