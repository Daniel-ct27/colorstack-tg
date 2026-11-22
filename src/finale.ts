export const releaseActions = {
  checkpoint: 'Save the current public report',
  rebuild: 'Rebuild a staging export',
  reconcile: 'Reconcile the staging records',
  compare: 'Compare staging with the archive',
  route: 'Promote on agreement; restore checkpoint on mismatch',
  publish: 'Publish staging immediately',
  overwrite: 'Overwrite all staging records from the archive',
} as const

export type ReleaseAction = keyof typeof releaseActions

export function rehearseRelease(plan: readonly ReleaseAction[], mismatch: boolean) {
  let checkpoint = false
  let rebuilt = false
  let reconciled = false
  let verified = false
  let outcome: 'published' | 'restored' | undefined
  const trace: string[] = []
  const stop = (reason: string) => ({ passed: false, trace: [...trace, reason] })

  for (const action of plan) {
    if (outcome) return stop('The release already ended. Remove any actions after the release gate.')
    switch (action) {
      case 'checkpoint':
        if (rebuilt) return stop('The recovery had already begun when the checkpoint was taken.')
        checkpoint = true
        trace.push('Last known public report saved.')
        break
      case 'rebuild':
        if (!checkpoint) return stop('Take a checkpoint before starting recovery.')
        rebuilt = true
        trace.push('Scheduled export rebuilt in staging.')
        break
      case 'reconcile':
        if (!rebuilt) return stop('There is no staged export to reconcile yet.')
        reconciled = true
        trace.push('Newer revisions kept. Withdrawals preserved. Conflicts held.')
        break
      case 'compare':
        if (!reconciled) return stop('Validate the staged report after reconciliation.')
        verified = true
        trace.push(mismatch ? 'Comparison found an unresolved mismatch.' : 'Staged report agrees with the archive.')
        break
      case 'route':
        if (!verified) return stop('The release gate needs a validation result.')
        outcome = mismatch ? 'restored' : 'published'
        trace.push(mismatch ? 'Checkpoint restored. The public dashboard is unchanged.' : 'Verified report promoted. The showcase is ready.')
        break
      case 'publish':
        return stop('An unconditional publish can release mismatched data.')
      case 'overwrite':
        return stop('A blanket overwrite can resurrect withdrawn jobs.')
    }
  }

  return outcome ? { passed: true, trace } : stop('The plan ended before the release gate.')
}
