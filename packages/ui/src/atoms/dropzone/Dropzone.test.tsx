import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropzone } from './Dropzone';
import { useDropzone } from './useDropzone';

const image = new File(['image'], 'photo.png', { type: 'image/png' });
const text = new File(['text'], 'notes.txt', { type: 'text/plain' });
const transfer = (files: File[] = [image]) => ({ types: ['Files'], files });
const inputIn = (container: HTMLElement) => {
  const input = container.querySelector('input');
  if (!input) {
    throw new Error('Missing file input');
  }
  return input;
};

describe('Dropzone v0.1', () => {
  it('exposes one named native button and a hidden sibling picker with no form participation', async () => {
    const user = userEvent.setup();
    const { container } = render(<Dropzone onFiles={vi.fn()} id='media' title='Upload media' />);
    const button = screen.getByRole('button', { name: 'Drag, paste or upload' });
    const input = inputIn(container);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('id', 'media');
    expect(button).toHaveAttribute('title', 'Upload media');
    expect(button).toHaveAttribute('data-state', 'idle');
    expect(button.nextElementSibling === input).toBe(true);
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('hidden');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(input).not.toHaveAttribute('name');
    expect(input).not.toHaveAttribute('required');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await user.tab();
    expect(button).toHaveFocus();
    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it('opens the picker through native click, Enter and Space, preserving consumer onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<Dropzone onFiles={vi.fn()} onClick={onClick} />);
    const click = vi.spyOn(inputIn(container), 'click').mockImplementation(() => undefined);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter} ');
    expect(click).toHaveBeenCalledTimes(3);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('allows consumer activation cancellation without opening the picker', async () => {
    const { container } = render(<Dropzone onFiles={vi.fn()} onClick={(event) => event.preventDefault()} />);
    const click = vi.spyOn(inputIn(container), 'click');
    await userEvent.click(screen.getByRole('button'));
    expect(click).not.toHaveBeenCalled();
  });

  it('routes picker constraints, resets before delivery, and accepts the same file again', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn((_files: File[]) => expect(input.value).toBe(''));
    const { container } = render(<Dropzone onFiles={onFiles} accept='image/*' multiple={true} />);
    const input = inputIn(container);
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input.multiple).toBe(true);
    await user.upload(input, image);
    await user.upload(input, image);
    expect(onFiles).toHaveBeenCalledTimes(2);
    expect(onFiles.mock.calls[0]?.[0]).toEqual([image]);
    expect(input.files).toHaveLength(0);
    fireEvent.change(input, { target: { files: [] } });
    expect(onFiles).toHaveBeenCalledTimes(2);
  });

  it.each([false, true])('snapshots a mutable picker selection (multiple=%s)', async (multiple) => {
    const onFiles = vi.fn<(files: File[]) => void>();
    const { result } = renderHook(() => useDropzone({ onFiles, multiple }));
    const { container, rerender } = render(<input type='file' multiple={true} />);
    const input = inputIn(container);
    await userEvent.upload(input, [image, text]);
    expect(input.value).not.toBe('');
    const selected = Array.from(input.files ?? []);
    const setValue = Object.getOwnPropertyDescriptor(input, 'value')?.set;
    if (!setValue) {
      throw new Error('Expected user-event file input value setter');
    }
    // Deliberately model a live selection cleared by reset, not a browser FileList guarantee.
    Object.defineProperty(input, 'files', { configurable: true, get: () => selected });
    vi.spyOn(input, 'value', 'set').mockImplementation((value) => {
      setValue.call(input, value);
      selected.length = 0;
    });
    rerender(<input type='file' multiple={true} onChange={result.current.inputProps.onChange} />);
    fireEvent.change(input);
    expect(input.value).toBe('');
    expect(selected).toHaveLength(0);
    expect(onFiles).toHaveBeenCalledTimes(1);
    const delivered = onFiles.mock.calls[0]?.[0];
    expect(delivered).toHaveLength(multiple ? 2 : 1);
    expect(delivered?.[0] === image).toBe(true);
    if (multiple) {
      expect(delivered?.[1] === text).toBe(true);
    }
  });

  it.each(['throw', 'unmount'])('resets the actual picker before a consumer can %s', async (action) => {
    const failure = new Error('Consumer failure');
    let observedError: unknown;
    const onFiles = vi.fn((files: File[]) => {
      expect(input.value).toBe('');
      expect(input.files).toHaveLength(0);
      expect(files).toHaveLength(2);
      expect(files[0] === image && files[1] === text).toBe(true);
      if (action === 'throw') {
        throw failure;
      }
      unmount();
    });
    const { result } = renderHook(() => useDropzone({ onFiles, multiple: true }));
    const { container, rerender, unmount } = render(<input type='file' multiple={true} />);
    const input = inputIn(container);
    await userEvent.upload(input, [image, text]);
    expect(input.value).not.toBe('');
    rerender(
      <input
        type='file'
        multiple={true}
        onChange={(event) => {
          try {
            result.current.inputProps.onChange?.(event);
          } catch (error) {
            observedError = error;
          }
        }}
      />
    );
    fireEvent.change(input);
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
    expect(observedError === (action === 'throw' ? failure : undefined)).toBe(true);
    expect(input.isConnected).toBe(action !== 'unmount');
  });

  it('keeps nested file drags over until the final leave and ignores non-file drags', () => {
    render(<Dropzone onFiles={vi.fn()} label='Add media' dropLabel='Release media' />);
    const button = screen.getByRole('button');
    fireEvent.dragEnter(button, { dataTransfer: { types: ['text/plain'], files: [] } });
    expect(button).toHaveAttribute('data-state', 'idle');
    expect(fireEvent.dragOver(button, { dataTransfer: { types: ['text/uri-list'], files: [] } })).toBe(true);
    fireEvent.dragEnter(button, { dataTransfer: transfer([]) });
    expect(button).toHaveAccessibleName('Release media');
    expect(button).toHaveAttribute('data-state', 'over');
    const child = button.querySelector('span');
    if (!child) {
      throw new Error('Missing label');
    }
    fireEvent.dragEnter(child, { dataTransfer: transfer([]) });
    fireEvent.dragLeave(child, { dataTransfer: transfer([]) });
    expect(button).toHaveAttribute('data-state', 'over');
    expect(fireEvent.dragOver(button, { dataTransfer: transfer([]) })).toBe(false);
    fireEvent.dragLeave(button, { dataTransfer: transfer([]) });
    expect(button).toHaveAttribute('data-state', 'idle');
    expect(button).toHaveAccessibleName('Add media');
    fireEvent.dragLeave(button, { dataTransfer: transfer([]) });
    fireEvent.dragEnter(button, { dataTransfer: transfer([]) });
    expect(button).toHaveAttribute('data-state', 'over');
  });

  it.each([false, true])('delivers dropped files without accept validation (multiple=%s)', (multiple) => {
    const onFiles = vi.fn();
    render(<Dropzone onFiles={onFiles} accept='image/*' multiple={multiple} />);
    const button = screen.getByRole('button');
    fireEvent.dragEnter(button, { dataTransfer: transfer() });
    expect(fireEvent.drop(button, { dataTransfer: transfer([text, image]) })).toBe(false);
    expect(onFiles).toHaveBeenCalledWith(multiple ? [text, image] : [text]);
    expect(button).toHaveAttribute('data-state', 'idle');
    fireEvent.drop(button, { dataTransfer: { types: ['text/plain'], files: [] } });
    fireEvent.drop(button, { dataTransfer: transfer([]) });
    expect(onFiles).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('receives paste only on the focused target (multiple=%s)', (multiple) => {
    const onFiles = vi.fn();
    render(<Dropzone onFiles={onFiles} accept='image/*' multiple={multiple} />);
    const button = screen.getByRole('button');
    fireEvent.paste(button, { clipboardData: transfer([text, image]) });
    fireEvent.paste(document.body, { clipboardData: transfer([text, image]) });
    expect(onFiles).not.toHaveBeenCalled();
    button.focus();
    expect(fireEvent.paste(button, { clipboardData: transfer([text, image]) })).toBe(false);
    expect(onFiles).toHaveBeenCalledWith(multiple ? [text, image] : [text]);
    expect(fireEvent.paste(button, { clipboardData: transfer([]) })).toBe(true);
    expect(onFiles).toHaveBeenCalledTimes(1);
  });

  it('ignores picker, drag, drop and paste while disabled and clears a previous drag', async () => {
    const onFiles = vi.fn();
    const { container, rerender } = render(<Dropzone onFiles={onFiles} />);
    const button = screen.getByRole('button');
    fireEvent.dragEnter(button, { dataTransfer: transfer() });
    rerender(<Dropzone onFiles={onFiles} disabled={true} />);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'idle');
    const click = vi.spyOn(inputIn(container), 'click');
    await userEvent.click(button);
    fireEvent.dragEnter(button, { dataTransfer: transfer() });
    fireEvent.dragOver(button, { dataTransfer: transfer() });
    fireEvent.drop(button, { dataTransfer: transfer() });
    fireEvent.paste(button, { clipboardData: transfer() });
    fireEvent.change(inputIn(container), { target: { files: [image] } });
    expect(button).toHaveAttribute('data-state', 'idle');
    expect(inputIn(container)).toBeDisabled();
    expect(click).not.toHaveBeenCalled();
    expect(onFiles).not.toHaveBeenCalled();
    rerender(<Dropzone onFiles={onFiles} />);
    fireEvent.dragEnter(button, { dataTransfer: transfer() });
    fireEvent.dragLeave(button, { dataTransfer: transfer() });
    expect(button).toHaveAttribute('data-state', 'idle');
  });

  it('uses the approved recipe, per-part classes and outer-layout merge surface', () => {
    const { result } = renderHook(() => useDropzone({ onFiles: vi.fn() }));
    expect(result.current.rootProps['data-state']).toBe('idle');
    expect(result.current.rootProps.className).toContain('flex-col');
    const { rerender } = render(<Dropzone onFiles={vi.fn()} className='mt-2 w-full consumer-target' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('eg-dropzone', 'mt-2', 'w-full', 'consumer-target', 'min-w-24', 'min-h-24');
    expect(button).toHaveClass('border-dashed', 'bg-transparent', 'bg-none', '[box-shadow:none]');
    expect(button).toHaveClass('transition-colors', 'motion-reduce:transition-none', 'focus-visible:shadow-focus');
    expect(button).toHaveClass('disabled:opacity-45', 'disabled:pointer-events-none', 'disabled:cursor-not-allowed');
    expect(button).toHaveClass('data-[state=over]:bg-alpha-red-07');
    expect(button.className).not.toMatch(/is-over|eg-dropzone--inline/);
    rerender(<Dropzone onFiles={vi.fn()} variant='inline' className='mt-2' />);
    expect(button).toHaveClass('flex-row', 'gap-2.5', 'min-h-14', 'w-full', 'mt-2');
    expect(button).not.toHaveClass('flex-col', 'gap-1.5', 'min-h-24');
  });
});
