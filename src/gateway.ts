export const gatewaySamples = [
  { jobs: [{ job_id: 'J-41', state: 'waiting' }, { job_id: 'J-42', state: 'done' }] },
  { jobs: [{ job_id: 'J-57', state: 'done' }] },
  { jobs: [] },
]

const expected = [
  [{ id: 'J-41', status: 'queued' }, { id: 'J-42', status: 'completed' }],
  [{ id: 'J-57', status: 'completed' }],
  [],
]

export function checkGateway(config: { arrayKey: string; idKey: string; statusKey: string; waiting: string; done: string }) {
  return gatewaySamples.map((sample, index) => {
    const value: unknown = Object.hasOwn(sample, config.arrayKey) ? Reflect.get(sample, config.arrayKey) : undefined
    if (!Array.isArray(value)) return { output: null, passed: false }
    const output = value.map((job) => {
      const id: unknown = Object.hasOwn(job, config.idKey) ? Reflect.get(job, config.idKey) : undefined
      const state: unknown = Object.hasOwn(job, config.statusKey) ? Reflect.get(job, config.statusKey) : undefined
      return { id: typeof id === 'string' ? id : null, status: state === 'waiting' ? config.waiting : state === 'done' ? config.done : null }
    })
    return { output, passed: JSON.stringify(output) === JSON.stringify(expected[index]) }
  })
}
