import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { StepMeter } from './StepMeter';
import type { StepMeterProps } from './types';
import { useStepMeter } from './useStepMeter';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

const labelWarning = 'StepMeter requires a non-empty label. Nothing was rendered.';
const valueWarning = 'StepMeter requires a finite numeric value. Nothing was rendered.';

// The one documented cast: a JavaScript caller can pass values that the public type rejects.
function untyped(props: Record<string, unknown>): StepMeterProps {
  return props as unknown as StepMeterProps;
}

function stepsOf(root: HTMLElement) {
  return [...root.children];
}

function statesOf(root: HTMLElement) {
  return stepsOf(root).map((step) => step.getAttribute('data-state'));
}

function expectedStates(filled: number, total: number) {
  return Array.from({ length: total }, (_, position) => (position < filled ? 'filled' : 'empty'));
}

describe('StepMeter', () => {
  it('renders one named image with the stable root marker and presentational steps (SM-01)', () => {
    const { container } = render(<StepMeter label='High progress' value={3} />);
    const image = screen.getByRole('img', { name: 'High progress' });
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(image);
    expect(image.tagName).toBe('SPAN');
    expect(image).toHaveClass('eg-step-meter');
    expect(image).not.toHaveAttribute('data-state');
    expect(image).not.toHaveAttribute('tabindex');
    expect(image.textContent).toBe('');
    expect(image.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')).toHaveLength(0);
    const steps = stepsOf(image);
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(step.tagName).toBe('SPAN');
      expect(step).toHaveClass('eg-step-meter__step');
      expect(step.childNodes).toHaveLength(0);
      for (const attribute of ['role', 'tabindex', 'aria-label', 'aria-hidden']) {
        expect(step, attribute).not.toHaveAttribute(attribute);
      }
    }
  });

  it('derives the root props and the step list in the hook (SM-01)', () => {
    const { result } = renderHook(() => useStepMeter({ label: 'High progress', value: 3, id: 'level' }));
    expect(result.current.valid).toBe(true);
    expect(result.current.rootProps).toMatchObject({ id: 'level', role: 'img', 'aria-label': 'High progress' });
    expect(result.current.rootProps.className.split(' ')).toContain('eg-step-meter');
    for (const consumed of ['label', 'value', 'steps']) {
      expect(result.current.rootProps, consumed).not.toHaveProperty(consumed);
    }
    expect(result.current.steps.length).toBeGreaterThan(0);
  });

  it.each([0, 1, 2, 3, 4])('fills exactly %i leading steps of the default four, in DOM order (SM-02)', (value) => {
    render(<StepMeter label='Progress' value={value} />);
    const image = screen.getByRole('img', { name: 'Progress' });
    expect(stepsOf(image)).toHaveLength(4);
    expect(statesOf(image)).toEqual(expectedStates(value, 4));
  });

  it.each([1, 2, 6, 10])('renders %i steps and fills each value from 0 through the total (SM-02)', (steps) => {
    const { rerender } = render(<StepMeter label='Progress' value={0} steps={steps} />);
    const image = screen.getByRole('img', { name: 'Progress' });
    for (let value = 0; value <= steps; value += 1) {
      rerender(<StepMeter label='Progress' value={value} steps={steps} />);
      expect(stepsOf(image)).toHaveLength(steps);
      expect(statesOf(image)).toEqual(expectedStates(value, steps));
    }
  });

  it('lists the steps in order with stable positions in the hook (SM-02)', () => {
    const { result } = renderHook(() => useStepMeter({ label: 'Progress', value: 2, steps: 6 }));
    expect(result.current.steps.map(({ position }) => position)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(result.current.steps.map((step) => step['data-state'])).toEqual(expectedStates(2, 6));
  });

  it('updates the name and the steps on rerender without replacing the root or announcing (SM-02)', () => {
    const { container, rerender } = render(<StepMeter label='Low progress' value={1} />);
    const image = screen.getByRole('img', { name: 'Low progress' });
    expect(statesOf(image)).toEqual(expectedStates(1, 4));
    rerender(<StepMeter label='Full progress' value={6} steps={6} />);
    expect(container.firstElementChild).toBe(image);
    expect(image).toHaveAccessibleName('Full progress');
    expect(statesOf(image)).toEqual(expectedStates(6, 6));
    expect(image).not.toHaveAttribute('aria-live');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each([
    [9, 4, 4],
    [4.9, 4, 4],
    [-1, 4, 0],
    [-0.5, 4, 0],
    [0.9, 4, 0],
    [2.9, 4, 2],
    [5.9, 6, 5],
    [99, 6, 6],
    [2.9, 10, 2]
  ])('floors and clamps the value %f against %i steps to %i filled (SM-03)', (value, steps, filled) => {
    render(<StepMeter label='Progress' value={value} steps={steps} />);
    const image = screen.getByRole('img', { name: 'Progress' });
    expect(statesOf(image)).toEqual(expectedStates(filled, steps));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['0', 0],
    ['-1', -1],
    ['11', 11],
    ['2.5', 2.5],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
    ['the string "6"', '6'],
    ['null', null],
    ['true', true],
    ['an object', {}]
  ])('falls back to four steps silently when steps is %s and clamps the value against four (SM-03)', (_name, steps) => {
    const { rerender } = render(<StepMeter {...untyped({ label: 'Progress', value: 3, steps })} />);
    const image = screen.getByRole('img', { name: 'Progress' });
    expect(stepsOf(image)).toHaveLength(4);
    expect(statesOf(image)).toEqual(expectedStates(3, 4));
    rerender(<StepMeter {...untyped({ label: 'Progress', value: 9, steps })} />);
    expect(statesOf(image)).toEqual(expectedStates(4, 4));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([1, 10])('accepts the bounds of the steps range (%i) without a fallback (SM-03)', (steps) => {
    render(<StepMeter label='Progress' value={steps} steps={steps} />);
    const image = screen.getByRole('img', { name: 'Progress' });
    expect(stepsOf(image)).toHaveLength(steps);
    expect(statesOf(image)).toEqual(expectedStates(steps, steps));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['an empty string', ''],
    ['whitespace only', ' \t\n '],
    ['a number', 42],
    ['null', null],
    ['undefined', undefined],
    ['an object', {}]
  ])('warns once and renders nothing when label is %s, never an unnamed image (SM-04)', (_name, label) => {
    const { container, rerender } = render(<StepMeter {...untyped({ label, value: 3 })} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[labelWarning]]);
    consoleWarn.mockClear();
    rerender(<StepMeter label='High progress' value={3} />);
    expect(screen.getByRole('img', { name: 'High progress' })).toBeInTheDocument();
    expect(statesOf(screen.getByRole('img'))).toEqual(expectedStates(3, 4));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
    ['the string "3"', '3'],
    ['null', null],
    ['undefined', undefined],
    ['an object', {}]
  ])('warns once and renders nothing when value is %s (SM-04)', (_name, value) => {
    const { container, rerender } = render(<StepMeter {...untyped({ label: 'High progress', value })} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(consoleWarn.mock.calls).toEqual([[valueWarning]]);
    consoleWarn.mockClear();
    rerender(<StepMeter label='High progress' value={2} />);
    expect(statesOf(screen.getByRole('img', { name: 'High progress' }))).toEqual(expectedStates(2, 4));
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('emits each warning for its own invalid input and renders nothing when both are invalid (SM-04)', () => {
    const { container } = render(<StepMeter {...untyped({ label: '  ', value: Number.NaN })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn.mock.calls).toHaveLength(2);
    expect(consoleWarn.mock.calls).toEqual(expect.arrayContaining([[labelWarning], [valueWarning]]));
  });

  it('reports an invalid input from the hook as not valid (SM-04)', () => {
    const named = renderHook(() => useStepMeter({ label: 'High progress', value: 1 }));
    expect(named.result.current.valid).toBe(true);
    const unnamed = renderHook(() => useStepMeter({ label: ' ', value: 1 }));
    expect(unnamed.result.current.valid).toBe(false);
    const unmeasured = renderHook(() => useStepMeter({ label: 'High progress', value: Number.NaN }));
    expect(unmeasured.result.current.valid).toBe(false);
  });

  it('stays silent in production but still renders nothing for an invalid input (SM-04)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<StepMeter {...untyped({ label: '', value: Number.NaN })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

const injectedProps = {
  children: 'injected',
  dangerouslySetInnerHTML: { __html: 'injected' },
  role: 'button',
  'aria-label': 'injected',
  'aria-labelledby': 'other',
  'aria-hidden': true,
  'aria-live': 'polite',
  'aria-valuemin': 0,
  'aria-valuemax': 100,
  'aria-valuenow': 50,
  'aria-valuetext': 'injected',
  'data-state': 'filled',
  title: 'injected',
  tabIndex: 0,
  contentEditable: true
};
const protectedAttributes = [
  'aria-labelledby',
  'aria-hidden',
  'aria-live',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
  'data-state',
  'title',
  'tabindex',
  'contenteditable'
];

describe('StepMeter protected semantics', () => {
  it('excludes the protected props, every handler and refs from the public type (SM-05)', () => {
    expectTypeOf<
      Extract<
        keyof StepMeterProps,
        | 'children'
        | 'dangerouslySetInnerHTML'
        | 'role'
        | 'aria-label'
        | 'aria-labelledby'
        | 'aria-hidden'
        | 'aria-live'
        | 'aria-valuemin'
        | 'aria-valuemax'
        | 'aria-valuenow'
        | 'aria-valuetext'
        | 'data-state'
        | 'title'
        | 'tabIndex'
        | 'contentEditable'
        | 'ref'
        | 'asChild'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<Extract<keyof StepMeterProps, `on${string}`>>().toEqualTypeOf<never>();
    expectTypeOf<StepMeterProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<StepMeterProps['value']>().toEqualTypeOf<number>();
    expectTypeOf<StepMeterProps['steps']>().toEqualTypeOf<number | undefined>();
  });

  it('drops injected semantics, content, focus and handlers in the hook but forwards compatible attributes (SM-05)', () => {
    const handler = vi.fn();
    const { result } = renderHook(() =>
      useStepMeter(
        untyped({
          ...injectedProps,
          onClick: handler,
          onKeyDown: handler,
          onFocus: handler,
          onPointerDown: handler,
          id: 'level',
          'data-source': 'host',
          'aria-describedby': 'hint',
          label: 'High progress',
          value: 3
        })
      )
    );
    const rootProps = result.current.rootProps;
    expect(rootProps).toMatchObject({
      role: 'img',
      'aria-label': 'High progress',
      id: 'level',
      'data-source': 'host',
      'aria-describedby': 'hint'
    });
    for (const key of ['children', 'dangerouslySetInnerHTML', ...protectedAttributes, 'tabIndex', 'contentEditable']) {
      expect(rootProps, key).not.toHaveProperty(key);
    }
    expect(Object.keys(rootProps).filter((key) => /^on/i.test(key))).toEqual([]);
  });

  it('keeps the name, role and content owned by the component while forwarding compatible attributes (SM-05)', () => {
    const handler = vi.fn();
    const { container } = render(
      <StepMeter
        {...untyped({
          ...injectedProps,
          onClick: handler,
          onKeyDown: handler,
          onFocus: handler,
          onPointerDown: handler,
          id: 'level',
          'data-source': 'host',
          'aria-describedby': 'hint',
          label: 'High progress',
          value: 3
        })}
      />
    );
    const image = screen.getByRole('img', { name: 'High progress' });
    expect(image).toHaveAttribute('role', 'img');
    expect(image).toHaveAttribute('id', 'level');
    expect(image).toHaveAttribute('data-source', 'host');
    expect(image).toHaveAttribute('aria-describedby', 'hint');
    for (const attribute of protectedAttributes) {
      expect(image, attribute).not.toHaveAttribute(attribute);
    }
    expect(image.textContent).toBe('');
    expect(stepsOf(image)).toHaveLength(4);
    for (const step of stepsOf(image)) {
      expect(step.childNodes).toHaveLength(0);
    }
    fireEvent.click(image);
    fireEvent.keyDown(image, { key: 'Enter' });
    fireEvent.focus(image);
    fireEvent.pointerDown(image);
    for (const step of stepsOf(image)) {
      fireEvent.click(step);
    }
    expect(handler).not.toHaveBeenCalled();
    expect(container.querySelectorAll('[tabindex], [contenteditable], [title]')).toHaveLength(0);
  });

  it('never attaches a ref, which React 19 delivers to function components as a prop (SM-05)', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<StepMeter {...untyped({ label: 'High progress', value: 3, ref })} />);
    expect(screen.getByRole('img', { name: 'High progress' })).toBeInTheDocument();
    expect(ref.current).toBeNull();
  });

  it('renders the same protected markup on the server (SM-05)', () => {
    const html = renderToStaticMarkup(
      <StepMeter {...untyped({ ...injectedProps, id: 'level', label: 'High progress', value: 3 })} />
    );
    expect(html).not.toMatch(
      /injected|tabindex|contenteditable|aria-hidden|aria-live|aria-value|title=|aria-labelledby/i
    );
    const host = document.createElement('div');
    host.innerHTML = html;
    const root = host.firstElementChild;
    expect(root).toHaveAttribute('role', 'img');
    expect(root).toHaveAttribute('aria-label', 'High progress');
    expect(root).toHaveAttribute('id', 'level');
    expect(root).not.toHaveAttribute('data-state');
    expect(root?.children).toHaveLength(4);
  });

  it('is not focusable and adds no tab stop between real controls (SM-05)', async () => {
    const user = userEvent.setup();
    render(
      <p>
        <a href='#more'>More</a>
        <StepMeter {...untyped({ label: 'High progress', value: 3, tabIndex: 0 })} />
        <button type='button'>After</button>
      </p>
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'More' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    expect(screen.getByRole('img', { name: 'High progress' })).not.toHaveFocus();
  });
});

describe('StepMeter classes and markup', () => {
  it('merges className last on the root for placement and never reaches the steps (SM-06)', () => {
    const { rerender } = render(
      <StepMeter label='High progress' value={3} className='ms-auto self-start consumer-marker' />
    );
    const image = screen.getByRole('img', { name: 'High progress' });
    expect(image).toHaveClass('eg-step-meter', 'inline-flex', 'ms-auto', 'self-start', 'consumer-marker');
    expect(image.className.split(' ').slice(-3)).toEqual(['ms-auto', 'self-start', 'consumer-marker']);
    for (const step of stepsOf(image)) {
      expect(step).toHaveClass('eg-step-meter__step');
      expect(step.className).not.toMatch(/ms-auto|self-start|consumer-marker/);
    }
    rerender(<StepMeter label='High progress' value={3} />);
    expect(image.className.split(' ')).not.toContain('consumer-marker');
    expect(image).toHaveClass('eg-step-meter');
  });

  it('composes the root class in the hook with the consumer class last (SM-06)', () => {
    const { result } = renderHook(() =>
      useStepMeter({ label: 'High progress', value: 3, className: 'consumer-marker' })
    );
    expect(result.current.rootProps.className.split(' ')[0]).toBe('eg-step-meter');
    expect(result.current.rootProps.className.split(' ').at(-1)).toBe('consumer-marker');
    for (const step of result.current.steps) {
      expect(step.className).not.toContain('consumer-marker');
    }
  });

  it('carries the approved static utilities on the root and on every step (SM-07)', () => {
    render(<StepMeter label='High progress' value={3} />);
    const image = screen.getByRole('img', { name: 'High progress' });
    expect(image).toHaveClass('eg-step-meter', 'inline-flex', 'flex-none', 'items-center', 'gap-1');
    for (const step of stepsOf(image)) {
      expect(step).toHaveClass(
        'eg-step-meter__step',
        'inline-block',
        'flex-none',
        'w-3.5',
        'h-3.75',
        '[clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]',
        'bg-alpha-red-22',
        'data-[state=filled]:bg-fg-brand-default',
        'transition-none',
        'forced-colors:forced-color-adjust-none',
        'forced-colors:data-[state=filled]:bg-[color:CanvasText]',
        'forced-colors:data-[state=empty]:bg-transparent'
      );
    }
  });

  it('has no motion, effect, mirrored-state or inline-appearance utilities on any part (SM-07, SM-10)', () => {
    render(<StepMeter label='High progress' value={2} steps={6} />);
    const image = screen.getByRole('img', { name: 'High progress' });
    const forbiddenUtility =
      /(^|[\s:])(transition-(?!none)|animate-|shadow|filter|backdrop-|transform|translate-|rotate-|scale-|skew-|blur-|opacity-|border|ring|outline)/;
    for (const part of [image, ...stepsOf(image)]) {
      expect(part.className).not.toMatch(forbiddenUtility);
      expect(part).not.toHaveAttribute('style');
      for (const mirrored of ['is-on', 'is-filled', 'is-empty', 'filled', 'empty']) {
        expect(part, mirrored).not.toHaveClass(mirrored);
      }
    }
  });

  it('applies a changed value immediately, with or without a reduced-motion preference (SM-10)', () => {
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {
        // jsdom stub: no media listeners are needed.
      },
      removeEventListener: () => {
        // jsdom stub: no media listeners are needed.
      },
      addListener: () => {
        // Legacy API stub for older environments.
      },
      removeListener: () => {
        // Legacy API stub for older environments.
      },
      dispatchEvent: () => false
    }));
    vi.stubGlobal('matchMedia', matchMedia);
    try {
      const { rerender } = render(<StepMeter label='Low progress' value={1} />);
      const image = screen.getByRole('img', { name: 'Low progress' });
      expect(statesOf(image)).toEqual(expectedStates(1, 4));
      rerender(<StepMeter label='High progress' value={3} />);
      expect(statesOf(image)).toEqual(expectedStates(3, 4));
      expect(image).toHaveAccessibleName('High progress');
      expect(matchMedia.mock.calls.every(([query]) => typeof query === 'string')).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('renders the same markup on the server and on the client (SM-12)', () => {
    const element = <StepMeter label='High progress' value={3} steps={6} className='ms-auto' id='level' />;
    const { container } = render(element);
    expect(renderToStaticMarkup(element)).toBe(container.innerHTML);
    const plain = <StepMeter label='High progress' value={0} />;
    const second = render(plain);
    expect(renderToStaticMarkup(plain)).toBe(second.container.innerHTML);
  });
});
