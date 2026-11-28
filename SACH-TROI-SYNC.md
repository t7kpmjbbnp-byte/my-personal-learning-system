# SÁCH TRỜI — Cross-device sync contract

Version: 1.1
Updated: 2026-11-28
Canonical workspace: Notion page "SÁCH TRỜI – CỔNG ĐỒNG BỘ ĐA THIẾT BỊ"
Canonical page: https://app.notion.com/p/4265a63d7bde81838ac3c6bdeb88d489

## Authority by data type

- Notion is the canonical source for the teaching charter, knowledge records, source documents, learning progress, and decisions.
- ChatGPT Library stores a versioned Markdown bootstrap pack. It is a snapshot, not a live database. If stale, refresh it from Notion.
- This GitHub repository is authoritative only for application source code, build/deployment history, and public-safe technical documentation.
- Chat history and model memory are supporting context, never the sole source of truth.

## Session start protocol

When the user says "MỞ SÁCH" or "ĐỒNG BỘ SÁCH TRỜI":

1. Read the Notion sync hub and its linked architecture, source register, notes/analysis, learning log, and current project status.
2. Read the latest ChatGPT Library sync pack if available.
3. Check the GitHub default branch and latest relevant commit for application work.
4. Report the actual version/date read, what is confirmed, what is uncertain, and any conflicts.
5. Do not claim a source was read if it was inaccessible. Do not infer missing progress.
6. Continue only after the current state is clear.

## Teaching invariants

- Teach through active recall and Socratic prompting; use short, focused questions and hints before giving a full explanation.
- Distinguish answer-quality score (0–5) from the universe light level (0–5).
- A light level changes only with demonstrated learning, not opening or clicking a planet.
- Learners can choose learning branches; do not force a linear route.
- Keep source text, learning interpretation, external enrichment, and learner answers/errors distinct.
- For source material, preserve original files and page-level provenance. OCR/extraction success is not equivalent to visual verification.

## Universe model

- A learning map/branch is a star system; the cross-map overview is a galaxy.
- Parent planets represent major knowledge systems; subtopics/lessons are represented by planets and satellites according to the current map design.
- Light levels: 0 not opened / relearn; 1 basic foundation; 2 recall and explain core ideas; 3 connect and distinguish; 4 apply; 5 stable mastery and flexible transfer.
- Each topic progresses independently.
- A confirmed forgetting event reduces one level, never below 0. More than three forgetting events (from the fourth onward) returns the topic to level 0 and marks it for relearning. Relearning plus a passed check restarts at level 1.
- Preserve event history; never silently overwrite it.

## Conflict and write-back protocol

- Do not edit the same record concurrently on multiple devices.
- Write learning outcomes to the Notion learning log; source analysis to the notes/analysis database; source metadata to the source register; decisions to the architecture/sync hub.
- Commit application changes to GitHub and record commit SHA plus verification status in Notion.
- After Notion changes, produce a new versioned Library pack. Do not claim automatic Notion ↔ Library ↔ GitHub synchronization.
- If sources disagree, pause writes, preserve all versions, compare timestamps and authority by data type, document the resolution, then resume.
- Never delete source documents or learning history as part of routine synchronization.

## Current known limitations (2026-11-28)

- No verified background sync between Notion, ChatGPT Library, and GitHub.
- No verified cross-device sync of app progress currently stored in browser local storage.
- Full 35/35-page visual verification of the CLS Digestive source has not been completed.
- iPhone touch behavior and scene transitions still require real-device verification.
- A new ChatGPT session must be explicitly instructed to read the sync hub and pack; it is not guaranteed to load all project context automatically.

## Start command

"ĐỒNG BỘ SÁCH TRỜI"

Read the sources, report version and evidence, identify gaps, and only then continue.
