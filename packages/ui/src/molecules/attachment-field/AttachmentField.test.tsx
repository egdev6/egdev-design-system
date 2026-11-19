import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AttachmentField } from './AttachmentField';
import type { AttachmentFieldProps } from './types';
import { useAttachmentField } from './useAttachmentField';

const makeFile = (name: string, type = 'image/png', size = 240 * 1024) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};
const clipboard = (files: File[], extra: Record<string, string> = {}) => ({
  files,
  types: [...(files.length > 0 ? ['Files'] : []), ...Object.keys(extra)],
  getData: (type: string) => extra[type] ?? ''
});
const transfer = (files: File[]) => ({ types: ['Files'], files });
const at = <T,>(list: readonly T[], index: number): T => {
  const item = list[index];
  if (item === undefined) {
    throw new Error(`Missing item ${index}`);
  }
  return item;
};
const dropzone = () => screen.getByRole('button', { name: 'Drag, paste or upload' });
const notes = () => screen.getByRole('textbox', { name: 'Notes' });
const pasteInto = (target: Element, files: File[], extra?: Record<string, string>) =>
  fireEvent.paste(target, { clipboardData: clipboard(files, extra) });
const field = (props: Partial<AttachmentFieldProps> = {}, children: ReactNode = <textarea aria-label='Notes' />) => (
  <AttachmentField {...({ label: 'Attachments', ...props } as AttachmentFieldProps)}>{children}</AttachmentField>
);
const rejectionTexts = () => Array.from(document.querySelectorAll('.eg-field-message')).map((node) => node.textContent);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AttachmentField v0.1 — structure (AC-01, AC-02)', () => {
  it('keeps the root marker, renders children first and merges a layout className last without inline style', () => {
    const { container } = render(field({ className: 'col-span-2' }));
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('eg-attachment-field', 'eg-stack', 'col-span-2');
    expect(root.className.endsWith('col-span-2')).toBe(true);
    expect(root).not.toHaveAttribute('style');
    expect(root.firstElementChild).toBe(notes());
  });

  it('forwards native attributes to the root', () => {
    const { container } = render(field({ id: 'attachments', title: 'Files' }));
    expect(container.firstElementChild).toHaveAttribute('id', 'attachments');
    expect(container.firstElementChild).toHaveAttribute('title', 'Files');
  });

  it('renders no list with an empty list, the Dropzone with its default name and an empty status region', () => {
    render(field());
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(dropzone()).toBeEnabled();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});

describe('AttachmentField v0.1 — paste (AC-03 to AC-07)', () => {
  it('attaches a pasted image from the Textarea, prevents the default and keeps focus', async () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    await userEvent.click(notes());
    const image = makeFile('shot.png');
    expect(pasteInto(notes(), [image])).toBe(false);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith([image]);
    expect(notes()).toHaveFocus();
  });

  it('ignores a text-only paste and lets the Textarea receive the text', async () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    await userEvent.click(notes());
    expect(pasteInto(notes(), [], { 'text/plain': 'hello' })).toBe(true);
    await userEvent.paste('hello');
    expect(notes()).toHaveValue('hello');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(rejectionTexts()).toEqual([]);
  });

  it('lets files win on a mixed clipboard', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    const image = makeFile('cell.png');
    expect(pasteInto(notes(), [image], { 'text/plain': 'a', 'text/html': '<b>a</b>' })).toBe(false);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith([image]);
  });

  it('adds no paste listener to document or window and ignores a paste outside the root', () => {
    const onValueChange = vi.fn();
    const documentSpy = vi.spyOn(document, 'addEventListener');
    const windowSpy = vi.spyOn(window, 'addEventListener');
    render(
      <>
        {field({ onValueChange })}
        <input aria-label='Outside' />
      </>
    );
    expect(pasteInto(screen.getByRole('textbox', { name: 'Outside' }), [makeFile('shot.png')])).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(documentSpy.mock.calls.some(([type]) => type === 'paste')).toBe(false);
    expect(windowSpy.mock.calls.some(([type]) => type === 'paste')).toBe(false);
  });

  it('processes a paste on the focused Dropzone once', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    dropzone().focus();
    const image = makeFile('shot.png');
    expect(pasteInto(dropzone(), [image])).toBe(false);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith([image]);
  });

  it('ignores a paste already prevented by a consumer onPaste', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }, <textarea aria-label='Notes' onPaste={(event) => event.preventDefault()} />));
    pasteInto(notes(), [makeFile('shot.png')]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not prevent a paste where every file is rejected, but reports and shows it', () => {
    const onFilesRejected = vi.fn();
    const onValueChange = vi.fn();
    render(field({ onFilesRejected, onValueChange }));
    const text = makeFile('notes.txt', 'text/plain');
    expect(pasteInto(notes(), [text])).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onFilesRejected).toHaveBeenCalledWith([{ file: text, reason: 'type' }]);
    expect(rejectionTexts()).toHaveLength(1);
  });
});

