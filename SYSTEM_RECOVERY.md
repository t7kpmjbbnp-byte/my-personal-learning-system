# SYSTEM_RECOVERY.md
# My Personal Learning System — Recovery & Handover Guide

> Purpose: restore project context in a new ChatGPT conversation or with another AI assistant.
> Last prepared: 2026-11-27.
> Repository: https://github.com/t7kpmjbbnp-byte/my-personal-learning-system

## 1. Project identity

**Project:** My Personal Learning System  
**Repository:** `t7kpmjbbnp-byte/my-personal-learning-system`  
**Default branch:** `main`  
**Goal:** a durable personal knowledge and learning system for medical study, connecting source documents, notes, analysis, citations, structured knowledge, and AI assistance.

## 2. Intended architecture

- **GitHub — durable system of record:** versioned storage for source archives, notes, structured data, workflows, documentation, and change history.
- **NotebookLM — source-grounded study workspace:** work with original reference documents and ask questions grounded in those sources.
- **ChatGPT — learning and systems assistant:** explain, analyze, teach, connect concepts, and assist with repository maintenance when authorized.
- **Source Archive — preservation layer:** retain original documents separately from summaries, alongside extracted text, tables/figures where feasible, analysis, notes, questions, answers, and source references.
- **Knowledge Graph — relationship layer:** represent concepts and their relationships in a readable, maintainable way.

These are intended roles. Verify the actual implementation in the repository before making changes.

## 3. Last-known project context (reported in conversation; not independently verified here)

- A Knowledge Graph phase was previously worked on.
- The user reported 10 concepts and 10 relationships associated with Issue #12.
- A Knowledge Graph interface using GitHub Pages was discussed/implemented.
- The user selected **Option A: a comprehensive Source Archive** that preserves source material and related learning artifacts.
- A semi-automated workflow was being planned: **NotebookLM → GitHub → ChatGPT**.
- The first known study source was a 35-page PDF titled **“CLS Tiêu hóa”**, containing text and images, plus one note. The original PDF had not yet been confirmed as fully archived in GitHub.

**Important:** Treat this section as historical handover context, not proof of current repository state. Check files, commits, issues, and workflows before reporting completion.

## 4. Non-negotiable preservation rules

1. Never delete, overwrite, or reorganize existing user data without explicit approval.
2. Keep original source files distinct from summaries, extracted text, and AI-generated explanations.
3. Preserve citations, source names, page numbers, and provenance wherever available.
4. Do not claim a document is fully archived unless the original file and expected supporting assets are verified.
5. Do not invent medical facts, citations, study progress, or implementation status.
6. Prefer incremental, reversible changes and clear commit messages.
7. Keep the system usable on an iPhone and prefer low-cost or free approaches where practical.
8. Make Knowledge Graphs and dashboards clear and readable; avoid unnecessary visual complexity.
9. Before changing an existing file, fetch its current contents and preserve unrelated content.
10. Report exactly what was inspected, changed, and verified.

## 5. Recovery procedure for a new assistant

1. Confirm repository identity and access.
2. Inspect the default branch and repository tree.
3. Read the README, this guide, relevant documentation, workflows, and Knowledge Graph/Source Archive files.
4. Review recent commits and relevant issues (especially Issue #12 if it exists).
5. Compare actual repository state with Section 3; mark each item verified, changed, missing, or unknown.
6. Identify the most recent incomplete task from repository evidence and conversation context.
7. Present a concise status report and proposed next action.
8. **Do not write to the repository until the user approves the specific change.**

## 6. Suggested Source Archive structure

This is a target design, not a claim that these folders already exist. Adapt to the repository's actual structure rather than duplicating existing conventions.

```text
source-archive/
  <subject>/
    <document-id>/
      original/
        source.pdf
      extracted/
        full-text.md
        tables/
        figures/
      study-notes.md
      questions-and-answers.md
      citations.md
      manifest.yml
```

A manifest should record, where known: document title and stable ID; original filename and format; source/author/publisher and publication date; date added and processing status; page count; extraction method and known limitations; related notes, concepts, and citations.

Do not assume every PDF can be perfectly extracted. Check scanned pages, figures, tables, and OCR quality.

## 7. Completion and verification standard

Use explicit statuses:
- **Verified:** directly checked in the repository or source document.
- **Reported:** stated by the user or in prior conversation, not yet checked.
- **In progress:** evidence of partial implementation exists.
- **Missing:** checked and not found.
- **Unknown:** not enough evidence.

For each completed task, record files created/updated, commit SHA or issue/PR reference, validation performed, known limitations, and next step.

## 8. Short recovery prompt

“Read `SYSTEM_RECOVERY.md` in my repository `t7kpmjbbnp-byte/my-personal-learning-system`. Reconstruct the project context, inspect the actual repository state, distinguish verified facts from historical reports, and give me a status report. Preserve all existing data. Do not modify anything until I approve a specific change.”

---
This document is a recovery guide, not a backup of the source documents themselves. Keep original learning materials and their assets in the Source Archive with appropriate access controls.
