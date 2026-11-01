# Dialog

Dialog is a modal composed from `Dialog`, `DialogTrigger`, `DialogContent` and `DialogClose`. Supply a localized, non-empty title and, when appropriate, a description and footer actions. Radix owns focus, dismissal and the portal. Trigger-less controlled use leaves focus restoration to the consumer.

`DialogContent` merges `className` last for supported layout composition. Overriding reserved panel width, padding, radius, paint, focus or positioning is unsupported but not prevented. Stacking above positioned content is consumer-owned. Nested dialogs and subtree-scoped portal themes are outside this contract.
