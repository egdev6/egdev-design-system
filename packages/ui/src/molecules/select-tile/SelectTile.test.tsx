import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelectTile } from '@/molecules/select-tile/useSelectTile';
import { SelectTile, type SelectTileOption, type SelectTileProps, type SelectTileRatio } from './index';

const options: SelectTileOption[] = [
  { value: 'camera', label: 'Camera', meta: 'Two layers', live: true, badge: 'Live' },
  { value: 'offline', label: 'Offline', disabled: true },
  { value: 'slides', label: 'Slides', thumb: { src: 'slides.png' } },
  { value: 'credits', label: 'Credits' }
];
const base = { type: 'single', label: 'Scenes', options } as const;

function card(control: HTMLElement) {
  const parent = control.closest('.eg-tile');
  if (!(parent instanceof HTMLElement)) {
    throw new Error('Missing visual card');
  }
  return parent;
}

/** Radix measures hidden form inputs; jsdom has no ResizeObserver. Keyboard remains real. */
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
});
afterEach(() => vi.unstubAllGlobals());

/** Radix schedules focus while the arrow is held; release after its focus task. */
async function arrow(user: ReturnType<typeof userEvent.setup>, key: string) {
  await user.keyboard(`{${key}>}`);
  await user.keyboard(`{/${key}}`);
}

