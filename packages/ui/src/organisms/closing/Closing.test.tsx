import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../../atoms/button';
import { Link } from '../../atoms/link';
import { SectionShell } from '../../templates/section-shell';
import { Closing, type ClosingProps } from './index';

describe('Closing expanded contract', () => {
  it('uses a single column without media so no empty media track remains (CL-03)', () => {
    const { container, rerender } = render(
      <Closing title='Keep building' level={2}>
        <a href='#next'>Next</a>
      </Closing>
    );
    const grid = container.querySelector('.eg-closing')?.firstElementChild;
    expect(grid).toHaveClass('grid', 'grid-cols-1');
    expect(grid).not.toHaveClass('grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]');
    rerender(
      <Closing title='Keep building' level={2} media={<span>Art</span>}>
        <a href='#next'>Next</a>
      </Closing>
    );
    expect(container.querySelector('.eg-closing')?.firstElementChild).toHaveClass(
      'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1'
    );
    rerender(
      <Closing title='Keep building' level={2} media={false}>
        <a href='#next'>Next</a>
      </Closing>
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(container.querySelector('.eg-closing')?.firstElementChild).not.toHaveClass(
      'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]'
    );
  });
  it.each([1, 2, 3, 4, 5, 6] as const)('CL-01 forwards heading ID at rank %i only', (level) => {
    const { container } = render(
      <SectionShell aria-labelledby={`rank-${level}`}>
        <Closing title='Ranked' level={level} id={`rank-${level}`}>
          <Button>Go</Button>
        </Closing>
      </SectionShell>
    );
    expect(screen.getByRole('region', { name: 'Ranked' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level, name: 'Ranked' })).toHaveAttribute('id', `rank-${level}`);
    expect(container.querySelector('.eg-closing')).not.toHaveAttribute('id');
    expect(container.querySelectorAll(`#rank-${level}`)).toHaveLength(1);
  });

  it.each(['eyebrow', 'accent', 'lede', 'media'] as const)('CL-01/03 omits %s independently', (missing) => {
    const options = {
      eyebrow: 'Context',
      accent: 'Accent',
      lede: 'Introduction',
      media: <img alt='' src='/decoration.png' />
    };
    const { [missing]: _omitted, ...present } = options;
    const { container } = render(
      <Closing title='Heading ' level={2} {...present}>
        <Button>Go</Button>
      </Closing>
    );
    expect(Boolean(screen.queryByText('Context'))).toBe(missing !== 'eyebrow');
    expect(Boolean(container.querySelector('.eg-heading__accent'))).toBe(missing !== 'accent');
    expect(Boolean(screen.queryByText('Introduction'))).toBe(missing !== 'lede');
    expect(Boolean(container.querySelector('[aria-hidden="true"]:has(img)'))).toBe(missing !== 'media');
    const root = container.querySelector('.eg-closing');
    const grid = root?.firstElementChild;
    const copy = grid?.firstElementChild;
    expect(grid?.children).toHaveLength(missing === 'media' ? 1 : 2);
    expect(copy?.children).toHaveLength(missing === 'eyebrow' || missing === 'lede' ? 3 : 4);
  });

  it.each([1, 2, 3])('CL-02/06 preserves %i independent CTA(s) and their native activation', async (count) => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const controls = [
      <Button key='button' onClick={() => calls.push('button')}>
        Button
      </Button>,
      <Link
        key='link'
        href='#link'
        onClick={(event) => {
          event.preventDefault();
          calls.push('link');
        }}
      >
        Link
      </Link>,
      <Button key='third' onClick={() => calls.push('third')}>
        Third
      </Button>
    ].slice(0, count);
    const { container } = render(
      <Closing title='Actions' level={2}>
        {controls}
      </Closing>
    );
    const names = ['Button', 'Link', 'Third'].slice(0, count);
    expect(Array.from(container.querySelectorAll('button, a')).map((node) => node.textContent)).toEqual(names);
    for (const [index, name] of names.entries()) {
      await user.tab();
      const control = screen.getByRole(index === 1 ? 'link' : 'button', { name });
      expect(control).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
    }
    expect(calls).toEqual([
      'button',
      'button',
      ...(count > 1 ? ['link'] : []),
      ...(count > 2 ? ['third', 'third'] : [])
    ]);
    expect(container.querySelector('a a, a button, button a, button button')).toBeNull();
  });

  it('CL-03 hides decorative media and introduces no focusable media element', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Closing title='Media' level={2} media={<img alt='' src='/decoration.png' />}>
        <Button>Action</Button>
      </Closing>
    );
    const image = container.querySelector('img');
    const wrapper = image?.parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).not.toHaveAttribute('tabindex');
    expect(wrapper?.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
    await user.tab();
    expect(wrapper).not.toHaveFocus();
  });

  it('CL-07 discards every protected native input while forwarding compatible attributes', () => {
    const unsafe = {
      role: 'navigation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    };
    const { container } = render(
      <Closing
        {...unsafe}
        id='owned-heading'
        title='Protected'
        level={2}
        data-example='value'
        aria-label='Example'
        tabIndex={-1}
      >
        <Button>Go</Button>
      </Closing>
    );
    const root = container.querySelector('.eg-closing');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('style');
    expect(root).not.toHaveAttribute('id');
    expect(root).toHaveAttribute('data-example', 'value');
    expect(root).toHaveAttribute('aria-label', 'Example');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(container.querySelector('b')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Protected' })).toHaveAttribute('id', 'owned-heading');
  });

  it('CL-04/05/07 applies placement merge and the specified classes to the correct parts', () => {
    const { container } = render(
      <Closing title='Styled' level={2} lede='Body' media={<img alt='' src='/decoration.png' />} className='mt-4 mt-8'>
        <Button>Go</Button>
      </Closing>
    );
    const root = container.querySelector('.eg-closing');
    expect(root).toHaveClass(
      'mt-8',
      'box-border',
      'relative',
      'isolate',
      'w-full',
      'font-sans',
      'text-fg-default',
      'before:content-none'
    );
    expect(root).not.toHaveClass('mt-4');
    const grid = root?.firstElementChild;
    expect(grid).toHaveClass(
      'grid',
      'min-w-0',
      'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
      'items-center',
      'gap-10',
      '[@media(width<=860px)]:grid-cols-1',
      '[@media(width<=860px)]:gap-2'
    );
    expect(grid?.firstElementChild).toHaveClass('min-w-0');
    expect(screen.getByRole('heading').parentElement).toHaveClass('mt-5', 'mb-7');
    expect(screen.getByText('Body')).toHaveClass(
      'm-0',
      'max-w-[40ch]',
      'font-sans',
      'text-body-large',
      'text-fg-default',
      'wrap-break-word'
    );
    expect(screen.getByRole('button').parentElement).toHaveClass('mt-8', 'flex', 'flex-wrap', 'gap-3');
    expect(container.querySelector('img')?.parentElement).toHaveClass(
      'relative',
      'mx-auto',
      'aspect-square',
      'w-[min(100%,62vh)]',
      'min-w-0',
      '[@media(width<=860px)]:order-first',
      '[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]'
    );
    expect(container.querySelector('[class*="eg-closing__"]')).toBeNull();
  });

  it('CL-07 rejects invalid public types at compile time', () => {
    const valid = { title: 'Title', level: 2 as const, children: 'Action' };
    // @ts-expect-error role is protected.
    const role: ClosingProps = { ...valid, role: 'navigation' };
    // @ts-expect-error inline style is protected.
    const style: ClosingProps = { ...valid, style: {} };
    // @ts-expect-error raw HTML is protected.
    const html: ClosingProps = { ...valid, dangerouslySetInnerHTML: { __html: 'bad' } };
    // @ts-expect-error only native heading ranks 1 through 6 are valid.
    const rank: ClosingProps = { ...valid, level: 7 };
    // @ts-expect-error title is required.
    const title: ClosingProps = { level: 2, children: 'Action' };
    // @ts-expect-error CTA children are required.
    const children: ClosingProps = { title: 'Title', level: 2 };
    expect([role, style, html, rank, title, children]).toHaveLength(6);
  });
});

