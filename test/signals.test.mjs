import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkHandoff, checkWindow, trail } from '../src/signals.ts'

test('requires the last complete and first incomplete showcase views, regardless of pin order', () => {
  assert.equal(checkWindow(['e11', 'e07']).solved, true)
  assert.equal(checkWindow(['e02', 'e11']).solved, false)
  assert.equal(checkWindow(['e07', 'e13']).solved, false)
  assert.equal(checkWindow(['e07', 'e07']).solved, false)
  assert.equal(checkWindow(['e07']).solved, false)
})

test('distinguishes another run from a record that does not show viewer output', () => {
  assert.match(checkWindow(['e07', 'e04']).feedback, /different run/)
  assert.match(checkWindow(['e07', 'e09']).feedback, /what viewers saw/)
  assert.equal(new Set(trail.map(({ id }) => id)).size, trail.length)
})

test('handoff evidence must match both the showcase run and dashboard route', () => {
  assert.equal(checkHandoff('e09').solved, true)
  assert.match(checkHandoff('e15').feedback, /wrong delivery/)
  assert.match(checkHandoff('e16').feedback, /different run/)
  assert.match(checkHandoff('e10').feedback, /gateway record/)
})
