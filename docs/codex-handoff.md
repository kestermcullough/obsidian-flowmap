# Codex handoff notes

## Goal

Finish and harden an Obsidian plugin named **FlowMap MVP**.

Product definition:

> One Markdown file contains one `flowmap` YAML block. The plugin renders it as an interactive React Flow canvas. The user can view, pan, zoom, click nodes for details, switch to Arrange mode, drag boxes, and save layout positions back into the same Markdown block.

## Current architecture

```text
Markdown note
  -> ```flowmap fenced YAML block
  -> Obsidian registerMarkdownCodeBlockProcessor('flowmap')
  -> parseFlowMap(source)
  -> FlowMapEmbed React component
  -> ReactFlow canvas
  -> optional save layout back to same fenced block
```

Important files:

| File | Purpose |
|---|---|
| `src/main.tsx` | Obsidian plugin entrypoint and code block processor. |
| `src/parser.ts` | YAML parse/stringify and validation. |
| `src/convert.ts` | Converts FlowMap YAML model to React Flow nodes/edges. |
| `src/layout.ts` | Dagre layout helper. |
| `src/obsidianWriteback.ts` | Replaces the current fenced block with updated YAML. |
| `src/components/FlowMapEmbed.tsx` | Main React Flow canvas. |
| `src/components/FlowMapNode.tsx` | Custom node component. |
| `src/components/DetailsPanel.tsx` | Right-side node details. |
| `src/styles.css` | Obsidian-themed styles. |

## First tasks for Codex

1. Run `npm install` and `npm run build`.
2. Fix any TypeScript/build issues caused by dependency/API changes.
3. Confirm CSS bundling behavior. If styles are not bundled into `main.js`, update build to emit/copy `styles.css` and document manual install files.
4. Test manually inside an Obsidian test vault.
5. Test with one note containing exactly one `flowmap` block.
6. Test with one note containing multiple `flowmap` blocks.
7. Harden block replacement in `obsidianWriteback.ts`.
8. Add a small test suite for parse/validate/stringify and block replacement.

## Known weak spots

### 1. Write-back is fragile

`replaceFlowMapBlock` currently matches the first `flowmap` fence whose normalized body equals the source passed by Obsidian. This is fine for MVP, but it should be hardened.

Potential improvements:

- Preserve exact indentation/fence style if possible.
- Support trailing spaces after the opening fence.
- Support CRLF without rewriting the whole file awkwardly.
- Avoid replacing the wrong duplicate block if two identical blocks exist.
- Explore whether Obsidian provides better section metadata in `MarkdownPostProcessorContext`.

### 2. CSS handling needs verification

The entrypoint imports `@xyflow/react/dist/style.css` and `./styles.css`. esbuild may require a CSS loader/output handling depending on the Obsidian plugin build conventions used. Verify the final plugin loads React Flow styles.

Possible fix: configure esbuild to emit `styles.css`, or avoid importing CSS and copy a stylesheet explicitly.

### 3. UI edit scope is intentionally minimal

The MVP only saves positions. Future UI editing should be designed carefully:

- Rename node.
- Edit node detail.
- Edit node links/data.
- Add node.
- Add edge.
- Delete node/edge.
- Edge details on click.

Do not make movement alter graph semantics.

### 4. React Flow version

This MVP uses `@xyflow/react` v12. React Flow v12 uses `@xyflow/react`, not older `reactflow` package imports.

## Suggested next features

### Better source editing

- Details panel has an “Open source” or “Edit YAML” button.
- Maybe locate the current block and reveal it in source mode.

### Details rendering

- Render `detail` as Markdown using Obsidian `MarkdownRenderer` or a safe markdown renderer.
- Keep links clickable.

### View settings

Top-level YAML fields:

```yaml
showMinimap: true
showControls: true
arrange: false
```

### Styling by type

Support type-specific icons/classes:

```yaml
styles:
  databricks-job:
    icon: workflow
  delta-table:
    icon: database
```

Or keep styling plugin-defined and use `type` only as class name.

### Edge interactions

- Click edge to show edge details.
- Different edge styles by `type`.

### Keyboard shortcuts

- `f`: fit view
- `a`: toggle arrange mode
- `s`: save layout, but only when arrange mode is on

### Schema docs and examples

Add examples for:

- ML pipeline.
- App/dataflow architecture.
- Incident/debug flow.
- Human process flow.

## Manual test checklist

- Code block parses valid YAML.
- Invalid YAML shows useful errors.
- Missing node referenced by edge shows validation error.
- Pan works.
- Zoom works.
- Fit works.
- Auto-layout works.
- Clicking a node opens details panel.
- Details panel shows type, detail, links, and data.
- Arrange mode off: nodes do not move.
- Arrange mode on: nodes move.
- Save layout writes a `layout:` section.
- Reopening the note preserves saved positions.
- Multiple flowmap blocks render without React root leaks.
- Theme changes remain readable in light/dark mode.

## Production release notes

Before publishing as an Obsidian community plugin:

- Rename `flowmap-mvp` to a stable plugin id.
- Add repository URL, author URL, funding/license details as desired.
- Follow Obsidian community plugin submission requirements.
- Add release artifacts: `main.js`, `manifest.json`, and any required `styles.css`.
