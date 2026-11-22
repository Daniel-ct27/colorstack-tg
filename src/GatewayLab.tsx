import { useState, type FormEvent } from 'react'
import { checkGateway, gatewaySamples } from './gateway.ts'

const fields = {
  arrayKey: { target: 'Jobs list', choices: ['records', 'jobs', 'state'] },
  idKey: { target: 'id', choices: ['state', 'id', 'job_id'] },
  statusKey: { target: 'status', choices: ['state', 'status', 'job_id'] },
  waiting: { target: 'waiting', choices: ['completed', 'queued', 'cancelled'] },
  done: { target: 'done', choices: ['queued', 'cancelled', 'completed'] },
} as const

type Field = keyof typeof fields

const steps: { title: string; direction: string; keys: Field[] }[] = [
  { title: '1. Match the fields', direction: 'Pick the gateway field that supplies each dashboard target.', keys: ['arrayKey', 'idKey', 'statusKey'] },
  { title: '2. Translate the job states', direction: 'Pick the dashboard name for each gateway state.', keys: ['waiting', 'done'] },
]

export function GatewayLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [config, setConfig] = useState({ arrayKey: '', idKey: '', statusKey: '', waiting: '', done: '' })
  const [result, setResult] = useState<ReturnType<typeof checkGateway>>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const mapping = { ...config }
    for (const key of Object.keys(fields) as (keyof typeof fields)[]) mapping[key] = mapping[key].trim()
    const next = checkGateway(mapping)
    setResult(next)
    if (!solved && next.every(({ passed }) => passed)) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="gateway-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="gateway-title">Translate the gateway response.</h2>
        <p className="lab-lede">The jobs arrived, but the dashboard speaks a different language. Read the sample, connect the fields, and translate the states. Then test your adapter.</p>
        <h3 className="lab-label">What the dashboard expects</h3>
        <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{'[\n  {"id":"J-41","status":"queued"},\n  {"id":"J-42","status":"completed"}\n]'}</pre>
        <p className="mt-3 text-sm text-muted">An empty response should render an empty list.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Gateway sample</h3><span className="lab-label">Incoming JSON</span></div>
        <pre className="mt-4 whitespace-pre-wrap break-words rounded border border-line bg-navy p-3 font-mono text-sm">{JSON.stringify(gatewaySamples[0], null, 2)}</pre>
        <form className="gateway-match mt-5 grid gap-4" onSubmit={submit}>
          {steps.map(({ title, direction, keys }) => (
            <fieldset key={title}>
              <legend>{title}</legend>
              <p className="mb-2 text-sm text-muted">{direction}</p>
              {keys.map((key) => (
                <label key={key} className="gateway-pair">
                  <code>{fields[key].target}</code><span aria-hidden="true">↔</span>
                  <select value={config[key]} onChange={(event) => { setConfig({ ...config, [key]: event.target.value }); setResult(undefined) }} required>
                    <option value="">Choose a match</option>
                    {fields[key].choices.map((choice) => <option key={choice}>{choice}</option>)}
                  </select>
                </label>
              ))}
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button className="lab-primary" type="submit">Test my adapter</button>
            <span className="text-sm text-muted">{Object.values(config).filter(Boolean).length} of {Object.keys(fields).length} connected</span>
          </div>
        </form>
        <div className="mt-4 space-y-2" role="status">
          {result?.map(({ output, passed }, index) => (
            <div key={index}>
              <p className={passed ? 'lab-pass' : 'lab-fail'}><strong>{passed ? 'PASS' : 'FAIL'}</strong> · {['Mixed job states', 'Single completed job', 'Empty jobs list'][index]}</p>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-muted">{output === null ? 'No array found at the mapped field.' : JSON.stringify(output)}</pre>
            </div>
          ))}
          {result?.every(({ passed }) => passed) && <p className="lab-result">Mapping verified. The dashboard can read all three responses.</p>}
        </div>
      </div>
    </section>
  )
}
