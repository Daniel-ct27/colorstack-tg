interface RelayPolicy {
  retry: string
  identity: string
  finish: string
  timeoutTicks: string
}

const scenarios = [
  { label: 'Normal delivery commits the report', drop: 'none' },
  { label: 'A dropped publish gets retried', drop: 'publish' },
  { label: 'A lost acknowledgement never creates a second report', drop: 'commit' },
  { label: 'A healthy slow write does not get a needless retry', drop: 'slow' },
] as const

export function rehearseRelay(policy: RelayPolicy) {
  return scenarios.map(({ label, drop }) => {
    const written = new Set<string>()
    const trace: string[] = []
    let confirmed = false
    let premature = false
    const deadline = Number(policy.timeoutTicks)
    const prematureRetry = drop === 'slow' && policy.retry === 'timeout' && policy.finish === 'commit' && deadline < 3

    function send(id: string, attempt: number) {
      trace.push(`PUBLISH ${id}`)
      if (attempt === 1 && drop === 'publish') {
        trace.push('Publish lost in transit.')
        return
      }

      trace.push(`RECEIVED ${id}`)
      if (policy.finish === 'receipt' && !written.has(id)) premature = true
      if (attempt === 1 && drop === 'slow') {
        trace.push('The database needs three ticks for this healthy write.')
        if (prematureRetry) trace.push(`Tick ${deadline}: retry requested while the first write is still running.`)
      }
      trace.push(written.has(id) ? 'Existing delivery recognized.' : 'Dashboard wrote the report.')
      written.add(id)

      if (policy.finish === 'receipt') confirmed = true
      if (attempt === 1 && drop === 'commit') {
        trace.push('Commit acknowledgement lost.')
        return
      }
      trace.push(`COMMITTED ${id}`)
      if (policy.finish === 'commit') confirmed = true
    }

    send('R-61', 1)
    const retry = (policy.retry === 'timeout' && !confirmed) || (policy.retry === 'receipt' && drop !== 'publish')
    const tooLate = retry && policy.retry === 'timeout' && deadline > 5
    if (tooLate) trace.push(`Tick ${deadline}: the replay cutoff already passed.`)
    if (retry && !tooLate) {
      trace.push(policy.retry === 'timeout' ? 'Commit deadline expired.' : 'Retry triggered by receipt.')
      send(policy.identity === 'reuse' ? 'R-61' : 'R-62', 2)
    }

    if (premature) trace.push('Sender marked the report delivered before the database write.')
    trace.push(`${written.size} report writes · ${confirmed ? 'delivery confirmed' : 'delivery unconfirmed'}`)
    return { label, passed: confirmed && !premature && !prematureRetry && !tooLate && written.size === 1 && (drop !== 'none' || !retry), detail: trace.join('\n') }
  })
}