describe('AttachmentField v0.1 — drop and pick (AC-08)', () => {
  it('validates dropped files through the same pipeline', () => {
    const onValueChange = vi.fn();
    const onFilesRejected = vi.fn();
    render(field({ onValueChange, onFilesRejected }));
    const image = makeFile('a.png');
    const text = makeFile('a.txt', 'text/plain');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([image, text]) });
    expect(onValueChange).toHaveBeenCalledWith([image]);
    expect(onFilesRejected).toHaveBeenCalledWith([{ file: text, reason: 'type' }]);
  });

  it('delivers several picked files through the pipeline and keeps the picker multiple', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onValueChange = vi.fn();
    const { container } = render(field({ onValueChange }));
    const input = container.querySelector('input[type=file]') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
    const files = [makeFile('a.png'), makeFile('b.png')];
    await user.upload(input, files);
    expect(onValueChange).toHaveBeenCalledWith(files);
  });

  it('sets the picker accept from acceptedTypes joined by commas, or image/* when omitted or empty', () => {
    const { container, rerender } = render(field({ acceptedTypes: ['image/png', 'image/webp'] }));
    const input = () => container.querySelector('input[type=file]') as HTMLInputElement;
    expect(input()).toHaveAttribute('accept', 'image/png,image/webp');
    rerender(field());
    expect(input()).toHaveAttribute('accept', 'image/*');
    rerender(field({ acceptedTypes: [] }));
    expect(input()).toHaveAttribute('accept', 'image/*');
  });
});

