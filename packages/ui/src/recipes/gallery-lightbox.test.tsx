import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { composeStory } from '@storybook/react-vite';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import * as publicAPI from '../index';
import meta, { Default } from './gallery-lightbox.stories';

const Gallery = composeStory(Default, meta);
const storySource = readFileSync(resolve(import.meta.dirname, 'gallery-lightbox.stories.tsx'), 'utf8');

const photos = ['Workbench', 'Whiteboard', 'Prototype', 'Notes wall', 'Desk setup', 'Release day'];
const opener = (label: string) => screen.getByRole('button', { name: `Enlarge photo: ${label}` });
/** The list item that holds one photo's thumbnail and its trigger. */
const itemOf = (label: string) => {
  const item = opener(label).closest('li');
  if (!item) {
    throw new Error(`The trigger of "${label}" is not inside a list item`);
  }
  return item;
};
const dialog = () => screen.getByRole('dialog', { name: 'Studio photos' });
const slides = () =>
  within(dialog())
    .getAllByRole('group')
    .filter((node) => node.getAttribute('aria-roledescription') === 'slide');
const currentSlide = () => slides().find((node) => node.getAttribute('aria-current') === 'true');
const slideName = (position: number) => `${position} of ${photos.length}: ${photos[position - 1]}`;
const counter = (position: number) =>
  `${String(position).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;

/**
 * A button's content model is phrasing content with no interactive descendant, so none of these elements may sit
 * inside any button. Flow-only containers and interactive elements are listed; phrasing content such as `span` and
 * `svg` is what Button and IconButton legitimately render.
 */
const nonPhrasingInButton = [
  'figure',
  'div',
  'p',
  'ul',
  'ol',
  'li',
  'section',
  'article',
  'nav',
  'header',
  'footer',
  'aside',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'form',
  'fieldset',
  'details',
  'dialog',
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'label'
]
  .map((tag) => `button ${tag}`)
  .join(', ');

/** Render the recipe and open the thumbnail named `label` with a real pointer click. */
async function open(label: string) {
  const user = userEvent.setup();
  render(<Gallery />);
  await user.click(opener(label));
  await screen.findByRole('dialog', { name: 'Studio photos' });
  return user;
}

describe('Gallery lightbox recipe (#575, composed under the #509 decision)', () => {
  it('lists one figure per photo with its own Button trigger beside it, and no dialog until one is opened', () => {
    const { container } = render(<Gallery />);
    const list = screen.getByRole('list', { name: 'Photo gallery' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(photos.length);
    for (const label of photos) {
      const item = itemOf(label);
      const trigger = opener(label);
      const figure = item.querySelector('figure.eg-photo');
      expect(figure).toBeInTheDocument();
      // The trigger and the thumbnail are siblings inside the item; neither wraps the other.
      expect(figure?.parentElement).toBe(item);
      expect(trigger.parentElement).toBe(item);
      // The thumbnail is content, not decoration: it keeps its own alternative and its caption.
      expect(within(item).getByRole('img', { name: new RegExp(label) })).toBeInTheDocument();
      expect(within(item).getByText(label)).toBeInTheDocument();
      // A short visible label, with an accessible name that is unique per photo and contains it (WCAG 2.5.3).
      expect(trigger).toHaveTextContent(/^Enlarge$/);
      expect(trigger.getAttribute('aria-label')).toContain(trigger.textContent ?? '');
      expect(trigger).toHaveAttribute('type', 'button');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
    // Thumbnails keep PhotoFrame's default cover crop; the enlarged view is what shows the whole image.
    const images = [...container.querySelectorAll('.eg-photo__img')];
    expect(images).toHaveLength(photos.length);
    for (const image of images) {
      expect(image).toHaveClass('object-cover');
      expect(image).not.toHaveClass('object-contain');
    }
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('never nests a figure inside a button: the trigger is a sibling of its thumbnail, not a wrapper', async () => {
    await open('Prototype');
    // Six thumbnails in the page and six slides in the open dialog.
    const figures = [...document.body.querySelectorAll('figure')];
    expect(figures).toHaveLength(photos.length * 2);
    expect(document.body.querySelector('button figure')).toBeNull();
    for (const figure of figures) {
      expect(figure.closest('button, a, [role="button"]')).toBeNull();
    }
    // Every trigger shares its list item with the thumbnail it opens.
    const triggers = [...document.body.querySelectorAll('li > button')];
    expect(triggers).toHaveLength(photos.length);
    for (const trigger of triggers) {
      expect([...(trigger.parentElement?.children ?? [])].some((child) => child.tagName === 'FIGURE')).toBe(true);
    }
    // The general rule behind it: no flow-only or interactive element sits inside any button.
    expect([...document.body.querySelectorAll(nonPhrasingInButton)].map((node) => node.tagName)).toEqual([]);
  });

  it('opens a full-size dialog with the host-supplied title and close label on click', async () => {
    await open('Prototype');
    const panel = dialog();
    expect(panel).toHaveClass('eg-dialog', 'h-full', 'max-w-none');
    expect(panel).toHaveAccessibleName('Studio photos');
    expect(within(panel).getByRole('heading', { name: 'Studio photos' })).toBeVisible();
    expect(within(panel).getByRole('button', { name: 'Close photos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enlarge photo: Prototype', hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it.each([
    ['Workbench', 1],
    ['Prototype', 3],
    ['Release day', 6]
  ])('starts the Carousel at the clicked photo: %s', async (label, position) => {
    await open(label);
    const current = currentSlide();
    expect(current).toBeDefined();
    expect(current).toHaveAccessibleName(slideName(position));
    expect(slides()).toHaveLength(photos.length);
    expect(
      screen.getByText(
        (_, node) => node?.getAttribute('aria-hidden') === 'true' && node.textContent === counter(position)
      )
    ).toBeInTheDocument();
    expect(within(dialog()).getByRole('button', { name: 'Previous slide' })).toHaveProperty('disabled', position === 1);
    expect(within(dialog()).getByRole('button', { name: 'Next slide' })).toHaveProperty(
      'disabled',
      position === photos.length
    );
  });

  it('shows every photo whole with fit contain, in one letterboxed viewport proportion', async () => {
    await open('Prototype');
    const images = within(dialog()).getAllByRole('img');
    expect(images).toHaveLength(photos.length);
    for (const image of images) {
      expect(image).toHaveClass('object-contain');
      expect(image).not.toHaveClass('object-cover');
    }
    const frames = [...dialog().querySelectorAll('figure.eg-photo')];
    expect(frames).toHaveLength(photos.length);
    expect(new Set(frames.map((frame) => frame.getAttribute('data-ratio'))).size).toBe(1);
  });

  it('moves between photos with the arrow keys, Home and End, bounded at both ends', async () => {
    const user = await open('Prototype');
    // Initial focus lands on the current slide, so the keys work without a Tab.
    expect(currentSlide()).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(currentSlide()).toHaveAccessibleName(slideName(4));
    expect(currentSlide()).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(currentSlide()).toHaveAccessibleName(slideName(2));
    await user.keyboard('{End}');
    expect(currentSlide()).toHaveAccessibleName(slideName(6));
    await user.keyboard('{ArrowRight}');
    expect(currentSlide()).toHaveAccessibleName(slideName(6));
    await user.keyboard('{Home}');
    expect(currentSlide()).toHaveAccessibleName(slideName(1));
    await user.keyboard('{ArrowLeft}');
    expect(currentSlide()).toHaveAccessibleName(slideName(1));
    expect(currentSlide()).toHaveFocus();
    // The Previous and Next buttons stay available to pointer users.
    await user.click(within(dialog()).getByRole('button', { name: 'Next slide' }));
    expect(currentSlide()).toHaveAccessibleName(slideName(2));
  });

  it('closes on Escape and returns focus to the button that opened it', async () => {
    const user = await open('Prototype');
    await user.keyboard('{End}');
    expect(currentSlide()).toHaveAccessibleName(slideName(6));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // The opener regains focus, not the button of the photo the reader had reached.
    await waitFor(() => expect(opener('Prototype')).toHaveFocus());
    expect(opener('Prototype')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes with the dismiss button and reopens another photo at its own slide', async () => {
    const user = await open('Prototype');
    await user.keyboard('{End}');
    await user.click(within(dialog()).getByRole('button', { name: 'Close photos' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(opener('Prototype')).toHaveFocus());
    await user.click(opener('Workbench'));
    await screen.findByRole('dialog', { name: 'Studio photos' });
    expect(currentSlide()).toHaveAccessibleName(slideName(1));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(opener('Workbench')).toHaveFocus());
  });

  it('opens from the keyboard on Enter and Space, with the same start slide', async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    opener('Notes wall').focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: 'Studio photos' });
    expect(currentSlide()).toHaveAccessibleName(slideName(4));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(opener('Notes wall')).toHaveFocus());
    await user.keyboard(' ');
    await screen.findByRole('dialog', { name: 'Studio photos' });
    expect(currentSlide()).toHaveAccessibleName(slideName(4));
  });

  it('composes only public exports and the existing PhotoFrame fixture, with no appearance override', () => {
    const specifiers = [...storySource.matchAll(/from '([^']+)'/g)].flatMap((match) => (match[1] ? [match[1]] : []));
    const relative = specifiers.filter((specifier) => specifier.startsWith('.'));
    expect(relative.sort()).toEqual(
      [
        '../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url',
        '../atoms/button',
        '../atoms/photo-frame',
        '../molecules/carousel',
        '../molecules/dialog'
      ].sort()
    );
    for (const name of ['Button', 'PhotoFrame', 'Carousel', 'Dialog', 'DialogTrigger', 'DialogContent']) {
      expect(publicAPI, name).toHaveProperty(name);
    }
    // className, style and appearance props stay on the story's own elements, never on a design-system component.
    expect(storySource).not.toMatch(
      /<(?:Button|PhotoFrame|Carousel|Dialog|DialogTrigger|DialogContent)\b[^>]*\b(?:className|style)=/
    );
    expect(storySource).not.toMatch(/\bstyle=/);
  });

  it('styles its own elements only with utilities that the production recipes already compile', () => {
    // Storybook compiles utilities from files listed in .storybook/preview.css, not from this story, so the story
    // may only use classes that a production types.ts already contains as whole tokens.
    const source = resolve(import.meta.dirname, '..');
    const recipes = readdirSync(source, { recursive: true })
      .map(String)
      .filter((path) => /(?:^|\/)types\.ts$/.test(path))
      .map((path) => readFileSync(resolve(source, path), 'utf8'))
      .join('\n');
    const lists = [...storySource.matchAll(/className='([^']+)'/g)].map((match) => match[1] ?? '');
    const utilities = lists.flatMap((list) => list.split(/\s+/)).filter(Boolean);
    expect(utilities.length).toBeGreaterThan(10);
    const literal = (token: string) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const missing = utilities.filter(
      (token) => !new RegExp(`(?:^|[\\s'"\`])${literal(token)}(?:$|[\\s'"\`])`).test(recipes)
    );
    expect(missing).toEqual([]);
  });

  it('documents the pattern in English and why the app composes it (#509, #575)', () => {
    const description = storySource.slice(0, storySource.indexOf('const meta'));
    for (const fragment of [
      '#509',
      '#575',
      'Dialog',
      'Carousel',
      'PhotoFrame',
      'Button',
      "fit='contain'",
      'Escape',
      'focus',
      'figure',
      'sibling'
    ]) {
      expect(description, fragment).toContain(fragment);
    }
    expect(description).toMatch(/no GalleryLightbox export/i);
    expect(meta.title).toBe('Recipes/Gallery lightbox');
    expect(publicAPI).not.toHaveProperty('GalleryLightbox');
  });
});
