# Referencia: patrones de Radix UI

> Adaptado de Stack & Flow. Diferencias: paquete unificado `radix-ui` y estilos con clases `eg-*` en lugar de utilidades de Tailwind.
> Referencias en el repo: `molecules/tabs` (Tabs), `atoms/icon-button` (Slot + AccessibleIcon), `primitives/surface` (Slot).

## Por qué Radix

Radix da primitivas sin estilo y accesibles: teclado, ARIA, foco y portales. Nosotros ponemos el aspecto. Nunca se reimplementa lo que ya hace Radix.

## Importación

Del paquete unificado, con alias `*Primitive` para que se vea de dónde sale cada pieza:

```tsx
// ✅
import { DropdownMenu as DropdownMenuPrimitive, Dialog as DialogPrimitive } from 'radix-ui';

// ❌ piezas sueltas: no se sabe a qué primitiva pertenecen
import { Root, Trigger, Content } from '@radix-ui/react-dropdown-menu';
```

Excepción: utilidades sin partes (`Slot`, `AccessibleIcon`, `VisuallyHidden`) se usan por su nombre: `Slot.Root`, `AccessibleIcon.Root`.

## Menú (Menu)

```tsx
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

export const Menu: FC<MenuProps> = (props) => {
  const { items, align, sideOffset, trigger } = useMenu(props);
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild={true}>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className='eg-menu' align={align} sideOffset={sideOffset} collisionPadding={8}>
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

```css
.eg-menu[data-state='open'] { animation: eg-fade-in var(--duration-fast) var(--ease-out); }
.eg-menu__item[data-highlighted] { background: var(--color-action-primary-bg-default); color: var(--color-fg-default); }
.eg-menu__item[data-disabled] { opacity: .45; pointer-events: none; }
```

- `data-highlighted` es el foco de teclado y el hover del item: no hace falta `:hover` aparte.
- Items con `cursor: default`, como un menú nativo.

## Navegación lateral (NavList)

Grupos plegables con `Accordion` (`type="multiple"`) o `Collapsible` si es un solo grupo. Los enlaces son `<a>` normales con `aria-current="page"`; no se usa `NavigationMenu`, que está pensado para menús horizontales con paneles desplegables.

## Diálogo y sheet

```tsx
<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
  <DialogPrimitive.Trigger asChild={true}>{trigger}</DialogPrimitive.Trigger>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className='eg-dialog-backdrop' />
    <DialogPrimitive.Content className={cn('eg-dialog', side && `eg-dialog--sheet-${side}`)}>
      <DialogPrimitive.Title className='eg-dialog__title'>{title}</DialogPrimitive.Title>
      <DialogPrimitive.Description className='eg-dialog__desc'>{description}</DialogPrimitive.Description>
      {children}
      <DialogPrimitive.Close asChild={true}>
        <IconButton label='Cerrar' icon={<Icon name='x' />} />
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

- **Tooltip:** solo texto, nunca contenido interactivo. Un `Tooltip.Provider` en la raíz de la app (AppShell).
- **HoverCard:** panel de detalle al pasar (Quorb). Siempre con una vía de teclado equivalente (el Gauge es un botón que abre lo mismo).
- **Popover:** panel interactivo al hacer clic.

## Reglas

- `Portal` siempre para lo flotante.
- `asChild` en los triggers.
- Nunca reimplementar teclado ni foco.
- Foco visible con `:focus-visible` y `--shadow-focus`; nunca solo un brillo.
- Animaciones con `[data-state]`, y desactivadas con `prefers-reduced-motion`.
- Estado de abrir/cerrar y cálculos en el hook.

## Checklist

- [ ] Importado de `radix-ui` con alias `*Primitive`
- [ ] Flotantes en `Portal`
- [ ] `asChild` en triggers
- [ ] Foco visible con el token de foco
- [ ] Estados estilados por `data-state` / ARIA
- [ ] Lógica en el hook
