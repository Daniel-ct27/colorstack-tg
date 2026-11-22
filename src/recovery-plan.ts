export const jobs = {
  mount: { title: 'Mount the snapshot', needs: [] },
  audit: { title: 'Audit the manifest', needs: [] },
  rebuild: { title: 'Rebuild the export', needs: ['mount', 'audit'] },
  prepare: { title: 'Prepare dashboard cache', needs: ['audit'] },
  refresh: { title: 'Refresh the dashboard', needs: ['rebuild', 'prepare'] },
  archive: { title: 'Archive the rebuilt report', needs: ['rebuild'] },
} as const

export type Job = keyof typeof jobs

export function checkRound(round: readonly Job[], finished: ReadonlySet<Job>, number: number) {
  if (round.length > 2) return `Round ${number} has only two workers.`
  if (number > 3) return 'The recovery window lasts three rounds.'
  const scheduled = new Set<Job>()
  for (const job of round) {
    if (finished.has(job) || scheduled.has(job)) return `${jobs[job].title} is scheduled twice.`
    const missing = jobs[job].needs.find((prerequisite) => !finished.has(prerequisite))
    if (missing) return `Round ${number}: ${jobs[job].title} needs “${jobs[missing].title}” to finish in an earlier round.`
    scheduled.add(job)
  }
  return null
}

export function checkSchedule(rounds: readonly (readonly Job[])[]) {
  const finished = new Set<Job>()
  for (const [index, round] of rounds.entries()) {
    const blocker = checkRound(round, finished, index + 1)
    if (blocker) return blocker
    for (const job of round) finished.add(job)
  }
  return finished.size === Object.keys(jobs).length ? null : 'Place all six jobs before you run the schedule.'
}
