# CommunityCard responsive breakpoint amendment

Owner selected (verbatim): "Autorizar breakpoint local de 48rem".

The presented decision authorizes static `min-[48rem]:` variants in CommunityCard only, replacing the non-emitting `md:` variants for its existing planned padding changes. The current token theme does not define a default md breakpoint. This preserves the intended responsive treatment at48rem (768px with the browser initial16px font size) without adding/changing tokens or dependencies.

Scope: CommunityCard body `min-[48rem]:p-8` and top row `min-[48rem]:px-8 min-[48rem]:py-5`, plus corresponding tests/story descriptions when needed. This is not global approval for arbitrary numeric breakpoints. Original approved spec/plan files remain byte-identical; this amendment supersedes only their md spelling for these recipes. Actual emitted media queries and browser geometry on both sides of the breakpoint must be verified before delivery.
