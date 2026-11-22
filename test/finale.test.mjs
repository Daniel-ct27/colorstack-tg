import assert from 'node:assert/strict'
import { test } from 'node:test'
import { rehearseRelease } from '../src/finale.ts'

const plan = ['checkpoint', 'rebuild', 'reconcile', 'compare', 'route']

test('the same plan publishes verified data and restores when validation fails', () => {
  const success = rehearseRelease(plan, false)
  const failedCheck = rehearseRelease(plan, true)
  assert.equal(success.passed, true)
  assert.equal(failedCheck.passed, true)
  assert.match(success.trace.at(-1), /promoted/)
  assert.match(failedCheck.trace.at(-1), /restored/)
})

test('unsafe release steps and invalid ordering fail with a trace', () => {
  assert.match(rehearseRelease(['rebuild'], false).trace.at(-1), /checkpoint/)
  assert.match(rehearseRelease(['checkpoint', 'rebuild', 'compare'], false).trace.at(-1), /reconciliation/)
  assert.equal(rehearseRelease([...plan.slice(0, -1), 'publish'], true).passed, false)
  assert.equal(rehearseRelease(['checkpoint', 'rebuild', 'overwrite'], false).passed, false)
})
