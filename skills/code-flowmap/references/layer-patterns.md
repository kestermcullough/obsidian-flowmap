# Layer Patterns

Use multiple maps when one map becomes too dense.

## system-data-flow

Use for:

- runtime entrypoints
- services
- external APIs
- tables/files/stores
- dashboards
- alerts

Typical nodes:

- CI/CD pipeline
- deployed job
- notebook/script entrypoint
- API client
- source data
- processing pipeline
- output table
- dashboard/alert

## code-analysis-flow

Use for:

- function-level or module-level transformations
- dataframes/intermediate objects
- model or scoring logic
- gates/branches
- algorithm steps

Typical nodes:

- parameters object
- data collection function
- resampling/pivot step
- event extraction
- metrics calculation
- anomaly detection
- output payload model

## parameters-outputs-alerts

Use for:

- tunable runtime inputs
- defaults
- table schemas
- output contracts
- dashboard datasets
- alert predicates
- local tuning scripts

Typical nodes:

- parameter groups
- output table schema
- dashboard query group
- alert query group
- local harness

## deployment-runtime-flow

Use for:

- CI/CD
- secrets
- bundle resources
- job/task definitions
- schedules
- environment variables

Typical nodes:

- pipeline
- config validation
- secret sync
- bundle deploy
- scheduled job
- task entrypoint
