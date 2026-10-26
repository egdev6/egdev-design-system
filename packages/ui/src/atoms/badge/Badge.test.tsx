import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useBadge } from '@/atoms/badge/useBadge';
import { Icon } from '../icon';
import { Badge, type BadgeTone, type BadgeVariant, badgeVariants } from './index';

const tones: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'brand'];
const variants: BadgeVariant[] = ['soft', 'solid'];
const combinations = tones.flatMap((tone) => variants.map((variant) => ({ tone, variant })));

function colors(tone: BadgeTone, variant: BadgeVariant): string[] {
  if (variant === 'solid') {
    return [
      'border-transparent',
      'shadow-none',
      tone === 'brand' ? 'bg-action-primary-solid-bg' : tone === 'neutral' ? 'bg-fg-secondary' : `bg-status-${tone}`,
      tone === 'brand' ? 'text-action-primary-solid-fg' : 'text-fg-on-status'
    ];
  }
  if (tone === 'brand') {
    return ['text-primitive-red-200', 'border-alpha-red-22', 'bg-alpha-red-12', 'shadow-edge'];
  }
  const color = tone === 'neutral' ? 'fg-secondary' : `status-${tone}`;
  return [`text-${color}`, `border-${color}/30`, `bg-${color}/8`, 'shadow-edge'];
}

describe('Badge v0.1', () => {
  it('renders a neutral soft span with the public marker and no automatic icon (AC-01)', () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('eg-badge', 'inline-flex', 'rounded-full', 'text-label-default', 'text-fg-secondary');
    expect(badge).toHaveAttribute('data-tone', 'neutral');
    expect(badge).toHaveAttribute('data-variant', 'soft');
    expect(badge.children).toHaveLength(0);
    expect(badge).not.toHaveClass('eg-tag', 'eg-status');
  });

  it('derives root and icon parts in the hook without leaking own props', () => {
    const { result, rerender } = renderHook(
      ({ tone }: { tone?: BadgeTone }) =>
        useBadge({ children: 'Published', tone, className: 'mt-2', title: 'Publication' }),
      { initialProps: {} }
    );
    expect(result.current.rootProps).toMatchObject({
      title: 'Publication',
      'data-tone': 'neutral',
      'data-variant': 'soft'
    });
    expect(result.current.rootProps.className).toContain('mt-2');
    expect(result.current.iconProps).toMatchObject({ 'aria-hidden': true });
    expect(result.current.iconProps.className).toContain('size-3.5');
    expect(result.current.rootProps).not.toHaveProperty('tone');
    expect(result.current.rootProps).not.toHaveProperty('variant');
    expect(result.current.rootProps).not.toHaveProperty('icon');
    rerender({ tone: 'success' });
    expect(result.current.rootProps['data-tone']).toBe('success');
  });

  it.each(combinations)('resolves $tone/$variant token utilities in CVA and hook (AC-03)', ({ tone, variant }) => {
    const { result } = renderHook(() => useBadge({ children: 'Condition', tone, variant }));
    const classes = result.current.rootProps.className?.split(' ');
    const recipe = badgeVariants({ tone, variant }).split(' ');
    for (const utility of colors(tone, variant)) {
      expect(classes).toContain(utility);
      expect(recipe).toContain(utility);
    }
    expect(classes).toContain('text-label-default');
    expect(classes).not.toContain(variant === 'soft' ? 'shadow-none' : 'shadow-edge');
    expect(result.current.rootProps).toMatchObject({ 'data-tone': tone, 'data-variant': variant });
  });

  it('hides the decorative icon wrapper before the readable label (AC-02)', () => {
    render(<Badge icon={<Icon name='check' className='size-3.5' />}>Published</Badge>);
    const badge = screen.getByText('Published');
    const wrapper = badge.firstElementChild;
    expect(wrapper?.tagName).toBe('SPAN');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass('size-3.5', 'shrink-0');
    expect(wrapper?.querySelector('svg')).toHaveClass('eg-icon', 'size-3.5');
    expect(badge.lastChild?.textContent).toBe('Published');
    expect(badge).toHaveTextContent('Published');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(badge).not.toHaveAttribute('aria-label');
  });

  it.each([undefined, null, false])('omits an absent icon wrapper for %s', (icon) => {
    render(<Badge icon={icon}>Draft</Badge>);
    expect(screen.getByText('Draft').children).toHaveLength(0);
  });

  it('does not treat a supplied numeric decorative node as absent', () => {
    render(<Badge icon={0}>Zero</Badge>);
    expect(screen.getByText('0')).toHaveAttribute('aria-hidden', 'true');
  });

  it('stays passive with no role, live region or tab stop (AC-04)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Badge>Testing</Badge>
        <button type='button'>After</button>
      </>
    );
    const badge = screen.getByText('Testing');
    for (const attribute of ['role', 'tabindex', 'aria-live', 'data-state']) {
      expect(badge).not.toHaveAttribute(attribute);
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('merges supported layout last and forwards native attributes (AC-05, AC-06)', () => {
    render(
      <Badge
        id='publication'
        title='Publication'
        data-source='consumer'
        aria-describedby='hint'
        className='mt-1 mt-2 self-start'
      >
        Published
      </Badge>
    );
    const badge = screen.getByText('Published');
    expect(badge).toHaveClass('eg-badge', 'mt-2', 'self-start', 'text-label-default', 'text-fg-secondary');
    expect(badge).not.toHaveClass('mt-1');
    expect(badge).toHaveAttribute('id', 'publication');
    expect(badge).toHaveAttribute('title', 'Publication');
    expect(badge).toHaveAttribute('data-source', 'consumer');
    expect(badge).toHaveAttribute('aria-describedby', 'hint');
  });

  it('updates tone, treatment and optional icon without stale classes or wrapper', () => {
    const { rerender } = render(
      <Badge tone='danger' variant='solid' icon={<Icon name='alert' className='size-3.5' />}>
        Failed
      </Badge>
    );
    expect(screen.getByText('Failed')).toHaveClass('bg-status-danger', 'text-fg-on-status');
    rerender(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge).toHaveClass('bg-fg-secondary/8', 'shadow-edge');
    expect(badge).not.toHaveClass('bg-status-danger', 'text-fg-on-status', 'shadow-none');
    expect(badge.children).toHaveLength(0);
  });
});