describe('AttachmentField v0.1 — validation (AC-09 to AC-13)', () => {
  it('rejects a disallowed or empty type and leaves the list unchanged', () => {
    const onValueChange = vi.fn();
    const onFilesRejected = vi.fn();
    render(field({ onValueChange, onFilesRejected, acceptedTypes: ['image/png', 'image/jpeg'] }));
    const bmp = makeFile('screenshot.bmp', 'image/bmp');
    const untyped = makeFile('mystery', '');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([bmp]) });
    expect(rejectionTexts()).toEqual(['screenshot.bmp was not added: only PNG, JPEG files are allowed.']);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([untyped]) });
    expect(rejectionTexts()).toEqual(['mystery was not added: only PNG, JPEG files are allowed.']);
    expect(onFilesRejected).toHaveBeenNthCalledWith(1, [{ file: bmp, reason: 'type' }]);
    expect(onFilesRejected).toHaveBeenNthCalledWith(2, [{ file: untyped, reason: 'type' }]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('matches types case-insensitively, exactly or by subtype wildcard', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange, acceptedTypes: ['image/PNG'] }));
    const png = makeFile('a.png', 'IMAGE/png');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([png]) });
    expect(onValueChange).toHaveBeenCalledWith([png]);
    const onOther = vi.fn();
    render(field({ onValueChange: onOther }));
    const svg = makeFile('a.svg', 'image/svg+xml');
    fireEvent.drop(at(screen.getAllByRole('button', { name: 'Drag, paste or upload' }), 1), {
      dataTransfer: transfer([svg])
    });
    expect(onOther).toHaveBeenCalledWith([svg]);
  });

  it('describes the default image rule in the rejection text', () => {
    render(field());
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    expect(rejectionTexts()).toEqual(['a.txt was not added: only image files are allowed.']);
  });

  it('accepts a file of exactly maxFileBytes and rejects one byte more', () => {
    const onValueChange = vi.fn();
    const onFilesRejected = vi.fn();
    render(field({ onValueChange, onFilesRejected, maxFileBytes: 5 * 1024 * 1024 }));
    const exact = makeFile('exact.png', 'image/png', 5 * 1024 * 1024);
    const over = makeFile('big.png', 'image/png', 5 * 1024 * 1024 + 1);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([exact]) });
    expect(onValueChange).toHaveBeenCalledWith([exact]);
    expect(onFilesRejected).not.toHaveBeenCalled();
    fireEvent.drop(dropzone(), { dataTransfer: transfer([over]) });
    expect(onFilesRejected).toHaveBeenCalledWith([{ file: over, reason: 'size' }]);
    expect(rejectionTexts()).toEqual(['big.png was not added: it is larger than 5 MB.']);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('counts the current list and accepts the first files that fit in order', () => {
    const onValueChange = vi.fn();
    const onFilesRejected = vi.fn();
    const first = makeFile('first.png');
    render(field({ defaultValue: [first], onValueChange, onFilesRejected, maxFiles: 3 }));
    const [a, b, c] = [makeFile('a.png'), makeFile('b.png'), makeFile('c.png')];
    fireEvent.drop(dropzone(), { dataTransfer: transfer([a, b, c]) });
    expect(onValueChange).toHaveBeenCalledWith([first, a, b]);
    expect(onFilesRejected).toHaveBeenCalledWith([{ file: c, reason: 'count' }]);
    expect(rejectionTexts()).toEqual(['c.png was not added: at most 3 attachments are allowed.']);
  });

  it('does not let files rejected for type or size consume capacity', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange, maxFiles: 1, maxFileBytes: 100 }));
    const text = makeFile('a.txt', 'text/plain', 1);
    const big = makeFile('big.png', 'image/png', 101);
    const good = makeFile('good.png', 'image/png', 100);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([text, big, good]) });
    expect(onValueChange).toHaveBeenCalledWith([good]);
  });

  it('uses plural texts for several files of one rule', () => {
    render(field({ maxFiles: 1, maxFileBytes: 1024 }));
    fireEvent.drop(dropzone(), {
      dataTransfer: transfer([makeFile('a.png', 'image/png', 2048), makeFile('b.png', 'image/png', 2048)])
    });
    expect(rejectionTexts()).toEqual(['2 files were not added: each must be 1 KB or smaller.']);
  });

  it('uses the plural count text when several files exceed the capacity', () => {
    render(field({ defaultValue: [makeFile('first.png')], maxFiles: 1 }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.png'), makeFile('b.png')]) });
    expect(rejectionTexts()).toEqual(['2 files were not added: at most 1 attachments are allowed.']);
  });

  it('reports one error per broken rule in type, size, count order and each file once', () => {
    const onFilesRejected = vi.fn();
    render(field({ onFilesRejected, maxFiles: 1, maxFileBytes: 100, acceptedTypes: ['image/png'] }));
    const typeAndSize = makeFile('both.bmp', 'image/bmp', 500);
    const size = makeFile('big.png', 'image/png', 500);
    const ok = makeFile('ok.png', 'image/png', 10);
    const count = makeFile('late.png', 'image/png', 10);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([ok, typeAndSize, size, count]) });
    expect(rejectionTexts()).toEqual([
      'both.bmp was not added: only PNG files are allowed.',
      'big.png was not added: it is larger than 100 B.',
      'late.png was not added: at most 1 attachments are allowed.'
    ]);
    expect(onFilesRejected).toHaveBeenCalledTimes(1);
    expect(at(onFilesRejected.mock.calls, 0)[0]).toEqual([
      { file: typeAndSize, reason: 'type' },
      { file: size, reason: 'size' },
      { file: count, reason: 'count' }
    ]);
  });

  it.each([
    ['maxFileBytes', 0],
    ['maxFileBytes', -1],
    ['maxFileBytes', Number.NaN],
    ['maxFileBytes', Number.POSITIVE_INFINITY],
    ['maxFiles', 0],
    ['maxFiles', -2],
    ['maxFiles', Number.NaN],
    ['maxFiles', Number.POSITIVE_INFINITY],
    ['maxFiles', 1.5]
  ])('ignores an invalid %s of %s', (prop, limit) => {
    const onValueChange = vi.fn();
    render(field({ onValueChange, [prop]: limit }));
    const files = [makeFile('a.png', 'image/png', 10 * 1024 * 1024), makeFile('b.png', 'image/png', 10)];
    fireEvent.drop(dropzone(), { dataTransfer: transfer(files) });
    expect(onValueChange).toHaveBeenCalledWith(files);
    expect(rejectionTexts()).toEqual([]);
  });
});

