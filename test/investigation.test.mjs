import assert from 'node:assert/strict'
import { test } from 'node:test'
import { rehearseRelay } from '../src/relay.ts'
import { archiveCopies, decodeLayer, identifyArchive, restartNote, sealedNote } from '../src/encoding.ts'

test('relay recovery handles missing data and an acknowledgement lost after a write', () => {
  const policy = { retry: 'timeout', identity: 'reuse', finish: 'commit', timeoutTicks: '4' }
  assert.ok(rehearseRelay(policy).every(({ passed }) => passed))
  assert.deepEqual(rehearseRelay({ ...policy, identity: 'rotate' }).map(({ passed }) => passed), [true, true, false, true])
  assert.equal(rehearseRelay({ ...policy, finish: 'receipt' })[0].passed, false)
})

test('the archive note must be decoded from the outer format inward', () => {
  const hex = decodeLayer(sealedNote, 'hex')
  const base64 = decodeLayer(hex, 'base64')
  assert.notEqual(base64, restartNote)
  assert.equal(decodeLayer(base64, 'reverse'), restartNote)
  assert.throws(() => decodeLayer(base64, 'hex'))
})

test('a short deadline retries a healthy write and a long one misses the recovery window', () => {
  const policy = { retry: 'timeout', identity: 'reuse', finish: 'commit' }
  assert.match(rehearseRelay({ ...policy, timeoutTicks: '2' })[3].detail, /still running/)
  assert.equal(rehearseRelay({ ...policy, timeoutTicks: '2' })[3].passed, false)
  assert.match(rehearseRelay({ ...policy, timeoutTicks: '8' })[1].detail, /cutoff/)
  assert.equal(rehearseRelay({ ...policy, timeoutTicks: '8' })[1].passed, false)
})

test('a plausible alternate note decodes but cannot be sent under the incident tag', () => {
  const amber = decodeLayer(decodeLayer(decodeLayer(archiveCopies.amber, 'hex'), 'url'), 'reverse')
  const blue = decodeLayer(decodeLayer(decodeLayer(archiveCopies.blue, 'hex'), 'base64'), 'reverse')
  const values = { amber, blue }
  assert.equal(identifyArchive(values, ['blue'], 'blue').passed, false)
  assert.equal(identifyArchive(values, ['amber', 'blue'], 'amber').passed, false)
  assert.equal(identifyArchive(values, ['amber', 'blue'], 'blue').passed, true)
})
