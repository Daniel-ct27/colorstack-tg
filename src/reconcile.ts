type Copy = readonly [revision: number, state: string]
interface Ticket { id: string; archive: Copy; dashboard: Copy }

export const pairs: readonly Ticket[] = [
  { id: 'J-61', archive: [12, 'ready'], dashboard: [9, 'queued'] },
  { id: 'J-66', archive: [10, 'ready'], dashboard: [13, 'withdrawn'] },
  { id: 'J-72', archive: [14, 'queued'], dashboard: [14, 'queued'] },
  { id: 'J-83', archive: [15, 'ready'], dashboard: [15, 'queued'] },
]

export const lateUpdates: readonly Ticket[] = [
  { id: 'J-61', archive: [12, 'ready'], dashboard: [16, 'withdrawn'] },
  { id: 'J-83', archive: [17, 'ready'], dashboard: [15, 'queued'] },
]

export function reconcilePreview(ticket: Ticket, action?: string) {
  const { archive, dashboard } = ticket
  if (action === 'archive') return { archive, dashboard: archive }
  if (action === 'dashboard') return { archive: dashboard, dashboard }
  return { archive, dashboard }
}

export function checkReconciliation(actions: Record<string, string>, tickets = pairs) {
  return tickets.map(({ id, archive, dashboard }) => {
    const same = archive[0] === dashboard[0] && archive[1] === dashboard[1]
    const expected = same ? 'skip' : archive[0] === dashboard[0] ? 'review' : archive[0] > dashboard[0] ? 'archive' : 'dashboard'
    const feedback = same ? 'Both copies already agree. Rewriting them would create a needless update.' :
      archive[0] === dashboard[0] ? 'The same revision has two different states. Hold it for review before publishing.' :
      'Copy the higher revision to the stale side. A withdrawal is an update too.'
    return { id, passed: actions[id] === expected, feedback }
  })
}