describe('AttachmentField v0.1 — rejection messages (AC-14)', () => {
  it('replaces messages on the next intake, clears them on an accepted one and links them from the Dropzone', () => {
    render(field({ maxFileBytes: 100 }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    const messages = Array.from(document.querySelectorAll('.eg-field-message'));
    expect(messages).toHaveLength(1);
    expect(dropzone()).toHaveAttribute('aria-describedby', at(messages, 0).id);
    expect(at(messages, 0).getAttribute('aria-live')).toBeNull();
    expect(at(messages, 0).getAttribute('role')).toBeNull();
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('big.png', 'image/png', 500)]) });
    expect(rejectionTexts()).toEqual(['big.png was not added: it is larger than 100 B.']);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('ok.png', 'image/png', 10)]) });
    expect(rejectionTexts()).toEqual([]);
    expect(dropzone()).not.toHaveAttribute('aria-describedby');
  });

  it('references exactly the ids of the present messages in rule order', () => {
    render(field({ maxFiles: 1, maxFileBytes: 100 }));
    fireEvent.drop(dropzone(), {
      dataTransfer: transfer([
        makeFile('ok.png', 'image/png', 1),
        makeFile('a.txt', 'text/plain'),
        makeFile('big.png', 'image/png', 500),
        makeFile('late.png', 'image/png', 1)
      ])
    });
    const ids = Array.from(document.querySelectorAll('.eg-field-message')).map((node) => node.id);
    expect(ids).toHaveLength(3);
    expect(dropzone()).toHaveAttribute('aria-describedby', ids.join(' '));
  });

  it('keeps a message when the intake has no files', () => {
    render(field());
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    fireEvent.drop(dropzone(), { dataTransfer: transfer([]) });
    expect(rejectionTexts()).toHaveLength(1);
  });

  it('applies messages overrides entry by entry over the defaults', () => {
    render(
      field({
        maxFileBytes: 100,
        messages: { rejectedSize: (files, max) => `${files.length} too big (${max})` }
      })
    );
    fireEvent.drop(dropzone(), {
      dataTransfer: transfer([makeFile('big.png', 'image/png', 500), makeFile('a.txt', 'text/plain')])
    });
    expect(rejectionTexts()).toEqual(['a.txt was not added: only image files are allowed.', '1 too big (100)']);
  });

  it('uses Image for a nameless file and passes Dropzone labels only when defined', () => {
    const { rerender } = render(field());
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('', 'text/plain')]) });
    expect(rejectionTexts()).toEqual(['Image was not added: only image files are allowed.']);
    rerender(field({ messages: { dropzoneLabel: 'Add screenshots' } }));
    expect(screen.getByRole('button', { name: 'Add screenshots' })).toBeInTheDocument();
  });
});

describe('AttachmentField v0.1 — message defaults', () => {
  const messages = () => renderHook(() => useAttachmentField({ label: 'Attachments' })).result.current.messages;

  it('builds item labels, remove names, announcements and sizes', () => {
    const m = messages();
    expect(m.itemLabel({ file: makeFile('a.png'), position: 1, typeLabel: 'PNG', sizeLabel: '240 KB' })).toBe(
      'Attachment 1, PNG, 240 KB'
    );
    expect(
      m.itemLabel({ file: makeFile('a.svg', 'image/svg+xml'), position: 2, typeLabel: 'SVG', sizeLabel: '1 KB' })
    ).toBe('Attachment 2, SVG, 1 KB');
    expect(m.removeItem('Attachment 1, PNG, 240 KB')).toBe('Remove Attachment 1, PNG, 240 KB');
    expect(m.added(1)).toBe('Attachment added');
    expect(m.added(3)).toBe('3 attachments added');
    expect(m.removed('Attachment 1, PNG, 240 KB')).toBe('Attachment 1, PNG, 240 KB removed');
    expect(m.dropzoneLabel).toBeUndefined();
    expect(m.dropzoneDropLabel).toBeUndefined();
  });

  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1 KB'],
    [240 * 1024, '240 KB'],
    [1024 * 1024 - 1, '1 MB'],
    [1024 * 1024, '1 MB'],
    [1.5 * 1024 * 1024, '1.5 MB'],
    [5 * 1024 * 1024, '5 MB']
  ])('formats %s bytes as %s', (bytes, text) => {
    expect(messages().formatSize(bytes)).toBe(text);
  });
});

