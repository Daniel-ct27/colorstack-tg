import { useState } from 'react'
import { checkReconciliation, pairs } from './reconcile.ts'

export function ReconcileLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [actions, setActions] = useState<Record<string, string>>({})
  const [results, setResults] = useState<ReturnType<typeof checkReconciliation>>()

  return (
    <section className="lab-workbench" aria-labelledby="reconcile-title">
      <div className="lab-brief">
        <p className="eyebrow">Distributed state</p>
        <h2 id="reconcile-title">Reconcile the two records.</h2>
        <p className="lab-lede">Repair the staggered copies without resurrecting a withdrawn job or overwriting a conflict. Neither service wins every time.</p>
        <details className="lab-hint" open><summary>Recovery policy</summary><p>Higher revisions supersede lower ones, even when the new state is withdrawn. If revisions match but states differ, hold the job for review. Leave identical records alone.</p></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Reconciliation queue</h3></div>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault()
          const next = checkReconciliation(actions)
          setResults(next)
          if (next.every(({ passed }) => passed) && !solved) onSolve()
        }}>
          {pairs.map(({ id, archive, dashboard }, index) => (
            <fieldset className="rounded border border-line bg-navy p-3" key={id}>
              <legend className="px-1 font-mono text-gold">{id}</legend>
              <p className="text-sm">Archive: r{archive[0]} · {archive[1]}<br />Dashboard: r{dashboard[0]} · {dashboard[1]}</p>
              <label className="mt-2 grid gap-1 text-sm">Recovery action
                <select className="rounded border border-line bg-panel p-2" value={actions[id] ?? ''} required onChange={(event) => { setActions({ ...actions, [id]: event.target.value }); setResults(undefined) }}>
                  <option value="">Choose an action</option><option value="archive">Copy archive to dashboard</option><option value="dashboard">Copy dashboard to archive</option><option value="skip">Leave both alone</option><option value="review">Hold for review</option>
                </select>
              </label>
              {results && <p className={results[index].passed ? 'lab-pass mt-2' : 'lab-fail mt-2'}>{results[index].passed ? 'PASS' : results[index].feedback}</p>}
            </fieldset>
          ))}
          <button className="lab-primary justify-self-start">Dry-run reconciliation</button>
        </form>
        <p className="lab-result" role="status">{results ? `${results.filter(({ passed }) => passed).length} of ${pairs.length} decisions verified.` : ''}</p>
      </div>
    </section>
  )
}
