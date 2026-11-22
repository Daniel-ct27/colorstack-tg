import assert from 'node:assert/strict'
import { test } from 'node:test'
import { stageStatus } from '../src/progress.ts'

test('a new player starts with one open stage', () => {
  assert.equal(stageStatus(1, []), 'current')
  assert.equal(stageStatus(2, []), 'locked')
  assert.equal(stageStatus(10, []), 'locked')
})

test('clearing successive stages unlocks only the immediate next stage', () => {
  assert.equal(stageStatus(1, [1]), 'complete')
  assert.equal(stageStatus(2, [1]), 'current')
  assert.equal(stageStatus(3, [1]), 'locked')
  assert.equal(stageStatus(3, [1, 2]), 'current')
  assert.equal(stageStatus(4, [1, 2]), 'locked')
})

test('an existing Stage 02 solve does not bypass Stage 01', () => {
  assert.equal(stageStatus(2, [2]), 'locked')
  assert.equal(stageStatus(3, [2]), 'locked')
  assert.equal(stageStatus(2, [1, 2]), 'complete')
})
