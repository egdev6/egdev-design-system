# Referencia: patrones de Radix UI

> Adapted from Stack & Flow: individual-package namespaces and token-backed Tailwind/CVA under the [contract](../../_shared/component-contract.md#radix); no implied completed migration. Historical BEM Menu/Dialog snippets below illustrate Radix structure only, not target appearance permission. Use approved types.ts variants and hook-derived per-part cn() composition, attribute data/aria variants and minimal justified CSS; preserve legacy until parity and migration approval.
> Current implementation reference: `packages/ui/src/atoms/gauge/` under the [effective v0.9 contract](../../_shared/component-contract.md#current-gauge-contract). Gauge is passive and uses no Radix primitive; it is the only public React component. Surface, IconButton and Tabs are future/provisional Foundation concepts, not current importable references.

## Por qué Radix

Radix da primitivas sin estilo y accesibles: teclado, ARIA, foco y portales. Nosotros ponemos el aspecto. Nunca se reimplementa lo que ya hace Radix.

## Importación

De paquetes individuales, con namespace `*Primitive`. Hoy solo están declarados `@radix-ui/react-tabs`, `@radix-ui/react-slot` y `@radix-ui/react-accessible-icon` en `packages/ui/package.json`. Menú, diálogo y el resto son esquemas futuros, no componentes disponibles: añadir su paquete requiere confirmación.

```tsx
// Use individual-package namespaces.
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'; // schematic: package not yet approved
import * as DialogPrimitive from '@radix-ui/react-dialog'; // schematic: package not yet approved

// Avoid ambiguous standalone primitive imports.
import { Root, Trigger, Content } from '@radix-ui/react-dropdown-menu';
```

Las utilidades también usan namespace: `import * as Slot from '@radix-ui/react-slot'` e `import * as AccessibleIcon from '@radix-ui/react-accessible-icon'`; JSX: `Slot.Root`, `AccessibleIcon.Root`.

## Menú (Menu)

```tsx
// Schematic: MenuProps/useMenu do not exist here; approve anatomy, package and plan first.
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

Historical state-recipe illustration only: use token-backed `data-[highlighted]:` / `data-[disabled]:` and focus-visible utilities in the target; this CSS does not establish a meaningful seventh-file role or approve hardcoded values.

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
- This conceptual future snippet illustrates states only. Its root still needs the overlay treatment from [Material](../../../docs/MATERIAL.md), an approved component recipe or Surface proposal, and the required contract/plan/package approvals. Surface is not currently importable; Gauge's native-well exception does not authorize a generic wrapper or Surface-class cloning. Use token spacing and justify custom offsets; do not copy `collisionPadding={8}` as policy.

## Navegación lateral (NavList)

Grupos plegables con `Accordion` (`type="multiple"`) o `Collapsible` si es un solo grupo. Los enlaces son `<a>` normales con `aria-current="page"`; no se usa `NavigationMenu`, que está pensado para menús horizontales con paneles desplegables.

## Diálogo y sheet

**Conceptual future example, not runnable current API:** Dialog requires an approved contract/plan and missing-package confirmation before implementation. IconButton is also unavailable; a native close button illustrates Radix composition without importing a retired component. Appearance and composition require their own approved recipes; this sketch grants no dynamic-class or handwritten-style exception and is not a current story/test/consumer fixture.

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog'; // future: requires approval

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

- **Tooltip:** solo texto, nunca contenido interactivo. Un `TooltipPrimitive.Provider` en la raíz de la app cuando se apruebe ese paquete.
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
