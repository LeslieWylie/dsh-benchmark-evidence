> **⚠️ Archived — merged into [dsh-ops-kit](https://github.com/LeslieWylie/dsh-ops-kit)**
> This repository shipped one of five skills that used to be published as five separate packages. They are now maintained together as a single bundle so nobody has to install — and the ecosystem does not have to index — the same skill five times. Please switch to `dsh-ops-kit`.
>
> **已归档 — 已合并至 [dsh-ops-kit](https://github.com/LeslieWylie/dsh-ops-kit)**
> 本仓库此前是五个独立发布包之一，其功能现已与另外四个包一起合并维护为单一 bundle，避免同一批 skill 被拆成五份重复发布、重复索引。请改用 `dsh-ops-kit`。

---

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
