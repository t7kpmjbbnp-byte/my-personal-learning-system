# PERSONAL KNOWLEDGE GRAPH

## Purpose

Build a traceable map of concepts and their relationships across the learner's subjects. The graph supports learning and review; it is not a diagnostic or treatment tool.

## Files

- `nodes.json`: concepts (nodes), including definitions, subject, learning status, and evidence.
- `relationships.json`: directed relationships (edges) between concepts.
- `index.html`: responsive, read-only browser viewer with search, filters, node details, relationship navigation, and evidence links.

## Data principles

1. Preserve all existing learning records. This folder is additive and does not replace any current file.
2. Every node and relationship must have a stable, unique ID.
3. Cite the learning record that supports each medical concept. Use repository paths and Issue numbers where available.
4. Distinguish a concept being discussed from the learner having mastered it. The initial status `introduced` means only that it appeared in a learning record.
5. Do not infer mastery, errors, or clinical competence from a single case.
6. Add uncertain or unverified relationships only after checking an appropriate source; mark them as needing verification.
7. Keep simulated cases clearly identified as educational examples, not real patient records.
8. Use UTF-8 JSON and validate JSON syntax before committing.

## Node fields

- `id`: stable identifier.
- `label`: Vietnamese display name.
- `subject`: subject area.
- `type`: concept, condition, investigation, threshold, or action.
- `summary`: concise educational description.
- `learning_status`: introduced, reviewing, or assessed.
- `evidence`: array of source records supporting the node.

## Relationship fields

- `id`: stable identifier.
- `source` and `target`: node IDs.
- `type`: relationship category (for example, mechanism, assessed_by, suggests, or management).
- `label`: readable relationship label.
- `evidence`: source records supporting the relationship.

## Initial scope

The first graph is seeded only from the educational ascites/SBP case recorded in Issue #12. It is intentionally small and will grow as new learning updates are recorded and reviewed.

## Viewer

Open `index.html` in a browser through GitHub Pages to use the read-only graph viewer. It loads `nodes.json` and `relationships.json` from the same folder. It includes search, type/status filters, node details, related concepts, and links to evidence files.

The viewer uses plain HTML, CSS, and JavaScript with no external libraries, API keys, analytics, or write permissions. It does not edit repository data.

## GitHub Pages deployment (least-privilege workflow)

The workflow `.github/workflows/knowledge-graph-pages.yml` deploys **only** the `03_KNOWLEDGE_GRAPH/` folder. It does not publish the rest of the repository. It runs when this folder or the workflow changes on `main`, and can also be started manually.

One-time setup on GitHub:

1. Open the repository on GitHub and tap **Settings**.
2. Open **Pages** under **Code and automation**.
3. Under **Build and deployment → Source**, choose **GitHub Actions** (not Deploy from a branch).
4. Save if GitHub shows a Save button.
5. Open the **Actions** tab and select **Deploy Knowledge Graph to GitHub Pages**.
6. If a run is not already in progress, use **Run workflow** on branch `main`.
7. Wait for the workflow to finish successfully. Open its deployment environment link, or visit `https://t7kpmjbbnp-byte.github.io/my-personal-learning-system/`.

The site root is the graph viewer because the workflow uploads only this folder. Its JSON data and viewer are deployed together. The viewer is read-only and requires no API key, external JavaScript library, analytics, or write permission.

**Privacy check:** GitHub Pages creates a published website. Confirm that the repository and the graph data are appropriate for public viewing before enabling it. The workflow deliberately excludes other repository folders, but the graph's own nodes, relationships, and evidence links will be visible to site visitors. Pages eligibility for private repositories depends on the current GitHub plan and organization settings.


## CLS Tiêu hóa curriculum expansion

- `cls_tieu_hoa_curriculum.json` stores the four-group curriculum outline for the 35-page CLS Tiêu hóa source.
- It is an additive, structured outline; the existing interactive case graph remains preserved.
- The outline records the source verification limitation explicitly: text extraction has been reviewed, but all 35 original pages have not yet been visually verified.
- The next viewer phase is to render the curriculum hierarchy (subject → four groups → topics → subtopics) while retaining the existing case graph and evidence navigation.
- Do not mark topics as mastered based only on their presence in this outline.


## SÁCH TRỜI Universe ↔ Notion source-note integration

- `universe.html` now loads `cls_tieu_hoa_source_map.json` alongside the existing curriculum.
- The source map contains **37 source-backed Notion note records** (N01–N37), with stable note IDs, direct Notion URLs, PDF page locators, evidence type, and verification state.
- **32 notes** are mapped to the existing 17 CLS mother-planet topics; **5 group-summary notes** are attached at their existing parent learning branches. The current four visual learning branches are preserved; the source taxonomy's fifth group (G05, lab values/tumor markers) is nested within the existing function/lab branch.
- Selecting a mother planet shows its related Notion source notes. Opening a lesson satellite also shows the same traceable references and page locators.
- Lesson-level provenance is now curated separately: **32 of 37 notes** are mapped to **59 satellite-to-note links** using stable satellite IDs. A satellite shows only notes explicitly assigned to that lesson; group summaries remain at branch level, and an unmapped lesson is not given a misleading source link.
- Evidence coverage report: `cls_tieu_hoa_coverage.json` inventories all **57 satellites**. Current snapshot: **54/57** have direct note links, **3/57** need source review; all 37 notes remain `in_progress`. The satellite panel shows whether a direct note exists and its verification state. `no_direct_source` means no explicit mapping yet, not proof that the original document lacks content.
- The satellite-specific references are also included in the generated teaching prompt, so the prompt no longer passes every note from the parent planet to every lesson.
- The mapping does not create new mastery progress, overwrite existing local progress, or claim that opening a source equals learning it.
- All source notes remain marked **in progress / đang đối chiếu**. The links provide provenance, not independent medical validation.
- GitHub Pages workflow run [46114885820](https://github.com/t7kpmjbbnp-byte/my-personal-learning-system/actions/runs/46114885820) completed successfully on 2026-11-28 after the Universe integration changes.
