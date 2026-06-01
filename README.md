# FlowMap MVP for Obsidian

A handoff-ready MVP Obsidian plugin for **one Markdown file = one interactive graph/map**.

It is intentionally Mermaid-like in spirit: the source of truth is a fenced Markdown code block. The difference is that the rendered view is an interactive React Flow canvas with pan, zoom, node dragging, auto-layout, a minimap, controls, and a details panel.

```flowmap
nodes:
  - id: source
    label: Source Table
  - id: job
    label: Transform Job
edges:
  - from: source
    to: job
    label: reads
```

## MVP scope

Implemented:

- `flowmap` fenced code block processor for Obsidian Markdown preview/live preview.
- YAML parser and lightweight schema validation.
- React Flow renderer with pan, zoom, controls, minimap, and fit view.
- Dagre auto-layout.
- View mode vs Arrange mode.
- Drag nodes only in Arrange mode.
- Save layout back into the same fenced code block.
- Click node to show a right-side details panel.
- Command to insert an example `flowmap` block.

Not implemented yet:

- Add/remove nodes and edges from UI.
- Rich text editing in the details panel.
- Edge click details panel.
- Multiple code blocks per note tested rigorously.
- Full automated test suite.
- Production hardening for all Markdown fence edge cases.
- Mobile polish.
- Community-plugin release workflow.

## Development

```bash
npm install
npm run build
```

For development:

```bash
npm run dev
```

Copy or symlink these files into an Obsidian test vault:

```text
.vault/.obsidian/plugins/flowmap-mvp/
  main.js
  manifest.json
  styles.css   # if emitted separately later; currently CSS is bundled by esbuild
```

Then enable the plugin in Obsidian settings.

## Why this shape

This follows the same basic mechanism used by many React-based Obsidian plugins:

1. Obsidian detects a fenced code block by language.
2. The plugin registers a Markdown code block processor.
3. Obsidian provides an HTMLElement.
4. The plugin mounts a React root into that element.
5. React Flow renders the interactive diagram.

The code avoids vault-wide scanning, Dataview, or automatic graph extraction. The diagram source is the fenced YAML block.

## Source format

See [`docs/flowmap-format.md`](docs/flowmap-format.md).

## Codex handoff

See [`docs/codex-handoff.md`](docs/codex-handoff.md).
