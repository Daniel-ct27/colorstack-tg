import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkExport, initialConfig } from '../src/export-debug.ts'

function results(overrides = {}) {
  return checkExport(JSON.stringify({ ...JSON.parse(initialConfig), ...overrides })).checks.map(({ passed }) => passed)
}

test('fixing the input key alone exposes the scheduled output path problem', () => {
  assert.deepEqual(results(), [false, false, true, true])
  assert.deepEqual(results({ inputKey: 'records' }), [true, false, true, true])
})

test('a full repair works for both modes and preserves the previous report on empty input', () => {
  const repair = { inputKey: 'records', outputPath: '/showcase/reports/report.json' }
  assert.deepEqual(results(repair), [true, true, true, true])
  assert.deepEqual(results({ ...repair, skipEmpty: false }), [true, true, true, false])
  assert.deepEqual(results({ inputKey: 'constructor' }), [false, false, false, true])
  assert.ok(checkExport('{bad JSON').error)
  assert.ok(checkExport('{"inputKey":3,"skipEmpty":true}').error)
})
