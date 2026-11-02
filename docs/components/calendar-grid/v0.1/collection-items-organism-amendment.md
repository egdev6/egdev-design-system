# Collection items naming amendment (organisms)

The owner decision on 2026-11-02, forwarded in `odd/tasks/organisms-build.md` L28, was **“Aprobar para organismos (Recomendado)”**: explicit approval extending the `collection-items` convention's applicability to organisms, recorded after the CalendarGrid implementation raised the convention's molecule-only wording as an open question.

This supersedes the prior convention's molecule-only `whenToUse` wording. The prior delegated approval remains historical and is not edited: `docs/decisions/prop-naming-molecule-specs-approval.json`, scope `convention:collection-items`, hash `sha256:304ac895a943454d04d057e18518794a315958b70252df2e696e00dc65b36f40`. This record does not assert native, signed or independent review. The amended convention is recorded in the registry with its own content hash and [separate appended receipt](collection-items-organism-approval.json).

## Superseded wording

- **Before:** “A molecule renders its own standard entry, with its sub-parts, for each element of a consumer-supplied list.”
- **After:** “An organism or molecule renders its own standard entry, with its sub-parts, for each element of a consumer-supplied list.”

Only `whenToUse` changes. `id`, `name`, `meaning`, `avoid`, `status`, aliases and exceptions are unchanged, and no name, exception, component, token, dependency or API migration is created by this amendment.

## Owner quote

> Aprobar para organismos (Recomendado)
