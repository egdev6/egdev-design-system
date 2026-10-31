# First UI wave — scoped owner approvals

- Status: actual owner decisions; runtime execution is limited to the selected plans and exclusions below.
- Canonical SHA-256: `bbc9ec9834515877bd416af040179b0e5916d75ca0d699fbad35a292b73eceb7`. Hash UTF-8 LF bytes from the actual whole-line `## Approved scopes` heading through EOF, including final LF, excluding this metadata.

## Approved scopes

The owner selected every listed option in four separate questionnaire sections: exact contracts; bounded static visual sets; exact plans AND explicit bounded implementation/provisioning/validation; and independent Indicator extras. These are actual human choices, not native/provider verdicts.

| Binding | Frozen approval target | SHA-256 |
| --- | --- | --- |
| I-C | [spec.md](../../indicator/v0.2/spec.md) | `5a7f18f79329d4cc3fc37ca4ad4ce823cc11e321cdc11936b1f032d7947c4eb6` |
| P-C | [spec.md](../../panel/v0.2/spec.md) | `98d1cc3aa4fa81040f001476a334e1436e2d78f86f1a93cf7a23220b02917e06` |
| C-C | [spec.md](../../collapsible/v0.2/spec.md) | `b3d9f158d45661b151dbff249b645ab6f97b036e872d187eb6f4be39d35b2017` |
| I-V | [capture-metadata.json](../../indicator/v0.2/observed/capture-metadata.json) | `84b4657450e3dff258af66e50e4d16b79fb6749166988eeed55e2868f5427bf3` |
| P-V | [capture-metadata.json](../../panel/v0.2/observed/capture-metadata.json) | `ba97d0956d084cd503091e22c10e851dd7cdd97517f54880a2db840afa4d2a56` |
| C-V | [capture-metadata.json](../../collapsible/v0.2/observed/capture-metadata.json) | `3bfe14c4f31834b58a7789388c08ad02ecbe075cb0376a0ad3b3ad8f7ab99e49` |
| I-P | [implementation-plan.md](../../indicator/v0.2/implementation-plan.md) | `0e2a477066f7ce162fcbcdff3713822e1a5eae6f3e12ebe44471476d97f3793e` |
| P-P | [implementation-plan.md](../../panel/v0.2/implementation-plan.md) | `0d4e70b14ddd26ddd80df4225b5e105451acee9e15623600446ef70c10370b79` |
| C-P | [implementation-plan.md](../../collapsible/v0.2/implementation-plan.md) | `136dc06ca4e2bdc55cdd31ab07a023aaa13443642bde467541eefcbf271df42f` |
| I-A | [indicator-amendment.md](../../avatar/v0.2/indicator-amendment.md) | `c46c02566fb2dec680f69231e5ee96236a1cfaf28011086923985bfa03c6b1da` |
| I-N | [indicator-naming-proposals.md](indicator-naming-proposals.md) | `218403be9baee574e213cf1b06db1f7bd4d3951b20c7e24e593e90ef011fb062` |

## Visual adoption limits

Only the following 13 PNGs and recorded source/capture conditions are adopted as expected static references. No runtime React/Radix, keyboard, focus, AT, browser-zoom, installed-font or universal pixel-parity result is certified. Avatar pairs are authored reconstructions, not observed migration parity. Historical capture-time identities and disclosed capture-only overrides remain unchanged.

| Set | PNG | SHA-256 |
| --- | --- | --- |
| I-V | `branches--static--desktop--dark.png` | `cc6ec72b4ee7b4c753a024f577c4f392fc37e938ca054603870a8f1305b58232` |
| I-V | `avatar--compatibility-proposal--desktop--dark.png` | `f9117e3e21523be9baa71e95efdc0ae7bc3b11bd1b8b1347353c323e0ba128d4` |
| I-V | `corners--static--desktop--dark.png` | `8dc9fa6e4023854ac0e9b9a8caffa8de2513a6b666c12001e0ff1a5d443fcdd5` |
| I-V | `tones--static--desktop--dark.png` | `458d86f31e793677528e5308c6e5fe0c86e4371ab77756d92a11915b48153e0a` |
| I-V | `contexts--static--narrow--dark.png` | `23115359597005f5f834d1320fbfab8b554991cda1c908e0aa397e453de29fdd` |
| P-V | `banded--static--desktop--dark.png` | `b07532259d69925ed473a1771c78754b6ea95289a411112185fb5d14d12826b1` |
| P-V | `hosts--static--desktop--dark.png` | `46c7d43358a40dd42f844d929b40fb3eb2ee29fc24f29110261a0da501db542a` |
| P-V | `optional--static--narrow--dark.png` | `20322dcd38f148c6cd74c9453ac09b6ea332ba0cbf96cd47567c1cc5aeb5d08f` |
| P-V | `default--static--desktop--dark.png` | `882a4312164c1c85273691e9598100f91f4e0f5058826993eff59d6ceb809240` |
| C-V | `independent--static--desktop--dark.png` | `2c87ccaf1b9ba300d413497778a01063635cf9267b8a1fc876b50b78b22c391f` |
| C-V | `states--static--desktop--dark.png` | `f089d96638c7a1a4bdf7e86e1d0109448898955516ddc2ebc02aed5df45f58fa` |
| C-V | `long-label--static--narrow--dark.png` | `1e3efbe5c72b4befca25234191ccc0f8bdbf4f1e5d9dc4ee691b1d4b5b3eaa16` |
| C-V | `independent--reduced-motion--desktop--dark.png` | `cc25e55c3774eb6acf8bc3eb3fef7628ce43a2b90a4001124068a95cadfe9c03` |

## Independent Indicator extras

I-A approves geometry/glyph/position sharing only; preserve Avatar API/DOM/semantics/paint/ring/paused behavior and require regressions. No Badge change.

I-N approves all three exact JSON proposal definitions: anchor-corner-position → position, indicator-count → count, indicator-count-cap → max. Their individual fenced byte identities remain bound in I-N. Approved-state semantic registry hashes and recoverable approval evidence must be computed correctly; future Indicator usage requires actual implemented source and manual symbol review. No fictional revision, automatic alias migration or unrelated API promotion.

## Explicit execution permission and exclusions

Question 3 explicitly requested and received approval to implement the selected exact plans only after their other approved gates, provision only already-declared dependencies using `pnpm install --frozen-lockfile --ignore-scripts`, and run their planned validations. Parent must issue fresh narrow/disjoint runtime assignments, recheck source/ownership availability and own shared integration, provisioning, browser/capture and serialized broad/packed gates.

No new dependency/token values, commit, push, PR or merge is authorized. No publication, issue closure/label change, unrelated migration, new effects implementation or missing organism work is inferred. PhotoFrame/GaugeGroup/effects final runtime gates remain separate; AppShell stays parked. No passing functional/build/AT result is invented by this permission.

## Authority and durable provenance

Source: four-question interactive owner questionnaire in parent Pi session `01a18891-ec9e-77b8-b92d-52b1c9e93682`. The owner selected I-C/P-C/C-C; I-V/P-V/C-V; I-P/P-P/C-P with the explicit execution/provisioning wording; and I-A/I-N. Existing proposal/spec/plan Pending headers are historical to these separately bound decisions, not reason to erase scope or broaden it.

Canonical table entries use the exact anchored heading through EOF recorded in the decision index; visual JSON entries use whole-file byte hashes. This record is a manual recoverable owner grant, not an independent/native receipt or certification of implementation. Existing FX-O/FX-A decisions remain separate and unchanged.
