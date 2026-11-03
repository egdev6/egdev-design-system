# NowCard v0.1 — body-grow amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Scope:** One utility on `NowCardBody`: `flex-1`. No other NowCard class, prop, marker, token or API changes.
- **Trigger:** NowStrip v0.1 plan gate 5 (footer alignment feasibility), which required stopping for an owner decision if aligned footer bands could not be proved without changing NowCard.

## Evidence that triggered the stop

Real Chromium 153.0.8010.12, 1280×900, dark theme, NowStrip `UnevenCards` with a `NowCardFooter` in every card of the first row:

| Card | Height | Footer top | Gap below footer |
|---|---|---|---|
| 1 | 181.41px | 192.22px | 1px |
| 2 | 181.41px | 185.73px | 7.48px |
| 3 | 181.41px | 138.41px | 54.81px |

Grid stretching gave equal card heights, but `NowCardBody` had `flex-grow: 0`, so each footer band followed its content instead of the card bottom. Capture: [gate5-before-amendment-1280-dark.png](../../now-strip/v0.1/observed/gate5-before-amendment-1280-dark.png).

## Owner decision

Question: "NowStrip: los footers de las NowCard no se alinean sin cambiar NowCard (body sin flex-grow; footers a 192/186/138px en la misma fila). ¿Cómo seguimos?"

Answer: "Enmienda mínima de NowCard: body flex-1 (Recomendado)".

This follows the CommunityCard precedent, where a growing body pins the action to the card bottom.

## Result

- `nowCardBodyVariants` gains `flex-1`; `NowCard.test.tsx` asserts it (observed RED before the change, GREEN after).
- **Standalone NowCard unchanged:** the width, height and footer offset of every card in all nine NowCard stories at 390px and 1280px are byte-identical before and after the change (cards with intrinsic height have no free space to distribute).
- **NowStrip:** all three first-row cards measure 181.41px with footer tops at 192.22px and 1px below each footer, in `UnevenCards`, which now gives every first-row card a footer. Capture: [uneven-aligned-1280-dark.png](../../now-strip/v0.1/observed/uneven-aligned-1280-dark.png).
- `types.ts` SHA-256 changes from `520bea0e406bea5b9a9846bf8ee9155c279bbd0d1691c495061d7e6b35a41640` to `0456c698ab96fb7522dc8676a36fac8de860b87b71eb1389e0785f7e14ee4b1c`; the four NowCard naming usages record the new revision. Existing receipts bind convention content, not usages.
