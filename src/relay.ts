interface RelayPolicy {
  retry: string
  identity: string
  finish: string
}

const scenarios = [
  { label: 'Normal delivery commits the report', drop: 'none' },
  { label: 'A dropped publish gets retried', drop: 'publish' },
  { label: 'A lost acknowledgement never creates a second report', drop: 'commit' },
] as const

export function rehearseRelay(policy: RelayPolicy) {
  return scenarios.map(({ label, drop }) => {
    const written = new Set<string>()
    const trace: string[] = []
    let confirmed = false
    let premature = false

    function send(id: string, attempt: number) {
      trace.push(`PUBLISH ${id}`)
      if (attempt === 1 && drop === 'publish') {
        trace.push('Publish lost in transit.')
        return
      }

      trace.push(`RECEIVED ${id}`)
      if (policy.finish === 'receipt' && !written.has(id)) premature = true
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
    if (retry) {
      trace.push(policy.retry === 'timeout' ? 'Commit deadline expired.' : 'Retry triggered by receipt.')
      send(policy.identity === 'reuse' ? 'R-61' : 'R-62', 2)
    }

    if (premature) trace.push('Sender marked the report delivered before the database write.')
    trace.push(`${written.size} report writes · ${confirmed ? 'delivery confirmed' : 'delivery unconfirmed'}`)
    return { label, passed: confirmed && !premature && written.size === 1 && (drop !== 'none' || !retry), detail: trace.join('\n') }
  })
}
