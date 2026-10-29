import { fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Icon } from '../../atoms/icon';
import { SocialLinks } from './SocialLinks';
import type { SocialLinkItem } from './types';
import { useSocialLinks } from './useSocialLinks';

const item = (overrides: Partial<SocialLinkItem> = {}): SocialLinkItem => ({
  id: 'github',
  href: 'https://github.com/example',
  label: 'GitHub profile',
  icon: <Icon name='github' />,
  ...overrides
});
afterEach(() => vi.restoreAllMocks());

describe('SocialLinks public contract', () => {
  it('renders a named native list with direct entries, atomic links and a separate caption', () => {
    render(<SocialLinks items={[item()]} />);
    const list = screen.getByRole('list', { name: 'Social profiles' });
    const entry = within(list).getByRole('listitem');
    const link = within(entry).getByRole('link', { name: 'GitHub profile' });
    expect(list.tagName).toBe('UL');
    expect(entry.parentElement).toBe(list);
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://github.com/example');
    expect(link).toHaveClass('eg-icon-btn', 'size-12');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(link).not.toHaveAttribute('aria-label');
    expect(link.querySelector('.eg-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('GitHub profile')).toBeInTheDocument();
    expect(screen.getByText('Follow me')).toHaveClass('eg-social__label');
    expect(list).toHaveClass('eg-social__list', 'eg-cluster', 'gap-2', 'flex-wrap');
    expect(list.parentElement).toHaveClass('eg-social', 'eg-stack', 'gap-3');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('derives layout and atom defaults through the meaningful hook', () => {
    const { result } = renderHook(() => useSocialLinks({ items: [item()] }));
    expect(result.current.layoutProps).toMatchObject({ gap: 3, asChild: true });
    expect(result.current.listProps).toMatchObject({ role: 'list', 'aria-label': 'Social profiles' });
    expect(result.current.items[0]?.buttonProps).toMatchObject({ variant: 'outline', size: 'lg', asChild: true });
  });

  it('merges external rel case-insensitively and includes exactly one localized notice', () => {
    render(
      <SocialLinks
        newTabText='(new window)'
        items={[
          item({ external: true, rel: 'me NOOPENER me nofollow noreferrer NoFoLlOw' }),
          item({ id: 'local', label: 'Same context', rel: 'me', external: false })
        ]}
      />
    );
    const external = screen.getByRole('link', { name: 'GitHub profile (new window)' });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'me NOOPENER nofollow noreferrer');
    expect(external).not.toHaveAttribute('aria-describedby');
    expect(screen.getAllByText('GitHub profile (new window)')).toHaveLength(1);
    const same = screen.getByRole('link', { name: 'Same context' });
    expect(same).not.toHaveAttribute('target');
    expect(same).toHaveAttribute('rel', 'me');
  });

  it('adds secure rel and a default new-context notice only for explicit external entries', () => {
    render(<SocialLinks items={[item({ external: true })]} />);
    expect(screen.getByRole('link', { name: 'GitHub profile (opens in a new tab)' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
  });

  it('falls back with development warnings for blank list names and notices', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<SocialLinks label='  ' newTabText=' ' items={[item({ external: true })]} />);
    expect(screen.getByRole('list', { name: 'Social profiles' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub profile (opens in a new tab)' })).toBeInTheDocument();
    expect(warning).toHaveBeenCalledTimes(2);
  });

  it.each([null, '', '  '])('omits caption %j without losing the list name or reserving a caption node', (caption) => {
    const { container } = render(<SocialLinks caption={caption} label='Find us' items={[item()]} />);
    expect(screen.getByRole('list', { name: 'Find us' })).toBeInTheDocument();
    expect(container.querySelector('.eg-social__label')).toBeNull();
    expect(container.querySelector('.eg-social')?.children).toHaveLength(1);
  });

  it('preserves meaningful caption and item label text, trimming only the destination', () => {
    render(
      <SocialLinks
        caption='  Follow the project  '
        items={[item({ label: '  Project GitHub  ', href: ' https://github.com/example ' })]}
      />
    );
    expect(screen.getByText('Follow the project').textContent).toBe('  Follow the project  ');
    expect(screen.getByText('Project GitHub').textContent).toBe('  Project GitHub  ');
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com/example');
  });

  it.each([
    '',
    ' ',
    '/profile',
    '#profile',
    '//example.org/profile',
    'http://example.org',
    'javascript:alert(1)',
    'data:text/html,hello',
    'mailto:hello@example.org',
    'https://user:pass@example.org',
    'https://user@example.org',
    'https://',
    'https://exa\nmple.org',
    '\thttps://example.org',
    'https://example.org/\u007f'
  ])('rejects invalid destination %j with a development warning and no orphan root', (href) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(<SocialLinks items={[item({ href })]} />);
    expect(container).toBeEmptyDOMElement();
    expect(warning).toHaveBeenCalled();
  });

  it('skips blank ids/names and later duplicates, including an invalid first occurrence', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <SocialLinks
        items={[
          item({ id: ' ' }),
          item({ id: 'reserved', href: 'http://invalid.example' }),
          item({ id: 'reserved', label: 'Duplicate' }),
          item({ id: 'blank-name', label: ' ' }),
          item(),
          item({ label: 'Later duplicate' }),
          item({ id: 'last', label: 'Last profile' })
        ]}
      />
    );
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['GitHub profile', 'Last profile']);
    expect(warning).toHaveBeenCalledTimes(5);
  });

  it('renders nothing for empty data and supports more than six valid profiles', () => {
    const { container, rerender } = render(<SocialLinks items={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(
      <SocialLinks
        items={Array.from({ length: 8 }, (_, index) => item({ id: String(index), label: `Profile ${index}` }))}
      />
    );
    expect(screen.getAllByRole('link')).toHaveLength(8);
  });

  it('preserves keyed link identity, focus and input order through rerenders', async () => {
    const user = userEvent.setup();
    const first = item();
    const second = item({ id: 'second', label: 'Second profile' });
    const { rerender } = render(<SocialLinks items={[first, second]} />);
    await user.tab();
    const link = screen.getByRole('link', { name: first.label });
    expect(link).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: second.label })).toHaveFocus();
    await user.tab({ shift: true });
    rerender(<SocialLinks dir='rtl' items={[second, { ...first, href: 'https://github.com/updated' }]} />);
    expect(screen.getByRole('link', { name: first.label })).toBe(link);
    expect(link).toHaveFocus();
    expect(screen.getAllByRole('link')[1]).toBe(link);
  });

  it('observes native navigation events without cancellation or button-style Space activation', async () => {
    const user = userEvent.setup();
    const events: boolean[] = [];
    const onClick = vi.fn((event: MouseEvent<HTMLDivElement>) => {
      events.push(event.defaultPrevented);
      // The consumer, not SocialLinks, cancels navigation in this JSDOM test.
      event.preventDefault();
    });
    render(
      <SocialLinks
        items={[item()]}
        onClick={onClick}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) => events.push(event.defaultPrevented)}
      />
    );
    const link = screen.getByRole('link');
    await user.tab();
    await user.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    await user.click(link);
    fireEvent.click(link, { ctrlKey: true });
    expect(fireEvent.mouseDown(link, { button: 1 })).toBe(true);
    fireEvent.contextMenu(link);
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(events).toEqual([false, false, false, false]);
    expect(link).not.toHaveAttribute('tabindex');
    expect(link).not.toHaveAttribute('aria-pressed');
    expect(link).not.toHaveAttribute('data-state');
  });

  it('delegates inline layout, dense ghost sizing and token gaps without modifier classes', () => {
    render(<SocialLinks items={[item()]} inline={true} size='md' variant='ghost' gap={1} />);
    const list = screen.getByRole('list');
    expect(list.parentElement).toHaveClass('eg-cluster', 'flex-row', 'flex-wrap', 'gap-4', 'items-center');
    expect(list).toHaveClass('gap-1');
    expect(screen.getByRole('link')).toHaveClass('size-10');
    expect(list.parentElement?.className).not.toMatch(/eg-social--/);
  });

  it('forwards native root attributes only, supports outer sizing and keeps keys out of DOM ids', () => {
    render(<SocialLinks items={[item()]} id='profiles' dir='rtl' data-region='footer' className='max-w-48 mx-auto' />);
    const list = screen.getByRole('list');
    expect(list.parentElement).toHaveAttribute('id', 'profiles');
    expect(list.parentElement).toHaveAttribute('dir', 'rtl');
    expect(list.parentElement).toHaveAttribute('data-region', 'footer');
    expect(list.parentElement).toHaveClass('eg-social', 'min-w-0', 'max-w-48', 'mx-auto');
    expect(screen.getByRole('link')).not.toHaveAttribute('id');
    expect(screen.getByRole('listitem')).not.toHaveAttribute('id');
    expect(list).not.toHaveAttribute('data-region');
  });

  it('validates and renders on the server without browser-origin inference', () => {
    const html = renderToString(<SocialLinks items={[item({ external: true })]} />);
    expect(html).toContain('role="list"');
    expect(html).toContain('GitHub profile (opens in a new tab)');
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain('<button');
  });
});
