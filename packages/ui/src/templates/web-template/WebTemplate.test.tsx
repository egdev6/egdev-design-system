import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { WebTemplate } from './index';

describe('WebTemplate', () => {
  it('orders the supplied landmarks, owns one main and reserves header clearance', () => {
    const { container } = render(
      <WebTemplate topBar={<header>Header</header>} content={<p>Content</p>} footer={<footer>Footer</footer>} />
    );
    const root = container.querySelector('.eg-web-template');
    expect(root?.children).toHaveLength(4);
    expect(root?.children[1]).toHaveClass('min-h-[var(--nav-height)]');
    expect(root?.children[1]?.firstElementChild?.tagName).toBe('HEADER');
    expect(root?.children[2]?.tagName).toBe('MAIN');
    expect(root?.children[3]?.tagName).toBe('FOOTER');
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('main')).not.toHaveClass('pt-14');
  });
  it('omits nullish header hosts but treats false as supplied', () => {
    const { container, rerender } = render(<WebTemplate content='Content' />);
    const root = container.querySelector('.eg-web-template');
    expect(root?.children).toHaveLength(2);
    rerender(<WebTemplate topBar={null} footer={null} content='Content' />);
    expect(root?.children).toHaveLength(2);
    rerender(<WebTemplate topBar={false} content='Content' />);
    expect(root?.children).toHaveLength(3);
    expect(root?.children[1]).toHaveClass('min-h-[var(--nav-height)]');
  });
  it('gives each skip link a unique target, localized label and focus behavior', async () => {
    const user = userEvent.setup();
    render(
      <>
        <WebTemplate content='One' />
        <WebTemplate messages={{ skipToContent: 'Jump to content' }} content='Two' />
      </>
    );
    const mains = screen.getAllByRole('main');
    const first = screen.getByRole('link', { name: 'Skip to content' });
    const second = screen.getByRole('link', { name: 'Jump to content' });
    expect(mains[0]?.id).not.toBe(mains[1]?.id);
    expect(first).toHaveAttribute('href', `#${mains[0]?.id}`);
    expect(second).toHaveAttribute('href', `#${mains[1]?.id}`);
    await user.click(second);
    expect(mains[1]).toHaveFocus();
  });
  it('forwards safe native props and discards protected ones', () => {
    const unsafe = {
      role: 'navigation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'wrong' },
      children: 'wrong'
    };
    const { container } = render(
      <WebTemplate {...unsafe} content={<p>Content</p>} id='host' data-owner='host' className='mt-4 mt-8' />
    );
    const root = container.querySelector('.eg-web-template');
    expect(root).toHaveAttribute('id', 'host');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('style');
    expect(root).toHaveClass('mt-8');
    expect(root).not.toHaveClass('mt-4');
    expect(within(root as HTMLElement).queryByText('wrong')).toBeNull();
  });
});
