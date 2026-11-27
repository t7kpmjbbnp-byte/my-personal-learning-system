# Document Integrity Checker — Reusable Template

Use one ledger per source document. This checklist verifies capture fidelity; it does not validate the medical/scientific correctness of the source.

## Source identity

- Source ID:
- Exact title:
- File type:
- Reported page/slide count:
- Content types (text, tables, images, diagrams, scans):
- Author/publisher/version:
- Original storage location:
- Redistribution permission:
- Overall status: not_started / in_progress / captured_unverified / checked / partial_unavailable

## Page-level ledger

Create one row for every page/slide. Do not infer page coverage from unnumbered excerpts.

| Page | Text status | Visual status | Compared with original | Final status | Notes / unresolved issue |
|---:|---|---|---|---|---|
| 1 | pending | pending | No | pending | |

Status values:
- pending
- text_captured
- visuals_reviewed
- compared
- verified
- issue

## Per-page verification

- [ ] Text and reading order captured.
- [ ] Headings, lists, numbering and paragraph boundaries retained.
- [ ] Tables preserve row/column relationships.
- [ ] Images/diagrams/radiographs reviewed.
- [ ] Captions, legends, labels and annotations retained where legible.
- [ ] Unreadable regions flagged, never guessed.
- [ ] Extracted content compared against the original page.
- [ ] Page numbering offsets documented.

## Non-page assets

| Asset | Expected count | Captured | Compared | Status | Notes |
|---|---:|---|---|---|---|
| Original source file | | | | | |
| Saved notes | | | | | |
| Prompts and answers | | | | | |
| Citations | | | | | |
| Learner annotations | | | | | |

## Completion rules

- checked means all applicable content in the declared capture scope was compared with the original and known gaps are listed. It does not mean the whole NotebookLM account/history was exported.
- partial_unavailable means some pages/assets could not be retrieved; list exact page numbers and missing elements.
- Do not upload copyrighted or confidential source files to a public repository without permission.
- Never mark a page verified when only a text fragment is available and its page/visuals have not been checked.
