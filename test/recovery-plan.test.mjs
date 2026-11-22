import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkSchedule } from '../src/recovery-plan.ts'
import { checkReconciliation } from '../src/reconcile.ts'

test('schedule needs capacity and prerequisites from prior rounds', () => {
  assert.equal(checkSchedule([['mount', 'audit'], ['rebuild', 'prepare'], ['archive', 'refresh']]), null)
  assert.match(checkSchedule([['mount', 'audit', 'prepare']]), /two workers/)
  assert.match(checkSchedule([['mount', 'audit'], ['rebuild', 'refresh']]), /earlier round/)
  assert.match(checkSchedule([['mount', 'audit']]), /all six/)
})

test('reconciliation preserves withdrawals and holds equal-revision conflicts', () => {
  const actions = { 'J-61': 'archive', 'J-66': 'dashboard', 'J-72': 'skip', 'J-83': 'review' }
  assert.ok(checkReconciliation(actions).every(({ passed }) => passed))
  assert.deepEqual(checkReconciliation({ ...actions, 'J-66': 'archive', 'J-83': 'archive' }).map(({ passed }) => passed), [true, false, true, false])
})
