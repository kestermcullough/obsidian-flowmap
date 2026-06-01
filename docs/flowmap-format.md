# FlowMap YAML format

The MVP format is intentionally small, readable, and LLM-writable.

## Full example

````markdown
```flowmap
title: Churn Model Pipeline
direction: LR
height: 620

nodes:
  - id: raw-events
    label: Raw Events
    type: delta-table
    detail: |
      Source event table used for feature generation.
    links:
      catalog: https://example.com/catalog/raw-events
    data:
      owner: data-platform
      freshness: hourly

  - id: feature-job
    label: Feature Engineering Job
    type: databricks-job
    detail: |
      Builds hourly features for churn prediction.
    links:
      job: https://example.com/databricks/job/123
    data:
      owner: ml-platform
      cadence: hourly

  - id: train-model
    label: Train Churn Model
    type: notebook

  - id: registry
    label: MLflow Registry
    type: model-registry

edges:
  - from: raw-events
    to: feature-job
    label: reads
  - from: feature-job
    to: train-model
    label: trains from
  - from: train-model
    to: registry
    label: registers

layout:
  raw-events: { x: 0, y: 100 }
  feature-job: { x: 300, y: 100 }
  train-model: { x: 600, y: 100 }
  registry: { x: 900, y: 100 }
```
````

## Top-level fields

| Field | Required | Notes |
|---|---:|---|
| `title` | No | Displayed in the toolbar. |
| `direction` | No | Dagre rank direction: `LR`, `RL`, `TB`, or `BT`. Defaults to `LR`. |
| `height` | No | Canvas height in pixels. Defaults to `620`. |
| `nodes` | Yes | Array of node objects. |
| `edges` | No | Array of edge objects. |
| `groups` | No | Reserved for future use. |
| `layout` | No | Node positions. Written by Save layout. |

## Node fields

| Field | Required | Notes |
|---|---:|---|
| `id` | Yes | Stable unique identifier. Use slug-like names. |
| `label` | No | Human display label. Defaults to `id`. |
| `type` | No | Displayed above label. Examples: `databricks-job`, `delta-table`, `api`, `dashboard`. |
| `detail` | No | Markdown-ish text displayed in details panel. MVP displays as plain pre-wrapped text. |
| `links` | No | Map of label to URL. |
| `data` | No | Freeform key/value metadata. |

## Edge fields

| Field | Required | Notes |
|---|---:|---|
| `from` | Yes | Source node id. |
| `to` | Yes | Target node id. |
| `label` | No | Edge label. |
| `type` | No | Reserved for future styling/semantics. |
| `detail` | No | Reserved for edge details panel. |
| `data` | No | Freeform metadata. |

## Design rules

- The Markdown code block is the source of truth.
- Moving boxes changes only `layout`, not the process semantics.
- Semantic fields should be boring YAML, not custom punctuation-heavy DSL syntax.
- `data:` is the escape hatch for project-specific metadata.
- IDs should be stable; labels can change.
