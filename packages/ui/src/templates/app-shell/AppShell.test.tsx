import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TabBar } from '../../organisms/tab-bar';
import { AppShell } from './AppShell';

class ResizeObserverMock {
  observe() {
    /* jsdom has no layout observer */
  }
  unobserve() {
    /* jsdom has no layout observer */
  }
  disconnect() {
    /* jsdom has no layout observer */
  }
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const tabBar = (
  <TabBar
    label='Primary'
    items={[
      { id: 'home', label: 'Home', href: '#home', icon: 'compass', 'aria-current': 'page' },
      { id: 'settings', label: 'Settings', href: '#settings', icon: 'settings' }
    ]}
  />
);

const side = (
  <div>
    <nav aria-label='Workspace'>
      <a href='#home' aria-current='page'>
        Home
      </a>
    </nav>
  </div>
);

afterEach(() => {
  window.location.hash = '';
  vi.restoreAllMocks();
});

describe('AppShell', () => {
  it('renders one main landmark inside an unroled root, skip row, body and bottom regions in that order', () => {
    const { container } = render(
      <AppShell sideNavigation={side} bottomNavigation={tabBar}>
        <h1>Content</h1>
      </AppShell>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-app-shell');
    expect(root).not.toHaveAttribute('role');
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    const [skipRow, body, bottom] = [...root.children] as [HTMLElement, HTMLElement, HTMLElement];
    expect(skipRow.tagName).toBe('DIV');
    expect(body).toContainElement(screen.getByRole('main'));
    expect(bottom).toContainElement(screen.getByRole('navigation', { name: 'Primary' }));
    expect(within(root).getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Content' }));
    expect(screen.queryByRole('banner')).toBeNull();
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.queryByRole('contentinfo')).toBeNull();
    expect(screen.getAllByRole('navigation').map((element) => element.getAttribute('aria-label'))).toEqual([
      'Workspace',
      'Primary'
    ]);
  });

  it('switches regions only when both navigation slots are supplied', () => {
    const { container, rerender } = render(
      <AppShell sideNavigation={side} bottomNavigation={tabBar}>
        <p>Content</p>
      </AppShell>
    );
    const parts = (): [HTMLElement, HTMLElement, HTMLElement] =>
      [...(container.firstElementChild as HTMLElement).children] as [HTMLElement, HTMLElement, HTMLElement];
    expect(parts()[0]).toHaveClass('sr-only', 'focus-within:not-sr-only', 'hidden', 'min-[56rem]:block');
    expect(parts()[1].firstElementChild).toHaveClass(
      'sticky',
      'top-0',
      'h-dvh',
      'self-start',
      'shrink-0',
      'max-[56rem]:hidden'
    );
    expect(parts()[2]).toHaveClass('sticky', 'bottom-0', 'min-[56rem]:hidden');
    expect(screen.getByRole('main')).toHaveClass('min-w-0', 'flex-1', 'focus:outline-none');

    rerender(
      <AppShell sideNavigation={side}>
        <p>Content</p>
      </AppShell>
    );
    const sideOnly = (): [HTMLElement, HTMLElement] =>
      [...(container.firstElementChild as HTMLElement).children] as [HTMLElement, HTMLElement];
    expect(sideOnly()[1].firstElementChild).toHaveClass('sticky', 'h-dvh');
    expect(sideOnly()[1].firstElementChild).not.toHaveClass('max-[56rem]:hidden');
    expect(sideOnly()[1]).toContainElement(screen.getByRole('main'));

    rerender(
      <AppShell bottomNavigation={tabBar}>
        <p>Content</p>
      </AppShell>
    );
    const bottomOnly = (): [HTMLElement, HTMLElement] =>
      [...(container.firstElementChild as HTMLElement).children] as [HTMLElement, HTMLElement];
    expect(bottomOnly()[0]).toContainElement(screen.getByRole('main'));
    expect(bottomOnly()[1]).toHaveClass('sticky', 'bottom-0');
    expect(bottomOnly()[1]).not.toHaveClass('min-[56rem]:hidden');
    expect(screen.queryByRole('link', { name: 'Skip to content' })).toBeNull();

    rerender(
      <AppShell>
        <p>Content</p>
      </AppShell>
    );
    expect((container.firstElementChild as HTMLElement).children).toHaveLength(1);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.queryAllByRole('navigation')).toHaveLength(0);
    expect(screen.queryByRole('link', { name: 'Skip to content' })).toBeNull();
  });

  it('renders a localized skip link only with side navigation and moves focus without touching the URL', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <AppShell sideNavigation={side} bottomNavigation={tabBar} messages={{ skipToContent: 'Saltar al contenido' }}>
        <p>Content</p>
      </AppShell>
    );
    const skip = screen.getByRole('link', { name: 'Saltar al contenido' });
    const main = screen.getByRole('main');
    expect(skip).toHaveAttribute('href', `#${main.id}`);
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(skip.closest('div')).toHaveClass('sr-only', 'focus-within:not-sr-only');
    await user.click(skip);
    expect(main).toHaveFocus();
    expect(window.location.hash).toBe('');
    unmount();

    render(
      <AppShell sideNavigation={side}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveClass('eg-btn');
  });

  it('gives each instance a unique main id and honors tab-to-focus order without js state', async () => {
    window.matchMedia = vi.fn(() => {
      throw new Error('AppShell must not read matchMedia');
    }) as unknown as typeof window.matchMedia;
    const addListener = vi.spyOn(window, 'addEventListener');
    const observe = vi.spyOn(ResizeObserverMock.prototype, 'observe');
    const { unmount } = render(
      <AppShell sideNavigation={side}>
        <p>One</p>
      </AppShell>
    );
    const firstId = screen.getByRole('main').id;
    unmount();
    render(
      <AppShell sideNavigation={side}>
        <p>Two</p>
      </AppShell>
    );
    expect(screen.getByRole('main').id).not.toBe(firstId);
    expect(addListener).not.toHaveBeenCalled();
    expect(observe).not.toHaveBeenCalled();
  });

  it('keeps the public marker and supported layout merge last while protecting owned semantics', () => {
    const { container } = render(
      <AppShell
        sideNavigation={side}
        className='min-h-full m-4'
        {...({ role: 'main', dangerouslySetInnerHTML: { __html: 'nope' } } as object)}
        data-test='shell'
      >
        <p>Content</p>
      </AppShell>
    );
    const root = container.firstElementChild as HTMLElement;
    // twMerge resolves the recognized min-height group: the consumer's layout utility replaces the
    // contract default, while the public marker is retained.
    expect(root).toHaveClass('eg-app-shell', 'min-h-full', 'm-4');
    expect(root).not.toHaveClass('min-h-dvh');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('data-test', 'shell');
    expect(root.textContent).toContain('Content');
    expect(root.innerHTML).not.toContain('nope');
  });

  it('owns no containment, stacking, motion or paint beyond the token canvas', () => {
    const { container } = render(
      <AppShell sideNavigation={side} bottomNavigation={tabBar}>
        <p>Content</p>
      </AppShell>
    );
    const root = container.firstElementChild as HTMLElement;
    const body = root.children[1] as HTMLElement;
    const owned = [root, root.children[0] as HTMLElement, body, ...([...body.children] as HTMLElement[])];
    const classes = owned.flatMap((element) => [...element.classList]);
    for (const forbidden of [
      /^contain-/,
      /^transform/,
      /^translate-/,
      /^filter$/,
      /^isolate$/,
      /^z-/,
      /^transition/,
      /^duration-/,
      /^animate-/,
      /^bg-(?!bg-canvas)/,
      /^border$/,
      /^shadow-/,
      /^opacity-/
    ]) {
      expect(classes.filter((name) => forbidden.test(name))).toEqual([]);
    }
    expect(container.firstElementChild).toHaveClass('bg-bg-canvas', 'text-fg-default', 'font-sans');
  });
});
