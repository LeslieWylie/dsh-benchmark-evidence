import assert from 'node:assert/strict'
import test from 'node:test'
import { apply } from '../src/index.ts'

function fakeContext() {
  const tools: Array<{ definition: { name: string; execute: (args: Record<string, unknown>) => Promise<unknown> | unknown } }> = []
  return { tools: { register(definition: typeof tools[number]['definition']) { tools.push({ definition }) } }, skills: { register() {} }, registered: tools }
}

test('registers manifest and integrity gate tools', () => {
  const context = fakeContext(); apply(context as never)
  assert.deepEqual(context.registered.map(x => x.definition.name), ['dsh_benchmark_manifest', 'dsh_benchmark_gate'])
})

test('manifest freezes identity fields without running a benchmark', async () => {
  const context = fakeContext(); apply(context as never)
  const value = await context.registered[0]!.definition.execute({ benchmark: 'example@1', model: 'openai/example', source_commit: 'abc123', runtime: 'docker', jobs_dir: 'runs/example' }) as Record<string, unknown>
  assert.equal(value.schema_version, 'benchmark-manifest.v1'); assert.deepEqual(value.non_goals, ['no score claim without artifact and result-integrity checks', 'no secret values in manifest'])
})

test('gate rejects errored or incomplete results', async () => {
  const context = fakeContext(); apply(context as never)
  const value = await context.registered[1]!.definition.execute({ total: 10, completed: 9, scored: 8, errored: 1, pending: 1, timeout: 0 }) as Record<string, unknown>
  assert.equal(value.integrity_status, 'contaminated_or_incomplete'); assert.ok((value.blockers as unknown[]).length >= 3)
})
