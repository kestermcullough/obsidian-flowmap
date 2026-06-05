---
name: code-flowmap
description: Create evidence-backed maps of software projects from code/config, emitting renderer-neutral FlowMap YAML plus Obsidian fenced blocks, Markdown summary, and Mermaid fallback by default. Use when asked to map a repo, explain project architecture as a flow, generate FlowMap YAML, create an Obsidian flowmap note, or produce a Mermaid fallback from code evidence.
---

# Code FlowMap

Create code-evidenced system maps. The core artifact is renderer-neutral FlowMap YAML; Obsidian is only one optional renderer.

## Default Output

Unless the user asks for one specific format, output all formats:

1. `raw-yaml`
2. `obsidian-flowmap-note`
3. `markdown-summary-plus-yaml`
4. `mermaid-fallback`

For large repositories, create multiple maps instead of one overloaded map.

## Evidence Rule

Build nodes and edges from actual code/config only. Docs, README files, notes, screenshots, chats, and prior summaries may guide inspection or labels, but they are not primary evidence.

Every node should have `data.evidence`. Every edge must be justified by a code/config relationship: call, import, config mapping, read, write, dashboard query, alert query, dataframe/payload handoff, job/task definition, or deployment link.

If a contextual system is visible only through configured names, include it only with `data.scope: context-from-config`. If a fact cannot be justified, omit it.

For the full evidence policy, read `references/evidence-rules.md`.

## Workflow

1. Inspect repo structure with `rg --files`, excluding generated/cache/vendor directories.
2. Read code/config entrypoints before docs.
3. Identify layers. Prefer these when relevant:
   - `system-data-flow`
   - `code-analysis-flow`
   - `parameters-outputs-alerts`
   - `deployment-runtime-flow`
4. Draft FlowMap YAML with stable slug IDs.
5. Add `data.evidence` to every node.
6. Check every edge against code/config evidence.
7. Emit all default output formats unless the user asked otherwise.
8. If editing a repo, write notes under an existing docs folder when available.

For layer patterns, read `references/layer-patterns.md`. For YAML fields and conventions, read `references/flowmap-yaml-format.md`.

## Output Notes

- `raw-yaml`: plain YAML object with `title`, `direction`, `nodes`, `edges`, and optional `layout`.
- `obsidian-flowmap-note`: Markdown containing fenced `flowmap` blocks. This works with the Obsidian FlowMap plugin but should not require it conceptually.
- `markdown-summary-plus-yaml`: concise explanation followed by YAML.
- `mermaid-fallback`: simple `flowchart LR`/`TD` derived from the same nodes and edges. Mermaid is a visual fallback, not the source of truth.

## Final Audit

Before finalizing:

- Every node has evidence.
- Every edge is code/config justified.
- Defaults, table names, and columns match code/config.
- External systems are not marked implemented unless code calls them.
- Mermaid fallback has the same logical nodes and edges as the FlowMap YAML.
