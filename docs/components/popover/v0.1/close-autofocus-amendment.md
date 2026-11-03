# Popover v0.1 — close auto-focus amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Amends:** the public `PopoverContentProps` of the delivered [Popover v0.1](../../../../packages/ui/src/molecules/popover/types.ts). Additive: one new optional prop, with no change to existing props, defaults, rendering or behavior when it is omitted.
- **Required by:** [SectionNav v0.1 plan](../../section-nav/v0.1/implementation-plan.md) §3. After activating a same-document link inside the index, the plan forbids a forced return of focus to the trigger, which would overwrite the destination focus, and it names Radix's supported `onCloseAutoFocus` event as the way to prevent that.

## Problem found before SectionNav implementation

`PopoverContentProps` is built from `ComponentPropsWithoutRef<'div'>` plus Popover's own props. It does not expose Radix `Popover.Content`'s `onCloseAutoFocus`.

Without it, a non-modal Popover that closes after an index link activation always focuses the trigger. SectionNav cannot meet its contract through the public API, and its plan forbids patching Popover from SectionNav or writing bespoke focus management. The SectionNav Unit A writer stopped before writing any file.

## Owner decision

Question: "SectionNav: el Popover público no expone onCloseAutoFocus, y sin él, al navegar con un link del índice el foco vuelve al botón y pisa el destino. ¿Cómo seguimos?"

Answer: "Enmienda acotada de Popover: exponer onCloseAutoFocus (Recomendado)".

## Amended API

| Prop | Type | Behavior |
|---|---|---|
| `onCloseAutoFocus` (new, optional) | `(event: Event) => void` | Forwarded unchanged to Radix `Popover.Content` `onCloseAutoFocus`. Radix calls it when focus is about to move back to the trigger on close; `event.preventDefault()` keeps focus where it is. |

- When the prop is omitted, behavior is identical to v0.1: Radix restores focus to the trigger on close.
- Popover adds no default handler. It does not prevent focus return itself and adds no focus management of its own. Escape and outside-interaction behavior stay Radix's.
- The prop is not a Storybook control: `@control false`, with a `@controlReason` that functions are not serializable.
- **Consumer obligation:** prevent the default only after real navigation that moved focus to a destination. SectionNav does exactly that; it must not suppress focus return after Escape or outside interaction.
- **Naming:** a new own prop with no existing registry convention. Register it as approved under this owner decision with a recoverable receipt. The approval does not generalize to other Radix events.
