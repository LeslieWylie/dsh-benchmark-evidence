import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineTool } from '@deepseek-ai/dsh-tools';
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_PATH = 'skills/benchmark-evidence/SKILL.md';
const SKILL = {
    name: 'benchmark-evidence',
    description: 'Portable benchmark manifest, precheck, artifact, and result-integrity rules.',
    whenToUse: 'Load before running or interpreting a benchmark.',
    source: 'dsh-benchmark-evidence',
    path: join(PACKAGE_ROOT, SKILL_PATH),
    content: readFileSync(join(PACKAGE_ROOT, SKILL_PATH), 'utf8'),
    invocation: { modelInvocable: true, userInvocable: true },
};
const asJson = (value) => value;
const text = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const integer = (value) => Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
export function apply(ctx) {
    ctx.skills.register(SKILL);
    ctx.tools.register(defineTool({
        name: 'dsh_benchmark_manifest',
        description: 'Create a machine-readable benchmark run manifest. It only returns data and does not start a run.',
        parameters: {
            benchmark: { type: 'string', required: true }, model: { type: 'string', required: true }, source_commit: { type: 'string', required: true },
            runtime: { type: 'string', required: true }, jobs_dir: { type: 'string', required: true }, cohort: { type: 'string' },
        },
        output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }] },
        execute: args => Promise.resolve(asJson({
            schema_version: 'benchmark-manifest.v1', benchmark: text(args.benchmark), model: text(args.model), source_commit: text(args.source_commit, 200),
            runtime: text(args.runtime), jobs_dir: text(args.jobs_dir, 1000), cohort: text(args.cohort) || null, created_at: new Date().toISOString(),
            freeze_required: ['benchmark_revision', 'model_revision', 'agent', 'harness', 'provider', 'concurrency', 'timeout', 'context_window'],
            non_goals: ['no score claim without artifact and result-integrity checks', 'no secret values in manifest'],
        })),
    }));
    ctx.tools.register(defineTool({
        name: 'dsh_benchmark_gate',
        description: 'Classify benchmark result integrity from counts; completed is not treated as scored automatically.',
        parameters: {
            total: { type: 'integer', required: true }, completed: { type: 'integer', required: true }, scored: { type: 'integer', required: true },
            errored: { type: 'integer', required: true }, pending: { type: 'integer', required: true }, timeout: { type: 'integer' },
        },
        output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }] },
        execute: args => {
            const counts = { total: integer(args.total), completed: integer(args.completed), scored: integer(args.scored), errored: integer(args.errored), pending: integer(args.pending), timeout: integer(args.timeout) };
            const blockers = [];
            if (counts.completed !== counts.total)
                blockers.push('completed does not equal total');
            if (counts.errored > 0)
                blockers.push('errored tasks present');
            if (counts.pending > 0)
                blockers.push('pending tasks present');
            if (counts.timeout > 0)
                blockers.push('timeouts present');
            if (counts.scored !== counts.total)
                blockers.push('scored denominator differs from total');
            const status = blockers.length ? 'contaminated_or_incomplete' : 'clean_candidate';
            return Promise.resolve(asJson({ ok: true, integrity_status: status, counts, blockers, score_interpretation: status === 'clean_candidate' ? 'candidate for comparison after artifact audit' : 'do not rank or derive training direction' }));
        },
    }));
}
//# sourceMappingURL=index.js.map