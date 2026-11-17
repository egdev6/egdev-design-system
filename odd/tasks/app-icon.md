# AppIcon atom (#410)

Implement the APPROVED spec `docs/components/app-icon/v0.1/spec.md` (on main since #442; every open decision resolves to its **Recommended** option, see its "Approval" section; owner delegation recorded there). Branch `feat/app-icon` (worktree `../eds-wt-g`), one PR, Closes #410. Roadmap #427, milestone #15.

## Specs

- S1: Six files in `packages/ui/src/atoms/app-icon/` (no stylesheet): `types.ts` (`AppIconSize = 'sm'|'md'|'lg'`; `AppIconProps` with required `monogram: string` `@control text`, optional `src` and `label` `@control text`, `size` `@control select` `@default md`; native span props minus `children`, `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, `tabIndex`, `style`, `dangerouslySetInnerHTML`, `contentEditable`, `onClick`, `onKeyDown`; static CVA `appIconVariants` `eg-app-icon relative inline-grid shrink-0 place-items-center overflow-hidden` with sizes `size-8/size-10/size-12`, `appIconImageVariants` `size-full object-contain object-center`, `appIconFallbackVariants` `grid size-full place-items-center font-sans text-fg-default` with sm `text-label-default`, md/lg `text-body-default`), `useAppIcon.ts` (blank `label`/`src` treated as absent; named → `role="img"` + `aria-label`, otherwise `aria-hidden`; owned attributes forced; root classes `surfaceVariants({tone:'surface-1', elevation:0, radius:'md', padding:'none'})` + size + `className` merged last), `AppIcon.tsx` (Radix Avatar Root/Image `alt=''`/Fallback `aria-hidden` with the monogram, no delay), `AppIcon.test.tsx`, `AppIcon.stories.tsx`, `index.ts` (exports `AppIcon`, `AppIconProps`, `AppIconSize` only; variants stay internal).
- S2: Wiring: barrel `packages/ui/src/index.ts` (alphabetical, before avatar); `@source` for `atoms/app-icon/types.ts` in `packages/ui/src/styles/compiled.css` and for the stories in `.storybook/preview.css` (without these the utilities do not ship); catalog tuple in `scripts/catalog_data.py` + `python3 scripts/build_catalog.py`; system artifact `pnpm artifact --write && pnpm system:docs`.
- S3: Tests first (RED before GREEN), via the public interface, reusing Avatar's Image stub/settle helpers: missing/blank src → exact monogram (incl. an emoji grapheme), no img; load → `<img alt="">` with `object-contain`, fallback removed, one img role; error → fallback, src change → load, src removed → fallback; naming (label → `img` role with name, fallback `aria-hidden`, blank label decorative, rerender add/change/remove); untyped owned attributes stripped; native pass-through (`id`, `title`, `data-*`, `aria-describedby`); sizes; frame markers (`eg-app-icon`, `eg-surface`, `rounded-md`, `overflow-hidden`, `p-0`); className merge; no tab stop; Avatar suite unchanged.
- S4: Docgen/controls (`storybook-docgen.test.ts` AppIcon block and barrel lists; `storybook-controls.test.ts` component entry, control map, count, defaults), package exports (runtime + type inventories; CSS recipe and SSR test), packed consumer (imports, inventory, `AppIconSamples` with `@ts-expect-error` for missing monogram/children/ref/asChild/role/style/alt/size number; SSR; CSR load/error; `assertAppIconCSS`; React 18 and 19). Stories: Default, Sizes, WithImage (inline SVG data URI), NonSquareImage, MissingImage, BrokenImage, Named, Decorative, InButton; no argTypes/play.
- S5: Registry: AppIcon usages on `brand-monogram`, `accessible-name`, `preset-dimensions`; new convention `identity-image-source` (`src`) with drafted meaning/whenToUse/avoid and approval record `docs/components/app-icon/v0.1/prop-naming-approval.json` (Tabs v0.2 shape; cite the spec's Approval delegation); `scripts/prop-naming.test.mjs` rows; `pnpm props:docs`. Evidence `docs/components/app-icon/v0.1/implementation.md` with the spec content SHA-256 and approval reference.
- S6: No stylesheet, no new module beyond the six files, no new tokens, no new dependencies (Radix Avatar is already a dependency). English artifacts.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S6 | gentle-ai-worker |
| T2 | S1 | parent: Chrome/Edge/Firefox load/fail/monogram/contrast/geometry; captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (owner delegation). Open items resolved: snapshot hash recorded in implementation.md; convention wording drafted by the worker; variants not exported.
- L2: Parent browser check (Chrome): sizes, radius, contain, fallback, contrast, naming, tab order pass; captures recorded.
