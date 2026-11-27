# NotebookLM → GitHub → ChatGPT Source Bridge

## Purpose

This folder is the handoff point for useful, learner-selected NotebookLM outputs. NotebookLM remains the source-analysis workspace; GitHub stores durable learning notes; ChatGPT reads those notes to teach, assess, and update the learning system.

This is a **semi-automatic** workflow. It does not connect to or read the private NotebookLM interface, notebook chat history, or source list automatically.

## Workflow

1. In the relevant NotebookLM notebook, ask a question grounded in the selected sources.
2. For an answer worth keeping, use **Save to note** when available. Export that note to Google Docs if you want a separate backup, or copy the answer.
3. On GitHub, create an issue using the **NotebookLM Source Note** template. Paste the answer and its source citations/links. Include the notebook and source names.
4. Ask ChatGPT to process the new `[SOURCE NOTE]` issue. ChatGPT should read it, check the reasoning, distinguish source-supported statements from added explanation, and create a dated Markdown record in `04_SOURCE_BRIDGE/records/`.
5. Only after review, create a separate `[LEARNING UPDATE]` issue for progress, mistakes, review, or clinical-case evidence. The existing learning workflow remains unchanged.
6. When a source note materially supports a graph concept, ChatGPT may update the graph with traceable evidence, after checking the source and existing graph data.

## Record rules

- Keep the NotebookLM notebook name, source title, date, original prompt, and source citations.
- Mark unsupported or uncertain statements explicitly; do not present them as source facts.
- Do not infer mastery from a source summary or one correct answer.
- Do not store patient-identifying information.
- Do not upload complete copyrighted textbooks or lecture packs unless you have permission. Prefer your own notes, short relevant excerpts, and citations to the original source.
- Keep source notes separate from learner assessment records.

## Privacy warning

The repository and its GitHub Issues may be publicly visible. Do not put private documents, credentials, personal data, identifiable patient information, or material you are not allowed to publish here. Check repository visibility before submitting a source note.

## Record naming

Use `YYYY-MM-DD-short-topic.md`, for example `2026-11-27-ascites-saag-sbp.md`.

## Current starting point

The first notebook currently recorded for this workflow is **Nội cơ sở – RHM – CTUMP**. The first source recorded is **CLS Tiêu hóa**. Confirm these details when submitting the first source note; do not assume other notebooks or sources exist.
