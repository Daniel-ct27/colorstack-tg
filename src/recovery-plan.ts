export const jobs = {
  mount: { title: 'Mount the snapshot', needs: [] },
  audit: { title: 'Audit the manifest', needs: [] },
  rebuild: { title: 'Rebuild the export', needs: ['mount', 'audit'] },
  prepare: { title: 'Prepare dashboard cache', needs: ['audit'] },
  refresh: { title: 'Refresh the dashboard', needs: ['rebuild', 'prepare'] },
  archive: { title: 'Archive the rebuilt report', needs: ['rebuild'] },
} as const

export type Job = keyof typeof jobs

export function checkSchedule(rounds: readonly (readonly Job[])[]) {
  const finished = new Set<Job>()
  for (const [index, round] of rounds.entries()) {
    if (round.length > 2) return `Round ${index + 1} has only two workers.`
    for (const job of round) {
      const missing = jobs[job].needs.find((prerequisite) => !finished.has(prerequisite))
      if (missing) return `Round ${index + 1}: ${jobs[job].title} needs “${jobs[missing].title}” to finish in an earlier round.`
    }
    for (const job of round) {
      if (finished.has(job)) return `${jobs[job].title} is scheduled twice.`
      finished.add(job)
    }
  }
  return finished.size === Object.keys(jobs).length ? null : 'Place all six jobs before you run the schedule.'
}
