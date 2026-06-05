# Project FlowMap Prompt

Use this prompt to ask an LLM to create or update a project FlowMap.

```text
Create or update a code-evidenced FlowMap for this repository.

Default output mode: produce all formats unless I ask for a specific one:

1. raw-yaml
2. obsidian-flowmap-note
3. markdown-summary-plus-yaml
4. mermaid-fallback

Hard evidence rule: build the map only from actual code and config as they exist in the repository. README files, notes, screenshots, task lists, chats, and prior summaries may guide where to inspect or help choose labels, but they are not primary evidence. Do not invent nodes, edges, parameters, schemas, or external systems. If a fact cannot be justified by code/config evidence, omit it. If a contextual system is visible only through configured names, include it only with data.scope: context-from-config.

Inspect source code, config files, deployment manifests, bundle files, pipeline files, SQL/dashboard files, scripts, tests, and package metadata. For each node, include data.evidence with the file path(s) that justify it. For each edge, make sure it represents an actual code/config relationship: function call, config mapping, API/table/file read, API/table/file write, dataframe or payload passed to a downstream function, dashboard query, or alert query.

Use stable slug ids. Use human-readable labels. Use detail for concise explanation. Use data for structured facts such as evidence, functions, defaults, table names, schema columns, predicates, job/task keys, and scope.

Prefer multiple maps when one flat diagram would hide important layers:

1. system-data-flow: runtime entrypoints, services, APIs, stores, dashboards, alerts.
2. code-analysis-flow: functions, transformations, algorithms, intermediate frames, gates, branches.
3. parameters-outputs-alerts: tunable inputs, table schemas, dashboard queries, alert predicates, local tools.
4. deployment-runtime-flow: CI/CD, bundle resources, jobs, tasks, secrets, schedules.

Before finishing, audit the map:
- Every node has data.evidence.
- Every edge is justified by code/config.
- Parameter defaults match code/config exactly.
- Output table names and columns match writer/query code.
- External systems are not marked implemented unless code actually calls them.
- No claims are based only on docs or notes.
```
