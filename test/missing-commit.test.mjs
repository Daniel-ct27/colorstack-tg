import assert from 'node:assert/strict'
import { test } from 'node:test'
import { matchesCommit, repositoryHistory } from '../src/missing-commit.ts'

test('only the commit that changed the status filter solves the practice challenge', () => {
  assert.deepEqual(repositoryHistory.filter(({ hash }) => matchesCommit(hash)).map(({ hash }) => hash), ['ac2d4e1'])
  assert.equal(matchesCommit('  AC2D4E1 '), true)
  assert.equal(matchesCommit('ac2d4e'), false)
  assert.equal(matchesCommit(''), false)
})
