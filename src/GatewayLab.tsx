import { useState, type FormEvent } from 'react'
import { checkGateway, gatewaySamples } from './gateway.ts'

const fields = {
  arrayKey: 'Array field in the gateway response',
  idKey: 'Job ID field',
  statusKey: 'Job state field',
  waiting: 'Dashboard status for waiting',
  done: 'Dashboard status for done',
} as const

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
        <p className="lab-lede">The gateway returned fresh jobs. The dashboard expects a different shape and vocabulary. Map the incoming fields so all three sample responses render correctly.</p>
        <h3 className="lab-label">Dashboard contract</h3>
        <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-sm">{'[\n  {"id":"J-41","status":"queued"},\n  {"id":"J-42","status":"completed"}\n]'}</pre>
        <p className="mt-3 text-sm text-muted">An empty response should render an empty list.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Gateway samples</h3></div>
        <pre className="mt-4 whitespace-pre-wrap break-words rounded border border-line bg-navy p-3 font-mono text-sm">{JSON.stringify(gatewaySamples[0], null, 2)}</pre>
        <form className="mt-5 grid gap-3" onSubmit={submit}>
          {(Object.keys(fields) as (keyof typeof fields)[]).map((key) => (
            <label key={key} className="grid gap-1 text-sm font-semibold">
              {fields[key]}
              <input className="min-w-0 rounded border border-line bg-navy px-3 py-2 font-mono" value={config[key]} onChange={(event) => { setConfig({ ...config, [key]: event.target.value }); setResult(undefined) }} required autoComplete="off" spellCheck={false} maxLength={40} />
            </label>
          ))}
          <button className="lab-primary justify-self-start" type="submit">Run mapping checks</button>
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
