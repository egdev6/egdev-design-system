# Second wave owner approvals — PhotoFrame, GaugeGroup, AmbientBackground, Isotipo3D

Recorded 2026-10-31 from the owner's answers in the approval questionnaire: "Aprobar plan + SVG" (PhotoFrame), "Aprobar G-A + G-P" (GaugeGroup), "Aprobar AB-P + AB-E" (AmbientBackground) and "Aprobar ISO-P + ISO-B" (Isotipo3D).

Each approval binds the exact documents and hashes below, as pinned in the [approval decision index](approval-decision-index.md) after the [link correction](link-correction-record.md). Approval authorizes implementation within each plan's stated surfaces, the listed dependency permissions and bounded provisioning/validation. It does not adopt candidate captures, grant token or other dependency changes, certify zoom/AT conformity, or close issues. AppShell #130 stays parked.

## PhotoFrame #95

Approved: implementation plan F-P; adopted diagnostic SVG F-S with its provenance F-J. F-C remains the recovery/consolidation record. Candidate captures F-V stay pending for the owner visual review; F-R remains a request.

| Binding | Document | Pinned SHA-256 |
|---|---|---|
| F-C | `docs/components/photo-frame/v0.3/contract-recovery.md` | `bc430e450cb91d1081cc3b889a20b2cb67d81dd208f4c498c227a5b05b88ad67` |
| F-P | `docs/components/photo-frame/v0.3/implementation-plan.md` | `3a8f4a2db10cc1f5f93498443bb002b50bdec5abc25119302b9a5a7fe118f13f` |
| F-S | `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg` | `1027f0f62e322fa73f9c7e6ce6960f1f00207c0c37ec592409fe073af1e00b59` |
| F-J | `docs/components/photo-frame/v0.3/fixtures/provenance.json` | `06b0decd39297c957262753efb3826f32a8f1fbb4f635c65bc69a048323167ee` |
| F-V | `docs/components/photo-frame/v0.3/observed/capture-metadata.json` | `fd8660c0f4aebe016f1a30e11b1e73042f8b81ed9c860fddb74f49def8ab16a0` |
| F-R | `docs/components/photo-frame/v0.3/capture-request.json` | `1a17e5e07992484e88cb0c2a4cccff399787c49ab0f5583a1877572fc01a0dd4` |

## GaugeGroup #31

Approved: private Gauge refactor amendment G-A (gauge-model.ts normalization, glyph-table extraction, minimal useGauge delegation, internal CVA sharing, Group-only recipe, exactly two geometry selectors in gauge-group.css plus its import), then implementation plan G-P. Gauge API/types/JSX/CSS/stories and GaugeDock stay unchanged. Candidate captures G-V stay pending.

| Binding | Document | Pinned SHA-256 |
|---|---|---|
| G-C | `docs/components/gauge-group/v0.1/contract-recovery.md` | `d235dc78831aefd0f74e35635d7a977cc5bd5845dd14c8d040e88952259e11c7` |
| G-A | `docs/components/gauge-group/v0.1/gauge-refactor-amendment.md` | `31d24a2a0808da1ee60c12dc9d63a4b3b5104269e6d1cef77e46f974a7f92864` |
| G-P | `docs/components/gauge-group/v0.1/implementation-plan.md` | `88827e8d32d8fbe82f7fc6499073630fd2827c207f6c51d2e37d6c027f2628ca` |
| G-V | `docs/components/gauge-group/v0.1/observed/capture-metadata.json` | `5935add238d8a6ce49bd37bf523df3a2a520192036dddd410895cbb9ae6b92e2` |
| G-R | `docs/components/gauge-group/v0.1/capture-request.json` | `4a3a302ad8896e97f19dbf6e363bf6f2a2a09d8cc4021778297cf3e4d815ec44` |

## AmbientBackground #45

Approved: exact port/lifecycle/placement/build scope AB-P with engine port map AB-E, within the selected effects direction (FX-O utility A, dist-only) and the accepted compatibility risk (FX-A) and common plan FX-P. Director/HomeTemplate choreography excluded. Future comparisons AB-R stay pending.

| Binding | Document | Pinned SHA-256 |
|---|---|---|
| AB-C | `docs/components/ambient-background/v0.4/contract-recovery.md` | `fde20d0e5e5ff5ff541a21360b42dfacded1f0855babfd96b7e5691c994ed703` |
| AB-P | `docs/components/ambient-background/v0.4/implementation-plan.md` | `c25bdfe955fec20e1ff6b62827d852e973288fbe9c330246192c74cbdb77e3ed` |
| AB-E | `docs/components/ambient-background/v0.4/engine-port-map.md` | `cfe4528569534f92286eb391a1e1b66476f40b4b8e8854740168aebe2ef254d6` |
| AB-R | `docs/components/ambient-background/v0.4/capture-request.json` | `78bd479b64fd2702e6c6b7e66beaa542ccb92890eac515e3673c708cb7baa00c` |
| FX-P | `docs/components/remaining-components/v0.1/effects-integration-plan.md` | `d95b7d360d46f0efa27c10c750525ade476220cbfcb4be9d57ee985f721d6729` |
| FX-O | `docs/components/remaining-components/v0.1/effects-owner-decisions.md` | `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61` |
| FX-A | `docs/components/remaining-components/v0.1/effects-compatibility-owner-decision.md` | `7aababf3b009e2ffd05383ed895852fc6360f4d9f31a9e811743cb1fea36b1ca` |

## Isotipo3D #47

Approved: placement/lazy engine/lifecycle/cleanup/build scope ISO-P with dependency/build plan ISO-B, including the previously permitted exact required peer three=0.160.0, dev three and dev @types/three=0.160.0. Future comparisons ISO-R stay pending; no automatic issue closure.

| Binding | Document | Pinned SHA-256 |
|---|---|---|
| ISO-C | `docs/components/isotipo3d/v0.4/contract-recovery.md` | `2d39fdd3b4c17b87abb66400fa8de7e39cfb5a8cd3c45ca161f25a70de8042a6` |
| ISO-P | `docs/components/isotipo3d/v0.4/implementation-plan.md` | `a5b46aec4f6a56ca92570da39d680badebb7b99e5b5829a2deeccab61d2e51ad` |
| ISO-B | `docs/components/isotipo3d/v0.4/dependency-build-plan.md` | `fca7235c00170e4d49339a6ee102a3df6a617efb140a41e715dc87af2d9f172a` |
| ISO-R | `docs/components/isotipo3d/v0.4/capture-request.json` | `bcf1a9e460bf4d80f49a500be3d66764aac9532d0915bedbce1d511c21e8d9f8` |