describe('AttachmentField v0.1 — controlled and uncontrolled (AC-20)', () => {
  it('changes a controlled list only when the parent passes a new value', () => {
    const onValueChange = vi.fn();
    const current = [makeFile('first.png')];
    const { rerender } = render(field({ value: current, onValueChange }));
    const added = makeFile('a.png');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([added]) });
    expect(onValueChange).toHaveBeenLastCalledWith([at(current, 0), added]);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('b.png')]) });
    // The request was not applied, so the next request is still computed from the rendered list.
    expect(at(onValueChange.mock.calls, 1)[0]).toHaveLength(2);
    rerender(field({ value: [at(current, 0), added], onValueChange }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('c.png')]) });
    expect(at(onValueChange.mock.calls, 2)[0]).toHaveLength(3);
  });

  it('applies a controlled capacity from the rendered value', () => {
    const onFilesRejected = vi.fn();
    render(field({ value: [makeFile('a.png')], onValueChange: vi.fn(), maxFiles: 1, onFilesRejected }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('b.png')]) });
    expect(onFilesRejected).toHaveBeenCalledTimes(1);
  });

  it('renders a controlled value that breaks the limits without an error', () => {
    render(
      field({
        value: [makeFile('a.txt', 'text/plain'), makeFile('b.png'), makeFile('c.png')],
        onValueChange: vi.fn(),
        maxFiles: 1
      })
    );
    expect(rejectionTexts()).toEqual([]);
  });

  it('reads defaultValue once, ignores later defaultValue changes and accumulates additions', () => {
    const onValueChange = vi.fn();
    const first = makeFile('first.png');
    const { rerender } = render(field({ defaultValue: [first], onValueChange }));
    rerender(field({ defaultValue: [makeFile('other.png')], onValueChange }));
    const a = makeFile('a.png');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([a]) });
    expect(onValueChange).toHaveBeenLastCalledWith([first, a]);
    const b = makeFile('b.png');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([b]) });
    expect(onValueChange).toHaveBeenLastCalledWith([first, a, b]);
  });

  it('accumulates two intakes of one tick in uncontrolled mode', () => {
    const onValueChange = vi.fn();
    render(field({ onValueChange }));
    const [a, b] = [makeFile('a.png'), makeFile('b.png')];
    const target = notes();
    pasteInto(target, [a]);
    pasteInto(target, [b]);
    expect(onValueChange).toHaveBeenLastCalledWith([a, b]);
  });

  it('works as a controlled field wired to parent state', () => {
    const Host = () => {
      const [value, setValue] = useState<File[]>([]);
      return (
        <>
          <AttachmentField label='Attachments' value={value} onValueChange={setValue} maxFiles={2}>
            <textarea aria-label='Notes' />
          </AttachmentField>
          <output>{value.map((file) => file.name).join(',')}</output>
        </>
      );
    };
    render(<Host />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.png'), makeFile('b.png'), makeFile('c.png')]) });
    expect(document.querySelector('output')).toHaveTextContent('a.png,b.png');
  });
});

describe('AttachmentField v0.1 — maximum reached (AC-21)', () => {
  it('keeps the Dropzone rendered and enabled and rejects an extra file with a count message', () => {
    const onValueChange = vi.fn();
    render(field({ defaultValue: [makeFile('a.png'), makeFile('b.png')], maxFiles: 2, onValueChange }));
    expect(dropzone()).toBeEnabled();
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('c.png')]) });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(rejectionTexts()).toEqual(['c.png was not added: at most 2 attachments are allowed.']);
    expect(dropzone()).toBeEnabled();
  });
});
