import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, createRef, type ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, ButtonGroup, type ButtonGroupProps, type ButtonProps, PageHeader } from '../../index';
import { usePageHeader } from './usePageHeader';

function header(container: HTMLElement) {
  const element = container.querySelector('header');
  if (!element) {
    throw new Error('Missing PageHeader');
  }
  return element;
}

afterEach(() => vi.unstubAllEnvs());

describe('PageHeader public contract', () => {
  it('resolves passive defaults, omissions and unchanged action identity through the hook', () => {
    // createElement erases the exotic target identity; restore only the known Button target.
    const actions = createElement(Button, null, 'Create project') as ReactElement<ButtonProps, typeof Button>;
    const { result, rerender } = renderHook((props) => usePageHeader(props), {
      initialProps: { title: 'Projects', eyebrow: '  ', actions }
    });
    expect(result.current).toMatchObject({ valid: true, element: 'h1', title: 'Projects', eyebrow: undefined });
    expect(result.current.actions).toBe(actions);
    rerender({ title: 'Archive', eyebrow: 'Workspace', actions });
    expect(result.current.eyebrow).toBe('Workspace');
    expect(result.current.actions).toBe(actions);
  });
  it('renders one compact h1 inside an unpainted passive native header (AC-01/07/08)', () => {
    const { container } = render(
      <main>
        <PageHeader title='Projects' />
      </main>
    );
    const root = header(container);
    const heading = screen.getByRole('heading', { name: 'Projects', level: 1 });
    expect(screen.getAllByRole('heading')).toHaveLength(1);
    // Testing Library's implicit-role table does not model header ancestry; browser tree review is separate.
    expect(root.parentElement?.tagName).toBe('MAIN');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveClass('eg-page-header', 'flex', 'flex-wrap', 'items-center', 'justify-between');
    expect(root).toHaveClass('gap-x-6', 'gap-y-4');
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).toHaveClass(
      'eg-stack',
      'gap-2',
      'min-w-0',
      'grow',
      'basis-[calc(var(--space-24)*3)]'
    );
    expect(heading).toHaveClass('font-sans', 'text-heading-small', 'text-fg-default', 'm-0', 'wrap-anywhere');
    for (const element of [root, heading, root.firstElementChild]) {
      expect(element).not.toHaveAttribute('tabindex');
      expect(element).not.toHaveAttribute('aria-live');
      expect(element).not.toHaveAttribute('data-state');
      expect(element).not.toHaveAttribute('id');
      expect(element).not.toHaveAttribute('style');
      expect(element?.className).not.toMatch(/(?:^| )(?:bg-|border|shadow|p-)/);
    }
    expect(container.querySelector('.eg-surface, .eg-section-head, .eg-title, .eg-eyebrow')).toBeNull();
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('uses semantic level %i without changing typography', (level) => {
    render(<PageHeader title='Projects' level={level} />);
    const heading = screen.getByRole('heading', { name: 'Projects', level });
    expect(heading.tagName).toBe(`H${level}`);
    expect(heading).toHaveClass('text-heading-small', 'text-fg-default');
  });

  it('preserves nonblank strings and renders the eyebrow paragraph before the title (AC-02)', () => {
    const { container } = render(<PageHeader title='  Projects  ' eyebrow='  Workspace  ' />);
    const paragraph = screen.getByText('Workspace');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph.textContent).toBe('  Workspace  ');
    expect(paragraph).toHaveClass('font-display', 'text-label-eyebrow', 'uppercase', 'text-fg-muted', 'm-0');
    expect(paragraph.nextElementSibling).toBe(screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('  Projects  ');
    expect(header(container).querySelector('svg')).toBeNull();
  });

  it.each([undefined, '', ' \n\t '])('omits an absent or blank eyebrow %j', (eyebrow) => {
    const { container } = render(<PageHeader title='Projects' eyebrow={eyebrow} />);
    expect(container.querySelector('p')).toBeNull();
    expect(header(container).firstElementChild?.children).toHaveLength(1);
  });

  it.each([undefined, null, false, true])('omits the action area for %j', (actions) => {
    const { container } = render(<PageHeader title='Projects' actions={actions} />);
    expect(header(container).children).toHaveLength(1);
    expect(screen.queryByRole('group')).toBeNull();
  });

  it.each(['', ' ', '\n\t'])('warns in development and omits the entire header for blank title %j (AC-03)', (title) => {
    vi.stubEnv('NODE_ENV', 'development');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const { container } = render(<PageHeader title={title} actions={<Button>Create project</Button>} />);
      expect(container).toBeEmptyDOMElement();
      expect(warning).toHaveBeenCalledWith(expect.stringMatching(/PageHeader.*title.*non-whitespace/i));
    } finally {
      warning.mockRestore();
    }
  });

  it('silently omits an invalid title in production and recovers on prop updates', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const { container, rerender } = render(<PageHeader title='Projects' />);
      rerender(<PageHeader title=' ' actions={<Button>Create project</Button>} />);
      expect(container).toBeEmptyDOMElement();
      expect(warning).not.toHaveBeenCalled();
      rerender(<PageHeader title='Archive' />);
      expect(screen.getByRole('heading', { name: 'Archive' })).toBeVisible();
    } finally {
      warning.mockRestore();
    }
  });

  it('renders a single Button unchanged without a group and preserves its ref and events (AC-04)', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <PageHeader
        title='Projects'
        actions={
          <Button ref={ref} onClick={click}>
            Create project
          </Button>
        }
      />
    );
    const button = screen.getByRole('button', { name: 'Create project' });
    const area = header(container).lastElementChild;
    expect(area?.tagName).toBe('DIV');
    expect(area).toHaveClass('min-w-0', 'max-w-full');
    expect(area).not.toHaveAttribute('role');
    expect(area?.children).toHaveLength(1);
    expect(area?.firstElementChild).toBe(button);
    expect(ref.current).toBe(button);
    expect(screen.queryByRole('group')).toBeNull();
    expect(button).toHaveAttribute('data-state', 'idle');
    await user.click(button);
    await user.keyboard('{Enter} ');
    expect(click).toHaveBeenCalledTimes(3);
  });

  it('keeps Button asChild link semantics and native attributes', async () => {
    const user = userEvent.setup();
    const click = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <PageHeader
        title='Projects'
        actions={
          <Button asChild={true}>
            <a href='/projects/new' onClick={click}>
              Create project
            </a>
          </Button>
        }
      />
    );
    const link = screen.getByRole('link', { name: 'Create project' });
    expect(link).toHaveAttribute('href', '/projects/new');
    expect(screen.queryByRole('button')).toBeNull();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('keeps one consumer-owned spaced group, direct children and individual tab stops in RTL (AC-04/06/07)', async () => {
    const user = userEvent.setup();
    const groupProps: ButtonGroupProps = {
      variant: 'spaced',
      label: 'Project actions',
      children: [
        <Button key='import' variant='secondary'>
          Import
        </Button>,
        <Button key='create'>Create project</Button>
      ]
    };
    const { container } = render(
      <main>
        <PageHeader title='Projects' dir='rtl' actions={createElement(ButtonGroup, groupProps)} />
      </main>
    );
    const group = screen.getByRole('group', { name: 'Project actions' });
    expect(screen.getAllByRole('group')).toHaveLength(1);
    expect(group).toHaveClass('eg-button-group', 'flex-wrap', 'gap-3');
    expect(group.parentElement).toBe(header(container).lastElementChild);
    expect([...group.children].map((child) => child.textContent)).toEqual(['Import', 'Create project']);
    expect(header(container)).toHaveAttribute('dir', 'rtl');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Import' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Create project' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Import' })).toHaveFocus();
  });

  it('leaves disabled/loading suppression and focus ownership to children across updates', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const actions = (
      <ButtonGroup>
        <Button disabled={true} onClick={click}>
          Import
        </Button>
        <Button loading={true} onClick={click}>
          Saving
        </Button>
        <Button onClick={click}>Create project</Button>
      </ButtonGroup>
    );
    const { rerender } = render(<PageHeader title='Projects' actions={actions} />);
    await user.tab();
    // Button loading suppresses activation but intentionally retains its native tab stop (D9).
    expect(screen.getByRole('button', { name: 'Saving' })).toHaveFocus();
    await user.tab();
    const enabled = screen.getByRole('button', { name: 'Create project' });
    expect(enabled).toHaveFocus();
    rerender(<PageHeader title='Updated projects' eyebrow='Workspace' actions={actions} />);
    expect(screen.getByRole('button', { name: 'Create project' })).toBe(enabled);
    expect(enabled).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Saving' })).toHaveAttribute('data-state', 'loading');
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Import' }));
    await user.click(screen.getByRole('button', { name: 'Saving' }));
    expect(click).not.toHaveBeenCalled();
  });

  it('forwards native attributes only to the root and merges supported sizing/margins without changing parts (AC-09/10)', async () => {
    const click = vi.fn();
    const { container } = render(
      <PageHeader
        title='Projects'
        id='page-heading'
        lang='en'
        aria-describedby='help'
        data-context='workspace'
        onClick={click}
        className='min-w-0 min-w-full w-full max-w-full mt-2 mt-4 self-start'
      />
    );
    const root = header(container);
    expect(root).toHaveClass('eg-page-header', 'min-w-full', 'w-full', 'max-w-full', 'mt-4', 'self-start', 'gap-x-6');
    expect(root).not.toHaveClass('min-w-0', 'mt-2');
    expect(root).toHaveAttribute('id', 'page-heading');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    expect(root).toHaveAttribute('data-context', 'workspace');
    expect(root).not.toHaveAttribute('title');
    const heading = screen.getByRole('heading');
    expect(heading).not.toHaveAttribute('id');
    expect(heading).not.toHaveAttribute('aria-describedby');
    expect(heading).not.toHaveClass('mt-4', 'min-w-full');
    await userEvent.click(root);
    expect(click).toHaveBeenCalledOnce();
  });

  it('preserves long unbroken titles without truncation or clipping (AC-05)', () => {
    const title = 'Projects'.repeat(100);
    const { container } = render(<PageHeader title={title} />);
    expect(screen.getByRole('heading').textContent).toBe(title);
    expect(screen.getByRole('heading')).toHaveClass('wrap-anywhere');
    expect(container.innerHTML).not.toMatch(/truncate|overflow-hidden|line-clamp/);
  });
});
