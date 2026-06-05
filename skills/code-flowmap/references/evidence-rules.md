# Evidence Rules

Primary evidence:

- Source code.
- Config files.
- Deployment manifests, CI/CD files, bundle files, package metadata.
- SQL, dashboard JSON, alert definitions, tests, and scripts.
- Code comments/docstrings only when they explain code/config that exists.

Not primary evidence:

- README files.
- Meeting notes.
- Screenshots.
- Task lists.
- Chats or prior summaries.
- Human assumptions about architecture.

Docs and notes may guide where to inspect or how to phrase labels, but never use them alone to create nodes, edges, parameters, schemas, or external systems.

Use `data.scope` consistently:

- `implemented`: code/config implements or directly defines this thing.
- `config`: config defines this thing.
- `external-context`: external system described for orientation.
- `context-from-config`: external/contextual system inferred only from configured names or values.
- `implemented-local-tool`: local script/tool exists but is not part of primary runtime.

Prefer omission over invention. When uncertain, either omit the fact or mark the uncertainty in `data` with the evidence that caused it.

Every node should include:

```yaml
data:
  scope: implemented
  evidence:
    - path/to/file.ext
```

Every edge should represent one of:

- function call
- import/dependency used in runtime flow
- config value mapped into runtime parameter
- API/table/file read
- API/table/file write
- dataframe or payload passed to another function
- dashboard/alert query against a table
- job/task/deployment relationship defined in config
