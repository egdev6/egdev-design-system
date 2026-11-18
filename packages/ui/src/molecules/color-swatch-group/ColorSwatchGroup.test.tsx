import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentPropsWithoutRef, type ComponentType, useState } from 'react';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import * as ui from '@/index';

type Option = { value: string; label: string; disabled?: boolean };
type TestProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange' | 'children'> & {
  label: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  customLabel?: string;
};

// Look up the public barrel at runtime so RED reports the missing export as a test failure,
// rather than preventing the suite from collecting before the implementation exists.
const ColorSwatchGroup = Reflect.get(ui, 'ColorSwatchGroup') as ComponentType<TestProps>;
const options: Option[] = [
  { value: '#AA0000', label: 'Red' },
  { value: '#cccccc', label: 'Unavailable gray', disabled: true },
  { value: '#00AACC', label: 'Ocean' },
  { value: '#ffee00', label: 'Gold' }
];

function radio(name: string) {
  return screen.getByRole('radio', { name });
}

function picker(name = 'Custom color') {
  return screen.getByLabelText(name) as HTMLInputElement;
}

function currentValue() {
  return screen.getByRole('status');
}

function patches(root: Element) {
  return [...root.querySelectorAll<HTMLElement>('[style]')].filter((element) =>
    element.style.getPropertyValue('--eg-swatch-color')
  );
}

const ringClasses = [
  'rounded-full',
  'border-solid',
  'border-(length:--border-width)',
  'border-border-hairline-strong',
  'group-data-[state=checked]:outline-solid',
  'group-data-[state=checked]:outline-(length:--focus-width)',
  'group-data-[state=checked]:outline-fg-default',
  'group-data-[state=checked]:outline-offset-(--focus-width)'
];

function rings(container: Element) {
  return [...container.querySelectorAll<HTMLElement>('.border-border-hairline-strong')];
}

function customFrame() {
  const frame = picker().parentElement;
  if (!frame) {
    throw new Error('Missing custom frame');
  }
  return frame;
}

async function arrow(user: ReturnType<typeof userEvent.setup>, key: 'ArrowLeft' | 'ArrowRight') {
  // Radix schedules focus while the arrow is held, as in a browser.
  await user.keyboard(`{${key}>}`);
  await user.keyboard(`{/${key}}`);
}

function AcceptingGroup({
  initialValue = '#AA0000',
  onRequest,
  dir = 'ltr',
  customLabel = 'Custom color'
}: {
  initialValue?: string;
  onRequest: (value: string) => void;
  dir?: 'ltr' | 'rtl';
  customLabel?: string;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value={value}
        customLabel={customLabel}
        dir={dir}
        onValueChange={(next) => {
          onRequest(next);
          setValue(next);
        }}
      />
      <div role='region' aria-label='Consumer value'>
        {value}
      </div>
    </>
  );
}

