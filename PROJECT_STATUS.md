# PROJECT_STATUS.md
# My Personal Learning System — Project Status

> Last checked: 2026-11-27
> Repository: `t7kpmjbbnp-byte/my-personal-learning-system`
> Branch checked: `main`
> This is a snapshot of repository evidence, not a claim that every external service has been inspected.

## 1. Executive summary

The repository contains a working documentation and learning-record structure, a Knowledge Graph data set and read-only viewer, GitHub Actions workflows, and a NotebookLM-to-GitHub Source Bridge with an integrity ledger for the 35-page PDF **CLS Tiêu hóa**.

The main outstanding data-preservation task is the source capture: the PDF itself is not stored in this repository, and its page-level ledger shows **0/35 verified pages**. The Source Bridge documentation correctly describes the process as semi-automatic, not a live NotebookLM integration.

## 2. Verified repository components

| Component | Evidence in `main` | Status | Notes |
|---|---|---|---|
| Core learning framework | `00_SYSTEM/` | present | Learning rules, Socratic tutor, session template, assessment framework |
| Subject knowledge base | `01_SUBJECTS/NOI_CO_SO_RHM_CTUMP/` | present | Notes, questions, clinical cases, sources, topic map, vocabulary |
| Progress tracking | `02_PROGRESS/` | present | Current state, learning log, mistakes, review history |
| Knowledge Graph data | `03_KNOWLEDGE_GRAPH/nodes.json`, `relationships.json` | present | 10 nodes and 10 relationships |
| Knowledge Graph viewer | `03_KNOWLEDGE_GRAPH/index.html` | present | Read-only HTML viewer |
| Pages deployment workflow | `.github/workflows/knowledge-graph-pages.yml` | configured | Workflow deploys only `03_KNOWLEDGE_GRAPH/`; actual Pages deployment success was not checked in this audit |
| Learning update workflow | `.github/workflows/learning-update.yml` | present | Triggered by newly opened issues with title prefix `[LEARNING UPDATE]`; requires metadata and four sections |
| NotebookLM Source Bridge | `04_SOURCE_BRIDGE/` | present | Register, templates, records folder, integrity tracking |
| Recovery guide | `SYSTEM_RECOVERY.md` | present | Recovery and handover instructions |

## 3. Knowledge Graph snapshot

- Nodes: **10** (verified by reading `03_KNOWLEDGE_GRAPH/nodes.json`).
- Relationships: **10** (verified by reading `03_KNOWLEDGE_GRAPH/relationships.json`).
- Current graph scope: the ascites/SBP learning case documented in Issue #12.
- All 10 nodes currently use `learning_status: introduced`; this indicates the concepts appeared in a learning record, not that the learner has mastered them.
- Issue #12 is titled **[LEARNING UPDATE] Nội khoa – Dịch báng và SBP**. Its learning record says mastery remains **UNKNOWN** and recommends later reassessment.
- The graph workflow is configured to publish only the graph folder. Deployment success and the live Pages URL were not verified in this status check.

## 4. Source Archive — critical outstanding work

| Item | Verified state |
|---|---|
| Notebook | `Nội cơ sở – RHM – CTUMP` is recorded in `04_SOURCE_BRIDGE/SOURCE_REGISTER.md`; full NotebookLM inventory has not been checked |
| Source | `SRC-001 — CLS Tiêu hóa`, learner-reported PDF, 35 pages, text and images |
| Original PDF in this repository | **Not present** in the inspected recursive repository tree |
| Original location | Learner's device; exact path/link not recorded |
| Redistribution permission | Not confirmed; repository is public, so do not upload the complete PDF without permission |
| Page-level integrity ledger | `04_SOURCE_BRIDGE/integrity/SRC-001-CLS-Tieu-hoa.md` |
| Verified pages | **0/35** |
| Pending pages | **35/35** |
| NotebookLM note | One known note was reported; complete content not yet captured/compared |
| Prompts, answers, citations, annotations | Partial or not yet captured and verified |

**Interpretation:** the integrity ledger and source metadata are present, but they are not the original PDF and do not mean the source has been archived. Keep the PDF in its original permitted storage; capture page text, figures, tables, citations, and learning outputs with traceable page references.

## 5. Learning record snapshot

Issue #12 is open and records one simulated learning case about ascites and spontaneous bacterial peritonitis (SBP). It records correct calculation/identification of SAAG 1.8 g/dL and ascitic PMN 600 cells/mm³, plus correct answers on two follow-up questions. The issue explicitly leaves mastery as UNKNOWN because one case is insufficient evidence of independent mastery.

Next educational review proposed in Issue #12: use a new case to reassess SAAG, PMN interpretation, and the priority management step without hints.

## 6. Automation and integration boundaries

- GitHub learning-update automation exists and writes validated issue sections into progress and subject files.
- Knowledge Graph Pages deployment automation exists.
- The Source Bridge documentation states that NotebookLM is **not directly connected** to GitHub or ChatGPT. Captures require learner transfer or a supported export.
- Do not describe the NotebookLM → GitHub → ChatGPT workflow as fully automatic or as having live access to the user's NotebookLM account.

## 7. Next actions (recommended order)

1. **Complete SRC-001 capture:** obtain the PDF through a supported upload/export path, confirm permissions, and inspect all 35 pages including images, tables, and diagrams. Update the ledger only with page-level evidence.
2. **Complete NotebookLM inventory:** check the notebook's full source list, saved notes, useful chats, prompts, answers, and citations; update the source register with exact titles and capture states.
3. **Verify GitHub Pages deployment:** inspect the latest workflow run and confirm the deployed graph viewer opens correctly.
4. **Run a new learning reassessment:** use a different ascites/SBP case after the proposed review interval; update mastery only when evidence supports it.
5. **Keep this status file current:** update it after verifiable repository or workflow changes, retaining dated notes where useful.

## 8. Status vocabulary

- **Verified:** directly inspected in the repository or source.
- **Reported:** stated by the learner or a prior conversation, not independently checked.
- **In progress:** partial artifacts exist and outstanding work remains.
- **Configured:** workflow/configuration file exists; successful execution is not implied.
- **Unknown:** not enough evidence to determine the state.

---
For recovery instructions, see [SYSTEM_RECOVERY.md](SYSTEM_RECOVERY.md).
