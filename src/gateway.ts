export const gatewaySamples = [
  {
    jobs: [{ ticket: 'D-41', request: 'D-41', phase: 'K2', receipt: 'K2' }],
    records: [{ ticket: 'D-41', request: 'D-41', phase: 'K2', receipt: 'K2' }],
  },
  {
    jobs: [
      { ticket: 'D-41', request: 'R-82', phase: 'Q7', receipt: 'K2' },
      { ticket: 'D-52', request: 'R-83', phase: 'K2', receipt: 'Q7' },
    ],
    records: [{ ticket: 'D-41', request: 'R-82', phase: 'K2', receipt: 'K2' }],
  },
  {
    jobs: [],
    records: [{ ticket: 'D-52', request: 'R-83', phase: 'K2', receipt: 'Q7' }],
  },
]

const expected = [
  [{ id: 'D-41', status: 'queued' }],
  [{ id: 'D-41', status: 'completed' }, { id: 'D-52', status: 'queued' }],
  [],
]

export function checkGateway(config: { arrayKey: string; idKey: string; statusKey: string; k2: string; q7: string }) {
  return gatewaySamples.map((sample, index) => {
    const value: unknown = Object.hasOwn(sample, config.arrayKey) ? Reflect.get(sample, config.arrayKey) : undefined
    if (!Array.isArray(value)) return { output: null, passed: false }
    const output = value.map((job) => {
      const id: unknown = Object.hasOwn(job, config.idKey) ? Reflect.get(job, config.idKey) : undefined
      const state: unknown = Object.hasOwn(job, config.statusKey) ? Reflect.get(job, config.statusKey) : undefined
      return { id: typeof id === 'string' ? id : null, status: state === 'K2' ? config.k2 : state === 'Q7' ? config.q7 : null }
    })
    return { output, passed: JSON.stringify(output) === JSON.stringify(expected[index]) }
  })
}
