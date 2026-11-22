import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkGateway } from '../src/gateway.ts'

const mapping = { arrayKey: 'jobs', idKey: 'ticket', statusKey: 'phase', k2: 'queued', q7: 'completed' }
const passes = (config) => checkGateway(config).map(({ passed }) => passed)

test('an adapter matching dispatch evidence passes the initial sync, retry, and closeout', () => {
  assert.deepEqual(passes(mapping), [true, true, true])
})

test('plausible mappings survive the first sync but fail on later evidence', () => {
  assert.deepEqual(passes({ ...mapping, arrayKey: 'records' }), [true, false, false])
  assert.deepEqual(passes({ ...mapping, idKey: 'request' }), [true, false, true])
  assert.deepEqual(passes({ ...mapping, statusKey: 'receipt' }), [true, false, true])
  assert.deepEqual(passes({ ...mapping, q7: 'queued' }), [true, false, true])
})
