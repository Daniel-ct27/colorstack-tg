interface RelayPolicy {
  retry: string
  identity: string
  finish: string
}

export function rehearseRelay(policy: RelayPolicy) {
  return [
    { label: 'Normal delivery commits the report', passed: policy.finish !== 'receipt', detail: policy.finish === 'receipt' ? 'Receipt arrived before the dashboard wrote the report.' : 'Commit acknowledgement arrived after the write.' },
    { label: 'A dropped publish gets retried', passed: policy.retry === 'timeout', detail: policy.retry === 'timeout' ? 'The sender tried again after waiting for the commit deadline.' : 'The report never arrived and no useful retry followed.' },
    { label: 'A lost acknowledgement never creates a second report', passed: policy.retry === 'timeout' && policy.identity === 'reuse' && policy.finish === 'commit', detail: policy.identity === 'rotate' ? 'The retry used a new delivery ID. The receiver treated it as new work.' : 'The receiver can recognize a retry only when its delivery ID stays stable.' },
  ]
}
