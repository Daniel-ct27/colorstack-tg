import { useState } from 'react'
import { checkReleaseDecision, rehearseRelease, releaseActions, type ReleaseAction, type ReleaseDecision } from './finale.ts'

const actionIds: ReleaseAction[] = ['publish', 'compare', 'checkpoint', 'overwrite', 'route', 'reconcile', 'rebuild']
const rehearsals = [{ name: 'Rehearsal A', mismatch: false }, { name: 'Rehearsal B', mismatch: true }] as const
const actionName = (id: ReleaseAction) => id === 'route' ? 'Open the release gate' : releaseActions[id]
type Run = { scenario: number; events: string[]; step: number; ready: boolean }

export function FinaleLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [plan, setPlan] = useState<ReleaseAction[]>([])
  const [run, setRun] = useState<Run>()
  const [certified, setCertified] = useState<number[]>([])
  const [decision, setDecision] = useState<ReturnType<typeof checkReleaseDecision>>()
  const atEnd = Boolean(run && run.step === run.events.length - 1)
  const atGate = Boolean(run && atEnd && run.ready)

  function update(next: ReleaseAction[]) {
    setPlan(next)
    setRun(undefined)
    setCertified([])
    setDecision(undefined)
  }

  function moveStep(index: number, offset: -1 | 1) {
    const target = index + offset
    if (target < 0 || target >= plan.length) return
    const next = [...plan]
    const step = next[index]
    next[index] = next[target]
    next[target] = step
    update(next)
  }

  function rehearse(scenario: number) {
    const next = rehearseRelease(plan, rehearsals[scenario].mismatch)
    setDecision(undefined)
    setRun({ scenario, events: next.passed ? next.trace.slice(0, -1) : next.trace, step: 0, ready: next.passed })
  }

  function directRelease(choice: ReleaseDecision) {
    if (!run || !atGate) return
    const outcome = checkReleaseDecision(rehearsals[run.scenario].mismatch ? 'mismatch' : 'agreement', choice)
    setDecision(outcome)
    if (!outcome.passed || certified.includes(run.scenario)) return
    const next = [...certified, run.scenario]
    setCertified(next)
    if (next.length === rehearsals.length && !solved) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="finale-title">
      <div className="lab-brief">
        <p className="eyebrow">Release engineering</p>
        <h2 id="finale-title">Run the opening-day rehearsal.</h2>
        <p className="lab-lede">Build one runbook. Then guide it through two rehearsals before the crew opens the doors.</p>
        <details className="lab-hint" open><summary>Incident handoff</summary><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Keep a copy of the public report before touching staging.</li>
          <li>The rebuilt and reconciled report must agree with the archive before you publish it.</li>
          <li>Both rehearsals use the same runbook. Editing it clears their approvals.</li>
        </ul></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Release runbook</h3><span className="lab-label">{certified.length}/2 rehearsals approved</span></div>
        <p className="mt-3 text-sm text-muted">Add actions to the runbook. Use the arrows to move a step earlier or later.</p>
        <div className="lab-controls">
          {actionIds.map((id) => <button className="filter text-left" type="button" key={id} disabled={plan.includes(id)} onClick={() => update([...plan, id])}>{actionName(id)}</button>)}
        </div>
        <ol className="mt-4 grid gap-2">
          {plan.map((id, index) => (
            <li className="runbook-step rounded border border-line bg-navy p-3" key={id}>
              <span><strong className="text-gold">{index + 1}.</strong> {actionName(id)}</span>
              <div className="runbook-step-controls">
                <button type="button" className="filter" aria-label={`Move ${actionName(id)} earlier`} disabled={index === 0} onClick={() => moveStep(index, -1)}>↑</button>
                <button type="button" className="filter" aria-label={`Move ${actionName(id)} later`} disabled={index === plan.length - 1} onClick={() => moveStep(index, 1)}>↓</button>
                <button type="button" className="filter" aria-label={`Remove ${actionName(id)}`} onClick={() => update(plan.filter((action) => action !== id))}>Remove</button>
              </div>
            </li>
          ))}
        </ol>
        <div className="lab-controls" role="group" aria-label="Rehearsals">
          {rehearsals.map(({ name }, index) => <button className="filter" type="button" key={name} data-crew-action disabled={!plan.length} aria-pressed={run?.scenario === index} onClick={() => rehearse(index)}>{name}{certified.includes(index) ? ' ✓' : ''}</button>)}
        </div>
        {run && (
          <section className="relay-replay" aria-label="Release control room">
            <h4 className="font-bold">{rehearsals[run.scenario].name} · Control room</h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted" aria-live="polite">
              {run.events.slice(0, run.step + 1).map((line, index) => <li key={index} className={index === run.step ? 'text-ink' : undefined}>{line}</li>)}
            </ol>
            {!atEnd && <button type="button" className="lab-primary mt-3" onClick={() => setRun({ ...run, step: run.step + 1 })}>Advance rehearsal →</button>}
            {atEnd && !run.ready && <p className="lab-fail mt-3" role="status">Rehearsal stopped. Revise the runbook and try again.</p>}
            {atGate && (
              <div className="mt-3">
                <p className="font-bold">Release decision</p>
                <div className="lab-controls">
                  <button className="decision-tile" type="button" disabled={certified.includes(run.scenario)} onClick={() => directRelease('publish')}>Publish the staged report</button>
                  <button className="decision-tile" type="button" disabled={certified.includes(run.scenario)} onClick={() => directRelease('restore')}>Restore the checkpoint</button>
                </div>
                {decision && <p className={decision.passed ? 'lab-pass mt-2' : 'lab-fail mt-2'} role="status">{decision.detail}</p>}
              </div>
            )}
          </section>
        )}
        {certified.length === rehearsals.length && <p className="lab-result" role="status">Showcase restored. Operation Lost Access is complete.</p>}
      </div>
    </section>
  )
}
