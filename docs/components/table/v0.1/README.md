# Table v0.1

Table renders native tabular data with optional local sorting and multiple row selection. Supply a non-empty caption, stable unique row and column IDs, and pure column accessors. `details` omits sorting and selection.

The frame's `className` supports outer layout only. Native `style` is forwarded to the table, but using it for appearance is unsupported. Sorting uses the runtime locale for string keys; pre-sort rows or use numeric keys when server and client locales may differ. Table is unvirtualized; hosts should bound row counts and provide their own loading and error UI.

Visual, browser scrolling, keyboard focus and assistive-technology conformity have not yet been evaluated.
