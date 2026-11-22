import assert from 'node:assert/strict'
import { test } from 'node:test'
import { initialLab, runCommand, runCommands } from '../src/missing-commit.ts'

test('reproduce, inspect, revert and verify the report regression', () => {
  assert.match(runCommand(initialLab, 'run report').output, /Queued jobs included: FAIL/)
  const inspection = runCommand(initialLab, ' Git   show AC2D4E1 ')
  assert.match(inspection.output, /statuses: \[completed\]/)
  const repaired = runCommand(inspection.state, 'git revert ac2d4e1')
  assert.equal(repaired.state.solved, false)
  const verified = runCommand(repaired.state, 'run report')
  assert.equal(verified.state.solved, true)
  assert.match(verified.output, /Recovery verified/)
})

test('requires cause inspection and rejects a repair that rolls back another improvement', () => {
  const repaired = runCommand(initialLab, 'git revert ac2d4e1').state
  assert.equal(runCommand(repaired, 'run report').state.solved, false)
  const inspected = runCommand(repaired, 'git show ac2d4e1').state
  const collateral = runCommand(inspected, 'git revert ee10b3a').state
  const report = runCommand(collateral, 'run report')
  assert.equal(report.state.solved, false)
  assert.match(report.output, /Title is Daily Jobs: FAIL/)
  assert.deepEqual(runCommand(report.state, 'reset').state, initialLab)
})

test('unrecognized commands do not change the sandbox', () => {
  assert.equal(runCommand(initialLab, 'git show 0000000').state, initialLab)
  assert.equal(runCommand(initialLab, 'unknown').state, initialLab)
})

test('a command batch runs top to bottom and returns output for each nonempty line', () => {
  const result = runCommands(initialLab, 'git log --oneline\r\n\r\ngit show ac2d4e1\ngit revert ac2d4e1\nrun report')
  assert.equal(result.entries.length, 4)
  assert.equal(result.entries[0].command, 'git log --oneline')
  assert.match(result.entries[3].output, /Recovery verified/)
  assert.equal(result.state.solved, true)
  assert.equal(result.verified, true)
})
