import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chapters, missions, missionsForChapter } from '../src/missions.ts'

test('all ten stages appear in order with titles and briefings', () => {
  assert.deepEqual(missionsForChapter('All').map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assert.equal(new Set(missions.map(({ title }) => title)).size, 10)
  assert.ok(missions.every(({ title, focus, briefing }) => title && focus && briefing))
})

test('the three filters preserve stage membership and order', () => {
  assert.deepEqual(
    chapters.map((chapter) => missionsForChapter(chapter).map(({ id }) => id)),
    [[1, 2, 3], [4, 5, 6, 7], [8, 9, 10]],
  )
})
