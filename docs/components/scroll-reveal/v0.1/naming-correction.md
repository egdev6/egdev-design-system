# ScrollReveal v0.1 — scoped naming correction

Owner choice, verbatim: **"Reuse existing convention (recommended)"**, primary interactive Pi session `01a1910a-607e-77cc-a3dc-b39bbbbf10a6`.

The frozen spec payload `7048c85eb9c2997349ad100bdae32e0e301701a412cc447f021cd9f4d0df2101` proposed a new `entrance-variant` convention for `variant`. That lookup was incorrect: approved `visual-treatment` already owns the canonical name `variant` and covers visual treatment within the component's responsibility. The registry correctly rejects duplicate canonical names.

The owner authorizes reusing **`visual-treatment` / `variant`** for ScrollReveal and retaining the independently approved **`entrance-delay` / `delay`** convention. This changes no public prop name, type, default or behavior. No validator is weakened, no historical registry entry or receipt is rewritten, and the frozen spec/plan remain unchanged. The task-created, uncommitted invalid duplicate was never admitted or published and is removed as part of this correction. Current `types.ts` source hashes bind reviewed usages in the registry.