describe('ColorSwatchGroup public contract', () => {
  it('exports the molecule and names the fieldset, presets, picker and live output separately (AC-01, AC-11)', () => {
    expect(typeof ColorSwatchGroup).toBe('function');
    const onValueChange = vi.fn();
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#aa0000'
        customLabel='Custom color'
        onValueChange={onValueChange}
      />
    );
    const fieldset = screen.getByRole('group', { name: 'Accent' });
    const group = screen.getByRole('radiogroup', { name: 'Accent' });
    expect(fieldset.tagName).toBe('FIELDSET');
    expect(fieldset).toHaveClass('eg-color-swatch-group');
    expect(within(fieldset).getByText('Accent', { selector: 'legend' })).toBeVisible();
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveAttribute('aria-labelledby', fieldset.querySelector('legend')?.id);
    expect(within(group).getAllByRole('radio')).toHaveLength(4);
    for (const option of options) {
      expect(radio(option.label)).toHaveAccessibleName(option.label);
      // v0.2: names stay in the accessibility tree but are visually hidden.
      expect(screen.getByText(option.label)).toHaveClass('sr-only');
    }
    expect(picker()).toHaveAttribute('type', 'color');
    expect(picker()).toHaveAccessibleName('Custom color');
    expect(group).not.toContainElement(picker());
    expect(picker()).not.toHaveAttribute('aria-pressed');
    expect(currentValue()).toHaveAttribute('aria-live', 'polite');
    expect(currentValue()).toHaveTextContent(/Accent.*#aa0000/);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('forwards native fieldset attributes and generates independent naming IDs (AC-01, AC-11)', () => {
    const change = vi.fn();
    render(
      <>
        <p id='accent-help'>Choose an accent.</p>
        <ColorSwatchGroup
          label='Accent'
          options={options}
          value='#AA0000'
          customLabel='Custom color'
          onValueChange={change}
          id='accent-choice'
          dir='rtl'
          aria-describedby='accent-help'
          data-context='appearance'
        />
        <ColorSwatchGroup
          label='Other'
          options={options}
          value='#ffee00'
          customLabel='Other custom'
          onValueChange={change}
        />
      </>
    );
    const fieldset = screen.getByRole('group', { name: 'Accent' });
    const group = screen.getByRole('radiogroup', { name: 'Accent' });
    expect(fieldset).toHaveAttribute('id', 'accent-choice');
    expect(fieldset).toHaveAttribute('dir', 'rtl');
    expect(group).toHaveAttribute('dir', 'rtl');
    expect(fieldset).toHaveAttribute('data-context', 'appearance');
    expect(fieldset).toHaveAccessibleDescription('Choose an accent.');
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(picker().id).not.toBe(picker('Other custom').id);
    expect(change).not.toHaveBeenCalled();
  });

  it('matches presets case-insensitively without changing the supplied output spelling (AC-03, AC-04)', () => {
    const change = vi.fn();
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#aa0000'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    expect(radio('Red')).toBeChecked();
    expect(radio('Ocean')).not.toBeChecked();
    expect(currentValue()).toHaveTextContent('#aa0000');
    expect(picker()).toHaveValue('#aa0000');
    expect(change).not.toHaveBeenCalled();
  });

  it('requests the original preset spelling once while a rejecting parent keeps its stored value (AC-02, AC-03)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const stored = '#aa0000';
    const originalOptions = structuredClone(options);
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value={stored}
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    await user.click(radio('Ocean'));
    expect(change.mock.calls).toEqual([['#00AACC']]);
    expect(stored).toBe('#aa0000');
    expect(radio('Red')).toBeChecked();
    expect(radio('Ocean')).not.toBeChecked();
    expect(currentValue()).toHaveTextContent('#aa0000');
    expect(picker()).toHaveValue('#aa0000');
    expect(options).toEqual(originalOptions);
    await user.click(radio('Red'));
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('updates only after the parent accepts a preset and never emits for prop updates (AC-03)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const originalOptions = structuredClone(options);
    render(<AcceptingGroup onRequest={change} />);
    await user.click(radio('Ocean'));
    expect(change.mock.calls).toEqual([['#00AACC']]);
    expect(radio('Ocean')).toBeChecked();
    expect(currentValue()).toHaveTextContent('#00AACC');
    expect(picker()).toHaveValue('#00aacc');
    expect(screen.getByRole('region', { name: 'Consumer value' })).toHaveTextContent('#00AACC');
    expect(options).toEqual(originalOptions);
  });

  it('uses Radix horizontal arrows to select, skip disabled choices, loop and leave for the picker (AC-02)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <AcceptingGroup onRequest={change} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    await user.tab();
    expect(radio('Red')).toHaveFocus();
    await arrow(user, 'ArrowRight');
    expect(radio('Ocean')).toHaveFocus();
    expect(radio('Ocean')).toBeChecked();
    await arrow(user, 'ArrowRight');
    expect(radio('Gold')).toHaveFocus();
    await arrow(user, 'ArrowRight');
    expect(radio('Red')).toHaveFocus();
    await arrow(user, 'ArrowLeft');
    expect(radio('Gold')).toHaveFocus();
    expect(radio('Gold')).toBeChecked();
    expect(change.mock.calls).toEqual([['#00AACC'], ['#ffee00'], ['#AA0000'], ['#ffee00']]);
    await user.tab();
    expect(picker()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('reverses horizontal Radix navigation in RTL and retains supplied option order (AC-02)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<AcceptingGroup dir='rtl' onRequest={change} />);
    expect(screen.getAllByRole('radio')).toEqual(options.map((item) => radio(item.label)));
    await user.tab();
    expect(radio('Red')).toHaveFocus();
    await arrow(user, 'ArrowLeft');
    expect(radio('Ocean')).toHaveFocus();
    expect(radio('Ocean')).toBeChecked();
    await arrow(user, 'ArrowRight');
    expect(radio('Red')).toHaveFocus();
    expect(change.mock.calls).toEqual([['#00AACC'], ['#AA0000']]);
  });

  it('enters the first enabled radio and Space requests it when a custom value is current (AC-02, AC-04)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const choices = [{ value: '#101010', label: 'Disabled first', disabled: true }, ...options];
    render(<ColorSwatchGroup label='Accent' options={choices} value='#123456' onValueChange={change} />);
    expect(screen.getAllByRole('radio').every((item) => item.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(currentValue()).toHaveTextContent('#123456');
    await user.tab();
    expect(radio('Red')).toHaveFocus();
    await user.keyboard(' ');
    expect(change.mock.calls).toEqual([['#AA0000']]);
    expect(radio('Red')).not.toBeChecked();
    expect(currentValue()).toHaveTextContent('#123456');
  });

  it('preserves a disabled selected option and blocks its activation (AC-06)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#CCCCCC'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    const selected = radio('Unavailable gray');
    expect(selected).toBeDisabled();
    expect(selected).toBeChecked();
    expect(selected).toHaveAttribute('data-disabled');
    expect(currentValue()).toHaveTextContent('#CCCCCC');
    expect(picker()).toHaveValue('#cccccc');
    // Enter from outside the group before the disabled click, which may move focus to an ancestor.
    await user.tab();
    expect(radio('Red')).toHaveFocus();
    await user.click(selected);
    expect(selected).toBeChecked();
    expect(currentValue()).toHaveTextContent('#CCCCCC');
    expect(picker()).toHaveValue('#cccccc');
    expect(change).not.toHaveBeenCalled();
  });

  it('disables the whole group without hiding its accepted value or adding tab stops (AC-06)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <>
        <ColorSwatchGroup
          label='Accent'
          options={options}
          value='#AA0000'
          customLabel='Custom color'
          disabled={true}
          onValueChange={change}
        />
        <button type='button'>Next</button>
      </>
    );
    expect(screen.getByRole('group', { name: 'Accent' })).toBeDisabled();
    for (const item of screen.getAllByRole('radio')) {
      expect(item).toBeDisabled();
    }
    expect(radio('Red')).toBeChecked();
    expect(picker()).toBeDisabled();
    expect(currentValue()).toBeVisible();
    expect(currentValue()).toHaveTextContent('#AA0000');
    await user.click(radio('Ocean'));
    await user.click(picker());
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(change).not.toHaveBeenCalled();
  });

  it('keeps an all-disabled preset collection out of the tab order (AC-06)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <>
        <ColorSwatchGroup
          label='Accent'
          options={options.map((item) => ({ ...item, disabled: true }))}
          value='#AA0000'
          onValueChange={change}
        />
        <button type='button'>Next</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(radio('Red')).toBeChecked();
    expect(currentValue()).toHaveTextContent('#AA0000');
    expect(change).not.toHaveBeenCalled();
  });

  it('accepts a native custom value and matches a preset ignoring case (AC-03, AC-04)', () => {
    const change = vi.fn();
    render(<AcceptingGroup initialValue='#123456' onRequest={change} />);
    expect(screen.getAllByRole('radio').every((item) => item.getAttribute('aria-checked') === 'false')).toBe(true);
    expect(currentValue()).toHaveTextContent('#123456');
    fireEvent.change(picker(), { target: { value: '#00aacc' } });
    expect(change.mock.calls).toEqual([['#00aacc']]);
    expect(screen.getByRole('region', { name: 'Consumer value' })).toHaveTextContent('#00aacc');
    expect(currentValue()).toHaveTextContent('#00aacc');
    expect(radio('Ocean')).toBeChecked();
  });

  it('keeps the supplied value after a parent rejects a custom request (AC-03, AC-04)', () => {
    const change = vi.fn();
    const stored = '#aa0000';
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value={stored}
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    fireEvent.change(picker(), { target: { value: '#123456' } });
    expect(change.mock.calls).toEqual([['#123456']]);
    expect(stored).toBe('#aa0000');
    expect(currentValue()).toHaveTextContent('#aa0000');
    expect(picker()).toHaveValue('#aa0000');
    expect(radio('Red')).toBeChecked();
  });

  it('ignores picker events for the same color or invalid values without changing accepted state (AC-03, AC-07)', () => {
    const change = vi.fn();
    const stored = '#AA0000';
    render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value={stored}
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    fireEvent.change(picker(), { target: { value: '#aa0000' } });
    for (const value of ['#fff', '#12345678', ' #123456', '#123456\n', 'var(--color)', '#123456; color:red']) {
      // A native browser normally sanitizes malformed color values before dispatching; this
      // simulates a malformed event source without setting unsafe CSS or consumer state.
      const getter = vi.spyOn(picker(), 'value', 'get').mockReturnValue(value);
      fireEvent.input(picker());
      getter.mockRestore();
    }
    expect(change).not.toHaveBeenCalled();
    expect(stored).toBe('#AA0000');
    expect(currentValue()).toHaveTextContent('#AA0000');
    expect(radio('Red')).toBeChecked();
    expect(picker()).toHaveValue('#aa0000');
  });

  it('omits a missing or blank custom label without omitting the selected value (AC-05)', () => {
    const change = vi.fn();
    const { rerender } = render(
      <ColorSwatchGroup label='Accent' options={options} value='#AA0000' onValueChange={change} />
    );
    expect(screen.queryByLabelText('Custom color')).toBeNull();
    expect(document.querySelector('input[type="color"]')).toBeNull();
    expect(radio('Red')).toBeChecked();
    expect(currentValue()).toHaveTextContent('#AA0000');
    rerender(
      <ColorSwatchGroup label='Accent' options={options} value='#AA0000' customLabel={' \t '} onValueChange={change} />
    );
    expect(document.querySelector('input[type="color"]')).toBeNull();
    expect(change).not.toHaveBeenCalled();
  });

  it('omits an empty radiogroup while retaining the custom picker and current output (AC-05)', () => {
    const change = vi.fn();
    render(
      <ColorSwatchGroup label='Accent' options={[]} value='#123456' customLabel='Custom color' onValueChange={change} />
    );
    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(currentValue()).toHaveTextContent('#123456');
    expect(picker()).toBeEnabled();
    fireEvent.change(picker(), { target: { value: '#00ff00' } });
    expect(change.mock.calls).toEqual([['#00ff00']]);
    expect(currentValue()).toHaveTextContent('#123456');
    expect(picker()).toHaveValue('#123456');
  });

  it('filters malformed colors and blank option labels without mutating consumer options (AC-07, AC-08)', () => {
    const invalid = [
      '',
      '#fff',
      '#12345',
      '#12345678',
      ' #123456',
      '#123456 ',
      '#123456\n',
      '#ABCDEG',
      'var(--color)',
      'rgb(1, 2, 3)',
      'linear-gradient(red,blue)',
      'url(https://invalid)',
      '#123456; color:red'
    ];
    const supplied: Option[] = [
      ...invalid.map((value, index) => ({ value, label: `Invalid ${index}` })),
      { value: '#123456', label: '   ' },
      { value: '#AABBCC', label: 'Valid' }
    ];
    const original = structuredClone(supplied);
    const change = vi.fn();
    const { container } = render(
      <ColorSwatchGroup label='Accent' options={supplied} value='#aabbcc' onValueChange={change} />
    );
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    expect(radio('Valid')).toBeChecked();
    expect(patches(container)).toHaveLength(1);
    expect(patches(container)[0]).toHaveAttribute('aria-hidden', 'true');
    expect(patches(container)[0]?.style.getPropertyValue('--eg-swatch-color')).toBe('#aabbcc');
    expect(container.innerHTML).not.toContain('color:red');
    expect(supplied).toEqual(original);
    expect(change).not.toHaveBeenCalled();
  });

  it('keeps only the first valid duplicate even when disabled and ignores earlier blank labels (AC-07)', () => {
    const change = vi.fn();
    const supplied = [
      { value: '#ABCDEF', label: '  ' },
      { value: '#aBcDeF', label: 'First', disabled: true },
      { value: '#ABCDEF', label: 'Duplicate' },
      { value: '#112233', label: 'Second' }
    ];
    const before = structuredClone(supplied);
    render(<ColorSwatchGroup label='Accent' options={supplied} value='#ABCDEF' onValueChange={change} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(radio('First')).toBeDisabled();
    expect(radio('First')).toBeChecked();
    expect(screen.queryByRole('radio', { name: 'Duplicate' })).toBeNull();
    expect(radio('Second')).not.toBeChecked();
    expect(supplied).toEqual(before);
    expect(change).not.toHaveBeenCalled();
  });

  it('disables the picker and shows a placeholder for invalid incoming values without passing them to CSS (AC-07)', () => {
    const change = vi.fn();
    const badValues = [
      '',
      '#abc',
      '#12345678',
      '#ABCDEG',
      ' #123456',
      '#123456 ',
      '#123456\n',
      'var(--bad)',
      '#123456; color:red'
    ];
    const { container, rerender } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#AA0000'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    for (const value of badValues) {
      rerender(
        <ColorSwatchGroup
          label='Accent'
          options={options}
          value={value}
          customLabel='Custom color'
          onValueChange={change}
        />
      );
      expect(screen.getAllByRole('radio').every((item) => item.getAttribute('aria-checked') === 'false')).toBe(true);
      expect(currentValue()).toHaveTextContent(/Accent.*—/);
      expect(picker()).toBeDisabled();
      expect(picker()).not.toHaveAttribute('value', value);
      expect(container.innerHTML).not.toContain('var(--bad)');
      expect(patches(container).map((node) => node.style.getPropertyValue('--eg-swatch-color'))).toEqual([
        '#aa0000',
        '#cccccc',
        '#00aacc',
        '#ffee00'
      ]);
      expect(change).not.toHaveBeenCalled();
    }
  });

  it('recovers silently from invalid values and responds to changed options without mutating them (AC-03, AC-07)', () => {
    const change = vi.fn();
    const updated = [{ value: '#123456', label: 'New preset' }];
    const before = structuredClone(updated);
    const { rerender } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='invalid'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    expect(picker()).toBeDisabled();
    rerender(
      <ColorSwatchGroup
        label='Accent'
        options={updated}
        value='#123456'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    expect(picker()).toBeEnabled();
    expect(picker()).toHaveValue('#123456');
    expect(radio('New preset')).toBeChecked();
    expect(currentValue()).toHaveTextContent('#123456');
    expect(updated).toEqual(before);
    expect(change).not.toHaveBeenCalled();
    rerender(
      <ColorSwatchGroup label='Accent' options={[]} value='#123456' customLabel='Custom color' onValueChange={change} />
    );
    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(currentValue()).toHaveTextContent('#123456');
    expect(change).not.toHaveBeenCalled();
  });

  it('renders nothing for a blank required group label without emitting changes (AC-07)', () => {
    const change = vi.fn();
    const { container, rerender } = render(
      <ColorSwatchGroup label='' options={options} value='#AA0000' customLabel='Custom color' onValueChange={change} />
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <ColorSwatchGroup
        label={' \t\n '}
        options={options}
        value='#AA0000'
        customLabel='Custom color'
        onValueChange={change}
      />
    );
    expect(container).toBeEmptyDOMElement();
    expect(change).not.toHaveBeenCalled();
  });

  it('uses the static paint utility only on validated decorative patches of varied colors (AC-08)', () => {
    const change = vi.fn();
    const colors = [
      { value: '#000000', label: 'Dark' },
      { value: '#FFFFFF', label: 'Bright' },
      { value: '#1B1C20', label: 'Surface match' }
    ];
    const { container } = render(
      <ColorSwatchGroup label='Accent' options={colors} value='#ffffff' onValueChange={change} />
    );
    const found = patches(container);
    expect(found).toHaveLength(3);
    expect(found.map((node) => node.style.getPropertyValue('--eg-swatch-color'))).toEqual([
      '#000000',
      '#ffffff',
      '#1b1c20'
    ]);
    for (const patch of found) {
      expect(patch).toHaveAttribute('aria-hidden', 'true');
      expect(patch).toHaveClass('bg-[color:var(--eg-swatch-color)]');
      expect(patch.textContent).toBe('');
      expect(patch.querySelector('svg, button, input')).toBeNull();
      expect(patch.style.length).toBe(1);
    }
    expect(radio('Bright')).toBeChecked();
    expect(change).not.toHaveBeenCalled();
  });

  it('renders circular patches inside larger targets with visually hidden names (v0.2 AC-01, AC-02, AC-07)', () => {
    const { container } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#AA0000'
        customLabel='Custom color'
        onValueChange={vi.fn()}
      />
    );
    for (const option of options) {
      const item = radio(option.label);
      expect(item).toHaveClass('size-14', 'rounded-full', 'group');
      const name = within(item).getByText(option.label);
      expect(name).toHaveClass('sr-only');
      expect(name).not.toHaveAttribute('aria-hidden');
      expect(item).toHaveAccessibleName(option.label);
    }
    for (const patch of patches(container)) {
      expect(patch).toHaveClass('size-12', 'rounded-full');
    }
    expect(screen.getByText('Custom color', { selector: 'label' })).toHaveClass('sr-only');
    expect(picker()).toHaveAccessibleName('Custom color');
  });

  it('marks selection with a decorative ring and no check icon (v0.2 AC-03, AC-09)', () => {
    render(<ColorSwatchGroup label='Accent' options={options} value='#aa0000' onValueChange={vi.fn()} />);
    for (const option of options) {
      const item = radio(option.label);
      expect(item.querySelector('svg')).toBeNull();
      // No Radix Indicator or other stateful descendant remains inside the radio.
      expect(item.querySelector('[data-state]')).toBeNull();
      const found = rings(item);
      expect(found).toHaveLength(1);
      const [ring] = found;
      expect(ring).toHaveAttribute('aria-hidden', 'true');
      expect(ring).not.toHaveAttribute('style');
      expect(ring).toHaveClass(...ringClasses);
    }
    expect(radio('Red')).toHaveAttribute('data-state', 'checked');
    expect(radio('Red')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Ocean')).toHaveAttribute('data-state', 'unchecked');
  });

  it('keeps focus distinct from and outside the selection ring, with system colors in forced colors (v0.2 AC-06)', () => {
    const { container } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#AA0000'
        customLabel='Custom color'
        onValueChange={vi.fn()}
      />
    );
    const item = radio('Red');
    expect(item).toHaveClass(
      'focus-visible:outline-solid',
      'focus-visible:outline-(length:--focus-width)',
      'focus-visible:outline-focus-ring',
      'focus-visible:outline-offset-(--focus-offset)',
      'forced-colors:focus-visible:outline-[color:Highlight]'
    );
    expect(item).not.toHaveClass('focus-visible:shadow-focus');
    const [ring] = rings(item);
    expect(ring).toHaveClass('forced-colors:group-data-[state=checked]:outline-[color:CanvasText]');
    expect([...(ring?.classList ?? [])].some((name) => name.includes('focus-ring'))).toBe(false);
    const frame = customFrame();
    expect(frame).toHaveClass(
      'has-[:focus-visible]:outline-solid',
      'has-[:focus-visible]:outline-(length:--focus-width)',
      'has-[:focus-visible]:outline-focus-ring',
      'has-[:focus-visible]:outline-offset-(--focus-offset)',
      'forced-colors:has-[:focus-visible]:outline-[color:Highlight]'
    );
    expect(picker()).toHaveClass('absolute', 'inset-0', 'size-full', 'opacity-0', 'focus-visible:outline-none');
    const adjusted = [...container.querySelectorAll('[class*="forced-color-adjust-none"]')];
    expect(adjusted).toEqual(patches(container));
    for (const patch of patches(container)) {
      expect(patch).toHaveClass('forced-colors:forced-color-adjust-none');
    }
  });

  it('renders the custom control as a spectrum circle with a decorative plus badge in the same row (v0.2 AC-01, AC-05)', () => {
    const { container } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#AA0000'
        customLabel='Custom color'
        onValueChange={vi.fn()}
      />
    );
    const frame = customFrame();
    expect(frame).toHaveClass('group', 'relative', 'size-14', 'rounded-full');
    expect(frame.parentElement).toBe(screen.getByRole('radiogroup').parentElement);
    const spectrum = frame.querySelector('.bg-\\[image\\:var\\(--gradient-spectrum\\)\\]');
    expect(spectrum).not.toBeNull();
    expect(spectrum).toHaveAttribute('aria-hidden', 'true');
    expect(spectrum).toHaveClass('size-12', 'rounded-full');
    expect(spectrum).not.toHaveAttribute('style');
    const badge = frame.querySelector('.bg-surface-0');
    expect(badge).toHaveAttribute('aria-hidden', 'true');
    expect(badge).toHaveClass('text-fg-default', 'rounded-full');
    expect(badge?.querySelector('svg')).not.toBeNull();
    const found = rings(frame);
    expect(found).toHaveLength(1);
    expect(found[0]).toHaveClass(...ringClasses);
    expect(found[0]).toHaveAttribute('aria-hidden', 'true');
    // Only the preset patches carry the validated inline color.
    expect(patches(container)).toHaveLength(4);
    expect(frame.querySelectorAll('[style]')).toHaveLength(0);
    expect(picker()).not.toHaveAttribute('aria-checked');
    expect(picker()).not.toHaveAttribute('data-state');
  });

  it('checks the custom frame only for a valid non-preset value (v0.2 AC-04)', () => {
    const props = { label: 'Accent', options, customLabel: 'Custom color', onValueChange: vi.fn() };
    const { rerender } = render(<ColorSwatchGroup {...props} value='#123456' />);
    expect(customFrame()).toHaveAttribute('data-state', 'checked');
    expect(screen.getAllByRole('radio').every((item) => item.getAttribute('data-state') === 'unchecked')).toBe(true);
    rerender(<ColorSwatchGroup {...props} value='#aa0000' />);
    expect(customFrame()).toHaveAttribute('data-state', 'unchecked');
    expect(radio('Red')).toHaveAttribute('data-state', 'checked');
    rerender(<ColorSwatchGroup {...props} value='#CCCCCC' disabled={true} />);
    expect(customFrame()).toHaveAttribute('data-state', 'unchecked');
    rerender(<ColorSwatchGroup {...props} value='invalid' />);
    expect(customFrame()).toHaveAttribute('data-state', 'unchecked');
    expect(screen.getAllByRole('radio').every((item) => item.getAttribute('data-state') === 'unchecked')).toBe(true);
    expect(props.onValueChange).not.toHaveBeenCalled();
  });

  it('merges supported root layout classes without exposing patch paint to className (AC-08, AC-10)', () => {
    const { container } = render(
      <ColorSwatchGroup
        label='Accent'
        options={options}
        value='#AA0000'
        onValueChange={vi.fn()}
        className='w-32 w-48 ms-2 ms-4 bg-[color:red]'
      />
    );
    const root = screen.getByRole('group', { name: 'Accent' });
    expect(root).toHaveClass('eg-color-swatch-group', 'w-48', 'ms-4');
    expect(root).not.toHaveClass('w-32', 'ms-2');
    for (const patch of patches(container)) {
      expect(patch).toHaveClass('bg-[color:var(--eg-swatch-color)]');
      expect(patch).not.toHaveClass('w-48', 'ms-4', 'bg-[color:red]');
    }
  });

  it('does not participate in native form serialization (AC-11, AC-12)', () => {
    // Radix measures its hidden form inputs; jsdom does not provide ResizeObserver.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      }
    );
    onTestFinished(() => {
      vi.unstubAllGlobals();
    });
    const change = vi.fn();
    const { container } = render(
      <form>
        <ColorSwatchGroup
          label='Accent'
          options={options}
          value='#AA0000'
          customLabel='Custom color'
          onValueChange={change}
        />
      </form>
    );
    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    if (!form) {
      throw new Error('Missing form');
    }
    expect([...new FormData(form).entries()]).toEqual([]);
    expect(picker()).not.toHaveAttribute('name');
    expect(picker()).not.toBeRequired();
    expect(change).not.toHaveBeenCalled();
  });
});
