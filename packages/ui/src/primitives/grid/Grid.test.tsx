import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Stack } from '../stack/Stack';
import { layoutGapClasses } from '../stack/types';
import { Grid, GridItem } from './Grid';
import type { GridItemProps, GridProps } from './types';

const gapKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24] as const;
const alignValues = ['start', 'center', 'end', 'stretch', 'baseline'] as const;
const spans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const rowSpans = [1, 2, 3, 4] as const;

/** The element that carries a stable public marker; the system never selects through test ids. */
function marked(container: HTMLElement, marker: string): HTMLElement {
  const element = container.querySelector(`.${marker}`);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing an element with the .${marker} marker`);
  }
  return element;
}

const classesOf = (element: HTMLElement): string[] => [...element.classList];
const withPrefix = (element: HTMLElement, prefix: string): string[] =>
  classesOf(element).filter((name) => name.startsWith(prefix));
const collapseClasses = (element: HTMLElement): string[] =>
  classesOf(element).filter((name) => name.includes('@media'));
const baseUtility = (name: string): string => name.split(':').at(-1) ?? name;

/** Untyped JavaScript input: the public types reject these values, so the tests widen them on purpose. */
function untyped<Props>(props: Record<string, unknown>): Props {
  return props as unknown as Props;
}

/** The three utilities one collapse query contributes, written the way the recipe declares them. */
function collapseUtilities(threshold: number): string[] {
  return [
    `[@media(width<=${threshold}px)]:grid-cols-1`,
    `[@media(width<=${threshold}px)]:[&>*]:col-auto`,
    `[@media(width<=${threshold}px)]:[&>*]:row-auto`
  ].sort();
}

describe('Grid and GridItem public contract', () => {
  let consoleSpies: MockInstance[] = [];

  beforeEach(() => {
    consoleSpies = (['error', 'warn', 'log', 'info', 'debug'] as const).map((method) =>
      vi.spyOn(console, method).mockImplementation(() => undefined)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('G1: renders passive divs with one stretched column, the token gap and the stable markers', () => {
    const { container } = render(
      <Grid>
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Grid>
    );
    const root = marked(container, 'eg-grid');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-grid', 'grid', 'min-w-0', 'grid-cols-1', 'gap-4', 'items-stretch');
    // Passive layout: the class list is the only attribute, so no role, tabindex, id, style or ARIA is added.
    expect(root.getAttributeNames()).toEqual(['class']);
    expect(collapseClasses(root)).toEqual([]);
    expect([...root.children].map((child) => child.textContent)).toEqual(['One', 'Two', 'Three']);

    const items = render(
      <Grid>
        <GridItem>First cell</GridItem>
        <GridItem>Second cell</GridItem>
      </Grid>
    ).container;
    const cells = [...items.querySelectorAll('.eg-grid-item')];
    expect(cells).toHaveLength(2);
    for (const cell of cells) {
      expect(cell.tagName).toBe('DIV');
      expect(cell).toHaveClass('eg-grid-item', 'min-w-0');
      expect(cell.getAttributeNames()).toEqual(['class']);
      expect(withPrefix(cell as HTMLElement, 'col-span-')).toEqual([]);
      expect(withPrefix(cell as HTMLElement, 'row-span-')).toEqual([]);
    }
    expect(cells.map((cell) => cell.textContent)).toEqual(['First cell', 'Second cell']);
  });

  it.each([1, 2, 3, 4, 12] as const)('G2: columnCount %i emits exactly its own grid-cols utility', (columnCount) => {
    const { container } = render(
      <Grid columnCount={columnCount}>
        <span>Cell</span>
      </Grid>
    );
    const root = marked(container, 'eg-grid');
    expect(withPrefix(root, 'grid-cols-')).toEqual([`grid-cols-${columnCount}`]);
    expect(collapseClasses(root)).toEqual([]);
  });

  it('G3: maps each of the 15 gap keys to its own gap utility and an existing spacing token', () => {
    // Stack's exported map is the shared vocabulary: Grid's keys must not drift from it.
    expect(Object.keys(layoutGapClasses).map(Number)).toEqual([...gapKeys]);
    const theme = readFileSync(resolve(import.meta.dirname, '../../../../tokens/src/theme.css'), 'utf8');
    for (const gap of gapKeys) {
      const { container, unmount } = render(
        <Grid gap={gap}>
          <span>Cell</span>
        </Grid>
      );
      expect(withPrefix(marked(container, 'eg-grid'), 'gap-'), `gap ${gap}`).toEqual([`gap-${gap}`]);
      expect(theme, `gap-${gap} must map to --space-${gap}`).toMatch(new RegExp(`--space-${gap}:\\s`));
      unmount();
    }
  });

  it.each(alignValues)('G4: alignItems %s emits exactly its own items utility', (alignItems) => {
    const { container } = render(
      <Grid alignItems={alignItems}>
        <span>Cell</span>
      </Grid>
    );
    expect(withPrefix(marked(container, 'eg-grid'), 'items-')).toEqual([`items-${alignItems}`]);
  });

  it.each([860, 1080] as const)(
    'G5: collapseBelow %i adds exactly the three utilities of its own query and none of the other',
    (threshold) => {
      const other = threshold === 860 ? 1080 : 860;
      for (const columnCount of [1, 12] as const) {
        const { container, unmount } = render(
          <Grid columnCount={columnCount} collapseBelow={threshold}>
            <span>Cell</span>
          </Grid>
        );
        const root = marked(container, 'eg-grid');
        expect(collapseClasses(root).sort(), `${columnCount} columns`).toEqual(collapseUtilities(threshold));
        expect(
          collapseClasses(root).some((name) => name.includes(`${other}px`)),
          `${columnCount} columns`
        ).toBe(false);
        // The unconditional column count is untouched by the collapse.
        expect(withPrefix(root, 'grid-cols-')).toEqual([`grid-cols-${columnCount}`]);
        unmount();
      }
    }
  );

  it('G5: an omitted collapseBelow adds no collapse utility at any column count', () => {
    for (const columnCount of [1, 2, 3, 4, 12] as const) {
      const { container, unmount } = render(
        <Grid columnCount={columnCount}>
          <span>Cell</span>
        </Grid>
      );
      expect(collapseClasses(marked(container, 'eg-grid'))).toEqual([]);
      unmount();
    }
  });

  it('G6: span 1 to 12 and rowSpan 1 to 4 emit exactly their own utilities, independently', () => {
    for (const span of spans) {
      const { container, unmount } = render(<GridItem span={span}>Cell</GridItem>);
      const cell = marked(container, 'eg-grid-item');
      expect(withPrefix(cell, 'col-span-'), `span ${span}`).toEqual([`col-span-${span}`]);
      expect(withPrefix(cell, 'row-span-'), `span ${span}`).toEqual([]);
      unmount();
    }
    for (const rowSpan of rowSpans) {
      const { container, unmount } = render(<GridItem rowSpan={rowSpan}>Cell</GridItem>);
      const cell = marked(container, 'eg-grid-item');
      expect(withPrefix(cell, 'row-span-'), `rowSpan ${rowSpan}`).toEqual([`row-span-${rowSpan}`]);
      expect(withPrefix(cell, 'col-span-'), `rowSpan ${rowSpan}`).toEqual([]);
      unmount();
    }
    const { container } = render(
      <GridItem span={7} rowSpan={2}>
        Featured
      </GridItem>
    );
    const both = marked(container, 'eg-grid-item');
    expect(withPrefix(both, 'col-span-')).toEqual(['col-span-7']);
    expect(withPrefix(both, 'row-span-')).toEqual(['row-span-2']);
  });

  it('G7: a rerender drops the replaced utility, adds the new one and keeps the same DOM nodes', () => {
    const { container, rerender } = render(
      <Grid columnCount={3} gap={4} collapseBelow={860}>
        <GridItem span={5}>Cell</GridItem>
      </Grid>
    );
    const root = marked(container, 'eg-grid');
    const cell = marked(container, 'eg-grid-item');
    expect(collapseClasses(root).sort()).toEqual(collapseUtilities(860));

    rerender(
      <Grid columnCount={2} gap={8} collapseBelow={1080}>
        <GridItem span={7}>Cell</GridItem>
      </Grid>
    );
    expect(marked(container, 'eg-grid')).toBe(root);
    expect(marked(container, 'eg-grid-item')).toBe(cell);
    expect(withPrefix(root, 'grid-cols-')).toEqual(['grid-cols-2']);
    expect(withPrefix(root, 'gap-')).toEqual(['gap-8']);
    expect(collapseClasses(root).sort()).toEqual(collapseUtilities(1080));
    expect(withPrefix(cell, 'col-span-')).toEqual(['col-span-7']);

    rerender(
      <Grid columnCount={2} gap={8}>
        <GridItem span={7}>Cell</GridItem>
      </Grid>
    );
    expect(collapseClasses(root)).toEqual([]);
    expect(withPrefix(root, 'grid-cols-')).toEqual(['grid-cols-2']);
  });

  it.each([
    ['columnCount', 5, 'grid-cols-'],
    ['columnCount', 0, 'grid-cols-'],
    ['columnCount', null, 'grid-cols-'],
    ['gap', 9, 'gap-'],
    ['gap', null, 'gap-'],
    ['alignItems', 'around', 'items-'],
    ['alignItems', null, 'items-'],
    ['collapseBelow', 900, '@media'],
    ['collapseBelow', 0, '@media'],
    ['collapseBelow', null, '@media']
  ] as const)(
    'G8: Grid ignores the unsupported runtime value %s=%j without a class, attribute, throw or console call',
    (prop, value, utilityPrefix) => {
      const { container } = render(
        <Grid {...untyped<GridProps>({ [prop]: value })}>
          <span>Cell</span>
        </Grid>
      );
      const root = marked(container, 'eg-grid');
      // The axis contributes nothing of its own, whatever the default would have been.
      expect(classesOf(root).filter((name) => name.startsWith(utilityPrefix) || name.includes(utilityPrefix))).toEqual(
        []
      );
      // Nothing is interpolated into a class and nothing reaches the DOM.
      expect(root.getAttributeNames()).toEqual(['class']);
      expect(classesOf(root).filter((name) => /undefined|null|NaN|\[object/.test(name))).toEqual([]);
      for (const spy of consoleSpies) {
        expect(spy).not.toHaveBeenCalled();
      }
    }
  );

  it.each([
    ['span', 13, 'col-span-'],
    ['span', 0, 'col-span-'],
    ['span', null, 'col-span-'],
    ['rowSpan', 5, 'row-span-'],
    ['rowSpan', 0, 'row-span-'],
    ['rowSpan', null, 'row-span-']
  ] as const)(
    'G8: GridItem ignores the unsupported runtime value %s=%j without a class, attribute, throw or console call',
    (prop, value, utilityPrefix) => {
      const { container } = render(<GridItem {...untyped<GridItemProps>({ [prop]: value })}>Cell</GridItem>);
      const cell = marked(container, 'eg-grid-item');
      expect(withPrefix(cell, utilityPrefix)).toEqual([]);
      expect(cell).toHaveClass('eg-grid-item', 'min-w-0');
      expect(cell.getAttributeNames()).toEqual(['class']);
      for (const spy of consoleSpies) {
        expect(spy).not.toHaveBeenCalled();
      }
    }
  );

  it('G8: undefined, NaN and the empty string behave as omitted, as the variant fallback does', () => {
    for (const value of [undefined, Number.NaN, '']) {
      const { container, unmount } = render(
        <Grid {...untyped<GridProps>({ columnCount: value, gap: value, alignItems: value, collapseBelow: value })}>
          <span>Cell</span>
        </Grid>
      );
      const root = marked(container, 'eg-grid');
      expect(withPrefix(root, 'grid-cols-'), String(value)).toEqual(['grid-cols-1']);
      expect(withPrefix(root, 'gap-'), String(value)).toEqual(['gap-4']);
      expect(withPrefix(root, 'items-'), String(value)).toEqual(['items-stretch']);
      expect(collapseClasses(root), String(value)).toEqual([]);
      unmount();
      const item = render(<GridItem {...untyped<GridItemProps>({ span: value, rowSpan: value })}>Cell</GridItem>);
      const cell = marked(item.container, 'eg-grid-item');
      expect(withPrefix(cell, 'col-span-'), String(value)).toEqual([]);
      expect(withPrefix(cell, 'row-span-'), String(value)).toEqual([]);
      item.unmount();
    }
    for (const spy of consoleSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('G9: keeps every utility a static literal and sets no style or custom property', () => {
    // Doc comments quote code with backticks, so only the code is inspected.
    const code = (file: string) =>
      readFileSync(resolve(import.meta.dirname, file), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
    const types = code('types.ts');
    expect(types).not.toContain('${');
    expect(types).not.toContain('`');
    for (const file of ['types.ts', 'useGrid.ts', 'Grid.tsx']) {
      const source = code(file);
      expect(source, `${file} must not set an inline style`).not.toMatch(/\bstyle\b/);
      expect(source, `${file} must not set a custom property`).not.toMatch(/['"]--[a-z]/);
    }
  });

  it('G10: never emits a utility that can reorder content, whatever the props', () => {
    const reordering = /^(?:order|col-start|col-end|row-start|row-end|grid-flow)-/;
    const reordered = (element: HTMLElement) => classesOf(element).filter((name) => reordering.test(baseUtility(name)));
    for (const columnCount of [1, 2, 3, 4, 12] as const) {
      for (const collapseBelow of [undefined, 860, 1080] as const) {
        const { container, unmount } = render(
          <Grid columnCount={columnCount} collapseBelow={collapseBelow} gap={6} alignItems='baseline'>
            <span>Cell</span>
          </Grid>
        );
        expect(reordered(marked(container, 'eg-grid')), `${columnCount}/${collapseBelow}`).toEqual([]);
        unmount();
      }
    }
    for (const span of spans) {
      for (const rowSpan of rowSpans) {
        const { container, unmount } = render(
          <GridItem span={span} rowSpan={rowSpan}>
            Cell
          </GridItem>
        );
        expect(reordered(marked(container, 'eg-grid-item')), `${span}/${rowSpan}`).toEqual([]);
        unmount();
      }
    }
  });

  it('G10: keeps the tab order equal to the DOM order whatever the spans', async () => {
    const user = userEvent.setup();
    render(
      <Grid columnCount={12} collapseBelow={1080}>
        <GridItem span={7} rowSpan={2}>
          <button type='button'>First</button>
        </GridItem>
        <GridItem span={5}>
          <button type='button'>Second</button>
        </GridItem>
        <GridItem span={5}>
          <button type='button'>Third</button>
        </GridItem>
      </Grid>
    );
    const visited: string[] = [];
    for (let step = 0; step < 3; step += 1) {
      await user.tab();
      visited.push(document.activeElement?.textContent ?? '');
    }
    expect(visited).toEqual(['First', 'Second', 'Third']);
  });

  it('G11: merges Grid and GridItem onto a list and its items without a wrapper, keeping the child attributes and ref', () => {
    const listRef = createRef<HTMLUListElement>();
    const itemRef = createRef<HTMLLIElement>();
    const { container } = render(
      <Grid asChild={true} columnCount={12} gap={6} collapseBelow={1080}>
        <ul ref={listRef} aria-label='Projects' className='project-list'>
          <GridItem asChild={true} span={7} rowSpan={2}>
            <li ref={itemRef} className='featured'>
              Featured
            </li>
          </GridItem>
          <GridItem asChild={true} span={5}>
            <li>Second</li>
          </GridItem>
        </ul>
      </Grid>
    );
    const list = screen.getByRole('list', { name: 'Projects' });
    // No wrapper element: the list is the only child of the container.
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(list);
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('eg-grid', 'grid', 'grid-cols-12', 'gap-6', 'project-list');
    expect(collapseClasses(list).sort()).toEqual(collapseUtilities(1080));
    expect(listRef.current).toBe(list);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.tagName)).toEqual(['LI', 'LI']);
    expect([...list.children]).toEqual(items);
    expect(items[0]).toHaveClass('eg-grid-item', 'col-span-7', 'row-span-2', 'featured');
    expect(items[1]).toHaveClass('eg-grid-item', 'col-span-5');
    expect(itemRef.current).toBe(items[0]);
    expect(container.querySelector('[data-slot]')).toBeNull();
  });

  it('G11: merges a GridItem onto a Stack so one element is both the grid item and the vertical flow', () => {
    render(
      <Grid columnCount={12}>
        <GridItem asChild={true} span={7}>
          <Stack gap={8} aria-label='Quote column'>
            <p>Quote</p>
            <p>Profile</p>
          </Stack>
        </GridItem>
      </Grid>
    );
    const column = screen.getByLabelText('Quote column');
    expect(column).toHaveClass('eg-grid-item', 'eg-stack', 'col-span-7', 'gap-8', 'flex-col');
    expect(column.parentElement).toHaveClass('eg-grid');
    expect(column.children).toHaveLength(2);
  });

  it('G11: exposes plain function components with no public ref', () => {
    expect(typeof Grid).toBe('function');
    expect(typeof GridItem).toBe('function');
    expect(Grid).not.toHaveProperty('$$typeof');
    expect(GridItem).not.toHaveProperty('$$typeof');
    expect(Grid.displayName).toBe('Grid');
    expect(GridItem.displayName).toBe('GridItem');
    const ref = createRef<HTMLDivElement>();
    // @ts-expect-error The public props omit refs: an asChild child keeps its own ref through Slot instead.
    const refProps: GridProps = { ref };
    expect(refProps).toBeDefined();
  });

  it('G12: passes native attributes and events to the root and merges className after the variants', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <Grid
        aria-label='Projects'
        id='projects'
        data-region='build'
        className='mt-6 justify-self-end'
        onClick={clicked}
        columnCount={3}
        gap={5}
      >
        <button type='button'>Open</button>
      </Grid>
    );
    const root = screen.getByLabelText('Projects');
    expect(root).toHaveAttribute('id', 'projects');
    expect(root).toHaveAttribute('data-region', 'build');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    // The marker and every variant utility stay; className comes last.
    expect(root).toHaveClass('eg-grid', 'grid', 'grid-cols-3', 'gap-5', 'items-stretch', 'mt-6', 'justify-self-end');
    expect(classesOf(root).slice(-2)).toEqual(['mt-6', 'justify-self-end']);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(clicked).toHaveBeenCalledTimes(1);

    render(
      <GridItem aria-label='Cell' id='cell' data-slot-name='media' className='self-start' span={5}>
        Cell
      </GridItem>
    );
    const cell = screen.getByLabelText('Cell');
    expect(cell).toHaveAttribute('id', 'cell');
    expect(cell).toHaveAttribute('data-slot-name', 'media');
    expect(cell).toHaveClass('eg-grid-item', 'min-w-0', 'col-span-5', 'self-start');
    expect(classesOf(cell).at(-1)).toBe('self-start');
  });

  it('G13: creates no cell for null, false, empty or text-only children', () => {
    const sparse = render(
      <Grid>
        {null}
        <span>Only</span>
        {false}
      </Grid>
    );
    expect(marked(sparse.container, 'eg-grid').children).toHaveLength(1);
    sparse.unmount();

    const empty = render(<Grid />);
    expect(marked(empty.container, 'eg-grid').childNodes).toHaveLength(0);
    empty.unmount();

    const text = render(<Grid>Just text</Grid>);
    const root = marked(text.container, 'eg-grid');
    expect(root.children).toHaveLength(0);
    expect(root).toHaveTextContent('Just text');
    text.unmount();

    const nothing = render(
      <Grid>
        <GridItem>{null}</GridItem>
      </Grid>
    );
    expect(marked(nothing.container, 'eg-grid-item').childNodes).toHaveLength(0);
  });
});
