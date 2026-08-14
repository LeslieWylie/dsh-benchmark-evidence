# dsh-benchmark-evidence

面向 DeepSeek Harness 的 benchmark 证据和完整性门禁，泛化 Harbor/Terminal-Bench 周边的运行清单、fail-closed preflight、产物清单、结果完整性、清理和错误分桶设计。

- `dsh_benchmark_manifest`：生成冻结身份清单，不启动评测。
- `dsh_benchmark_gate`：区分 clean candidate 与 incomplete/contaminated 结果。

```bash
npm install dsh-benchmark-evidence
# 或：pnpm add dsh-benchmark-evidence
```

插件不会启动 benchmark、处理凭据、上传产物或修改运行目录。
