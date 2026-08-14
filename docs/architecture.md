# Architecture

`dsh-benchmark-evidence` separates benchmark identity from execution and scoring.

- `dsh_benchmark_manifest` freezes the benchmark, task set, model/provider label, revision, concurrency, timeout, and context-window identity.
- `dsh_benchmark_gate` applies fail-closed checks to result counts and denominator consistency.
- The skill describes artifact inventories, error buckets, cleanup, and the rule that completion alone is not a score claim.
- Execution remains in Harbor, Terminal-Bench, or another runner; this package only produces portable evidence contracts.

No provider credentials, task inputs, private logs, or benchmark results are bundled.
