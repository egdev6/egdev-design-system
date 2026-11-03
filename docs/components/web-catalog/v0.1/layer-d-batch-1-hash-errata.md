# Layer (d) batch 1 — payload hash erratum

Recorded 2026-11-03. Tracking: `odd/tasks/web-catalog.md` L28.

## What went wrong

Each spec defines its canonical payload as the UTF-8 bytes from the heading line `## 1. Purpose and scope` through EOF. The same text also appears earlier, inside the header's "Hash definition" metadata line. The parent's review and publication scripts searched for the first occurrence of that text instead of the heading line, so they hashed a longer byte range: the tail of the metadata line plus the blank line, then the whole canonical payload.

As a result, the parent replaced the writers' correct hashes with the longer-range values in PR #290, and published those values in issues #291–#293 and their approval comments. The published "Full snapshot" sections also start with that metadata tail before the `## 1. Purpose and scope` heading.

## What did not change

The approved content is unchanged. The canonical payload is the exact suffix of each published snapshot that starts at the `## 1. Purpose and scope` heading line; the extra leading bytes are only the tail of the metadata line. Approval comments, issue bodies and published history are not edited. Each issue gets an erratum comment.

| Component | Issue / approval comment | Pinned in approval (longer range) | Canonical payload (heading line to EOF) |
|---|---|---|---|
| SectionShell | #291 / 6597376660 | `8efab611751597184f80f03eb7b6ed405287078d26b971ccb2c746d15f195558` | `edb73a8b606fb49b19516e3d25cf2fe8bb78ca742ce05bd800e2215af03957f9` |
| TopBar | #292 / 6597377277 | `2593857a726c34d8af012ff9195fcbe4d9819a19b447103eceb707d017a46ac6` | `12dc99c75b4b5e07e3772fd55f0c0c413339f64c6fe9ab0cd58404640fa74e82` |
| Footer | #293 / 6597377760 | `e52b0cfd12946e852eea24f68262bd7c7afebb5c85bcc59c7a91a7657c9364b0` | `8b672a15b17d23d1162b896867c45112a74c1749c6e6e7770b21c93717e7efd0` |

Both values are recomputable from `docs/components/<name>/v0.1/spec.md` at merge commit `6f17aff94501956ef3a6f9e1766a72761199f086`: the longer range starts at the first byte occurrence of `## 1. Purpose and scope`, the canonical one at the start of the heading line. The spec headers, `capture.json` and `issue-comment.md` now carry the canonical value.

## Correction

Hash scripts locate the payload with `index(b'\n## 1. Purpose and scope\n') + 1`, never the first textual occurrence.