describe('Closing', () => {
  it('CL-01/02/03 names the host, retains actions and copy-first decorative media', () => {
    const { container } = render(
      <SectionShell register='show' aria-labelledby='closing-title'>
        <Closing
          id='closing-title'
          level={2}
          title='Together '
          accent='again'
          eyebrow='Next'
          lede='Keep going'
          media={<svg aria-label='Decoration' />}
        >
          <Button asChild={true}>
            <a href='#one'>One</a>
          </Button>
          <Button asChild={true} variant='secondary'>
            <a href='#two'>Two</a>
          </Button>
          <Button asChild={true} variant='neutral'>
            <a href='#three'>Three</a>
          </Button>
        </Closing>
      </SectionShell>
    );
    const region = screen.getByRole('region', { name: 'Together again' });
    expect(within(region).getByRole('heading', { level: 2, name: 'Together again' })).toHaveAttribute(
      'id',
      'closing-title'
    );
    expect(within(region).getByText('Next')).toBeInTheDocument();
    expect(within(region).getByText('Keep going')).toBeInTheDocument();
    expect(
      within(region)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['#one', '#two', '#three']);
    expect(container.querySelector('a a, a button, button a')).toBeNull();
    const media = container.querySelector('[aria-hidden="true"]:has(svg)');
    expect(media).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Three' }).compareDocumentPosition(media as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
  it('CL-02/06 retains native keyboard order and button activation', async () => {
    const user = userEvent.setup();
    let activations = 0;
    render(
      <Closing title='Actions' level={2}>
        <Button asChild={true}>
          <a href='#first'>First</a>
        </Button>
        <Button
          onClick={() => {
            activations += 1;
          }}
        >
          Second
        </Button>
      </Closing>
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(activations).toBe(1);
    await user.keyboard(' ');
    expect(activations).toBe(2);
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'First' })).toHaveFocus();
  });
  it('CL-01/03 omits absent optional content and keeps instance IDs distinct on rerender', () => {
    const view = (title: string) => (
      <>
        <Closing title={title} level={1} id='one'>
          <Button>First</Button>
        </Closing>
        <Closing title='Second' level={3} id='two'>
          <Button>Second action</Button>
        </Closing>
      </>
    );
    const { container, rerender } = render(view('First heading'));
    rerender(view('Changed heading'));
    expect(screen.getByRole('heading', { level: 1, name: 'Changed heading' })).toHaveAttribute('id', 'one');
    expect(screen.getByRole('heading', { level: 3, name: 'Second' })).toHaveAttribute('id', 'two');
    expect(container.querySelectorAll('[id]')).toHaveLength(2);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
    expect(screen.queryByRole('region')).toBeNull();
  });
  it('CL-04/05/07 applies its own responsive and legacy-neutralizing classes and protects root semantics', () => {
    const unsafe = { role: 'navigation', style: { color: 'red' }, dangerouslySetInnerHTML: { __html: 'bad' } };
    const { container } = render(
      <Closing {...unsafe} title='Title' level={2} id='heading' className='mt-4 mt-6' data-owner='host' media={<svg />}>
        <Button>Action</Button>
      </Closing>
    );
    const root = container.querySelector('.eg-closing');
    expect(root).toHaveClass(
      'box-border',
      'relative',
      'isolate',
      'w-full',
      'font-sans',
      'text-fg-default',
      'before:content-none',
      'mt-6'
    );
    expect(root).not.toHaveClass('mt-4');
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).not.toHaveAttribute('id');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('style');
    expect(root?.textContent).not.toContain('bad');
    const grid = root?.firstElementChild;
    expect(grid).toHaveClass(
      'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1',
      '[@media(width<=860px)]:gap-2'
    );
    expect(grid?.lastElementChild).toHaveClass(
      'aspect-square',
      'w-[min(100%,62vh)]',
      '[@media(width<=860px)]:order-first',
      '[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]'
    );
    expect(container.querySelector('[class*="eg-closing__"]')).toBeNull();
  });
});
