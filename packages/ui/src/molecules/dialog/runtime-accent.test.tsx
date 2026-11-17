import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type CSSProperties, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Dialog, DialogContent, DialogTrigger } from '.';

type AccentTheme = {
  normalizedAccent: string;
  mode: 'default' | 'custom';
  variables: Readonly<Record<string, string>>;
};
type AccentModule = { createAccentTheme: (input: string | null | undefined) => AccentTheme };
const accentSubpath = '@egdev/tokens/' + 'accent';
const loadAccent = async (): Promise<AccentModule> => import(/* @vite-ignore */ accentSubpath) as Promise<AccentModule>;

type ScopeExampleProps = {
  createAccentTheme: AccentModule['createAccentTheme'];
  outer: string;
  nested: string;
  sibling: string;
  placement: 'container' | 'viewport' | 'body';
};

function ScopeExample({ createAccentTheme, outer, nested, sibling, placement }: ScopeExampleProps) {
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <div aria-label='Outer theme' style={createAccentTheme(outer).variables as CSSProperties}>
        <div aria-label='Nested theme' style={createAccentTheme(nested).variables as CSSProperties} />
        <div aria-label='Dialog host' className='relative' ref={setPortalHost} />
        <Dialog>
          <DialogTrigger>Open themed dialog</DialogTrigger>
          {portalHost && (
            <DialogContent
              title='Themed settings'
              {...(placement === 'body'
                ? { container: null, overlayScope: 'viewport' as const }
                : { container: portalHost, overlayScope: placement })}
            >
              <input aria-label='Preference' />
            </DialogContent>
          )}
        </Dialog>
      </div>
      <div aria-label='Sibling theme' style={createAccentTheme(sibling).variables as CSSProperties} />
    </>
  );
}

function expectApplied(host: HTMLElement, theme: AccentTheme) {
  for (const [name, value] of Object.entries(theme.variables)) {
    expect(host.style.getPropertyValue(name), name).toBe(value);
  }
  expect(host.style.length).toBe(Object.keys(theme.variables).length);
}

describe('runtime accent scopes with Dialog', () => {
  it.each(['container', 'viewport'] as const)(
    'keeps sibling and nested themes independent through live updates in a %s portal',
    async (placement) => {
      const { createAccentTheme } = await loadAccent();
      const user = userEvent.setup();
      const originalRoot = document.documentElement.getAttribute('style');
      const { rerender } = render(
        <ScopeExample
          createAccentTheme={createAccentTheme}
          outer='#123456'
          nested='#ff0036'
          sibling='#00ff00'
          placement={placement}
        />
      );
      const outer = screen.getByLabelText('Outer theme');
      const nested = screen.getByLabelText('Nested theme');
      const sibling = screen.getByLabelText('Sibling theme');
      const portalHost = screen.getByLabelText('Dialog host');
      expectApplied(outer, createAccentTheme('#123456'));
      expectApplied(nested, createAccentTheme('#ff0036'));
      expectApplied(sibling, createAccentTheme('#00ff00'));
      const trigger = screen.getByRole('button', { name: 'Open themed dialog' });
      await user.click(trigger);
      const dialog = screen.getByRole('dialog', { name: 'Themed settings' });
      expect(portalHost).toContainElement(dialog);
      expect(outer).toContainElement(dialog);
      expect(nested).not.toContainElement(dialog);
      expect(sibling).not.toContainElement(dialog);
      expect(dialog.closest('.eg-dialog-backdrop')).toHaveClass(placement === 'container' ? 'absolute' : 'fixed');
      expect(screen.getByRole('textbox', { name: 'Preference' })).toHaveFocus();

      rerender(
        <ScopeExample
          createAccentTheme={createAccentTheme}
          outer='#777777'
          nested='#ff0036'
          sibling='#00ff00'
          placement={placement}
        />
      );
      expectApplied(outer, createAccentTheme('#777777'));
      expectApplied(nested, createAccentTheme('#ff0036'));
      expectApplied(sibling, createAccentTheme('#00ff00'));
      expect(portalHost).toContainElement(screen.getByRole('dialog', { name: 'Themed settings' }));
      expect(document.documentElement.getAttribute('style')).toBe(originalRoot);
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog', { name: 'Themed settings' })).not.toBeInTheDocument();
      await waitFor(() => expect(trigger).toHaveFocus());
      expectApplied(sibling, createAccentTheme('#00ff00'));
    }
  );

  it('replaces a custom host with the complete default map without changing its sibling', async () => {
    const { createAccentTheme } = await loadAccent();
    const { rerender } = render(
      <ScopeExample
        createAccentTheme={createAccentTheme}
        outer='#0000aa'
        nested='#123456'
        sibling='#777777'
        placement='viewport'
      />
    );
    const outer = screen.getByLabelText('Outer theme');
    const nested = screen.getByLabelText('Nested theme');
    const sibling = screen.getByLabelText('Sibling theme');
    expectApplied(outer, createAccentTheme('#0000aa'));
    rerender(
      <ScopeExample
        createAccentTheme={createAccentTheme}
        outer='invalid'
        nested='#ff0036'
        sibling='#777777'
        placement='viewport'
      />
    );
    expectApplied(outer, createAccentTheme(null));
    expectApplied(nested, createAccentTheme('#ff0036'));
    expectApplied(sibling, createAccentTheme('#777777'));
  });

  it('keeps a body portal outside the nested host rather than copying the trigger theme', async () => {
    const { createAccentTheme } = await loadAccent();
    const user = userEvent.setup();
    const bodyAccent = document.body.style.getPropertyValue('--color-fg-brand-default');
    render(
      <ScopeExample
        createAccentTheme={createAccentTheme}
        outer='#123456'
        nested='#ff0036'
        sibling='#00ff00'
        placement='body'
      />
    );
    const outer = screen.getByLabelText('Outer theme');
    const portalHost = screen.getByLabelText('Dialog host');
    await user.click(screen.getByRole('button', { name: 'Open themed dialog' }));
    const dialog = screen.getByRole('dialog', { name: 'Themed settings' });
    expect(document.body).toContainElement(dialog);
    expect(outer).not.toContainElement(dialog);
    expect(portalHost).not.toContainElement(dialog);
    expect(document.body.style.getPropertyValue('--color-fg-brand-default')).toBe(bodyAccent);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Themed settings' })).not.toBeInTheDocument();
  });
});
