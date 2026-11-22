import { useState } from 'react'
import { checkReconciliation, pairs } from './reconcile.ts'

const destinations = [
  ['archive', 'Send archive copy to dashboard'],
  ['dashboard', 'Send dashboard copy to archive'],
  ['skip', 'Leave both in place'],
  ['review', 'Send to review desk'],
] as const

export function ReconcileLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [actions, setActions] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState(0)
  const [results, setResults] = useState<ReturnType<typeof checkReconciliation>>()
  const { id, archive, dashboard } = pairs[selected]
  const result = results?.[selected]

  function route(value: string) {
    setActions({ ...actions, [id]: value })
    setResults(undefined)
  }

  function replay() {
    const next = checkReconciliation(actions)
    setResults(next)
    const firstFailed = next.findIndex(({ passed }) => !passed)
    if (firstFailed >= 0) setSelected(firstFailed)
    else if (!solved) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="reconcile-title">
      <div className="lab-brief">
        <p className="eyebrow">Distributed state</p>
        <h2 id="reconcile-title">Clear the reconciliation desk.</h2>
        <p className="lab-lede">Four job tickets are waiting for a decision. Compare both copies before you send each ticket on its way.</p>
        <details className="lab-hint" open><summary>Desk policy</summary><p>A higher revision replaces a lower one, even if it withdraws the job. Conflicting states at the same revision go to review. Identical copies stay where they are.</p></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Reconciliation desk</h3><span className="lab-label">{Object.keys(actions).length}/{pairs.length} routed</span></div>
        <div className="reconcile-queue" role="group" aria-label="Job tickets">
          {pairs.map(({ id: ticket }, index) => <button type="button" className="filter" aria-pressed={selected === index} key={ticket} data-routed={Boolean(actions[ticket])} onClick={() => setSelected(index)}>{ticket}{actions[ticket] ? ' ✓' : ''}</button>)}
        </div>
        <section className="reconcile-card" aria-label={`Compare copies of ${id}`}>
          <div className="reconcile-copies">
            <div><small>Archive · r{archive[0]}</small><strong>{archive[1]}</strong></div>
            <div><small>Dashboard · r{dashboard[0]}</small><strong>{dashboard[1]}</strong></div>
          </div>
          <div className="decision-tiles" role="group" aria-label={`Route ${id}`}>
            {destinations.map(([value, label]) => <button key={value} type="button" className="decision-tile" aria-pressed={actions[id] === value} onClick={() => route(value)}>{label}</button>)}
          </div>
          {result && <p className={result.passed ? 'lab-pass mt-2' : 'lab-fail mt-2'}>{result.passed ? 'This ticket is routed correctly.' : result.feedback}</p>}
        </section>
        <button type="button" className="lab-primary" disabled={Object.keys(actions).length !== pairs.length} onClick={replay}>Rehearse the handoff</button>
        <p className="lab-result" role="status">{results ? `${results.filter(({ passed }) => passed).length} of ${pairs.length} tickets routed safely.` : ''}</p>
      </div>
    </section>
  )
}
