# Churn Model Pipeline

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
    data:
      owner: ml-platform

  - id: registry
    label: MLflow Registry
    type: model-registry

  - id: batch-inference
    label: Batch Inference
    type: databricks-job
    data:
      cadence: daily
      sla: 07:00

  - id: dashboard
    label: Retention Dashboard
    type: dashboard

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
  - from: registry
    to: batch-inference
    label: loads model
  - from: feature-job
    to: batch-inference
    label: supplies features
  - from: batch-inference
    to: dashboard
    label: publishes scores
```
