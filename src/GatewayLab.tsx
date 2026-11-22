import { useState, type FormEvent } from 'react'
import { checkGateway, gatewaySamples } from './gateway.ts'

const fields = {
  arrayKey: { target: 'Live list', choices: ['jobs', 'records'] },
  idKey: { target: 'Dashboard ID', choices: ['request', 'ticket'] },
  statusKey: { target: 'Work status', choices: ['phase', 'receipt'] },
  k2: { target: 'K2', choices: ['completed', 'queued'] },
  q7: { target: 'Q7', choices: ['completed', 'queued'] },
} as const

const captures = ['First sync', 'After retry', 'After closeout'] as const

type Field = keyof typeof fields

const steps: { title: string; direction: string; keys: Field[] }[] = [
  { title: '1. Match the fields', direction: 'Use the retry and closeout captures to identify which fields the dashboard should trust.', keys: ['arrayKey', 'idKey', 'statusKey'] },
  { title: '2. Translate the job states', direction: 'Pick the dashboard name for each gateway state.', keys: ['k2', 'q7'] },
]

export function GatewayLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [config, setConfig] = useState({ arrayKey: '', idKey: '', statusKey: '', k2: '', q7: '' })
  const [evidence, setEvidence] = useState<(typeof captures)[number] | 'Dispatch notes'>('First sync')
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
        <h2 id="gateway-title">Recover the live queue.</h2>
        <p className="lab-lede">The dashboard looked right at first, then a retry scrambled the case IDs and work states. Compare the three gateway captures with the dispatch notes before you wire the adapter.</p>
        <p className="mt-3 text-sm text-muted">Keep the original dispatch ID, show the actual job status, and clear the board when the live queue is empty.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Evidence desk</h3></div>
        <div className="timeline-events" role="group" aria-label="Choose evidence">
          {([...captures, 'Dispatch notes'] as const).map((name) => (
            <button className="filter" type="button" key={name} aria-pressed={evidence === name} onClick={() => setEvidence(name)}>{name}</button>
          ))}
        </div>
        {evidence === 'Dispatch notes' ? (
          <ol className="mt-4 space-y-2 rounded border border-line bg-navy p-3 text-sm">
            <li><strong>09:10 · First sync.</strong> Dispatch case D-41 is waiting for overnight review.</li>
            <li><strong>09:18 · After retry.</strong> Dispatch confirmed D-41 finished. D-52 just joined the queue. The retry generated fresh request IDs.</li>
            <li><strong>09:26 · After closeout.</strong> Both cases left the live queue. The gateway still has a receipt for D-52.</li>
          </ol>
        ) : (
          <pre className="mt-4 whitespace-pre-wrap break-words rounded border border-line bg-navy p-3 font-mono text-sm">{JSON.stringify(gatewaySamples[captures.indexOf(evidence)], null, 2)}</pre>
        )}
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
              <p className={passed ? 'lab-pass' : 'lab-fail'}><strong>{passed ? 'PASS' : 'FAIL'}</strong> · {captures[index]}</p>
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-muted">{output === null ? 'No array found at the mapped field.' : JSON.stringify(output)}</pre>
            </div>
          ))}
          {result?.every(({ passed }) => passed) && <p className="lab-result">Mapping verified. The dashboard can read all three responses.</p>}
        </div>
      </div>
    </section>
  )
}
