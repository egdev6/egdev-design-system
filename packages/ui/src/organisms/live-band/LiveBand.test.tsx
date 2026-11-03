import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../atoms/button';
import { Countdown } from '../../atoms/countdown';
import { Link } from '../../atoms/link';
import { PhotoFrame } from '../../atoms/photo-frame';
import { ListItem, ListItemBody, ListItemTitle } from '../../molecules/list-item';
import type { LiveBandRowsProps } from './index';
import { LiveBandField, LiveBandList, LiveBandRow, LiveBandRows, LiveBandStreams, LiveBandVod } from './index';

// The negative examples are checked by tsc and never mounted.
const typeExamples = () => {
  // @ts-expect-error Field requires children.
  const field = <LiveBandField />;
  // @ts-expect-error Streams requires children.
  const streams = <LiveBandStreams />;
  // @ts-expect-error Vod requires a destination.
  const vod = <LiveBandVod>Watch</LiveBandVod>;
  // @ts-expect-error Vod requires children.
  const emptyVod = <LiveBandVod href='#vod' />;
  // @ts-expect-error List requires children.
  const list = <LiveBandList />;
  // @ts-expect-error Rows requires children.
  const rows = <LiveBandRows />;
  // @ts-expect-error Row requires one element.
  const row = <LiveBandRow />;
  // @ts-expect-error Field excludes a role override.
  const role = <LiveBandField role='button'>Text</LiveBandField>;
  // @ts-expect-error Streams excludes style.
  const style = <LiveBandStreams style={{ color: 'red' }}>Text</LiveBandStreams>;
  const handler = (
    // @ts-expect-error Vod excludes click handlers.
    <LiveBandVod href='#x' onClick={() => undefined}>
      Text
    </LiveBandVod>
  );
  // @ts-expect-error Rows excludes raw HTML.
  const raw: LiveBandRowsProps = { children: 'Text', dangerouslySetInnerHTML: { __html: 'x' } };
  const vodClass = (
    // @ts-expect-error Vod does not accept a className override.
    <LiveBandVod href='#x' className='mt-2'>
      Text
    </LiveBandVod>
  );
  // @ts-expect-error List has no native attributes.
  const listId = <LiveBandList id='x'>Text</LiveBandList>;
  const rowId = (
    // @ts-expect-error Row has no native attributes.
    <LiveBandRow id='x'>
      <span>Text</span>
    </LiveBandRow>
  );
  // @ts-expect-error Field does not expose a ref.
  const ref = <LiveBandField ref={createRef<HTMLDivElement>()}>Text</LiveBandField>;
  return [field, streams, vod, emptyVod, list, rows, row, role, style, handler, raw, vodClass, listId, rowId, ref];
};
void typeExamples;

