# Build notes

The plugin imports two CSS sources:

- `@xyflow/react/dist/style.css`
- `src/styles.css`

The esbuild config bundles JavaScript to `main.js`. If esbuild emits `main.css`, the config copies it to `styles.css`, because Obsidian conventionally loads `styles.css` from the plugin folder.

Expected release files:

```text
main.js
manifest.json
styles.css
```

Codex should verify this in a real install because CSS bundling behavior is one of the known MVP risks.
