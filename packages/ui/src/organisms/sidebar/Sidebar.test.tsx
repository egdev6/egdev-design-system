import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavList } from '../../molecules/nav-list';
import { Sidebar } from './Sidebar';

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

describe('Sidebar', () => {
  it('composes labelled navigation, consumer identity and footer without its own landmark or route logic', () => {
    const { container } = render(
      <Sidebar
        product={{ name: 'Workspace', node: <span>W</span>, href: '/home' }}
        footer={<button type='button'>Account</button>}
      >
        <NavList label='Primary' items={[{ id: 'home', label: 'Home', href: '/home', 'aria-current': 'page' }]} />
        <NavList label='Secondary' items={[]} />
      </Sidebar>
    );
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-sidebar', 'h-full', 'w-64');
    expect(screen.getAllByRole('navigation')).toHaveLength(2);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Secondary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute('href', '/home');
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
    expect(within(root as HTMLElement).queryByRole('button', { name: /collapse/i })).toBeNull();
  });

  it('omits absent and invalid identity and absent footer, while preserving supplied content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      /* suppress expected warning */
    });
    const { container, rerender } = render(
      <Sidebar>
        <a href='/a'>A</a>
      </Sidebar>
    );
    expect(screen.getByRole('link', { name: 'A' })).toBeInTheDocument();
    expect(container.querySelector('header, footer')).toBeNull();
    rerender(<Sidebar product={{ name: ' ', node: <span>W</span> }}>Body</Sidebar>);
    expect(screen.queryByText('W')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('keeps a decorative consumer image out of the home link name and orders the footer after scrolling content', () => {
    const { container } = render(
      <Sidebar
        product={{ name: 'Workspace', href: '/home', node: <img src='/logo.svg' alt='Extra artwork' /> }}
        footer={<button type='button'>Account</button>}
      >
        <a href='/body'>Body</a>
      </Sidebar>
    );
    const link = screen.getByRole('link', { name: 'Workspace' });
    expect(link).toHaveAttribute('href', '/home');
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.textContent?.match(/Workspace/g)).toHaveLength(1);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(3);
    expect(root.children[1]).toHaveClass('relative', 'min-h-0', 'flex-1', 'overflow-hidden');
    expect(root.children[1]).toContainElement(screen.getByRole('link', { name: 'Body' }));
    expect(root.children[2]).toContainElement(screen.getByRole('button', { name: 'Account' }));
  });

  it('renders a passive product name once without creating a home link', () => {
    render(<Sidebar product={{ name: 'Workspace', node: <span>W</span> }}>Body</Sidebar>);
    expect(screen.getByText('Workspace')).toBeVisible();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('W').closest('[aria-hidden=true]')).toBeInTheDocument();
  });

  it('uses a non-tabbable Radix viewport and supports layout classes and native attributes', () => {
    const { container } = render(
      <Sidebar className='w-80' dir='rtl' data-example='yes'>
        Body
      </Sidebar>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('eg-sidebar', 'w-80');
    expect(root).not.toHaveClass('w-64');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('data-example', 'yes');
    const viewport = container.querySelector('[data-radix-scroll-area-viewport]');
    expect(viewport).toBeInTheDocument();
    expect(viewport).not.toHaveAttribute('tabindex');
  });
});
