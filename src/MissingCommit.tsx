import { useEffect, useRef, useState, type FormEvent } from 'react'
import { initialLab, repositoryCommits, runCommands } from './missing-commit.ts'

interface MissingCommitProps {
  solved: boolean
  onSolve: () => void
  progressNotice: string
}

export function MissingCommit({ solved, onSolve, progressNotice }: MissingCommitProps) {
  const [lab, setLab] = useState(initialLab)
  const [command, setCommand] = useState('')
  const [transcript, setTranscript] = useState<{ id: number; command: string; output: string }[]>([])
  const output = useRef<HTMLDivElement>(null)
  const nextEntryId = useRef(0)

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight
  }, [transcript])

  function run(input: string) {
    const result = runCommands(lab, input)
    if (!result.entries.length) return
    const entries = result.entries.map((entry) => ({ ...entry, id: nextEntryId.current++ }))
    setLab(result.state)
    setTranscript((previous) => [...previous, ...entries].slice(-100))
    if (result.verified && !solved) onSolve()
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!command.trim()) return
    run(command)
    setCommand('')
  }

  return (
    <section className="lab-workbench" aria-labelledby="practice-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="practice-title">Bring back the missing jobs.</h2>
        <p className="lab-lede">One commit changed what the showcase report shows. Find it, revert it, and run the report to prove your fix.</p>
        <h3 className="lab-label">The report must</h3>
        <ul className="lab-rules">
          <li>Show queued and completed jobs.</li>
          <li>Leave cancelled jobs out.</li>
          <li>Keep the title “Daily Jobs.”</li>
          <li>Show newest jobs first.</li>
        </ul>
        <details className="lab-hint">
          <summary>Need a hint?</summary>
          <p>Run the report first. Then read a commit’s diff to see what changed.</p>
        </details>
        <p className="lab-result" role="status">
          {lab.solved ? 'Report restored' : solved ? 'Completed in a previous run' : ''}
          {progressNotice && <span className="block">{progressNotice}</span>}
        </p>
      </div>

      <div className="lab-console">
        <div className="lab-console-bar">
          <h3>Repository console</h3>
          <span className="lab-label">showcase / report</span>
        </div>
        <div className="lab-controls">
          {[
            ['Test report', 'run report'],
            ['Commit history', 'git log --oneline'],
            ['Help', 'help'],
            ['Reset', 'reset'],
          ].map(([label, action]) => (
            <button key={action} type="button" className={action === 'run report' ? 'lab-primary' : 'filter'} onClick={() => run(action)}>{label}</button>
          ))}
        </div>

        <section className="repo-board" aria-labelledby="repo-board-title">
          <h4 id="repo-board-title">Commit board</h4>
          <ol>
            {repositoryCommits.map(({ hash, summary }) => {
              const state = lab.reverted.includes(hash) ? 'reverted' : lab.inspected.includes(hash) ? 'inspected' : 'history'
              return (
                <li key={hash} data-state={state}>
                  <button className="repo-node" type="button" onClick={() => run(`git show ${hash}`)}>
                    <span className="repo-node-copy"><strong>{summary}</strong><code>{hash}</code></span>
                    <span className="repo-status">{state === 'reverted' ? 'Reverted' : state === 'inspected' ? 'Inspected' : 'In history'}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
        <form className="mt-4" onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="lab-command">Commands</label>
          <p id="command-help" className="mt-1 text-sm text-muted">Press Enter to run. Use Shift+Enter to add another command.</p>
          <textarea id="lab-command" className="mt-2 w-full rounded border border-line bg-navy px-3 py-2 font-mono" rows={4} value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }} aria-describedby="command-help" placeholder={'git log --oneline\nrun report'} maxLength={2000} autoComplete="off" spellCheck={false} required />
          <button className="lab-primary mt-2" type="submit">Run commands</button>
        </form>
        <div ref={output} className="lab-output mt-4 max-h-96 space-y-4 overflow-auto rounded border border-line bg-navy p-4" role="log" aria-label="Sandbox output">
          {transcript.length === 0 && <p className="text-sm text-muted">Ready. Test the report to see what broke.</p>}
          {transcript.map((entry) => (
            <div key={entry.id}>
              <p className="break-all font-mono text-sm text-gold">$ {entry.command}</p>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-ink">
                {entry.output.split('\n').map((line, lineIndex, lines) => (
                  <span className={line.endsWith(': PASS') ? 'lab-pass' : line.endsWith(': FAIL') ? 'lab-fail' : undefined} key={lineIndex}>{line}{lineIndex < lines.length - 1 ? '\n' : ''}</span>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
