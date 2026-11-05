import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SectionShell } from '../../templates/section-shell';
import { WebSection } from './index';

describe('WebSection', () => {
  it('renders supplied slots in order without injected semantics or placeholders', () => {
    const { container, rerender } = render(
      <WebSection
        header={<h2>Heading</h2>}
        media={<a href='#media'>Media</a>}
        body={<p>Body</p>}
        actions={<button>Action</button>}
        social={<a href='#social'>Social</a>}
      />
    );
    const root = container.querySelector('.eg-web-section');
    expect(root?.textContent).toBe('HeadingMediaBodyActionSocial');
    expect(root?.children).toHaveLength(5);
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root?.querySelector('[aria-hidden], [role], [tabindex]')).toBeNull();
    rerender(<WebSection body={<p>Only body</p>} />);
    expect(root?.children).toHaveLength(1);
    expect(root?.textContent).toBe('Only body');
  });

  it('omits each null or undefined slot without an empty wrapper', () => {
    const { container } = render(
      <WebSection header={null} media={undefined} body={null} actions={undefined} social={null} />
    );
    expect(container.querySelector('.eg-web-section')?.children).toHaveLength(0);
  });

  it('rejects protected native inputs while forwarding compatible attributes', () => {
    const unsafe = {
      id: 'wrong',
      role: 'navigation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: '<b>wrong</b>' },
      children: 'wrong'
    };
    const { container } = render(
      <WebSection
        {...unsafe}
        body={<p>Body</p>}
        dir='rtl'
        data-owner='host'
        aria-label='Host label'
        className='mt-4 mt-8'
      />
    );
    const root = container.querySelector('.eg-web-section');
    for (const attribute of ['id', 'role', 'style']) {
      expect(root).not.toHaveAttribute(attribute);
    }
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveAttribute('aria-label', 'Host label');
    expect(root).toHaveClass('mt-8');
    expect(root).not.toHaveClass('mt-4');
    expect(root?.textContent).toBe('Body');
  });

  it('keeps interactive media and actions in native keyboard order', async () => {
    const user = userEvent.setup();
    let count = 0;
    render(
      <WebSection
        media={<a href='#media'>Media</a>}
        actions={
          <button
            onClick={() => {
              count += 1;
            }}
          >
            Action
          </button>
        }
      />
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Media' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(count).toBe(1);
  });

  it('lets each host label its own section and preserves register and native placement', () => {
    const { container } = render(
      <>
        <SectionShell register='show' aria-labelledby='first'>
          <WebSection header={<h2 id='first'>First</h2>} className='mt-4 mt-8' data-owner='host' />
        </SectionShell>
        <SectionShell aria-labelledby='second'>
          <WebSection header={<h2 id='second'>Second</h2>} />
        </SectionShell>
      </>
    );
    expect(screen.getByRole('region', { name: 'First' })).toHaveClass('bg-[image:var(--gradient-section-show)]');
    expect(screen.getByRole('region', { name: 'Second' })).toBeInTheDocument();
    const root = container.querySelector('.eg-web-section');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveClass('mt-8');
    expect(root).not.toHaveClass('mt-4');
    expect(root).not.toHaveAttribute('id');
  });
});
