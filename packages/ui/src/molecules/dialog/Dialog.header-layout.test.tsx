import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Dialog, DialogContent } from '.';
import type { DialogContentProps } from './types';

type HeaderLayout = 'inline' | 'stacked';
/** Centres the lg dismiss (`--space-12`) on the title's first line below the header's `--space-4` padding. */
const DISMISS_TOP =
  'top-[calc(var(--space-4)+(var(--text-heading-small)*var(--text-heading-small--line-height)-var(--space-12))/2)]';

function Example({ headerLayout }: { headerLayout?: HeaderLayout }) {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        title='Settings'
        description='Adjust preferences.'
        statusText='Saved'
        headerLayout={headerLayout}
        actions={<button type='button'>Save</button>}
      >
        <input aria-label='Name' />
      </DialogContent>
    </Dialog>
  );
}

function headerParts() {
  const panel = screen.getByRole('dialog', { name: 'Settings', description: 'Adjust preferences.' });
  const header = panel.querySelector('header');
  if (!header) {
    throw new Error('Missing dialog header');
  }
  return {
    panel,
    header,
    title: within(header).getByRole('heading', { name: 'Settings' }),
    status: within(header).getByText('Saved'),
    description: within(header).getByText('Adjust preferences.'),
    dismiss: within(panel).getByRole('button', { name: 'Close' })
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

describe('Dialog sheet header opt-ins', () => {
  it.each(['inline', 'stacked'] as const)(
    'keeps the full title and description relationships with status and top actions in %s layout',
    (headerLayout) => {
      const title = 'A complete long title that wraps across lines without losing its accessible name';
      const props = {
        variant: 'sheet',
        title,
        description: 'The description remains associated.',
        statusText: 'Saved',
        headerLayout,
        titleOverflow: 'clamp',
        actionsPlacement: 'header',
        actions: <button type='button'>Apply</button>,
        children: <p>{title}</p>
      } as unknown as DialogContentProps;
      render(
        <Dialog defaultOpen={true}>
          <DialogContent {...props} />
        </Dialog>
      );
      const panel = screen.getByRole('dialog', { name: title, description: 'The description remains associated.' });
      const header = panel.querySelector('header');
      const heading = within(panel).getByRole('heading', { name: title });
      const description = within(panel).getByText('The description remains associated.');
      const action = within(panel).getByRole('button', { name: 'Apply' });
      expect(header).toContainElement(heading);
      expect(header).toContainElement(description);
      expect(header).toContainElement(within(panel).getByText('Saved'));
      expect(header).toContainElement(action);
      expect(heading).toHaveClass('line-clamp-2');
      expect(panel).toHaveAttribute('aria-labelledby', heading.id);
      expect(panel).toHaveAttribute('aria-describedby', description.id);
      expect(within(panel).getByText('Saved')).not.toHaveAttribute('aria-live');
      expect(panel.lastElementChild).toBe(within(panel).getByRole('button', { name: 'Close' }));
    }
  );
});

describe('Dialog header layout', () => {
  it('keeps the original inline markup and classes for omitted, explicit and invalid values', () => {
    const { rerender } = render(<Example />);
    const { panel, header, title, status, description } = headerParts();
    expect(header).toHaveClass(
      'eg-dialog__head',
      'relative',
      'shrink-0',
      'border-b-0',
      'py-[var(--space-4)]',
      'ps-[var(--space-6)]',
      'pe-[calc(var(--space-4)+var(--space-12))]',
      'flex',
      'items-baseline-last',
      'gap-[var(--space-2)]'
    );
    expect(header.children).toHaveLength(3);
    expect(Array.from(header.children)).toEqual([title, status, description]);
    expect(header).not.toHaveClass('flex-col');
    expect(panel).not.toHaveAttribute('headerlayout');
    const baseline = headerStructure(header);

    rerender(<Example headerLayout='inline' />);
    expect(headerStructure(headerParts().header)).toEqual(baseline);
    expect(headerParts().panel).not.toHaveAttribute('headerlayout');

    // Simulate an untyped consumer; the documented TypeScript union rejects this value.
    rerender(<Example headerLayout={'invalid' as unknown as HeaderLayout} />);
    expect(headerStructure(headerParts().header)).toEqual(baseline);
    expect(headerParts().panel).not.toHaveAttribute('headerlayout');
  });

  it('places the description below a title and status row in stacked layout', () => {
    render(<Example headerLayout='stacked' />);
    const { panel, header, title, status, description } = headerParts();
    const titleRow = title.parentElement;
    expect(header).toHaveClass('flex', 'flex-col');
    expect(titleRow).not.toBe(header);
    expect(titleRow).toHaveClass('flex', 'items-baseline-last');
    expect(titleRow).not.toHaveClass('items-center');
    expect(titleRow).toContainElement(status);
    expect(title.nextElementSibling).toBe(status);
    expect(titleRow?.parentElement).toBe(header);
    expect(titleRow?.nextElementSibling).toBe(description);
    expect(panel).not.toHaveAttribute('headerlayout');
  });

  it('preserves accessible relationships, dismiss placement and focus order in both layouts', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example headerLayout='inline' />);
    const first = headerParts();
    const titleId = first.panel.getAttribute('aria-labelledby');
    const descriptionId = first.panel.getAttribute('aria-describedby');
    expect(titleId).toBe(first.title.id);
    expect(descriptionId).toBe(first.description.id);
    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();
    if (!titleId || !descriptionId) {
      throw new Error('Missing dialog title or description relationship');
    }
    expect(first.dismiss).toHaveClass('absolute', DISMISS_TOP, 'end-[var(--space-4)]');
    expect(first.panel.lastElementChild).toBe(first.dismiss);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();

    for (const headerLayout of ['inline', 'stacked'] as const) {
      rerender(<Example headerLayout={headerLayout} />);
      const { panel, title, description, dismiss } = headerParts();
      expect(panel).toHaveAttribute('aria-labelledby', titleId);
      expect(panel).toHaveAttribute('aria-describedby', descriptionId);
      expect(title.id).toBe(titleId);
      expect(description.id).toBe(descriptionId);
      expect(dismiss).toBe(first.dismiss);
      expect(panel.lastElementChild).toBe(dismiss);
      expect(dismiss).toHaveClass('absolute', DISMISS_TOP, 'end-[var(--space-4)]');
      await user.tab();
      expect(within(panel).getByRole('button', { name: 'Save' })).toHaveFocus();
      await user.tab();
      expect(dismiss).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
    }
  });

  it('keeps omitted descriptions optional and limits the public layout values', () => {
    expectTypeOf<DialogContentProps['headerLayout']>().toEqualTypeOf<HeaderLayout | undefined>();
    const { rerender } = render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Information' headerLayout='stacked'>
          Body
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog', { name: 'Information' })).not.toHaveAttribute('aria-describedby');
    rerender(
      <Dialog defaultOpen={true}>
        <DialogContent title='Information' description='More details' headerLayout='stacked'>
          Body
        </DialogContent>
      </Dialog>
    );
    const panel = screen.getByRole('dialog', { name: 'Information', description: 'More details' });
    const title = within(panel).getByRole('heading', { name: 'Information' });
    const header = panel.querySelector('header');
    expect(title.parentElement?.parentElement).toBe(header);
    expect(title.parentElement?.nextElementSibling).toBe(within(panel).getByText('More details'));
    expect(header?.querySelector('.eg-dialog__status')).toBeNull();
  });

  it('separates the description by --space-2 without inherited margins in every layout', () => {
    const { rerender } = render(<Example />);
    for (const headerLayout of [undefined, 'inline', 'stacked'] as const) {
      rerender(<Example headerLayout={headerLayout} />);
      const { header, title, description, dismiss } = headerParts();
      expect(header).toHaveClass('gap-[var(--space-2)]');
      expect(header).not.toHaveClass('gap-[var(--space-3)]');
      expect(title).toHaveClass('m-0');
      expect(description).toHaveClass('m-0');
      expect(dismiss).toHaveClass(DISMISS_TOP);
      expect(dismiss).not.toHaveClass('top-[var(--space-4)]');
    }
  });

  it('aligns inline description and status to the last title baseline', () => {
    const { rerender } = render(<Example />);
    for (const headerLayout of [undefined, 'inline'] as const) {
      rerender(<Example headerLayout={headerLayout} />);
      const { header } = headerParts();
      expect(header).toHaveClass('flex', 'items-baseline-last');
      expect(header).not.toHaveClass('items-center');
    }
    rerender(<Example headerLayout='stacked' />);
    const stacked = headerParts();
    expect(stacked.header).toHaveClass('items-start');
    expect(stacked.header).not.toHaveClass('items-baseline-last');
    expect(stacked.title.parentElement).toHaveClass('items-baseline-last');
  });

  it('lets the stacked status follow the title row last baseline', () => {
    render(<Example headerLayout='stacked' />);
    const { title, status } = headerParts();
    expect(title.parentElement).toHaveClass('items-baseline-last');
    expect(status.parentElement).toBe(title.parentElement);
    expect(status).not.toHaveClass('self-start');
  });
});
