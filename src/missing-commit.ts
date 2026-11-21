export const repositoryHistory = [
  { hash: 'ee10b3a', summary: 'Update report heading', change: 'Renamed “Daily Activity” to “Daily Jobs”.' },
  { hash: 'ac2d4e1', summary: 'Apply the default report filter', change: 'Set the default status filter from “all” to “completed”.' },
  { hash: '7f01da9', summary: 'Sort rows by date', change: 'Changed the row order from oldest first to newest first.' },
] as const

export function matchesCommit(answer: string) {
  return answer.trim().toLowerCase() === 'ac2d4e1'
}
