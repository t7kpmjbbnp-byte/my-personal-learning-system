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

## GitHub Pages deployment (manual)

1. Open repository Settings on GitHub.
2. Open Pages under Code and automation.
3. Under Build and deployment, choose Deploy from a branch.
4. Select branch `main` and folder `/ (root)` if publishing the repository root.
5. Save, then wait for GitHub Pages to publish.
6. Open `https://t7kpmjbbnp-byte.github.io/my-personal-learning-system/03_KNOWLEDGE_GRAPH/`.

If Pages is already configured with a different source, do not change it without checking the existing site configuration first. Publishing is separate from committing the viewer files. Pages availability and private-repository eligibility depend on the repository's current GitHub plan and settings.
