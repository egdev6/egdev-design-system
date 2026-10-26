import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import { type ComponentPropsWithoutRef, createRef, forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Surface } from './Surface';
import type { SurfaceElevation, SurfaceProps } from './types';
import { surfaceVariants } from './types';
import { useSurface } from './useSurface';

const sheen = 'bg-[image:var(--gradient-sheen)]';
const raisedTones = ['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const;
const elevations = [0, 1, 2, 3] as const satisfies readonly SurfaceElevation[];
const elevationRecipes: Record<SurfaceElevation, readonly string[]> = {
  0: ['border-border-hairline', 'shadow-edge'],
  1: ['border-border-hairline', 'shadow-[var(--shadow-edge),var(--shadow-elev-1)]'],
  2: ['border-border-hairline-strong', 'shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)]'],
  3: ['border-border-hairline-strong', 'shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]']
};
const overlayRecipe = [
  'bg-surface-overlay',
  'backdrop-blur-overlay',
  'backdrop-saturate-150',
  'border-border-hairline-strong',
  'shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
  '[@media(prefers-reduced-transparency:reduce)]:bg-surface-2',
  '[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none',
  'not-supports-[backdrop-filter]:bg-surface-2'
];

const Article = forwardRef<HTMLElement, ComponentPropsWithoutRef<'article'>>((props, ref) => (
  <article {...props} ref={ref} />
));
Article.displayName = 'Article';

describe('Surface public contract', () => {
  it('defaults to a surface-1 div at elevation 1 with md padding and xl radius (AC-01)', () => {
    render(<Surface data-testid='surface'>Card</Surface>);
    const root = screen.getByTestId('surface');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass(
      'eg-surface',
      'box-border',
      'border',
      'border-solid',
      'text-fg-default',
      'bg-surface-1',
      sheen,
      ...elevationRecipes[1],
      'p-6',
      'rounded-xl'
    );
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('data-state');
  });

  it('applies the complete raised tone and elevation matrix with the sheen rule (AC-02, AC-03)', () => {
    for (const tone of raisedTones) {
      for (const elevation of elevations) {
        const classes = surfaceVariants({ tone, elevation }).split(' ');
        const label = `${tone} at elevation ${elevation}`;
        expect(classes, label).toContain(`bg-${tone}`);
        expect(classes, label).toEqual(expect.arrayContaining([...elevationRecipes[elevation]]));
        const others = elevations.filter((other) => other !== elevation).flatMap((other) => elevationRecipes[other]);
        for (const foreign of others.filter((item) => !elevationRecipes[elevation].includes(item))) {
          expect(classes, `${label} must not carry ${foreign}`).not.toContain(foreign);
        }
        const plain = tone === 'surface-0' && elevation === 0;
        expect(classes.includes(sheen), `${label} sheen`).toBe(!plain);
      }
    }
  });

  it('gives surface-0 the sheen when elevation is omitted, but not at explicit elevation 0 (AC-02)', () => {
    render(
      <>
        <Surface tone='surface-0' data-testid='omitted'>
          Omitted
        </Surface>
        <Surface tone='surface-0' elevation={0} data-testid='flat'>
          Flat
        </Surface>
      </>
    );
    expect(screen.getByTestId('omitted')).toHaveClass('bg-surface-0', sheen, ...elevationRecipes[1]);
    const flat = screen.getByTestId('flat');
    expect(flat).toHaveClass('bg-surface-0', ...elevationRecipes[0]);
    expect(flat).not.toHaveClass(sheen);
  });

  it('renders the recessed well recipe without sheen or elevation shadows (AC-02)', () => {
    render(
      <Surface tone='well' data-testid='well'>
        Well
      </Surface>
    );
    const well = screen.getByTestId('well');
    expect(well).toHaveClass('eg-surface', 'bg-surface-0', 'border-border-hairline', 'shadow-[var(--shadow-well)]');
    expect(well).not.toHaveClass(sheen, 'shadow-edge', ...elevationRecipes[1].slice(1));
  });

  it('renders the overlay glass with its solid reduced-transparency fallback (AC-02, AC-05)', () => {
    render(
      <Surface tone='overlay' data-testid='overlay'>
        Overlay
      </Surface>
    );
    const overlay = screen.getByTestId('overlay');
    expect(overlay).toHaveClass('eg-surface', ...overlayRecipe);
    expect(overlay).not.toHaveClass(sheen, 'bg-surface-1', 'border-border-hairline', 'shadow-edge');
  });

  it('maps every padding and radius preset to an existing token', () => {
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../../packages/tokens/src/theme.css'), 'utf8');
    const paddings = { none: ['p-0', 0], sm: ['p-3', 3], md: ['p-6', 6], lg: ['p-8', 8] } as const;
    for (const [padding, [utility, space]] of Object.entries(paddings)) {
      expect(surfaceVariants({ padding: padding as keyof typeof paddings }).split(' ')).toContain(utility);
      expect(theme, `${utility} must map to --space-${space}`).toMatch(new RegExp(`--space-${space}:\\s`));
    }
    for (const radius of ['none', 'md', 'lg', 'xl', 'full'] as const) {
      expect(surfaceVariants({ radius }).split(' ')).toContain(`rounded-${radius}`);
      expect(theme, `rounded-${radius} must map to --radius-${radius}`).toMatch(new RegExp(`--radius-${radius}:\\s`));
    }
  });

  it('references only existing Material tokens in its recipes', () => {
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../../packages/tokens/src/theme.css'), 'utf8');
    const references = new Set(
      [...readFileSync(resolve(import.meta.dirname, 'types.ts'), 'utf8').matchAll(/var\((--[a-z0-9-]+)\)/g)].map(
        (match) => match[1]
      )
    );
    expect(references.size).toBeGreaterThan(0);
    for (const token of references) {
      expect(theme, `${token} must be declared in theme.css`).toMatch(new RegExp(`${token}:\\s`));
    }
  });

  it('merges supported layout classes last and keeps the marker (AC-07)', () => {
    render(
      <Surface className='w-full overflow-hidden' data-testid='layout'>
        Layout
      </Surface>
    );
    const root = screen.getByTestId('layout');
    expect(root).toHaveClass('eg-surface', 'w-full', 'overflow-hidden', 'bg-surface-1', 'p-6');
    expect(root.className.split(' ').slice(-2)).toEqual(['w-full', 'overflow-hidden']);
  });

  it('passes native attributes through to the root', () => {
    render(
      <Surface id='panel' role='group' aria-label='Billing' data-tour='billing' title='Billing panel'>
        Billing
      </Surface>
    );
    const root = screen.getByRole('group', { name: 'Billing' });
    expect(root).toHaveAttribute('id', 'panel');
    expect(root).toHaveAttribute('data-tour', 'billing');
    expect(root).toHaveAttribute('title', 'Billing panel');
  });

  it('forwards an HTMLDivElement ref to the default div (AC-06)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Surface ref={ref}>Referenced</Surface>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe('Referenced');
  });

  it('merges classes and props onto a slotted section without a wrapper (AC-06)', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Surface asChild={true} ref={ref} tone='surface-2' elevation={0} radius='none' className='w-full'>
        <section aria-label='Header band' className='consumer-band'>
          <h2>Header</h2>
        </section>
      </Surface>
    );
    const section = screen.getByRole('region', { name: 'Header band' });
    expect(section).toHaveClass('eg-surface', 'bg-surface-2', sheen, 'shadow-edge', 'rounded-none', 'w-full');
    expect(section).toHaveClass('consumer-band');
    expect(section.parentElement?.classList.contains('eg-surface')).toBe(false);
    expect(ref.current === section).toBe(true);
  });

  it('forwards to a ref-forwarding custom child and keeps the child narrower ref (AC-06)', () => {
    const surfaceRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLElement>();
    render(
      <Surface asChild={true} ref={surfaceRef} tone='well'>
        <Article aria-label='Entry' ref={childRef}>
          Entry
        </Article>
      </Surface>
    );
    const article = screen.getByRole('article', { name: 'Entry' });
    expect(article).toHaveClass('eg-surface', 'shadow-[var(--shadow-well)]');
    expect(surfaceRef.current === article).toBe(true);
    expect(childRef.current === article).toBe(true);
  });

  it('slots onto list items while keeping their semantics', () => {
    render(
      <ul>
        <Surface asChild={true} padding='sm'>
          <li>Row</li>
        </Surface>
      </ul>
    );
    expect(screen.getByRole('listitem')).toHaveClass('eg-surface', 'p-3');
  });

  it('resolves defaults and the element choice in the hook', () => {
    const { result } = renderHook(() => useSurface({ children: 'Content' }));
    expect(result.current.asChild).toBe(false);
    expect(result.current.rootProps.className).toBe(surfaceVariants({}));
    expect(result.current.rootProps.children).toBe('Content');
    const slotted = renderHook(() => useSurface({ asChild: true, tone: 'overlay', children: <section /> }));
    expect(slotted.result.current.asChild).toBe(true);
    expect(slotted.result.current.rootProps.className).toContain('bg-surface-overlay');
    expect(slotted.result.current.rootProps).not.toHaveProperty('tone');
  });

  it('rejects elevation on well and overlay tones at type level (AC-04)', () => {
    // @ts-expect-error A well is always recessed; elevation is typed never (D4).
    const wellElevation: SurfaceProps = { tone: 'well', elevation: 1 };
    // @ts-expect-error An overlay always floats at level 3; elevation is typed never (D4).
    const overlayElevation: SurfaceProps = { tone: 'overlay', elevation: 0 };
    // @ts-expect-error asChild requires exactly one element child.
    const slottedText: SurfaceProps = { asChild: true, children: 'Text' };
    const allowed: SurfaceProps[] = [
      {},
      { elevation: 3 },
      ...raisedTones.flatMap((tone) => elevations.map((elevation) => ({ tone, elevation }))),
      { tone: 'well' },
      { tone: 'overlay' },
      { asChild: true, children: <section /> }
    ];
    expect([wellElevation, overlayElevation, slottedText]).toHaveLength(3);
    expect(allowed).toHaveLength(21);
  });

  it('types a div ref on the default branch and an HTMLElement ref when slotted (AC-06)', () => {
    const divRef = createRef<HTMLDivElement>();
    const elementRef = createRef<HTMLElement>();
    render(
      <>
        <Surface ref={divRef}>Default</Surface>
        {/* @ts-expect-error The default div promises only an HTMLDivElement ref. */}
        <Surface ref={elementRef}>Wide ref</Surface>
        <Surface asChild={true} ref={elementRef}>
          <section aria-label='Slotted'>Slotted</section>
        </Surface>
      </>
    );
    expect(divRef.current).toBeInstanceOf(HTMLDivElement);
    expect(elementRef.current?.tagName).toBe('SECTION');
  });
});