describe('SelectTile public contract', () => {
  it('names sibling native controls, orders options and isolates instance IDs', () => {
    render(
      <>
        <SelectTile {...base} />
        <SelectTile {...base} label='Other scenes' />
      </>
    );
    const groups = screen.getAllByRole('radiogroup');
    expect(groups[0]).toHaveClass('eg-select-tile');
    const radios = within(groups[0] as HTMLElement).getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('aria-checked'))).toEqual(['false', 'false', 'false', 'false']);
    expect(radios.map((radio) => radio.textContent)).toEqual(['', '', '', '']);
    expect(radios[0]).toHaveAccessibleName('Camera');
    expect(radios[0]).toHaveAccessibleDescription('Two layers Live');
    expect(radios[2]).not.toHaveAttribute('aria-describedby');
    expect(card(radios[0] as HTMLElement)).toHaveAttribute('data-state', 'live');
    for (const radio of radios) {
      expect(radio.tagName).toBe('BUTTON');
      expect(radio).toHaveAttribute('type', 'button');
      expect(radio.querySelector('div, img, button')).toBeNull();
    }
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    const image = document.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('delegates single click, Space, Enter, arrows and focus-only endpoints to Radix', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <SelectTile {...base} onValueChange={change} />
      </form>
    );
    await user.tab();
    const camera = screen.getByRole('radio', { name: 'Camera' });
    const slides = screen.getByRole('radio', { name: 'Slides' });
    const credits = screen.getByRole('radio', { name: 'Credits' });
    expect(camera).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(change).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    await user.keyboard(' ');
    expect(change).toHaveBeenLastCalledWith('camera');
    await user.click(camera);
    expect(change).toHaveBeenCalledTimes(1);
    await arrow(user, 'ArrowRight');
    expect(slides).toHaveFocus();
    expect(slides).toBeChecked();
    await user.keyboard('{End}');
    expect(credits).toHaveFocus();
    expect(slides).toBeChecked();
    await user.keyboard('{Home}');
    expect(camera).toHaveFocus();
    expect(slides).toBeChecked();
    await arrow(user, 'ArrowLeft');
    expect(credits).toHaveFocus();
    expect(change.mock.calls.map(([value]) => value)).toEqual(['camera', 'slides', 'credits']);
  });

  it('toggles multiple values in activation order while arrows and endpoints only focus', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<SelectTile type='multiple' label='Scenes' options={options} onValueChange={change} />);
    expect(screen.getByRole('group', { name: 'Scenes' })).toHaveClass('eg-select-tile');
    const camera = screen.getByRole('button', { name: 'Camera' });
    const slides = screen.getByRole('button', { name: 'Slides' });
    await user.click(slides);
    await user.click(camera);
    expect(change).toHaveBeenLastCalledWith(['slides', 'camera']);
    await user.keyboard('{ArrowRight}{End}{Home}');
    expect(camera).toHaveFocus();
    expect(change).toHaveBeenCalledTimes(2);
    await user.keyboard('{Enter}');
    expect(change).toHaveBeenLastCalledWith(['slides']);
    await user.click(slides);
    expect(change).toHaveBeenLastCalledWith([]);
    await user.keyboard(' ');
    expect(change).toHaveBeenLastCalledWith(['slides']);
    expect(document.querySelector('input')).toBeNull();
  });

  it.each(['single', 'multiple'] as const)(
    'keeps %s controlled values authoritative and updates silently',
    async (type) => {
      const user = userEvent.setup();
      const change = vi.fn();
      const props: SelectTileProps =
        type === 'single'
          ? { ...base, value: 'slides', defaultValue: 'camera', onValueChange: change }
          : { ...base, type, value: ['slides'], defaultValue: ['camera'], onValueChange: change };
      const { rerender } = render(<SelectTile {...props} />);
      const role = type === 'single' ? 'radio' : 'button';
      const camera = screen.getByRole(role, { name: 'Camera' });
      const slides = screen.getByRole(role, { name: 'Slides' });
      const attr = type === 'single' ? 'aria-checked' : 'aria-pressed';
      expect(slides).toHaveAttribute(attr, 'true');
      await user.click(camera);
      expect(slides).toHaveAttribute(attr, 'true');
      expect(camera).toHaveAttribute(attr, 'false');
      change.mockClear();
      rerender(<SelectTile {...(props.type === 'single' ? { ...props, value: '' } : { ...props, value: [] })} />);
      expect(slides).toHaveAttribute(attr, 'false');
      expect(change).not.toHaveBeenCalled();
    }
  );

  it.each(['single', 'multiple'] as const)('does not reset %s uncontrolled state when defaultValue changes', (type) => {
    const props: SelectTileProps =
      type === 'single' ? { ...base, defaultValue: 'camera' } : { ...base, type, defaultValue: ['camera'] };
    const { rerender } = render(<SelectTile {...props} />);
    const camera = screen.getByRole(type === 'single' ? 'radio' : 'button', { name: 'Camera' });
    rerender(
      <SelectTile
        {...(props.type === 'single' ? { ...props, defaultValue: 'slides' } : { ...props, defaultValue: ['slides'] })}
      />
    );
    expect(camera).toHaveAttribute(type === 'single' ? 'aria-checked' : 'aria-pressed', 'true');
  });

  it('participates in single-mode FormData and native required validity', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <SelectTile {...base} name='scene' required={true} />
      </form>
    );
    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Missing form');
    }
    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get('scene')).toBeNull();
    await user.click(screen.getByRole('radio', { name: 'Slides' }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('scene')).toBe('slides');
  });

  it('dims disabled cards only once, preserves live/selection and removes empty tab stops', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(<SelectTile {...base} disabled={true} defaultValue='camera' onValueChange={change} />);
    const camera = screen.getByRole('radio', { name: 'Camera' });
    expect(camera).toBeDisabled();
    expect(camera).toBeChecked();
    expect(card(camera)).toHaveAttribute('data-disabled');
    expect(card(camera)).toHaveAttribute('data-state', 'live');
    expect(camera.className).not.toMatch(/opacity/);
    await user.click(camera);
    await user.tab();
    expect(camera).not.toHaveFocus();
    expect(change).not.toHaveBeenCalled();
    rerender(<SelectTile {...base} options={[]} />);
    expect(screen.getByRole('radiogroup', { name: 'Scenes' })).toBeEmptyDOMElement();
    expect(document.querySelector('[tabindex="0"]')).toBeNull();
  });

  it('changes live independently and omits empty annotations', () => {
    const change = vi.fn();
    const { rerender } = render(<SelectTile {...base} value='slides' onValueChange={change} />);
    rerender(
      <SelectTile
        {...base}
        value='slides'
        onValueChange={change}
        options={[
          { value: 'camera', label: 'Camera', meta: '', badge: '' },
          { value: 'slides', label: 'Slides', live: true, badge: 'On air' }
        ]}
      />
    );
    expect(screen.getByRole('radio', { name: 'Camera' })).not.toHaveAttribute('aria-describedby');
    expect(screen.getByRole('radio', { name: 'Slides' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Slides' })).toHaveAccessibleDescription('On air');
    expect(change).not.toHaveBeenCalled();
  });

  it('keeps missing/failed media decorative, retries a new source and ignores stale failures', () => {
    const { container, rerender } = render(<SelectTile {...base} />);
    const oldImage = container.querySelector('img');
    if (!oldImage) {
      throw new Error('Missing preview');
    }
    fireEvent.error(oldImage);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Slides' })).toHaveAccessibleName('Slides');
    const next = [{ value: 'slides', label: 'Slides', thumb: { src: 'new.png' } }];
    rerender(<SelectTile {...base} options={next} />);
    expect(container.querySelector('img')).toHaveAttribute('src', 'new.png');
    fireEvent.error(oldImage);
    expect(container.querySelector('img')).toHaveAttribute('src', 'new.png');
  });

  it('tracks errors by value and source, including an old handler called after a source change', () => {
    const { result, rerender } = renderHook(
      ({ src }) => useSelectTile({ ...base, options: [{ value: 'camera', label: 'Camera', thumb: { src } }] }),
      { initialProps: { src: 'first.png' } }
    );
    expect(result.current.ratio).toBe(16 / 9);
    expect(result.current.root.props.dir).toBe('ltr');
    const failOld = result.current.items[0]?.imageProps?.onError;
    rerender({ src: 'second.png' });
    act(() => failOld?.());
    expect(result.current.items[0]?.imageProps?.src).toBe('second.png');
    act(() => result.current.items[0]?.imageProps?.onError());
    expect(result.current.items[0]?.imageProps).toBeUndefined();
    rerender({ src: 'third.png' });
    expect(result.current.items[0]?.imageProps?.src).toBe('third.png');
  });

  it('preserves consumer values on option changes without repairing or notifying', () => {
    const change = vi.fn();
    const { rerender } = render(<SelectTile {...base} value='camera' onValueChange={change} />);
    rerender(<SelectTile {...base} options={options.slice(1)} value='camera' onValueChange={change} />);
    expect(screen.getAllByRole('radio').every((radio) => radio.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(change).not.toHaveBeenCalled();
    rerender(<SelectTile {...base} value='camera' onValueChange={change} />);
    expect(screen.getByRole('radio', { name: 'Camera' })).toBeChecked();
  });

  it('disables multiple options individually and as a group without losing pressed state', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(
      <SelectTile type='multiple' label='Scenes' options={options} defaultValue={['camera']} onValueChange={change} />
    );
    const offline = screen.getByRole('button', { name: 'Offline' });
    expect(offline).toBeDisabled();
    await user.click(offline);
    expect(change).not.toHaveBeenCalled();
    rerender(
      <SelectTile
        type='multiple'
        label='Scenes'
        options={options}
        disabled={true}
        defaultValue={['camera']}
        onValueChange={change}
      />
    );
    const camera = screen.getByRole('button', { name: 'Camera' });
    expect(camera).toHaveAttribute('aria-pressed', 'true');
    expect(camera).toBeDisabled();
    await user.click(camera);
    expect(change).not.toHaveBeenCalled();
  });

  it.each([
    ['landscape', 16 / 9],
    ['portrait', 4 / 5],
    ['story', 9 / 16],
    ['square', 1],
    ['wide', 3],
    ['banner', 4]
  ] satisfies [SelectTileRatio, number][])('maps %s to the shared AspectRatio geometry', (ratio, expected) => {
    const { result } = renderHook(() => useSelectTile({ ...base, ratio }));
    expect(result.current.ratio).toBe(expected);
  });

  it('merges supported root layout last without reaching cards and keeps shared Material recipes', () => {
    render(
      <SelectTile
        {...base}
        id='scenes'
        title='Scene choices'
        className='grid-cols-4 w-full mt-3'
        aria-describedby='help'
      />
    );
    const root = screen.getByRole('radiogroup');
    expect(root).toHaveClass('eg-select-tile', 'grid-cols-4', 'w-full', 'mt-3');
    expect(root).not.toHaveClass('grid-cols-2');
    expect(root).toHaveAttribute('id', 'scenes');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    const frame = card(screen.getByRole('radio', { name: 'Camera' }));
    expect(frame).toHaveClass('eg-tile', 'eg-surface', 'p-2', 'min-h-11');
    expect(frame).not.toHaveClass('grid-cols-4', 'mt-3');
    expect(frame.className).not.toMatch(/is-active|eg-tile--/);
  });

  it('reverses horizontal radio navigation in RTL', async () => {
    const user = userEvent.setup();
    render(<SelectTile {...base} dir='rtl' />);
    await user.tab();
    await arrow(user, 'ArrowLeft');
    expect(screen.getByRole('radio', { name: 'Slides' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Slides' })).toBeChecked();
  });
});
