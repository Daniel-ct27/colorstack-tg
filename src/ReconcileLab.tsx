import { useState } from 'react'
import { checkReconciliation, lateUpdates, pairs, reconcilePreview } from './reconcile.ts'

const destinations = [
  ['archive', 'Send archive copy to dashboard'],
  ['dashboard', 'Send dashboard copy to archive'],
  ['skip', 'Leave both in place'],
  ['review', 'Send to review desk'],
] as const

export function ReconcileLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [actions, setActions] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState(0)
  const [phase, setPhase] = useState<'initial' | 'incoming' | 'late' | 'complete'>('initial')
  const [results, setResults] = useState<ReturnType<typeof checkReconciliation>>()
  const tickets = phase === 'late' || phase === 'complete'
    ? pairs.map((ticket) => lateUpdates.find(({ id }) => id === ticket.id) ?? ticket)
    : pairs
  const ticket = tickets[selected]
  const { id, archive, dashboard } = ticket
  const decision = actions[id]
  const preview = reconcilePreview(ticket, decision)
  const result = results?.[selected]
  const stable = phase === 'incoming' || phase === 'complete'

  function route(value: string) {
    setActions({ ...actions, [id]: value })
    setResults(undefined)
  }

  function replay() {
    const next = checkReconciliation(actions, tickets)
    setResults(next)
    const firstFailed = next.findIndex(({ passed }) => !passed)
    if (firstFailed >= 0) {
      setSelected(firstFailed)
    } else if (phase === 'initial') {
      setPhase('incoming')
    } else {
      setPhase('complete')
      if (!solved) onSolve()
    }
  }

  function loadUpdates() {
    setActions(Object.fromEntries(Object.entries(actions).filter(([key]) => !lateUpdates.some(({ id: changed }) => changed === key))))
    setResults(undefined)
    setSelected(0)
    setPhase('late')
  }

  return (
    <section className="lab-workbench" aria-labelledby="reconcile-title">
      <div className="lab-brief">
        <p className="eyebrow">Distributed state</p>
        <h2 id="reconcile-title">Clear the reconciliation desk.</h2>
        <p className="lab-lede">Route tickets by comparing the archive and dashboard copies. Then handle any changes that arrive while the desk is open.</p>
        <details className="lab-hint" open><summary>Desk policy</summary><p>A higher revision replaces a lower one, even if it withdraws the job. Conflicting states at the same revision go to review. Identical copies stay where they are.</p></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Reconciliation desk</h3><span className="lab-label">{Object.keys(actions).length}/{tickets.length} routed</span></div>
        <div className="reconcile-queue" role="group" aria-label="Job tickets">
          {tickets.map(({ id: item }, index) => <button type="button" className="filter" aria-pressed={selected === index} key={item} data-routed={Boolean(actions[item])} onClick={() => setSelected(index)}>{item}{actions[item] ? ' ✓' : ''}</button>)}
        </div>
        <section className="reconcile-card" aria-label={`Compare copies of ${id}`}>
          {phase === 'late' && lateUpdates.some(({ id: changed }) => changed === id) && <p className="mb-2 text-sm text-gold">New revision received · Route this ticket again</p>}
          <div className="reconcile-copies">
            <div><small>Archive · r{archive[0]}</small><strong>{archive[1]}</strong></div>
            <div><small>Dashboard · r{dashboard[0]}</small><strong>{dashboard[1]}</strong></div>
          </div>
          <div className="decision-tiles" role="group" aria-label={`Route ${id}`}>
            {destinations.map(([value, label]) => <button key={value} type="button" className="decision-tile" disabled={stable} aria-pressed={decision === value} onClick={() => route(value)}>{label}</button>)}
          </div>
          {decision && <p className="mt-3 text-sm text-muted" role="status">Preview · {decision === 'review' ? 'Flagged for review; neither copy changes.' : `Archive r${preview.archive[0]} ${preview.archive[1]} · Dashboard r${preview.dashboard[0]} ${preview.dashboard[1]}`}</p>}
          {result && <p className={result.passed ? 'lab-pass mt-2' : 'lab-fail mt-2'}>{result.passed ? 'This ticket is routed correctly.' : result.feedback}</p>}
        </section>
        {phase === 'incoming' ? (
          <button type="button" className="lab-primary" data-crew-action onClick={loadUpdates}>Open incoming updates · 2</button>
        ) : (
          <button type="button" className="lab-primary" data-crew-action disabled={stable || Object.keys(actions).length !== tickets.length} onClick={replay}>{phase === 'initial' ? 'Rehearse the handoff' : 'Dispatch updated tickets'}</button>
        )}
        {phase === 'complete' && <button type="button" className="filter ml-2" onClick={() => { setPhase('initial'); setActions({}); setResults(undefined); setSelected(0) }}>Restart shift</button>}
        <p className="lab-result" role="status">{phase === 'incoming' ? 'First batch verified. Two updates came in before dispatch.' : results ? `${results.filter(({ passed }) => passed).length} of ${tickets.length} tickets routed safely.` : ''}</p>
      </div>
    </section>
  )
}
