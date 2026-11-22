export function stageStatus(id: number, completed: readonly number[]) {
  for (let prerequisite = 1; prerequisite < id; prerequisite += 1) {
    if (!completed.includes(prerequisite)) return 'locked'
  }
  return completed.includes(id) ? 'complete' : 'current'
}
