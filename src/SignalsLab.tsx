import { useState } from 'react'
import { checkWindow, trail } from './signals.ts'

const sources = ['All services', 'Dashboard', 'Gateway', 'Scheduler']

export function SignalsLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [source, setSource] = useState('All services')
  const [query, setQuery] = useState('')
  const [pins, setPins] = useState<string[]>([])
  const [result, setResult] = useState<ReturnType<typeof checkWindow>>()
  const visible = trail.filter((record) => (source === 'All services' || record.source === source) &&
    `${record.time} ${record.run} ${record.result}`.toLowerCase().includes(query.trim().toLowerCase()))

  function toggle(id: string) {
    setPins(pins.includes(id) ? pins.filter((pin) => pin !== id) : [...pins, id])
    setResult(undefined)
  }

  function verify() {
    const next = checkWindow(pins)
    setResult(next)
    if (next.solved && !solved) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="signals-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="signals-title">Narrow the failure window.</h2>
        <p className="lab-lede">Pin the last time the showcase definitely showed a complete report and the first time it definitely showed an incomplete one.</p>
        <p className="text-sm text-muted"><strong className="text-ink">Rehearsal note</strong><br />The screenshot footer identifies showcase run <code>J-61</code>. The preview and staff test ran in the same window.</p>
        <div className="signals-pins">
          <h3 className="lab-label">Pinned evidence · {pins.length}/2</h3>
          {pins.length === 0 && <p className="mt-2 text-sm text-muted">Pin records from the timeline to compare them here.</p>}
          {trail.filter(({ id }) => pins.includes(id)).map(({ id, time, result: note }) => (
            <button type="button" className="filter mt-2 w-full text-left text-sm" key={id} onClick={() => toggle(id)} aria-label={`Unpin ${time} ${note}`}>{time} · {note} <span aria-hidden="true">×</span></button>
          ))}
          <button type="button" className="lab-primary mt-3" data-crew-action disabled={pins.length !== 2} onClick={verify}>Verify window</button>
          <p className="lab-result" role="status">{result?.feedback}</p>
        </div>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Activity timeline</h3><span className="lab-label">{visible.length} records</span></div>
        <div className="mt-3 flex flex-wrap gap-2">
          <label className="grid min-w-0 flex-1 gap-1 text-sm">Search by run ID, time, or event
            <input className="min-w-0 rounded border border-line bg-navy px-3 py-2 font-mono" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. heartbeat" />
          </label>
          <label className="grid gap-1 text-sm">Service
            <select className="rounded border border-line bg-navy px-3 py-2" value={source} onChange={(event) => setSource(event.target.value)}>
              {sources.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        </div>
        <ul className="signals-list">
          {visible.map(({ id, time, source: service, run, result: note }) => {
            const pinned = pins.includes(id)
            return (
              <li key={id}>
                <time>{time}</time>
                <div><strong>{note}</strong><small>{service} · {run}</small></div>
                <button type="button" className="filter" aria-pressed={pinned} aria-label={`${pinned ? 'Unpin' : 'Pin'} ${time} ${note}`} disabled={!pinned && pins.length === 2} onClick={() => toggle(id)}>{pinned ? 'Pinned' : 'Pin'}</button>
              </li>
            )
          })}
        </ul>
        {visible.length === 0 && <p className="mt-3 text-sm text-muted">No records match those filters.</p>}
      </div>
    </section>
  )
}