describe('LiveBand', () => {
  it('LB-01/03 preserves ordered independent links and semantic rows', () => {
    const { container } = render(
      <section aria-label='Live'>
        <LiveBandField id='field' data-owner='host' className='mt-4 mt-6'>
          <p>Upcoming</p>
        </LiveBandField>
        <LiveBandStreams id='streams'>
          <LiveBandVod href='#vod'>
            <span>Recording</span>
            <span aria-hidden='true'>Play</span>
            <time dateTime='2026-01-01'>January 1</time>
            <span>30 minutes</span>
          </LiveBandVod>
          <LiveBandList>
            <h2>Past streams</h2>
            <LiveBandRows data-rows='yes'>
              <LiveBandRow>
                <ListItem variant='editorial-divided' asChild={true}>
                  <a href='#row'>
                    <ListItemBody>
                      <ListItemTitle>First stream</ListItemTitle>
                      <time dateTime='2026-01-02'>January 2</time>
                      <span>40 minutes</span>
                    </ListItemBody>
                  </a>
                </ListItem>
              </LiveBandRow>
            </LiveBandRows>
            <a href='#archive'>Archive</a>
          </LiveBandList>
        </LiveBandStreams>
      </section>
    );
    const field = container.querySelector('#field');
    expect(field).toHaveClass(
      'eg-live-band',
      'static',
      'mt-6',
      'grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1'
    );
    expect(field).not.toHaveClass('mt-4');
    expect(field).toHaveAttribute('data-owner', 'host');
    expect(container.querySelector('#streams')).toHaveClass(
      'grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]',
      '[@media(width<=1080px)]:grid-cols-1'
    );
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-rows', 'yes');
    expect(list).toHaveClass('m-0', 'p-0', 'list-none');
    expect(within(list).getByRole('listitem').firstElementChild).toHaveAttribute('href', '#row');
    expect(list).not.toContainElement(screen.getByRole('link', { name: 'Archive' }));
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['#vod', '#row', '#archive']);
    expect(container.querySelector('a a, a button')).toBeNull();
    expect(container.querySelector('[class*="eg-live-band__"]')).toBeNull();
    expect(screen.getAllByRole('region')).toHaveLength(1);
  });
  it('LB-04/05/06 assigns approved layout and material classes without legacy parts', () => {
    const { container } = render(
      <>
        <LiveBandField id='f'>
          <span>Field</span>
        </LiveBandField>
        <LiveBandStreams id='s'>
          <LiveBandVod href='#vod'>
            <div className='relative aspect-16/9 overflow-hidden rounded-lg bg-surface-0 shadow-well'>
              <span>Featured</span>
              <span className='bg-surface-1 text-fg-default rounded-sm px-2 py-1 font-display text-meta'>
                30 minutes
              </span>
              <span
                aria-hidden='true'
                className='bg-action-primary-solid-bg text-action-primary-solid-fg rounded-full size-16'
              >
                Play
              </span>
              <span>Recording title</span>
            </div>
            <time dateTime='2026-01-01'>January 1</time>
          </LiveBandVod>
          <LiveBandList>
            <LiveBandRows>
              <LiveBandRow>
                <span>Row</span>
              </LiveBandRow>
            </LiveBandRows>
          </LiveBandList>
        </LiveBandStreams>
      </>
    );
    expect(container.querySelector('#f')).toHaveClass(
      'static',
      'grid',
      'min-w-0',
      'items-center',
      'gap-10',
      'grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1'
    );
    expect(container.querySelector('#s')).toHaveClass(
      'grid',
      'min-w-0',
      'items-start',
      'gap-7',
      'grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]',
      '[@media(width<=1080px)]:grid-cols-1'
    );
    const vod = screen.getByRole('link', { name: /Featured\s*30 minutes\s*Recording title\s*January 1/ });
    expect(vod).toHaveClass(
      'eg-surface',
      'bg-surface-1',
      'border-border-hairline',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
      'p-0',
      'focus-visible:outline-none',
      'focus-visible:shadow-focus'
    );
    expect(vod.firstElementChild).toHaveClass(
      'relative',
      'aspect-16/9',
      'overflow-hidden',
      'rounded-lg',
      'bg-surface-0',
      'shadow-well'
    );
    expect(screen.getByText('30 minutes')).toHaveClass(
      'bg-surface-1',
      'text-fg-default',
      'rounded-sm',
      'px-2',
      'py-1',
      'font-display',
      'text-meta'
    );
    expect(screen.getByText('Play')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Play')).toHaveClass(
      'bg-action-primary-solid-bg',
      'text-action-primary-solid-fg',
      'rounded-full',
      'size-16'
    );
    expect(within(vod).queryByRole('button')).toBeNull();
    expect(screen.getByRole('list')).toHaveClass('m-0', 'p-0', 'list-none');
    expect(container.querySelectorAll('.eg-live-band')).toHaveLength(1);
    expect(container.querySelector('[class*="eg-live-band__"]')).toBeNull();
  });
  it('LB-01/02/04 composes the named timer, CTA and framed image in order', () => {
    const { container } = render(
      <LiveBandField>
        <div>
          <h2>Next event</h2>
          <Countdown deadline={4102444800000} deadlineText='January 1, 2100 UTC' label='Countdown' />
          <Button variant='dark' asChild={true}>
            <Link href='#event'>Join event</Link>
          </Button>
        </div>
        <PhotoFrame src='/photo.png' alt='Studio setup' variant='framed' ratio='landscape' />
      </LiveBandField>
    );
    const field = container.querySelector('.eg-live-band');
    const timer = screen.getByRole('timer', { name: 'Countdown' });
    const cta = screen.getByRole('link', { name: 'Join event' });
    const image = screen.getByRole('img', { name: 'Studio setup' });
    expect(field?.children).toHaveLength(2);
    expect(field?.firstElementChild).toContainElement(timer);
    expect(field?.firstElementChild).toContainElement(cta);
    expect(field?.lastElementChild).toContainElement(image);
    expect(timer).toHaveAttribute('aria-live', 'off');
    expect(screen.getByText('January 1, 2100 UTC')).toHaveAttribute('datetime', '2100-01-01T00:00:00.000Z');
    expect(image.closest('figure')?.firstElementChild).toHaveClass(
      'rotate-[calc(var(--tilt-max)/3)]',
      'motion-reduce:rotate-none',
      'motion-reduce:transform-none',
      'motion-reduce:transition-none'
    );
    expect(image).toHaveAttribute('src', '/photo.png');
    expect(container.querySelector('[class*="eg-live-band__pix"]')).toBeNull();
  });
  it('LB-03 native keyboard order visits only CTA, VOD, rows and archive', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <LiveBandField>
          <Button variant='dark' asChild={true}>
            <Link href='#cta'>Join</Link>
          </Button>
        </LiveBandField>
        <LiveBandStreams>
          <LiveBandVod href='#vod'>
            <span>Recording </span>
            <span aria-hidden='true'>Play</span>
            <span>30 minutes</span>
          </LiveBandVod>
          <LiveBandList>
            <h2>Past</h2>
            <LiveBandRows>
              {['First', 'Second'].map((name) => (
                <LiveBandRow key={name}>
                  <ListItem variant='editorial-divided' asChild={true}>
                    <Link href={`#${name}`}>{name}</Link>
                  </ListItem>
                </LiveBandRow>
              ))}
            </LiveBandRows>
            <Link href='#archive'>Archive</Link>
          </LiveBandList>
        </LiveBandStreams>
      </>
    );
    for (const name of ['Join', 'Recording30 minutes', 'First', 'Second', 'Archive']) {
      await user.tab();
      expect(screen.getByRole('link', { name })).toHaveFocus();
    }
    await user.tab();
    expect(document.body).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: 'Archive' })).toHaveFocus();
    expect(container.querySelector('a a, a button')).toBeNull();
  });
  it('LB-07 forwards native attributes and rejects protected untyped props for every part', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLElement>();
    const unsafe = {
      role: 'button',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'bad' },
      tabIndex: 0,
      contentEditable: true,
      accessKey: 'z',
      'aria-hidden': true,
      'aria-live': 'assertive',
      'aria-pressed': true,
      'aria-selected': true,
      'aria-disabled': true,
      onClick,
      ref
    };
    const { container } = render(
      <>
        <LiveBandField {...unsafe} id='field-native' title='field title' data-owner='field' className='mt-2 mt-4'>
          Field
        </LiveBandField>
        <LiveBandStreams
          {...unsafe}
          id='streams-native'
          title='streams title'
          data-owner='streams'
          className='w-full w-auto'
        >
          Streams
        </LiveBandStreams>
        <LiveBandVod
          {...unsafe}
          id='vod-native'
          title='vod title'
          data-owner='vod'
          href='#vod'
          {...{ className: 'mt-9' }}
        >
          Vod
        </LiveBandVod>
        <LiveBandList {...unsafe} {...{ id: 'list-native', className: 'mt-9' }}>
          <LiveBandRows {...unsafe} id='rows-native' title='rows title' data-owner='rows' className='mt-2 mt-4'>
            <LiveBandRow {...unsafe} {...{ id: 'row-native', className: 'mt-9' }}>
              <span>Row</span>
            </LiveBandRow>
          </LiveBandRows>
        </LiveBandList>
      </>
    );
    const field = container.querySelector('#field-native');
    const streams = container.querySelector('#streams-native');
    const vod = container.querySelector('#vod-native');
    const rows = container.querySelector('#rows-native');
    const row = screen.getByRole('listitem');
    const list = rows?.parentElement;
    for (const [node, owner] of [
      [field, 'field'],
      [streams, 'streams'],
      [vod, 'vod'],
      [rows, 'rows']
    ] as const) {
      expect(node).toHaveAttribute('title', `${owner} title`);
      expect(node).toHaveAttribute('data-owner', owner);
    }
    for (const node of [field, streams, vod, rows, row, list]) {
      for (const attr of [
        'role',
        'style',
        'tabindex',
        'contenteditable',
        'accesskey',
        'aria-hidden',
        'aria-live',
        'aria-pressed',
        'aria-selected',
        'aria-disabled'
      ]) {
        expect(node).not.toHaveAttribute(attr);
      }
      if (node) {
        fireEvent.click(node);
      }
    }
    expect(onClick).not.toHaveBeenCalled();
    expect(ref.current).toBeNull();
    expect(field).toHaveClass('mt-4');
    expect(field).not.toHaveClass('mt-2');
    expect(streams).toHaveClass('w-auto');
    expect(streams).not.toHaveClass('w-full');
    expect(rows).toHaveClass('mt-4');
    expect(rows).not.toHaveClass('mt-2');
    expect(vod).not.toHaveClass('mt-9');
    expect(row).not.toHaveAttribute('id');
    expect(list).not.toHaveAttribute('id');
    expect(container).not.toHaveTextContent('bad');
  });
  it('LB-01 omits empty rows and keeps heading and archive', () => {
    for (const children of [[], null, false, [null, false]]) {
      const { unmount } = render(
        <LiveBandList>
          <h2>Past streams</h2>
          <LiveBandRows>{children}</LiveBandRows>
          <a href='#archive'>Archive</a>
        </LiveBandList>
      );
      expect(screen.queryByRole('list')).toBeNull();
      expect(screen.getByRole('heading', { name: 'Past streams' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Archive' })).toBeInTheDocument();
      unmount();
    }
  });
  it('LB-02 composes delivered quiet timer states', () => {
    const { rerender } = render(
      <LiveBandField>
        <Countdown deadline={4102444800000} deadlineText='January 1, 2100 UTC' label='Next event' />
      </LiveBandField>
    );
    expect(screen.getByRole('timer', { name: 'Next event' })).toHaveAttribute('aria-live', 'off');
    expect(screen.getByText('January 1, 2100 UTC').tagName).toBe('TIME');
    rerender(
      <LiveBandField>
        <Countdown deadline={0} deadlineText='January 1, 1970 UTC' label='Next event' />
      </LiveBandField>
    );
    expect(screen.getByText('Time reached')).toBeInTheDocument();
    rerender(
      <LiveBandField>
        <Countdown deadline={Number.NaN} deadlineText='Unknown' label='Next event' />
      </LiveBandField>
    );
    expect(screen.getByText('Time unavailable')).toBeInTheDocument();
  });
  it('LB-06/07 protects semantics at untyped boundaries and retains focus recipe', () => {
    const unsafe = {
      role: 'button',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: 'bad' },
      tabIndex: 0,
      onClick: vi.fn()
    };
    const { container } = render(
      <>
        <LiveBandField {...unsafe}>
          <span>Field</span>
        </LiveBandField>
        <LiveBandStreams {...unsafe}>
          <span>Streams</span>
        </LiveBandStreams>
        <LiveBandVod {...unsafe} href='#vod'>
          Watch
        </LiveBandVod>
        <LiveBandRows {...unsafe}>
          <LiveBandRow>
            <span>Row</span>
          </LiveBandRow>
        </LiveBandRows>
      </>
    );
    for (const node of [
      screen.getByText('Field').parentElement,
      screen.getByText('Streams').parentElement,
      screen.getByRole('link', { name: 'Watch' }),
      screen.getByRole('list')
    ]) {
      expect(node).not.toHaveAttribute('role');
      expect(node).not.toHaveAttribute('style');
      expect(node).not.toHaveAttribute('tabindex');
    }
    expect(screen.getByRole('link', { name: 'Watch' })).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:shadow-focus'
    );
    expect(container).not.toHaveTextContent('bad');
  });
});
