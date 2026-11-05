# Artboard token self-check

After installing `@egdev/system`, check each self-contained HTML artboard:

```sh
pnpm exec egdev-artboard-check design/example/01-artboard.html --system design/system.md
# Or use the installed package's design-system.json:
pnpm exec egdev-artboard-check design/example/01-artboard.html --artifact
```

`--artifact` is also the default. `--system` reads the token tables in the specified generated reference; use the same versioned reference that informed the artboard. A missing or malformed input is an error. The command only reads files and writes its report to stdout. Save that output alongside review evidence if a durable record is needed.

The report lists the source line, property, declared value and matching token. A copied custom-property definition is listed too. `UNTRACED` is an explicit gap, not an automatically approved exception: investigate it and fix or record it. Structural declarations outside the check are listed as `NOT CHECKED` and counted separately when present; they do not affect the exit code. Exit 0 means no listed gaps; exit 1 means at least one gap or an input error. Input errors are printed to stderr without a partial report. Matching literal values uses the first matching token in source order; equal values do not establish design intent.

The checker examines CSS in `<style>` elements and quoted `style` attributes, including declarations in nested blocks. It looks for colour and paint, font family and size, tokenised line-height and font-weight, margin, padding, gap, inset, radius, shadows, and custom-property declarations. References can name any declared token; exact normalized literal values are matched to the relevant token family, following simple token aliases. The Tailwind spacing scale supports `var(--spacing)` and `calc(var(--spacing) * N)` with a numeric multiplier. It also accepts `color-mix(in oklab, <token> N%, transparent)` for 0–100%, with either a token reference or its resolved literal value, per #343's colour-rule amendment. Locally changed or unknown custom properties are gaps; changing an alias target also invalidates references through that alias.

Escaped property names are listed verbatim as `UNTRACED`, rather than decoded or skipped. Because an escaped name could conceal a custom-property override, any escaped property causes all token matches, including references, literals and copied token definitions, in that artboard to be reported as untraced too. Recognised structural declarations such as `display`, `position`, alignment, flex/grid layout and percentage or auto dimensions are `NOT CHECKED`. Unknown properties remain gaps rather than silently overlooking a colour, length or shadow; inspect and record these conservative findings.

This is a conservative static declaration check, not a CSS engine. Composite shorthands, gradients, calculations other than the spacing-scale form above, fallbacks and other expressions that are not an exact token value are gaps rather than proven compliant. It does not compute the cascade, browser equivalence, inherited values, external content, script-generated styles, component fidelity or accessibility. External stylesheet links are rejected. Script content is not executed or checked; inspect it separately. Unsupported CSS and HTML syntax may require manual review; a zero-gap report does not prove that a rendered artboard is compliant. No CI enforcement or artboard-to-React conversion is provided.
