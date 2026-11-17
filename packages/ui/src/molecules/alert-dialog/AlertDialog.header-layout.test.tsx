import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from '.';
import type { AlertDialogContentProps } from './types';

type HeaderLayout = 'inline' | 'stacked';

function Example({ headerLayout }: { headerLayout?: HeaderLayout }) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent
        title='Disconnect?'
        description='Access will be removed.'
        tone='danger'
        headerLayout={headerLayout}
        actions={
          <>
            <AlertDialogCancel>Keep connected</AlertDialogCancel>
            <AlertDialogAction>Disconnect</AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  );
}

function headerParts() {
  const panel = screen.getByRole('alertdialog', { name: 'Disconnect?', description: 'Access will be removed.' });
  const header = panel.querySelector('header');
  if (!header) {
    throw new Error('Missing alert dialog header');
  }
  return {
    panel,
    header,
    title: within(header).getByRole('heading', { name: 'Disconnect?' }),
    description: within(header).getByText('Access will be removed.'),
    cancel: within(panel).getByRole('button', { name: 'Keep connected' }),
    action: within(panel).getByRole('button', { name: 'Disconnect' })
  };
}

function headerStructure(header: HTMLElement) {
  return {
    className: header.className,
    children: Array.from(header.children, (child) => ({
      tagName: child.tagName,
      className: child.className,
      text: child.textContent
    }))
  };
}

describe('AlertDialog header layout', () => {
  it('keeps the original stacked markup and classes for omitted, explicit and invalid values', () => {
    const { rerender } = render(<Example />);
    const { panel, header, title, description } = headerParts();
    const titleRow = title.parentElement;
    expect(header).toHaveClass(
      'eg-alert-dialog__head',
      'flex',
      'flex-col',
      'gap-[var(--space-2)]',
      'px-[var(--space-6)]',
      'pt-[var(--space-6)]',
      'pb-[var(--space-4)]'
    );
    expect(header.children).toHaveLength(2);
    expect(titleRow).toHaveClass('flex', 'items-center', 'gap-[var(--space-3)]');
    expect(Array.from(header.children)).toEqual([titleRow, description]);
    expect(titleRow?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(panel).not.toHaveAttribute('headerlayout');
    const baseline = headerStructure(header);

    rerender(<Example headerLayout='stacked' />);
    expect(headerStructure(headerParts().header)).toEqual(baseline);
    expect(headerParts().panel).not.toHaveAttribute('headerlayout');

    // Simulate an untyped consumer; the documented TypeScript union rejects this value.
    rerender(<Example headerLayout={'invalid' as unknown as HeaderLayout} />);
    expect(headerStructure(headerParts().header)).toEqual(baseline);
    expect(headerParts().panel).not.toHaveAttribute('headerlayout');
  });

  it('puts the title row and description side by side in inline layout', () => {
    render(<Example headerLayout='inline' />);
    const { panel, header, title, description } = headerParts();
    const titleRow = title.parentElement;
    expect(header).toHaveClass('flex', 'flex-row', 'items-center');
    expect(header).not.toHaveClass('flex-col');
    expect(titleRow).toHaveClass('flex', 'items-center', 'gap-[var(--space-3)]');
    expect(titleRow?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(titleRow?.parentElement).toBe(header);
    expect(titleRow?.nextElementSibling).toBe(description);
    expect(panel).not.toHaveAttribute('headerlayout');
  });

  it('preserves accessible relationships and Cancel/action focus order in both layouts', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example headerLayout='stacked' />);
    const first = headerParts();
    const titleId = first.panel.getAttribute('aria-labelledby');
    const descriptionId = first.panel.getAttribute('aria-describedby');
    expect(titleId).toBe(first.title.id);
    expect(descriptionId).toBe(first.description.id);
    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    if (!titleId || !descriptionId) {
      throw new Error('Missing alert dialog title or description relationship');
    }
    expect(first.cancel).toHaveFocus();

    for (const headerLayout of ['stacked', 'inline'] as const) {
      rerender(<Example headerLayout={headerLayout} />);
      const { panel, title, description, cancel, action } = headerParts();
      expect(panel).toHaveAttribute('aria-labelledby', titleId);
      expect(panel).toHaveAttribute('aria-describedby', descriptionId);
      expect(title.id).toBe(titleId);
      expect(description.id).toBe(descriptionId);
      expect(cancel).toBe(first.cancel);
      expect(action).toBe(first.action);
      expect(within(panel).getAllByRole('button')).toEqual([cancel, action]);
      await user.tab();
      expect(action).toHaveFocus();
      await user.tab();
      expect(cancel).toHaveFocus();
    }
  });

  it('limits the public layout values', () => {
    expectTypeOf<AlertDialogContentProps['headerLayout']>().toEqualTypeOf<HeaderLayout | undefined>();
  });
});
