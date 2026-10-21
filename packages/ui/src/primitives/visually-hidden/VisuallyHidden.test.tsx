import { render, renderHook, screen } from '@testing-library/react';
import type { ComponentPropsWithoutRef } from 'react';
import { createRef, forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useVisuallyHidden } from './useVisuallyHidden';
import { VisuallyHidden } from './VisuallyHidden';

const Heading = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h2'>>((props, ref) => (
  <h2 {...props} ref={ref} />
));

describe('VisuallyHidden', () => {
  it('renders a marked span whose text contributes to the parent accessible name', () => {
    render(
      <a href='/docs'>
        Docs <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
      </a>
    );
    expect(screen.getByRole('link', { name: 'Docs (opens in a new tab)' })).toBeInTheDocument();
    const hidden = screen.getByText('(opens in a new tab)');
    expect(hidden.tagName).toBe('SPAN');
    expect(hidden).toHaveClass('eg-visually-hidden');
    expect(hidden).not.toHaveAttribute('aria-hidden');
    expect(hidden).not.toHaveAttribute('tabindex');
  });

  it('retains Radix-owned hiding geometry without a stylesheet', () => {
    render(<VisuallyHidden>Hidden notice</VisuallyHidden>);
    expect(screen.getByText('Hidden notice')).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0px',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0px, 0px, 0px, 0px)',
      'white-space': 'nowrap',
      'border-width': '0px'
    });
  });

  it('forwards native attributes and supports an accessible description', () => {
    render(
      <>
        <button type='button' aria-describedby='notice'>
          Save
        </button>
        <VisuallyHidden id='notice' lang='en' data-source='consumer'>
          Changes are stored locally
        </VisuallyHidden>
      </>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Changes are stored locally');
    expect(screen.getByText('Changes are stored locally')).toHaveAttribute('data-source', 'consumer');
    expect(screen.getByText('Changes are stored locally')).toHaveAttribute('lang', 'en');
  });

  it('forwards an HTMLElement ref to the default span', () => {
    const ref = createRef<HTMLElement>();
    render(<VisuallyHidden ref={ref}>Referenced text</VisuallyHidden>);
    expect(ref.current).toBe(screen.getByText('Referenced text'));
  });

  it('slots a non-focusable heading, preserving its role and actual host ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <VisuallyHidden asChild={true} ref={ref} className='consumer-hook'>
        <h2>Settings</h2>
      </VisuallyHidden>
    );
    const heading = screen.getByRole('heading', { name: 'Settings', level: 2 });
    expect(ref.current).toBe(heading);
    expect(heading).toHaveClass('eg-visually-hidden', 'consumer-hook');
    expect(heading).toHaveStyle({ position: 'absolute', width: '1px', height: '1px' });
    expect(heading.parentElement?.querySelector('span')).toBeNull();
  });

  it('supports a custom child forwarding props and ref to one HTML host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <VisuallyHidden asChild={true} ref={ref} id='custom-heading'>
        <Heading className='child-hook'>Profile</Heading>
      </VisuallyHidden>
    );
    const heading = screen.getByRole('heading', { name: 'Profile' });
    expect(ref.current).toBe(heading);
    expect(heading).toHaveAttribute('id', 'custom-heading');
    expect(heading).toHaveClass('eg-visually-hidden', 'child-hook');
    expect(heading).toHaveStyle({ width: '1px', height: '1px' });
  });

  it('composes the marker before the supported non-visual consumer hook and passes props through', () => {
    const { result } = renderHook(() =>
      useVisuallyHidden({ children: 'Notice', className: 'consumer-hook', id: 'notice' })
    );
    expect(result.current.className.split(' ')).toEqual(['eg-visually-hidden', 'consumer-hook']);
    expect(result.current).toMatchObject({ children: 'Notice', id: 'notice' });
  });
});
