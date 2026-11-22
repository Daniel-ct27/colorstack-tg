import { useState, type FormEvent } from 'react'

export function HiddenSystem({ onSolve, solved }: { onSolve: () => void; solved: boolean }) {
  const [answer, setAnswer] = useState('')
  const [incorrect, setIncorrect] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (answer.trim().replace(/^\.\//, '') === 'nightly/scripts/export.sh') {
      setIncorrect(false)
      onSolve()
    } else {
      setIncorrect(true)
    }
  }

  return (
    <section className="lab-workbench" aria-labelledby="handoff-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="handoff-title">Trace the overnight export.</h2>
        <p className="lab-lede">The scheduler starts in <code>/showcase</code>. Read the handoff and directory evidence, then enter the relative path the scheduler should run.</p>
        <details className="lab-hint">
          <summary>Need a hint?</summary>
          <p>Both scripts share a name. Use the handoff to pick the correct folder, then trace the full path from the working directory.</p>
        </details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Workstation evidence</h3></div>
        <details className="lab-hint"><summary>Thanksgiving handoff</summary><p>The preview is for live demos. Tonight’s scheduler must use the script in the nightly project. The copied handoff only says <code>scripts/export.sh</code>.</p></details>
        <details className="lab-hint"><summary>Directory listing</summary><pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-ink">{'/showcase\n  preview/scripts/export.sh\n  nightly/scripts/export.sh\n  archive/export.csv'}</pre></details>
        <form className="mt-5" onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="export-path">Path relative to /showcase</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="export-path" className="min-w-0 flex-1 rounded border border-line bg-navy px-3 py-2 font-mono" value={answer} onChange={(event) => { setAnswer(event.target.value); setIncorrect(false) }} autoComplete="off" spellCheck={false} required disabled={solved} />
            <button className="lab-primary" disabled={solved}>Check path</button>
          </div>
        </form>
        <p className="lab-result" role="status">{solved ? 'Export located. Stage 02 is unlocked.' : incorrect ? 'That path won’t run the nightly export from /showcase. Check both clues.' : ''}</p>
      </div>
    </section>
  )
}
