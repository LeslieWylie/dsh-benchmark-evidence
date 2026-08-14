# dsh-benchmark-evidence

Benchmark evidence and integrity gates for DeepSeek Harness. It generalizes the run-manifest, fail-closed preflight, artifact inventory, result-integrity, cleanup, and error-bucketing practices used around Harbor and Terminal-Bench.

Tools:

- `dsh_benchmark_manifest`: create a frozen identity manifest without starting a run.
- `dsh_benchmark_gate`: distinguish a clean score candidate from incomplete or contaminated results.

```bash
npm install dsh-benchmark-evidence
# or: pnpm add dsh-benchmark-evidence
```

Completed is not treated as scored automatically. The package never starts a benchmark, handles credentials, uploads artifacts, or mutates a run directory.

```bash
npm run build && npm run typecheck && npm test && npm pack --dry-run
```
