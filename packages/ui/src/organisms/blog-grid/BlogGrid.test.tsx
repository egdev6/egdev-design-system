import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleFeature, ArticleFeatureCover } from '../../molecules/article-feature';
import { ListItem, ListItemBody, ListItemTitle } from '../../molecules/list-item';
import { BlogGrid, BlogGridArchive, BlogGridFeature, BlogGridRow, BlogGridRows } from './index';

const feature = (
  <BlogGridFeature>
    <ArticleFeature href='#featured' title='Featured article' actionLabel='Read'>
      <ArticleFeatureCover badge='Featured' coverWord='/hidden' />
    </ArticleFeature>
  </BlogGridFeature>
);
const row = (title: string) => (
  <BlogGridRow key={title}>
    <ListItem variant='editorial' asChild={true}>
      <a href={`#${title}`}>
        <ListItemBody>
          <ListItemTitle>{title}</ListItemTitle>
        </ListItemBody>
      </a>
    </ListItem>
  </BlogGridRow>
);
const archive = (
  <BlogGridArchive>
    <a href='#archive'>Archive</a>
  </BlogGridArchive>
);

describe('BlogGrid', () => {
  it('BG-01/02/04/06 preserves independent links, semantic list, ordering and native attributes', () => {
    const { container } = render(
      <section aria-label='Articles'>
        <h2>Articles</h2>
        <BlogGrid id='grid' data-owner='host' aria-label='Editorial' className='mt-4 mt-6'>
          {feature}
          <BlogGridRows>{[row('First'), row('Second')]}</BlogGridRows>
          {archive}
        </BlogGrid>
      </section>
    );
    const root = container.querySelector('#grid');
    expect(root).toHaveClass('eg-blog-grid', 'mt-6');
    expect(root).not.toHaveClass('mt-4');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveAttribute('aria-label', 'Editorial');
    expect(root?.tagName).toBe('DIV');
    expect(screen.getAllByRole('link').map((el) => el.getAttribute('href'))).toEqual([
      '#featured',
      '#First',
      '#Second',
      '#archive'
    ]);
    expect(screen.getByRole('link', { name: /Featured.*Featured article.*Read/i })).toBeInTheDocument();
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(Array.from(list.children).every((el) => el.tagName === 'LI' && el.firstElementChild?.tagName === 'A')).toBe(
      true
    );
    expect(list.contains(screen.getByRole('link', { name: 'Archive' }))).toBe(false);
    expect(root?.querySelector('a a, a button')).toBeNull();
    expect(screen.getAllByRole('region')).toHaveLength(1);
  });
  it('BG-01 omits empty lists for arrays, null and false while retaining archive', () => {
    for (const children of [[], null, false]) {
      const { unmount } = render(
        <BlogGrid>
          {feature}
          <BlogGridRows>{children}</BlogGridRows>
          {archive}
        </BlogGrid>
      );
      expect(screen.queryByRole('list')).toBeNull();
      expect(screen.getByRole('link', { name: 'Archive' })).toBeInTheDocument();
      unmount();
    }
  });
  it('BG-01 omits an absent archive', () => {
    render(
      <BlogGrid>
        {feature}
        <BlogGridRows>{row('First')}</BlogGridRows>
      </BlogGrid>
    );
    expect(screen.queryByRole('link', { name: 'Archive' })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
  it('BG-03/05 assigns the exact responsive and neutralizing utilities to each part', () => {
    const { container } = render(
      <BlogGrid>
        {feature}
        <BlogGridRows>{row('First')}</BlogGridRows>
        {archive}
      </BlogGrid>
    );
    const root = container.querySelector('.eg-blog-grid');
    const list = screen.getByRole('list');
    const li = screen.getByRole('listitem');
    const featureWrapper = screen.getByRole('link', { name: /Featured article/ }).parentElement;
    const archiveWrapper = screen.getByRole('link', { name: 'Archive' }).parentElement;
    expect(root).toHaveClass(
      'grid',
      'grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
      'grid-rows-[minmax(0,1fr)_auto]',
      'gap-x-5',
      'gap-y-0',
      'items-stretch',
      'min-w-0',
      '[@media(width<=1080px)]:grid-cols-1',
      '[@media(width<=1080px)]:grid-rows-none'
    );
    expect(featureWrapper).toHaveClass(
      'min-w-0',
      'col-start-1',
      'row-start-1',
      'row-span-2',
      '[&>a]:h-full',
      '[@media(width<=1080px)]:col-auto',
      '[@media(width<=1080px)]:row-auto',
      '[@media(width<=1080px)]:[&>a]:h-auto'
    );
    expect(featureWrapper).not.toHaveClass('[@media(width<=1080px)]:row-span-1');
    expect(list).toHaveClass(
      'min-w-0',
      'col-start-2',
      'row-start-1',
      'flex',
      'flex-col',
      'h-full',
      'gap-3',
      'list-none',
      'm-0',
      'p-0',
      '[@media(width<=1080px)]:col-auto',
      '[@media(width<=1080px)]:row-auto',
      '[@media(width<=1080px)]:h-auto'
    );
    expect(li).toHaveClass(
      'min-w-0',
      'flex-1',
      '[&>a]:h-full',
      '[@media(width<=1080px)]:flex-none',
      '[@media(width<=1080px)]:[&>a]:h-auto'
    );
    expect(archiveWrapper).toHaveClass(
      'min-w-0',
      'col-start-2',
      'row-start-2',
      'self-start',
      'mt-2',
      '[@media(width<=1080px)]:col-auto',
      '[@media(width<=1080px)]:row-auto'
    );
    expect(container.querySelector('.eg-blog-grid__list, .eg-blog-grid__all')).toBeNull();
  });
});
