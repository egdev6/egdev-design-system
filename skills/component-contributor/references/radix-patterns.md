# Referencia: patrones de Radix UI

> Adapted from Stack & Flow: individual-package namespaces and token-backed Tailwind/CVA under the [contract](../../_shared/component-contract.md#radix); no implied completed migration. Historical BEM Menu/Dialog snippets below illustrate Radix structure only, not target appearance permission. Use approved types.ts variants and hook-derived per-part cn() composition, attribute data/aria variants and minimal justified CSS; preserve legacy until parity and migration approval.
> Current implementation references: `packages/ui/src/atoms/gauge/`, `packages/ui/src/atoms/icon-button/`, `packages/ui/src/molecules/tabs/`, `packages/ui/src/molecules/menu/` and `packages/ui/src/molecules/dialog/`. Gauge is passive and uses no Radix primitive; its [effective v0.10 contract](../../_shared/component-contract.md#current-gauge-contract) remains specific to it. Public availability is authoritative in `packages/ui/src/index.ts` and `packages/effects/src/index.ts`; `docs/CATALOGO.md` lists components by level. Exported status does not establish catalog-wide M3 compliance or approve contract changes.

## Por qué Radix

Radix da primitivas sin estilo y accesibles: teclado, ARIA, foco y portales. Nosotros ponemos el aspecto. Nunca se reimplementa lo que ya hace Radix.

## Importación

Use individual packages with a `*Primitive` namespace. `packages/ui/package.json` declares `@radix-ui/react-` packages: `accessible-icon`, `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `label`, `popover`, `portal`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `slider`, `slot`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `tooltip` and `visually-hidden`. Adding a missing package requires confirmation.

```tsx
// Use individual-package namespaces.
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Avoid ambiguous standalone primitive imports.
import { Root, Trigger, Content } from '@radix-ui/react-dropdown-menu';
```

Las utilidades también usan namespace: `import * as Slot from '@radix-ui/react-slot'` e `import * as AccessibleIcon from '@radix-ui/react-accessible-icon'`; JSX: `Slot.Root`, `AccessibleIcon.Root`.

## Menú (Menu)

```tsx
// Schematic only; see packages/ui/src/molecules/menu/ for the current implementation.
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

export const Menu: FC<MenuProps> = (props) => {
  const { items, align, sideOffset, trigger } = useMenu(props);
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild={true}>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className='eg-menu' align={align} sideOffset={sideOffset}>
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.id}
              className={cn('eg-menu__item', item.danger && 'eg-menu__item--danger')}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {item.icon}
              <span className='eg-menu__label'>{item.label}</span>
              {item.shortcut && <kbd className='eg-kbd'>{item.shortcut}</kbd>}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
```

Historical state-recipe illustration only: use token-backed `data-[highlighted]:` / `data-[disabled]:` and focus-visible utilities in the target; this CSS does not establish a meaningful stylesheet role or approve hardcoded values.

```css
@layer components {
  .eg-menu__item[data-highlighted] { background: var(--color-surface-3); color: var(--color-fg-default); }
  .eg-menu__item[data-disabled] { opacity: .45; pointer-events: none; }
  .eg-menu__item:focus-visible { box-shadow: var(--shadow-focus); }
  @media (prefers-reduced-motion: reduce) {
    .eg-menu, .eg-menu__item { animation: none; transform: none; transition: none; }
  }
}
```

- `data-highlighted` es el foco de teclado y el hover del item: no hace falta `:hover` aparte.
- Items con `cursor: default`, como un menú nativo.
- This schematic snippet illustrates states only; see `packages/ui/src/molecules/menu/` for the current implementation. Its root still needs the overlay treatment from [Material](../../../docs/MATERIAL.md), composed through the exported Surface primitive or an approved component recipe, and the required contract/plan approvals. Gauge's transparent-frame exception does not authorize a generic wrapper or Surface-class cloning. Use token spacing and justify custom offsets; do not copy `collisionPadding={8}` as policy.

## Navegación lateral (NavList)

Grupos plegables con `Accordion` (`type="multiple"`) o `Collapsible` si es un solo grupo. Los enlaces son `<a>` normales con `aria-current="page"`; no se usa `NavigationMenu`, que está pensado para menús horizontales con paneles desplegables.

## Diálogo y sheet

**Schematic snippet, not a runnable API example:** see `packages/ui/src/molecules/dialog/` and `packages/ui/src/atoms/icon-button/` for the current implementations. Changes or new contracts require approval. Appearance and composition require their own approved recipes; this sketch grants no dynamic-class or handwritten-style exception and is not a current story/test/consumer fixture.

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';

<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
  <DialogPrimitive.Trigger asChild={true}>{trigger}</DialogPrimitive.Trigger>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className='eg-dialog-backdrop' />
    <DialogPrimitive.Content className={cn('eg-dialog', side && `eg-dialog--sheet-${side}`)}>
      <DialogPrimitive.Title className='eg-dialog__title'>{title}</DialogPrimitive.Title>
      <DialogPrimitive.Description className='eg-dialog__desc'>{description}</DialogPrimitive.Description>
      {children}
      <DialogPrimitive.Close asChild={true}>
        <button type='button'>Close</button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
```

- Confirmaciones destructivas: `AlertDialog`, no `Dialog`.
- Si no hay descripción visible, `aria-describedby={undefined}` en `Content` para que Radix no avise.

## Controles de formulario

| Componente | Primitiva | Atributo que se estila |
|---|---|---|
| Checkbox | `Checkbox` | `[data-state='checked' \| 'indeterminate']` |
| Switch | `Switch` | `[data-state='checked']` en root y thumb |
| Slider | `Slider` | `[data-orientation]`, `[data-disabled]` |
| RadioGroup / SelectTile | `RadioGroup` | `[data-state='checked']` |
| Select | `Select` | `[data-state='open']`, `[data-placeholder]` |
| ChipGroup | `ToggleGroup` | `[data-state='on']` |
| Field | `Form.Field` + `Label` | `[data-invalid]` |

## Flotantes de lectura

- **Tooltip:** text only, never interactive content. The tooltip package is declared; verify provider requirements against the current implementation.
- **HoverCard:** future detail panel on hover, with an equivalent keyboard path. It is not implemented here and adds no hover, focus or interaction API to the passive Gauge.
- **Popover:** panel interactivo al hacer clic.

## Reglas

- `Portal` siempre para lo flotante.
- `asChild` en los triggers.
- Nunca reimplementar teclado, foco ni ARIA. El hijo de `asChild` debe conservar la semántica y aceptar props/refs compatibles; comprobarlo, no prometer refs React 18 por los tipos.
- Foco visible con `:focus-visible` y `--shadow-focus`; nunca solo un brillo.
- Animaciones con `[data-state]`, y desactivadas con `prefers-reduced-motion`.
- Estado de abrir/cerrar y cálculos en el hook.

## Checklist

- [ ] Importado por namespace de `@radix-ui/react-*`; paquete existente o incorporación aprobada
- [ ] Flotantes en `Portal`
- [ ] `asChild` en triggers
- [ ] Foco visible con el token de foco
- [ ] Estados estilados por `data-state` / ARIA
- [ ] Lógica en el hook
