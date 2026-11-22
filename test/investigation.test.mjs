import assert from 'node:assert/strict'
import { test } from 'node:test'
import { rehearseRelay } from '../src/relay.ts'
import { decodeLayer, restartNote, sealedNote } from '../src/encoding.ts'

test('relay recovery handles missing data and an acknowledgement lost after a write', () => {
  const policy = { retry: 'timeout', identity: 'reuse', finish: 'commit' }
  assert.ok(rehearseRelay(policy).every(({ passed }) => passed))
  assert.deepEqual(rehearseRelay({ ...policy, identity: 'rotate' }).map(({ passed }) => passed), [true, true, false])
  assert.equal(rehearseRelay({ ...policy, finish: 'receipt' })[0].passed, false)
})

test('the archive note must be decoded from the outer format inward', () => {
  const hex = decodeLayer(sealedNote, 'hex')
  const base64 = decodeLayer(hex, 'base64')
  assert.notEqual(base64, restartNote)
  assert.equal(decodeLayer(base64, 'reverse'), restartNote)
  assert.throws(() => decodeLayer(base64, 'hex'))
})
