# TopBar v0.1 — part partition amendment

Owner answer (verbatim, 2026-11-03): "Separar por tipo de parte (Recomendado)".

## Conflict

The approved contract (issue #292) and plan require the DOM order brand → page navigation → utilities, receive every part through `children`, and forbid markup parsing and cloning. TopBar renders its own `nav` between the supplied brand and utility parts, so it must know which supplied child is which.

## Amendment

TopBar may identify only its own exported part components (`TopBarBrand`, `TopBarSearchFull`, `TopBarSearchCompact`, `TopBarUserMenu`, `TopBarMobileTrigger`) by React element type, and place each in its documented position. This is the same known-part partition approved for `CommunityCardMark`.

- No cloning, no prop injection and no reading or rewriting of a part's content.
- Fragments may be flattened only to reach those direct part elements, as in CommunityCard; arbitrary descendants are never inspected.
- Anything that is not a TopBar part keeps the contract's existing rule: it is a consumer composition error, documented and warned about in development, not silently reordered.
- Brand remains required and each part appears at most once, as already approved.

Everything else in the approved contract and plan (whole-file SHA-256 `cc6f23fae4b3f20336cc53e24e8b9860f81406d43eaee5df750678f4163283ab`) is unchanged. The original files stay byte-identical; this record supersedes only their "no parsing" wording for TopBar's own part types.
