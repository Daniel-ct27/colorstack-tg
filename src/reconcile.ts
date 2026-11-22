export const pairs = [
  { id: 'J-61', archive: [12, 'ready'], dashboard: [9, 'queued'] },
  { id: 'J-66', archive: [10, 'ready'], dashboard: [13, 'withdrawn'] },
  { id: 'J-72', archive: [14, 'queued'], dashboard: [14, 'queued'] },
  { id: 'J-83', archive: [15, 'ready'], dashboard: [15, 'queued'] },
] as const

export function checkReconciliation(actions: Record<string, string>) {
  return pairs.map(({ id, archive, dashboard }) => {
    const same = archive[0] === dashboard[0] && archive[1] === dashboard[1]
    const expected = same ? 'skip' : archive[0] === dashboard[0] ? 'review' : archive[0] > dashboard[0] ? 'archive' : 'dashboard'
    const feedback = same ? 'Both copies already agree. Rewriting them would create a needless update.' :
      archive[0] === dashboard[0] ? 'The same revision has two different states. Hold it for review before publishing.' :
      'Copy the higher revision to the stale side. A withdrawal is an update too.'
    return { id, passed: actions[id] === expected, feedback }
  })
}
