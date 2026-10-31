import { render, renderHook, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { FieldMessage } from './FieldMessage';
import type { FieldMessageProps, FieldMessageTone } from './types';
import { useFieldMessage } from './useFieldMessage';

const cases = [
  ['description', 'text-fg-muted', undefined],
  ['info', 'text-status-info', 'info'],
  ['warning', 'text-status-warning', 'alert'],
  ['success', 'text-status-success', 'circle-check'],
  ['error', 'text-status-danger', 'circle-alert']
] as const;

describe('FieldMessage', () => {
  it('defaults to a neutral paragraph without an icon, live region or state', () => {
    const { container } = render(
      <FieldMessage id='help' className='mt-2' data-source='consumer'>
        Additional context
      </FieldMessage>
    );
    const root = container.querySelector('p');
    expect(root).toHaveClass('eg-field-message', 'text-fg-muted', 'mt-2');
    expect(root).toHaveAttribute('id', 'help');
    expect(root).toHaveAttribute('data-source', 'consumer');
    expect(root).toHaveTextContent('Additional context');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
    expect(root).not.toHaveAttribute('data-state');
    expect(root?.querySelector('svg')).toBeNull();
  });

  it.each(cases)('renders %s with its token color and derived decorative glyph', (tone, color, icon) => {
    const { container } = render(<FieldMessage tone={tone}>Message in text</FieldMessage>);
    const root = container.querySelector('.eg-field-message');
    expect(root).toHaveClass(color, 'm-0', 'gap-1.5');
    const { result } = renderHook(() => useFieldMessage({ children: 'Message in text', tone }));
    expect(result.current.icon).toBe(icon);
    if (icon) {
      const svg = root?.querySelector('svg');
      expect(svg).toHaveClass('eg-icon', 'size-4', 'shrink-0');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
    } else {
      expect(root?.querySelector('svg')).toBeNull();
    }
    expect(container.querySelector('[role], [aria-live], [aria-invalid], [tabindex]')).toBeNull();
  });

  it('supports explicit decorative icon overrides and native announcement opt-in', () => {
    const { container } = render(
      <FieldMessage tone='success' icon='check' role='status' aria-live='polite'>
        Saved successfully
      </FieldMessage>
    );
    const root = screen.getByRole('status');
    expect(root).toHaveTextContent('Saved successfully');
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(container.querySelectorAll('[role]')).toHaveLength(1);
    expect(container.querySelector('svg circle')).toBeNull();
  });

  it('omits empty messages and recovers without an empty live region or icon shell', () => {
    const { container, rerender } = render(
      <FieldMessage tone='error' role='alert'>
        {''}
      </FieldMessage>
    );
    expect(container).toBeEmptyDOMElement();
    rerender(<FieldMessage tone='error'>Required value</FieldMessage>);
    expect(screen.getByText('Required value')).toBeInTheDocument();
    rerender(<FieldMessage>{''}</FieldMessage>);
    expect(container).toBeEmptyDOMElement();
  });

  it('updates appearance without replacing its root or moving focus from the control', () => {
    const view = (tone: FieldMessageTone) => (
      <>
        <input aria-label='Title' aria-describedby='message' />
        <FieldMessage id='message' tone={tone}>
          Check this value
        </FieldMessage>
      </>
    );
    const { container, rerender } = render(view('description'));
    const input = screen.getByRole('textbox', { name: 'Title' });
    const root = container.querySelector('.eg-field-message');
    input.focus();
    rerender(view('error'));
    expect(container.querySelector('.eg-field-message')).toBe(root);
    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleDescription('Check this value');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(root).toHaveClass('text-status-danger');
  });

  it('exposes only the approved tone/content/native shape without ref or asChild', () => {
    expectTypeOf<ComponentProps<typeof FieldMessage>>().toEqualTypeOf<FieldMessageProps>();
    // @ts-expect-error Message content is required plain text, not an interactive node.
    const rich: FieldMessageProps = { children: <button type='button'>Action</button> };
    // @ts-expect-error No asChild API is exposed.
    const slotted: FieldMessageProps = { children: 'Text', asChild: true };
    // @ts-expect-error The tone enum is closed.
    const unsupported: FieldMessageTone = 'danger';
    void [rich, slotted, unsupported];
  });
});
