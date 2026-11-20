import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, StrictMode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

const urls = { created: [] as File[], revoked: [] as string[] };

beforeEach(() => {
  urls.created = [];
  urls.revoked = [];
  URL.createObjectURL = vi.fn((blob: Blob | MediaSource) => {
    urls.created.push(blob as File);
    return `blob:preview-${urls.created.length}`;
  });
  URL.revokeObjectURL = vi.fn((url: string) => {
    urls.revoked.push(url);
  });
});

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
    expect(rejectionTexts()).toEqual(['2 files were not added: at most 1 attachment is allowed.']);
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
      'late.png was not added: at most 1 attachment is allowed.'
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

describe('AttachmentField v0.1.1 — external value changes (AC-14a to AC-14d)', () => {
  type HarnessProps = { initial?: File[]; transform?: (next: File[]) => File[]; recreate?: boolean };
  const Harness = ({
    initial = [makeFile('first.png')],
    transform = (next) => next,
    recreate = false
  }: HarnessProps) => {
    const [files, setFiles] = useState<File[]>(initial);
    return (
      <AttachmentField
        label='Attachments'
        maxFileBytes={100}
        value={recreate ? [...files] : files}
        onValueChange={(next) => setFiles(transform(next))}
      >
        <textarea aria-label='Notes' />
        <button type='button' onClick={() => setFiles([])}>
          Reset
        </button>
      </AttachmentField>
    );
  };
  const mixed = () => [makeFile('ok.png', 'image/png', 10), makeFile('big.png', 'image/png', 500)];
  const rejectedBig = 'big.png was not added: it is larger than 100 B.';

  it('AC-14a clears messages and aria-describedby on a parent reset and leaves focus on the Textarea', () => {
    render(<Harness />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    expect(rejectionTexts()).toHaveLength(1);
    expect(dropzone()).toHaveAttribute('aria-describedby');
    notes().focus();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(rejectionTexts()).toEqual([]);
    expect(dropzone()).not.toHaveAttribute('aria-describedby');
    expect(document.activeElement).toBe(notes());
  });

  it.each([
    ['the same array', (next: File[]) => next],
    ['a copied array', (next: File[]) => [...next]]
  ])('AC-14b keeps the message of a mixed intake echoed as %s', (_name, transform) => {
    render(<Harness transform={transform} />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer(mixed()) });
    expect(rejectionTexts()).toEqual([rejectedBig]);
    expect(dropzone()).toHaveAttribute('aria-describedby');
  });

  it('AC-14b keeps the message when the parent re-creates the same list on every render', () => {
    render(<Harness recreate={true} />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer(mixed()) });
    expect(rejectionTexts()).toEqual([rejectedBig]);
  });

  it('AC-14c clears the messages when the value is replaced by other files', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(field({ maxFileBytes: 100, value: [makeFile('first.png')], onValueChange }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    expect(rejectionTexts()).toHaveLength(1);
    rerender(field({ maxFileBytes: 100, value: [makeFile('other.png')], onValueChange }));
    expect(rejectionTexts()).toEqual([]);
    expect(dropzone()).not.toHaveAttribute('aria-describedby');
  });

  it('AC-14c clears the messages when the parent filters the requested list', () => {
    render(<Harness initial={[]} transform={(next) => next.slice(0, 1)} />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([...mixed(), makeFile('also.png', 'image/png', 5)]) });
    expect(rejectionTexts()).toEqual([]);
  });

  it('AC-14d adds no announcement and no node when the messages are cleared', () => {
    const { container } = render(<Harness />);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    const statusText = screen.getByRole('status').textContent;
    const nodes = container.querySelectorAll('*').length;
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('status').textContent).toBe(statusText);
    expect(container.querySelectorAll('*').length).toBeLessThan(nodes);
    expect(container.querySelectorAll('.eg-field-message')).toHaveLength(0);
  });

  it('AC-14d leaves the uncontrolled field unchanged: messages stay until the next intake or removal', () => {
    const { rerender } = render(field({ maxFileBytes: 100 }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    rerender(field({ maxFileBytes: 100, className: 'other' }));
    expect(rejectionTexts()).toHaveLength(1);
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

describe('AttachmentField v0.1 — message grammar (L2)', () => {
  it('uses the singular and plural count texts', () => {
    const { unmount } = render(field({ defaultValue: [makeFile('first.png')], maxFiles: 1 }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.png')]) });
    expect(rejectionTexts()).toEqual(['a.png was not added: at most 1 attachment is allowed.']);
    unmount();
    render(field({ defaultValue: [makeFile('x.png'), makeFile('y.png'), makeFile('z.png')], maxFiles: 3 }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.png'), makeFile('b.png')]) });
    expect(rejectionTexts()).toEqual(['2 files were not added: at most 3 attachments are allowed.']);
  });
});

const removeButtons = () => screen.getAllByRole('button', { name: /^Remove / });
const status = () => screen.getByRole('status');

describe('AttachmentField v0.1 — strip and labels (AC-16)', () => {
  it('renders a list named by label with a named image and Remove button per file', () => {
    render(
      field({
        defaultValue: [makeFile('a.png'), makeFile('b.jpg', 'image/jpeg', 2048), makeFile('c.svg', 'image/svg+xml', 12)]
      })
    );
    const list = screen.getByRole('list', { name: 'Attachments' });
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('eg-cluster');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'Attachment 1, PNG, 240 KB' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Attachment 2, JPEG, 2 KB' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Attachment 3, SVG, 12 B' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Attachment 1, PNG, 240 KB' })).toBeInTheDocument();
    expect(removeButtons()).toHaveLength(3);
  });

  it('applies messages overrides including formatSize and renumbers after a removal', async () => {
    render(
      field({
        defaultValue: [makeFile('a.png'), makeFile('b.png')],
        messages: {
          itemLabel: ({ position, sizeLabel }) => `Picture ${position} (${sizeLabel})`,
          removeItem: (label) => `Delete ${label}`,
          formatSize: (bytes) => `${bytes} bytes`
        }
      })
    );
    expect(screen.getByRole('img', { name: 'Picture 2 (245760 bytes)' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete Picture 1 (245760 bytes)' }));
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Picture 1 (245760 bytes)' })).toBeInTheDocument();
  });

  it('keeps duplicate file names as distinct items', () => {
    render(field({ defaultValue: [makeFile('same.png'), makeFile('same.png')] }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

describe('AttachmentField v0.1 — object URLs (AC-17)', () => {
  it('creates one URL per file and shows it', () => {
    const files = [makeFile('a.png'), makeFile('b.png')];
    render(field({ defaultValue: files }));
    expect(urls.created).toEqual(files);
    expect(screen.getAllByRole('img').map((img) => img.getAttribute('src'))).toEqual([
      'blob:preview-1',
      'blob:preview-2'
    ]);
    expect(urls.revoked).toEqual([]);
  });

  it('creates a URL for an added file only and revokes the URL of a removed file', async () => {
    const first = makeFile('a.png');
    render(field({ defaultValue: [first, makeFile('b.png')] }));
    await userEvent.click(at(removeButtons(), 0));
    expect(urls.revoked).toEqual(['blob:preview-1']);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('c.png')]) });
    expect(urls.created).toHaveLength(3);
    expect(urls.revoked).toEqual(['blob:preview-1']);
  });

  it('revokes on a controlled list change and on unmount, never a URL still shown', () => {
    const [a, b] = [makeFile('a.png'), makeFile('b.png')];
    const { rerender, unmount } = render(field({ value: [a, b], onValueChange: vi.fn() }));
    rerender(field({ value: [b], onValueChange: vi.fn() }));
    expect(urls.revoked).toEqual(['blob:preview-1']);
    expect(screen.getByRole('img').getAttribute('src')).toBe('blob:preview-2');
    unmount();
    expect(urls.revoked).toEqual(['blob:preview-1', 'blob:preview-2']);
  });

  it('keeps creation and revocation balanced under StrictMode, with none left after unmount', () => {
    const { unmount } = render(
      <StrictMode>{field({ defaultValue: [makeFile('a.png'), makeFile('b.png')] })}</StrictMode>
    );
    const live = screen.getAllByRole('img').map((img) => img.getAttribute('src'));
    expect(new Set(live).size).toBe(2);
    for (const url of live) {
      expect(urls.revoked).not.toContain(url);
    }
    unmount();
    expect(urls.revoked).toHaveLength(urls.created.length);
  });
});

describe('AttachmentField v0.1 — removal (AC-18)', () => {
  it('removes by click, Enter and Space and emits the list without the file', async () => {
    const onValueChange = vi.fn();
    const files = [makeFile('a.png'), makeFile('b.png'), makeFile('c.png'), makeFile('d.png')];
    render(field({ defaultValue: files, onValueChange }));
    await userEvent.click(at(removeButtons(), 0));
    expect(onValueChange).toHaveBeenLastCalledWith([at(files, 1), at(files, 2), at(files, 3)]);
    at(removeButtons(), 0).focus();
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith([at(files, 2), at(files, 3)]);
    at(removeButtons(), 0).focus();
    await userEvent.keyboard(' ');
    expect(onValueChange).toHaveBeenLastCalledWith([at(files, 3)]);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('tabs from the Textarea through the Remove buttons to the Dropzone', async () => {
    render(field({ defaultValue: [makeFile('a.png'), makeFile('b.png')] }));
    await userEvent.click(notes());
    await userEvent.tab();
    expect(at(removeButtons(), 0)).toHaveFocus();
    await userEvent.tab();
    expect(at(removeButtons(), 1)).toHaveFocus();
    await userEvent.tab();
    expect(dropzone()).toHaveFocus();
  });

  it('clears the previous rejection messages on a removal', async () => {
    render(field({ defaultValue: [makeFile('a.png')] }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    expect(rejectionTexts()).toHaveLength(1);
    await userEvent.click(at(removeButtons(), 0));
    expect(rejectionTexts()).toEqual([]);
  });
});

describe('AttachmentField v0.1 — focus after removal (AC-19)', () => {
  const three = (): [File, File, File] => [makeFile('a.png'), makeFile('b.png'), makeFile('c.png')];

  it('focuses the next item, else the previous, else the Dropzone (uncontrolled)', async () => {
    render(field({ defaultValue: three() }));
    await userEvent.click(at(removeButtons(), 1));
    expect(at(removeButtons(), 1)).toHaveFocus();
    expect(removeButtons()).toHaveLength(2);
    await userEvent.click(at(removeButtons(), 1));
    expect(at(removeButtons(), 0)).toHaveFocus();
    await userEvent.click(at(removeButtons(), 0));
    expect(dropzone()).toHaveFocus();
  });

  it('moves focus in controlled mode once the parent applies the removal', async () => {
    const Host = () => {
      const [value, setValue] = useState<File[]>(three());
      return <AttachmentField label='Attachments' value={value} onValueChange={setValue} />;
    };
    render(<Host />);
    await userEvent.click(at(removeButtons(), 0));
    expect(at(removeButtons(), 0)).toHaveFocus();
    expect(removeButtons()).toHaveLength(2);
  });

  it('keeps focus on the button when a controlled request is not applied', async () => {
    const onValueChange = vi.fn();
    render(field({ value: three(), onValueChange }));
    await userEvent.click(at(removeButtons(), 1));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(at(removeButtons(), 1)).toHaveFocus();
  });

  it('does not steal focus the user already moved elsewhere', async () => {
    const [a, b, c] = three();
    const onValueChange = vi.fn();
    const { rerender } = render(field({ value: [a, b, c], onValueChange }));
    await userEvent.click(at(removeButtons(), 0));
    notes().focus();
    rerender(field({ value: [b, c], onValueChange }));
    expect(notes()).toHaveFocus();
  });

  it('discards an unapplied request when a later change arrives', async () => {
    const [a, b, c] = three();
    const onValueChange = vi.fn();
    const { rerender } = render(field({ value: [a, b, c], onValueChange }));
    await userEvent.click(at(removeButtons(), 0));
    (document.activeElement as HTMLElement).blur();
    rerender(field({ value: [a, b, c, makeFile('d.png')], onValueChange }));
    expect(document.body).toHaveFocus();
  });
});

describe('AttachmentField v0.1 — announcements (AC-15)', () => {
  it('mounts the polite status region before any content and keeps it', () => {
    const { container } = render(field());
    expect(status()).toHaveAttribute('aria-live', 'polite');
    expect(status()).toBeEmptyDOMElement();
    expect(container.querySelectorAll('[role=status]')).toHaveLength(1);
  });

  it('announces one text per intake: added, then each rejection', () => {
    render(field({ acceptedTypes: ['image/png'] }));
    fireEvent.drop(dropzone(), {
      dataTransfer: transfer([makeFile('a.png'), makeFile('b.png'), makeFile('c.txt', 'text/plain')])
    });
    expect(status()).toHaveTextContent('2 attachments added c.txt was not added: only PNG files are allowed.');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('only.png')]) });
    expect(status()).toHaveTextContent(/^Attachment added$/);
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('d.txt', 'text/plain')]) });
    expect(status()).toHaveTextContent(/^d\.txt was not added: only PNG files are allowed\.$/);
  });

  it('announces one text per removal', async () => {
    render(field({ defaultValue: [makeFile('a.png')] }));
    await userEvent.click(at(removeButtons(), 0));
    expect(status()).toHaveTextContent(/^Attachment 1, PNG, 240 KB removed$/);
  });

  it('announces nothing for an empty selection', () => {
    render(field());
    fireEvent.drop(dropzone(), { dataTransfer: transfer([]) });
    expect(status()).toBeEmptyDOMElement();
  });

  it('replaces the inner span for two identical consecutive announcements', async () => {
    render(field({ defaultValue: [makeFile('a.png'), makeFile('b.png')] }));
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('x.png')]) });
    const first = status().firstElementChild;
    expect(first).toHaveTextContent('Attachment added');
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('y.png')]) });
    const second = status().firstElementChild;
    expect(second).toHaveTextContent('Attachment added');
    expect(second).not.toBe(first);
  });

  it('keeps visible errors out of live regions', () => {
    render(field());
    fireEvent.drop(dropzone(), { dataTransfer: transfer([makeFile('a.txt', 'text/plain')]) });
    const message = document.querySelector('.eg-field-message') as HTMLElement;
    expect(message).not.toHaveAttribute('aria-live');
    expect(message).not.toHaveAttribute('role');
  });
});

describe('AttachmentField v0.1 — disabled (AC-22)', () => {
  it('disables the Dropzone and every Remove button, keeps the strip and sets data-disabled', () => {
    const { container } = render(field({ defaultValue: [makeFile('a.png'), makeFile('b.png')], disabled: true }));
    expect(dropzone()).toBeDisabled();
    for (const button of removeButtons()) {
      expect(button).toBeDisabled();
    }
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
  });

  it('ignores paste: no preventDefault, callbacks or announcement', () => {
    const onValueChange = vi.fn();
    const onFilesRejected = vi.fn();
    render(field({ disabled: true, onValueChange, onFilesRejected }));
    expect(pasteInto(notes(), [makeFile('a.png')])).toBe(true);
    expect(pasteInto(notes(), [makeFile('a.txt', 'text/plain')])).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onFilesRejected).not.toHaveBeenCalled();
    expect(status()).toBeEmptyDOMElement();
  });

  it('does not remove while disabled and restores behavior when enabled again', async () => {
    const onValueChange = vi.fn();
    const files = [makeFile('a.png')];
    const { rerender, container } = render(field({ defaultValue: files, disabled: true, onValueChange }));
    await userEvent.click(at(removeButtons(), 0));
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(field({ defaultValue: files, onValueChange }));
    expect(container.firstElementChild).not.toHaveAttribute('data-disabled');
    await userEvent.click(at(removeButtons(), 0));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });
});

describe('AttachmentField v0.1 — rootRef and motion (AC-23)', () => {
  it('returns a rootRef attached to the root element', () => {
    const { result } = renderHook(() => useAttachmentField({ label: 'Attachments' }));
    expect(result.current.rootRef).toHaveProperty('current', null);
    const { container } = render(field());
    expect(container.firstElementChild).toHaveClass('eg-attachment-field');
  });

  it('adds no transition, animation or duration utility of its own', () => {
    const { container } = render(field({ defaultValue: [makeFile('a.png')] }));
    const own = [
      container.firstElementChild,
      screen.getByRole('list'),
      screen.getByRole('listitem'),
      screen.getByRole('status')
    ].map((node) => node?.className ?? '');
    for (const className of own) {
      expect(className).not.toMatch(/(^|\s)(transition|animate|duration)/);
    }
  });
});
