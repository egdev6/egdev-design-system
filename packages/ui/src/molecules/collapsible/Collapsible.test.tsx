import { act, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, createRef, useRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import * as collapsiblePublic from './index';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './index';
import type { CollapsibleContentProps, CollapsibleProps, CollapsibleTriggerProps } from './types';
import { useCollapsible, useCollapsibleContent, useCollapsibleTrigger } from './useCollapsible';

function Parts({ label = 'History' }: { label?: string }) {
  return (
    <>
      <CollapsibleTrigger>{label}</CollapsibleTrigger>
      <CollapsibleContent>Recent readings</CollapsibleContent>
    </>
  );
}

function LocalCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count {count}</button>;
}

function ExternalCloseExample() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger ref={ref}>History</CollapsibleTrigger>
      <CollapsibleContent>
        <button
          onClick={() => {
            ref.current?.focus();
            setOpen(false);
          }}
        >
          Close from body
        </button>
      </CollapsibleContent>
    </Collapsible>
  );
}

describe('Collapsible native relationship ownership', () => {
  it('rejects unsupported relationship overrides through close/open/reopen', async () => {
    const user = userEvent.setup();
    const triggerOverrides = { 'aria-controls': 'foreign', 'aria-expanded': true };
    const contentOverrides = { id: 'foreign', hidden: false };
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger {...triggerOverrides}>History</CollapsibleTrigger>
        <CollapsibleContent {...contentOverrides}>Recent readings</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    const shell = container.querySelector('.eg-collapsible__content');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(shell).toHaveAttribute('hidden');
    expect(shell?.id).toBeTruthy();
    expect(shell?.id).not.toBe('foreign');
    const id = shell?.id;
    expect(screen.queryByText('Recent readings')).not.toBeInTheDocument();
    for (const open of [true, false, true]) {
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', String(open));
      expect(shell?.id).toBe(id);
      if (open) {
        expect(trigger).toHaveAttribute('aria-controls', id);
        expect(shell).not.toHaveAttribute('hidden');
        expect(screen.getByText('Recent readings')).toBeVisible();
      } else {
        expect(trigger).not.toHaveAttribute('aria-controls');
        expect(shell).toHaveAttribute('hidden');
        expect(screen.queryByText('Recent readings')).not.toBeInTheDocument();
      }
    }
  });

  it('defaults closed, opens initially without callback, and ignores later defaultOpen changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container, rerender } = render(
      <Collapsible onOpenChange={onOpenChange}>
        <Parts />
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(container.querySelector('.eg-collapsible__content')).toHaveAttribute('hidden');
    rerender(
      <Collapsible defaultOpen={true} onOpenChange={onOpenChange}>
        <Parts />
      </Collapsible>
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(trigger);
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    rerender(
      <Collapsible defaultOpen={false} onOpenChange={onOpenChange}>
        <Parts />
      </Collapsible>
    );
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange.mock.calls).toEqual([[true]]);
  });

  it('initially opens with a matching native relationship and no mount callback', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible defaultOpen={true} onOpenChange={onOpenChange}>
        <Parts />
      </Collapsible>
    );
    const shell = container.querySelector('.eg-collapsible__content');
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', shell?.id);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(shell).not.toHaveAttribute('hidden');
    expect(screen.getByText('Recent readings')).toBeVisible();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('requests once per controlled activation without changing withheld state or echoing prop updates', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const view = (open: boolean, disabled = false) => (
      <Collapsible open={open} disabled={disabled} onOpenChange={onOpenChange}>
        <Parts />
      </Collapsible>
    );
    const { rerender } = render(view(false));
    const trigger = screen.getByRole('button');
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(trigger);
    await user.click(trigger);
    expect(onOpenChange.mock.calls).toEqual([[true], [true]]);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Recent readings')).not.toBeInTheDocument();
    rerender(view(true));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Recent readings')).toBeVisible();
    await user.click(trigger);
    expect(onOpenChange.mock.calls).toEqual([[true], [true], [false]]);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    rerender(view(false, true));
    rerender(view(true, true));
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange).toHaveBeenCalledTimes(3);
  });

  it('lets a native consumer click preventDefault cancel the Radix toggle', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger onClick={onClick}>History</CollapsibleTrigger>
        <CollapsibleContent>Recent readings</CollapsibleContent>
      </Collapsible>
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses Enter and Space once per activation without autofocus or custom navigation/close keys', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <>
        <Collapsible onOpenChange={onOpenChange}>
          <CollapsibleTrigger onKeyDown={onKeyDown}>History</CollapsibleTrigger>
          <CollapsibleContent>
            <button>Body action</button>
            <a href='#history'>Read history</a>
          </CollapsibleContent>
        </Collapsible>
        <button>Outside action</button>
      </>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Body action' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowUp}{Home}{End}{Escape}');
    expect(onKeyDown.mock.calls.map(([event]) => event.key)).toEqual([
      'Enter',
      'Tab',
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
      'Escape'
    ]);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Outside action' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Outside action' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();
    await user.keyboard(' ');
    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
    expect(trigger).toHaveFocus();
  });

  it.each([false, true])('disables only native Trigger activation while open=%s', async (defaultOpen) => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const bodyAction = vi.fn();
    const { container } = render(
      <>
        <Collapsible disabled={true} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
          <CollapsibleTrigger>History</CollapsibleTrigger>
          <CollapsibleContent>
            <button onClick={bodyAction}>Body action</button>
          </CollapsibleContent>
        </Collapsible>
        <button>After disclosure</button>
      </>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-disabled');
    expect(trigger).toHaveClass('data-disabled:opacity-45');
    expect(container.querySelector('.eg-collapsible')).not.toHaveClass('data-disabled:opacity-45');
    expect(container.querySelector('.eg-collapsible__content')).not.toHaveClass('data-disabled:opacity-45');
    await user.click(trigger);
    trigger.focus();
    expect(trigger).not.toHaveFocus();
    await user.keyboard('{Enter} ');
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', String(defaultOpen));
    await user.tab();
    if (defaultOpen) {
      const body = screen.getByRole('button', { name: 'Body action' });
      expect(body).toBeEnabled();
      expect(body).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(bodyAction).toHaveBeenCalledTimes(1);
      await user.tab();
    } else {
      expect(screen.queryByRole('button', { name: 'Body action' })).not.toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'After disclosure' })).toHaveFocus();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('retains uncontrolled visibility and body state when disabled changes after opening', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const view = (disabled: boolean) => (
      <Collapsible disabled={disabled} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>History</CollapsibleTrigger>
        <CollapsibleContent>
          <LocalCounter />
        </CollapsibleContent>
      </Collapsible>
    );
    const { rerender } = render(view(false));
    const trigger = screen.getByRole('button', { name: 'History' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Count 0' }));
    rerender(view(true));
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeEnabled();
    await user.click(trigger);
    expect(onOpenChange.mock.calls).toEqual([[true]]);
    rerender(view(false));
    expect(trigger).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
    await user.click(trigger);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('unmounts body form/local state while retaining the hidden shell and stable mounted id', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>History</CollapsibleTrigger>
        <CollapsibleContent>
          <label>
            Note
            <input defaultValue='Initial' />
          </label>
          <LocalCounter />
        </CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    const shell = container.querySelector('.eg-collapsible__content');
    await user.type(screen.getByRole('textbox', { name: 'Note' }), ' edited');
    await user.click(screen.getByRole('button', { name: 'Count 0' }));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
    await user.click(trigger);
    expect(shell).toHaveAttribute('hidden');
    expect(shell).toBeEmptyDOMElement();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    await user.click(trigger);
    expect(container.querySelector('.eg-collapsible__content')).toBe(shell);
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveValue('Initial');
    expect(screen.getByRole('button', { name: 'Count 0' })).toBeVisible();
  });

  it('keeps sibling/nested relationships unique and state independent', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Collapsible>
          <CollapsibleTrigger>Parent</CollapsibleTrigger>
          <CollapsibleContent>
            <Collapsible>
              <Parts label='Nested' />
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible>
          <Parts label='Sibling' />
        </Collapsible>
      </>
    );
    const parent = screen.getByRole('button', { name: 'Parent' });
    const sibling = screen.getByRole('button', { name: 'Sibling' });
    await user.click(parent);
    const nested = screen.getByRole('button', { name: 'Nested' });
    await user.click(nested);
    await user.click(sibling);
    const ids = Array.from(container.querySelectorAll('.eg-collapsible__content'), (node) => node.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids.every(Boolean)).toBe(true);
    for (const trigger of [parent, nested, sibling]) {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(ids).toContain(trigger.getAttribute('aria-controls'));
      const shell = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
      expect(shell?.parentElement).toBe(trigger.closest('.eg-collapsible'));
    }
    await user.click(nested);
    expect(nested).not.toHaveAttribute('aria-controls');
    expect(parent).toHaveAttribute('aria-expanded', 'true');
    expect(sibling).toHaveAttribute('aria-expanded', 'true');
    await user.click(sibling);
    expect(parent).toHaveAttribute('aria-expanded', 'true');
  });

  it('retains native names, heading/region semantics, actual button ref and decorative caret', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Collapsible defaultOpen={true} id='history-frame' data-consumer='frame'>
        <h2>
          <CollapsibleTrigger id='history-heading' ref={ref} aria-describedby='hint'>
            History
          </CollapsibleTrigger>
        </h2>
        <CollapsibleContent role='region' aria-labelledby='history-heading'>
          Recent readings
        </CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'History' });
    expect(within(screen.getByRole('heading', { level: 2 })).getByRole('button')).toBe(trigger);
    expect(ref.current).toBe(trigger);
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-describedby', 'hint');
    expect(trigger).not.toHaveAttribute('aria-pressed');
    expect(trigger.closest('.eg-collapsible')).toHaveAttribute('id', 'history-frame');
    expect(trigger.closest('.eg-collapsible')).toHaveAttribute('data-consumer', 'frame');
    expect(screen.getByRole('region', { name: 'History' }).id).toBe(trigger.getAttribute('aria-controls'));
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(trigger.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('supports consumer-owned focus movement before an external controlled close', async () => {
    const user = userEvent.setup();
    render(<ExternalCloseExample />);
    const trigger = screen.getByRole('button', { name: 'History' });
    await user.click(trigger);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close from body' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'Close from body' })).not.toBeInTheDocument();
  });

  it('filters prohibited untyped props without losing allowed native handlers or Material layout', async () => {
    const user = userEvent.setup();
    const commonOverrides = {
      style: { color: 'red' },
      contentEditable: true,
      suppressContentEditableWarning: true,
      dangerouslySetInnerHTML: { __html: '' },
      asChild: true,
      'data-state': 'foreign',
      'data-disabled': ''
    };
    const rootOverrides = { ...commonOverrides, role: 'menu', tabIndex: 8 };
    const triggerOverrides = {
      ...commonOverrides,
      type: 'submit',
      disabled: true,
      role: 'switch',
      tabIndex: -1,
      'aria-disabled': true,
      'aria-pressed': true,
      'data-state': 'loading'
    };
    const contentOverrides = { ...commonOverrides, forceMount: true, tabIndex: 0 };
    const onPointerDown = vi.fn();
    const { container } = render(
      <Collapsible {...rootOverrides} className='mt-2 mt-4 w-full'>
        <CollapsibleTrigger {...triggerOverrides} onPointerDown={onPointerDown} className='self-start'>
          History
        </CollapsibleTrigger>
        <CollapsibleContent {...contentOverrides} className='self-start'>
          Recent readings
        </CollapsibleContent>
      </Collapsible>
    );
    const root = container.querySelector('.eg-collapsible');
    const content = container.querySelector('.eg-collapsible__content');
    const trigger = screen.getByRole('button', { name: 'History' });
    expect(root?.tagName).toBe('DIV');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('style');
    expect(root).toHaveClass(
      'eg-surface',
      'mt-4',
      'w-full',
      'bg-surface-1',
      'shadow-edge',
      'rounded-md',
      'p-0',
      'overflow-visible'
    );
    expect(root).not.toHaveClass('mt-2');
    expect(trigger).toHaveClass(
      'eg-btn',
      'eg-collapsible__trigger',
      'justify-between',
      'text-start',
      'whitespace-normal',
      'self-start'
    );
    expect(trigger).not.toHaveClass('justify-center', 'whitespace-nowrap');
    expect(trigger).toBeEnabled();
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).not.toHaveAttribute('tabindex');
    expect(trigger).not.toHaveAttribute('aria-disabled');
    expect(trigger).not.toHaveAttribute('aria-pressed');
    expect(content).not.toHaveAttribute('tabindex');
    expect(content).toHaveAttribute('hidden');
    expect(screen.queryByText('Recent readings')).not.toBeInTheDocument();
    for (const node of [root, trigger, content]) {
      expect(node).toHaveAttribute('data-state', 'closed');
      expect(node).not.toHaveAttribute('data-disabled');
    }
    await user.click(trigger);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    for (const node of [root, trigger, content]) {
      expect(node).not.toHaveAttribute('contenteditable');
      expect(node).not.toHaveAttribute('suppresscontenteditablewarning');
    }
    expect(trigger.style.color).toBe('');
    expect(content).toHaveClass(
      'self-start',
      'border-t-(length:--border-width)',
      'border-border-hairline',
      'p-4',
      'font-sans',
      'text-body-default',
      'text-fg-default'
    );
    expect(content?.getAttribute('style')).not.toContain('color');
  });

  it('prepares per-part cn merges and static motion rules without duplicating Radix state', () => {
    const { result } = renderHook(() => ({
      root: useCollapsible({ children: 'Pair', className: 'mt-2 mt-4 w-full' }),
      trigger: useCollapsibleTrigger({ children: 'History', className: 'self-end self-start' }),
      content: useCollapsibleContent({ children: 'Readings', className: 'mt-2 mt-4 self-start' })
    }));
    expect(result.current.root.rootProps.disabled).toBe(false);
    expect(result.current.root.rootProps.open).toBeUndefined();
    expect(result.current.root.rootProps.defaultOpen).toBeUndefined();
    expect('data-state' in result.current.root.rootProps).toBe(false);
    expect(result.current.root.rootProps.className).toContain('mt-4');
    expect(result.current.root.rootProps.className).not.toContain('mt-2');
    expect(result.current.trigger.triggerProps.className).toContain('self-start');
    expect(result.current.trigger.triggerProps.className).not.toContain('self-end');
    expect(result.current.trigger.labelProps.className).toContain('min-w-0');
    expect(result.current.trigger.caretProps.className).toContain('shrink-0');
    expect(result.current.trigger.caretProps.className).toContain('group-data-[state=open]/collapsible:rotate-180');
    expect(result.current.trigger.caretProps.className).toContain('motion-reduce:transition-none');
    expect(result.current.trigger.caretProps.className).toContain('motion-reduce:transform-none');
    expect(result.current.trigger.caretProps.className).toContain(
      'motion-reduce:group-data-[state=open]/collapsible:rotate-0'
    );
    expect(result.current.content.contentProps.className).toContain('mt-4');
    expect(result.current.content.contentProps.className).not.toContain('mt-2');
  });

  it.each([CollapsibleTrigger, CollapsibleContent])('leaves orphan-part diagnostics to Radix (%s)', (Part) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => render(<Part>Orphan</Part>)).toThrow(/must be used within.*Collapsible/);
    } finally {
      error.mockRestore();
    }
  });

  it.each([false, true])(
    'preserves SSR/hydration identity and native state when initially open=%s',
    async (defaultOpen) => {
      const ref = createRef<HTMLButtonElement>();
      const tree = (
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger ref={ref}>History</CollapsibleTrigger>
          <CollapsibleContent>Recent readings</CollapsibleContent>
        </Collapsible>
      );
      // Parse only this trusted, React-escaped server fixture; no consumer HTML is evaluated.
      const parsed = new DOMParser().parseFromString(renderToString(tree), 'text/html');
      const container = document.importNode(parsed.body, true);
      const shell = container.querySelector('.eg-collapsible__content');
      const id = shell?.id;
      const trigger = within(container).getByRole('button');
      expect(id).toBeTruthy();
      expect(trigger).toHaveAttribute('aria-expanded', String(defaultOpen));
      if (defaultOpen) {
        expect(trigger).toHaveAttribute('aria-controls', id);
      } else {
        expect(trigger).not.toHaveAttribute('aria-controls');
      }
      const onRecoverableError = vi.fn();
      const root = await act(async () => hydrateRoot(container, tree, { onRecoverableError }));
      try {
        expect(container.querySelector('.eg-collapsible__content')?.id).toBe(id);
        expect(ref.current).toBe(trigger);
        expect(onRecoverableError).not.toHaveBeenCalled();
        await act(async () => trigger.click());
        expect(trigger).toHaveAttribute('aria-expanded', String(!defaultOpen));
        expect(shell?.id).toBe(id);
        if (defaultOpen) {
          expect(trigger).not.toHaveAttribute('aria-controls');
        } else {
          expect(trigger).toHaveAttribute('aria-controls', id);
        }
      } finally {
        await act(async () => root.unmount());
      }
      expect(ref.current).toBeNull();
    }
  );

  it('exports only the three named runtime parts from the scoped barrel', () => {
    expect(Object.keys(collapsiblePublic).sort()).toEqual(['Collapsible', 'CollapsibleContent', 'CollapsibleTrigger']);
  });

  it('keeps controlled unions, native exclusions and Trigger-only refs in the public types', () => {
    expectTypeOf<ComponentProps<typeof Collapsible>>().toEqualTypeOf<CollapsibleProps>();
    expectTypeOf<ComponentProps<typeof CollapsibleContent>>().toEqualTypeOf<CollapsibleContentProps>();
    expectTypeOf<CollapsibleTriggerProps['onClick']>().toEqualTypeOf<
      React.MouseEventHandler<HTMLButtonElement> | undefined
    >();
    const controlled: CollapsibleProps = { children: 'Pair', open: true, onOpenChange: () => undefined };
    const uncontrolled: CollapsibleProps = { children: 'Pair', defaultOpen: true };
    // @ts-expect-error Controlled visibility requires its next-value callback.
    const missingCallback: CollapsibleProps = { children: 'Pair', open: true };
    // @ts-expect-error Controlled and uncontrolled initialization are mutually exclusive.
    const mixedMode: CollapsibleProps = { ...controlled, defaultOpen: true };
    // @ts-expect-error Root has no public asChild composition API.
    const slotted: CollapsibleProps = { children: 'Pair', asChild: true };
    // @ts-expect-error Inline appearance is not a supported native surface.
    const styled: CollapsibleProps = { children: 'Pair', style: { color: 'red' } };
    // @ts-expect-error Content presence is owned by Radix.
    const forced: CollapsibleContentProps = { children: 'Body', forceMount: true };
    // @ts-expect-error Content id belongs to the native relationship.
    const identified: CollapsibleContentProps = { children: 'Body', id: 'foreign' };
    // @ts-expect-error Content hidden state belongs to Radix.
    const hidden: CollapsibleContentProps = { children: 'Body', hidden: false };
    // @ts-expect-error Trigger is always a native type=button.
    const submit: CollapsibleTriggerProps = { children: 'History', type: 'submit' };
    // @ts-expect-error Only Root owns disabled state.
    const disabled: CollapsibleTriggerProps = { children: 'History', disabled: true };
    // @ts-expect-error Root does not forward a public ref.
    const rootRef: ComponentProps<typeof Collapsible> = { children: 'Pair', ref: createRef<HTMLDivElement>() };
    const contentRef: ComponentProps<typeof CollapsibleContent> = {
      children: 'Body',
      // @ts-expect-error Content does not forward a public ref.
      ref: createRef<HTMLDivElement>()
    };
    const triggerRef: ComponentProps<typeof CollapsibleTrigger> = {
      children: 'History',
      ref: createRef<HTMLButtonElement>()
    };
    void [
      controlled,
      uncontrolled,
      missingCallback,
      mixedMode,
      slotted,
      styled,
      forced,
      identified,
      hidden,
      submit,
      disabled,
      rootRef,
      contentRef,
      triggerRef
    ];
  });
});
