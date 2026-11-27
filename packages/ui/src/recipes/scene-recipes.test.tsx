import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { composeStory } from '@storybook/react-vite';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import meta, { AboutScene, CommunityScene } from './scene-recipes.stories';

const About = composeStory(AboutScene, meta);
const Community = composeStory(CommunityScene, meta);

/** The recipe source without comments, so only the code is inspected. */
const code = readFileSync(resolve(import.meta.dirname, 'scene-recipes.stories.tsx'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const collapse = (element: Element, threshold: number) =>
  [...element.classList].filter((name) => name.includes(`[@media(width<=${threshold}px)]`)).sort();

function childAt(parent: HTMLElement, index: number): HTMLElement {
  const child = parent.children.item(index);
  if (!(child instanceof HTMLElement)) {
    throw new Error(`Missing the child at ${index}`);
  }
  return child;
}

function gridRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector('.eg-grid');
  if (!(root instanceof HTMLElement)) {
    throw new Error('The recipe must render a Grid root');
  }
  return root;
}

describe('Scene recipes lay their columns out with Grid', () => {
  it('keeps no consumer column utility in the recipe source and uses the approved Grid props', () => {
    // A consumer that writes no utilities (#392) cannot generate these, which is the reason for Grid.
    expect(code).not.toMatch(/min-\[48rem\]/);
    expect(code).not.toMatch(/grid-cols-\d/);
    expect(code).not.toMatch(/className=['"][^'"]*\bgrid\b/);
    expect(code).toContain("<Grid columnCount={12} gap={10} alignItems='stretch' collapseBelow={860}>");
    expect(code).toContain("<Grid columnCount={2} gap={6} alignItems='stretch' collapseBelow={860}>");
    expect(code).not.toContain('collapseBelow={1080}');
  });

  it('renders About as 5 and 7 columns of 12, the copy column being one Stack merged onto its grid item', () => {
    const { container } = render(<About />);
    const root = gridRoot(container);
    expect(root).toHaveClass('grid-cols-12', 'gap-10', 'items-stretch');
    // Stacks at and below 860px, never 1080px.
    expect(collapse(root, 860)).toHaveLength(3);
    expect(collapse(root, 1080)).toEqual([]);

    expect(root.children).toHaveLength(2);
    const media = childAt(root, 0);
    const copy = childAt(root, 1);
    expect(media).toHaveClass('eg-grid-item', 'col-span-5');
    expect(
      within(media).getByRole('img', { name: 'Diagnostic grid fixture standing in for a photograph' })
    ).toBeInTheDocument();
    expect(copy).toHaveClass('eg-grid-item', 'col-span-7', 'eg-stack', 'gap-8', 'justify-center');
    // DOM order is the reading order: the media first, then the quotation and the profile card.
    expect(within(copy).getByText('Illustrative quotation, not web copy')).toBeInTheDocument();
    expect(within(copy).getByLabelText('Studio profile')).toBeInTheDocument();
    expect(media.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders Community as two equal columns of cards that stack at and below 860px', () => {
    const { container } = render(<Community />);
    const root = gridRoot(container);
    expect(root).toHaveClass('grid-cols-2', 'gap-6', 'items-stretch');
    expect(collapse(root, 860)).toHaveLength(3);
    expect(collapse(root, 1080)).toEqual([]);
    expect(root.children).toHaveLength(2);
    for (const card of root.children) {
      expect(card).toHaveClass('eg-community-card');
    }
    expect(screen.getByRole('link', { name: 'Join the community' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Join the streams' })).toBeInTheDocument();
  });
});
