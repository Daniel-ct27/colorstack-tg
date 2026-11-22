import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkGateway } from '../src/gateway.ts'

test('maps the gateway shape and state names across three responses', () => {
  const mapping = { arrayKey: 'jobs', idKey: 'job_id', statusKey: 'state', waiting: 'queued', done: 'completed' }
  assert.deepEqual(checkGateway(mapping).map(({ passed }) => passed), [true, true, true])
  assert.deepEqual(checkGateway({ ...mapping, waiting: 'completed' }).map(({ passed }) => passed), [false, true, true])
  assert.deepEqual(checkGateway({ ...mapping, arrayKey: 'records' }).map(({ passed }) => passed), [false, false, false])
})
