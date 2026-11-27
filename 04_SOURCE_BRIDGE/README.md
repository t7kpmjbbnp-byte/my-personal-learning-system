# NotebookLM → GitHub → ChatGPT Source Archive

## Purpose

This folder is the durable, traceable archive for learner-selected material captured from the personal NotebookLM workspace **Nội cơ sở – RHM – CTUMP**. NotebookLM remains the source-analysis environment. GitHub stores source metadata and captured outputs. ChatGPT reads and checks the archive to teach, assess, and update the learning system.

This is a **semi-automatic bridge**, not a live NotebookLM integration. It cannot independently inspect the private NotebookLM account, enumerate all notebooks, or export complete chat history. Each captured item must be transferred by the learner or through a supported export.

## Archive layers

1. **Original source** — the original PDF, slide deck, document, web page, or video remains in NotebookLM and/or its original storage location. GitHub stores its identity, provenance, link, and relevant location details. Store a copy in GitHub only when the learner owns it or has permission to redistribute it and the repository's visibility is appropriate.
2. **Notebook/source register** — `SOURCE_REGISTER.md` lists notebooks and sources, including capture status and where the original is kept.
3. **Captured NotebookLM outputs** — dated Markdown records in `records/` preserve prompts, answers, saved notes, citations, learner annotations, and known gaps.
4. **Learning records** — the existing `02_PROGRESS/` and clinical-case records remain separate. A source archive entry is not proof of learning or mastery.
5. **Knowledge Graph** — graph changes happen only after evidence and relationships are checked.

## Capture protocol: completeness first

For each NotebookLM source, create or update its register entry and capture the following when available:

- Notebook name and stable notebook URL (if available).
- Exact source title, source type, original URL/file location, author/publisher, publication or edition date, and access date.
- Source version, page count, slide count, or relevant sections when visible.
- Original prompt, including follow-up questions that materially change the answer.
- Full answer text intended for preservation, not only a short summary.
- Every relevant saved note, kept as a separate clearly titled section.
- Source citations exactly as NotebookLM displays them, including page/section labels and links.
- Learner annotations, unresolved questions, and any corrections.
- A capture checklist identifying what was not available or could not be exported.

Do not silently shorten, paraphrase, or discard source citations during transfer. If a long answer must be split, use numbered parts and record the total number of parts. Keep the original NotebookLM/Google Docs content until the GitHub copy has been checked.

## What "complete" means here

A record is **complete for the captured session** only when all applicable items above have been transferred and checked. It does not mean the entire NotebookLM notebook, all historical chats, or every source file has been backed up. The personal NotebookLM workflow has no supported full-account export/API available to this bridge.

## Workflow

1. In NotebookLM, identify the notebook and source(s) used. Do not rely on the chat answer alone to identify provenance.
2. Save useful answers as Notes where possible. Preserve important prompts and follow-up answers. Export notes to Google Docs or copy them as a transfer method.
3. Check the exported/copied content against NotebookLM. Retain citations, headings, tables, and all relevant sections. For lengthy content, split it into numbered parts without removing content.
4. Create a GitHub Issue using **NotebookLM Source Archive Capture**. Complete the source metadata, prompt/answer/note/citation sections, and capture checklist. If a field is unavailable, write `Not available`; never guess.
5. After the Issue is created, ask ChatGPT to review it and create a dated Markdown record under `04_SOURCE_BRIDGE/records/`, plus update `SOURCE_REGISTER.md`. ChatGPT must preserve the captured content and flag gaps rather than inventing missing material.
6. Verify the committed record against the Issue and the original export. Only then mark the source/session capture as checked.
7. If useful, ask ChatGPT to teach from the verified record. Create a separate `[LEARNING UPDATE]` only for actual learner progress, mistakes, review, or clinical-case evidence.
8. Update the Knowledge Graph only when a concept or relationship is supported by traceable evidence.

## Document Integrity Checker

Use DOCUMENT_INTEGRITY_TEMPLATE.md for reusable page-level checks and integrity/SRC-001-CLS-Tieu-hoa.md for the known 35-page PDF. The ledger tracks text extraction, visual review (including tables, figures, captions and labels), comparison against the original, and unresolved issues for every page. A pasted excerpt without a confirmed PDF page number does not count as a verified page. Mark a page verified only after both text and relevant visual content have been checked. Overall source status must remain in_progress until all pages and applicable NotebookLM materials have been checked; use partial_unavailable when exact gaps remain.

## Record status vocabulary

- `not_started`: source identified but no capture attempted.
- `in_progress`: some materials captured; checklist has outstanding items.
- `captured_unverified`: content transferred but not compared with the original.
- `checked`: transferred content compared with the original/export; known gaps are documented.
- `partial_unavailable`: one or more relevant parts could not be retrieved/exported; gaps are explicitly listed.

Never use `checked` to imply medical correctness. Source fidelity and clinical correctness are separate checks.

## Data integrity and safety

- Preserve original wording for captured NotebookLM answers and notes. Put ChatGPT's review or corrections in a separate section.
- Keep source-supported claims separate from ChatGPT's additional explanation and from learner interpretation.
- Never invent citations, page numbers, URLs, source titles, or missing NotebookLM content.
- Do not infer mastery from a source summary or one correct answer.
- Do not store patient-identifying information, credentials, private personal data, or confidential institutional material.
- This repository is public unless its visibility is changed. Do not upload complete copyrighted textbooks, paid lecture packs, or other materials without redistribution permission. Prefer bibliographic metadata, links, citations, learner-created notes, and limited excerpts permitted by law/licence.
- Original documents should remain in their original storage. GitHub records their provenance; it is not automatically a mirror of every original file.

## Files

- `SOURCE_REGISTER.md`: notebook/source inventory and capture status.
- `RECORD_TEMPLATE.md`: structure for a durable source-session record.
- `records/`: dated, append-only capture records.
- `.github/ISSUE_TEMPLATE/notebooklm-source-note.md`: legacy issue template retained for compatibility.
- `.github/ISSUE_TEMPLATE/notebooklm-source-archive.md`: expanded capture template.

## Naming

Use `YYYY-MM-DD-short-topic-part-N.md` for split records, for example `2026-11-27-ascites-saag-sbp.md`. Keep all parts from one capture session clearly linked.

## Initial inventory

The first recorded notebook is **Nội cơ sở – RHM – CTUMP**. The first recorded source is **CLS Tiêu hóa**. This is the known starting inventory, not a claim that the notebook contains only one source. Confirm the full source list directly in NotebookLM before marking the inventory complete.
