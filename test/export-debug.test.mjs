import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkExport, initialConfig } from '../src/export-debug.ts'

test('the original input key breaks only the scheduled run', () => {
  assert.deepEqual(checkExport(initialConfig).checks.map(({ passed }) => passed), [false, true, true])
})

test('the repair works for both run modes and preserves the previous report on empty input', () => {
  assert.deepEqual(checkExport('{"inputKey":"records","skipEmpty":true}').checks.map(({ passed }) => passed), [true, true, true])
  assert.deepEqual(checkExport('{"inputKey":"records","skipEmpty":false}').checks.map(({ passed }) => passed), [true, true, false])
  assert.ok(checkExport('{bad JSON').error)
  assert.ok(checkExport('{"inputKey":3,"skipEmpty":true}').error)
})
