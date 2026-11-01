import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PreviewFrame } from './PreviewFrame';

describe('PreviewFrame', () => {
  it('names the figure with its first-child caption and orders caption, actions, canvas and footer', () => {
    const { container } = render(
      <PreviewFrame
        figureCaption='Preview'
        actions={<button type='button'>Edit</button>}
        footer={<button type='button'>Save</button>}
      >
        <span>Artwork</span>
      </PreviewFrame>
    );
    const figure = screen.getByRole('figure', { name: 'Preview' });
    expect(figure).toHaveClass('eg-stage');
    expect(figure.firstElementChild?.tagName).toBe('FIGCAPTION');
    expect(figure.firstElementChild).not.toContainElement(screen.getByRole('button', { name: 'Edit' }));
    expect([...figure.children].map((node) => node.tagName)).toEqual(['FIGCAPTION', 'DIV', 'DIV', 'DIV']);
    expect(screen.getByText('Artwork').closest('[aria-hidden=true]')).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll('button')).map((node) => node.textContent)).toEqual(['Edit', 'Save']);
    expect(container.querySelector('[data-safe-area]')).toBeInTheDocument();
  });

  it('falls back for invalid and unrepresentable ratios, retaining representable ratios', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      /* suppress expected development warning */
    });
    const { container, rerender } = render(<PreviewFrame aria-label='Preview' />);
    const wrapper = () => container.querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement;
    expect(wrapper().style.paddingBottom).toBe('56.25%');
    expect(warn).not.toHaveBeenCalled();
    for (const ratio of [0, -1, -0, NaN, Infinity, Number.MIN_VALUE]) {
      rerender(<PreviewFrame aria-label='Preview' ratio={ratio} />);
      expect(wrapper().style.paddingBottom).toBe('56.25%');
    }
    expect(warn).toHaveBeenCalledTimes(6);
    rerender(<PreviewFrame ratio={9 / 16} />);
    expect(wrapper().style.paddingBottom).toBe(`${100 / (9 / 16)}%`);
    rerender(<PreviewFrame ratio={5} />);
    expect(wrapper().style.paddingBottom).toBe('20%');
    for (const [ratio, padding] of [
      [1e-3, '100000%'],
      [1e5, '0.001%'],
      [1e-300, '9.999999999999999e+301%'],
      [10000, '0.01%']
    ] as const) {
      rerender(<PreviewFrame ratio={ratio} />);
      expect(wrapper().style.paddingBottom).toBe(padding);
    }
    expect(warn).toHaveBeenCalledTimes(6);
    warn.mockRestore();
  });

  it('keeps the host aria-label and labelledby above the caption when naming the figure', () => {
    const { rerender } = render(<PreviewFrame figureCaption='Preview' aria-label='Canvas' />);
    const figure = screen.getByRole('figure', { name: 'Canvas' });
    expect(figure).not.toHaveAttribute('aria-labelledby');
    rerender(<PreviewFrame figureCaption='Preview' aria-label='Canvas' aria-labelledby='external-heading' />);
    expect(screen.getByRole('figure', { name: 'Canvas' })).toHaveAttribute('aria-labelledby', 'external-heading');
    rerender(<PreviewFrame figureCaption='Preview' />);
    const named = screen.getByRole('figure', { name: 'Preview' });
    const captionId = named.getAttribute('aria-labelledby');
    expect(captionId).toBeTruthy();
    expect(named.querySelector('figcaption')).toHaveAttribute('id', captionId);
  });

  it('renders actions without a caption as an unnamed figure with no figcaption', () => {
    const { container } = render(
      <PreviewFrame actions={<button type='button'>Edit</button>}>
        <span>Artwork</span>
      </PreviewFrame>
    );
    const figure = container.querySelector('figure');
    expect(figure).not.toHaveAttribute('aria-labelledby');
    expect(container.querySelector('figcaption')).toBeNull();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Artwork').closest('[aria-hidden=true]')).toBeInTheDocument();
  });

  it('clamps zones and omits invalid or zero-area geometry with warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      /* suppress expected development warnings */
    });
    const { container } = render(
      <PreviewFrame
        zones={[
          { id: 'a', label: 'Title', x: -5, y: 90, width: 120, height: 30 },
          { id: 'b', label: 'Warning', x: 5, y: 5, width: 10, height: 10, tone: 'warning' },
          { id: 'c', label: 'Invalid', x: NaN, y: 0, width: 1, height: 1 },
          { id: 'd', label: 'Empty', x: 100, y: 0, width: 1, height: 1 },
          { id: 'e', label: 'Offscreen', x: 200, y: 200, width: 10, height: 10 }
        ]}
      />
    );
    const title = screen.getByText('Title').parentElement as HTMLElement;
    expect(title.style.getPropertyValue('--eg-zone-x')).toBe('0%');
    expect(title.style.getPropertyValue('--eg-zone-y')).toBe('90%');
    expect(title.style.getPropertyValue('--eg-zone-w')).toBe('100%');
    expect(title.style.getPropertyValue('--eg-zone-h')).toBe('10%');
    expect(title.className).not.toBe(screen.getByText('Warning').parentElement?.className);
    expect(screen.queryByText('Invalid')).toBeNull();
    expect(screen.queryByText('Empty')).toBeNull();
    expect(screen.queryByText('Offscreen')).toBeNull();
    expect(warn).toHaveBeenCalledWith('PreviewFrame: non-finite zone geometry omitted.');
    expect(warn).toHaveBeenCalledWith('PreviewFrame: zero-area zone omitted.');
    expect(container.querySelectorAll('[data-zone]')).toHaveLength(2);
    warn.mockRestore();
  });

  it('keeps grid visually plain and forwards layout and native props', () => {
    const { container, rerender } = render(
      <PreviewFrame variant='grid' safeArea={false} className='w-80' dir='rtl' aria-label='Canvas' />
    );
    const figure = screen.getByRole('figure', { name: 'Canvas' });
    expect(figure).toHaveClass('w-80');
    expect(figure).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('[data-safe-area]')).toBeNull();
    const canvasClass = container.querySelector('[data-canvas]')?.className;
    rerender(<PreviewFrame variant='plain' />);
    expect(container.querySelector('[data-canvas]')?.className).toBe(canvasClass);
  });
});
