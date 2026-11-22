import { useState } from 'react'
import { rehearseRelease, releaseActions, type ReleaseAction } from './finale.ts'

const actionIds: ReleaseAction[] = ['publish', 'compare', 'checkpoint', 'overwrite', 'route', 'reconcile', 'rebuild']

export function FinaleLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [plan, setPlan] = useState<ReleaseAction[]>([])
  const [results, setResults] = useState<ReturnType<typeof rehearseRelease>[]>()

  function update(next: ReleaseAction[]) {
    setPlan(next)
    setResults(undefined)
  }

  function rehearse() {
    const next = [rehearseRelease(plan, false), rehearseRelease(plan, true)]
    setResults(next)
    if (!solved && next.every(({ passed }) => passed)) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="finale-title">
      <div className="lab-brief">
        <p className="eyebrow">Release engineering</p>
        <h2 id="finale-title">Run the opening-day rehearsal.</h2>
        <p className="lab-lede">Build one recovery plan that can safely publish a clean report and leave the public dashboard intact when the checks fail.</p>
        <details className="lab-hint" open><summary>Incident handoff</summary><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Keep a copy of the public report before touching staging.</li>
          <li>The new export and its reconciled records must agree with the archive before promotion.</li>
          <li>The withdrawal from the reconciliation case must survive either outcome.</li>
        </ul></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Release runbook</h3><span className="lab-label">{plan.length} actions</span></div>
        <p className="mt-3 text-sm text-muted">Add actions in the order you want them to run. Remove an action to revise the plan.</p>
        <div className="lab-controls">
          {actionIds.map((id) => <button className="filter text-left" type="button" key={id} disabled={plan.includes(id)} onClick={() => update([...plan, id])}>{releaseActions[id]}</button>)}
        </div>
        <ol className="mt-4 grid gap-2">
          {plan.map((id, index) => <li className="flex items-center justify-between gap-2 rounded border border-line bg-navy p-3" key={id}><span><strong className="text-gold">{index + 1}.</strong> {releaseActions[id]}</span><button type="button" className="filter text-sm" aria-label={`Remove ${releaseActions[id]}`} onClick={() => update(plan.filter((action) => action !== id))}>Remove</button></li>)}
        </ol>
        <button className="lab-primary mt-4" type="button" data-crew-action disabled={!plan.length} onClick={rehearse}>Rehearse both outcomes</button>
        <div className="mt-4 grid gap-3" role="status">
          {results?.map(({ passed, trace }, index) => <div className="rounded border border-line p-3" key={index}>
            <h4 className={passed ? 'lab-pass font-bold' : 'lab-fail font-bold'}>{passed ? 'PASS' : 'FAIL'} · {index === 0 ? 'Clean report' : 'Mismatch during validation'}</h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">{trace.map((line, row) => <li key={row}>{line}</li>)}</ol>
          </div>)}
          {results?.every(({ passed }) => passed) && <p className="lab-result">Showcase restored. Operation Lost Access is complete.</p>}
        </div>
      </div>
    </section>
  )
}
