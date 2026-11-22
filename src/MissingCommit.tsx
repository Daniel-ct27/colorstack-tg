import { useState, type FormEvent } from 'react'
import { initialLab, runCommand } from './missing-commit.ts'

interface MissingCommitProps {
  solved: boolean
  onSolve: () => void
  progressNotice: string
}

export function MissingCommit({ solved, onSolve, progressNotice }: MissingCommitProps) {
  const [lab, setLab] = useState(initialLab)
  const [command, setCommand] = useState('')
  const [transcript, setTranscript] = useState<{ command: string; output: string }[]>([])

  function run(input: string) {
    const result = runCommand(lab, input)
    setLab(result.state)
    setTranscript((entries) => [...entries.slice(-19), { command: input, output: result.output }])
    if (result.state.solved && !solved) onSolve()
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

        <form className="mt-4" onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="lab-command">Command</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="lab-command" className="min-w-0 flex-1 rounded border border-line bg-navy px-3 py-2 font-mono" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="git show HASH" maxLength={100} autoComplete="off" spellCheck={false} required />
            <button className="filter" type="submit">Run command</button>
          </div>
        </form>
        <div className="lab-output mt-4 max-h-96 space-y-4 overflow-auto rounded border border-line bg-navy p-4" role="log" aria-label="Sandbox output">
          {transcript.length === 0 && <p className="text-sm text-muted">Ready. Test the report to see what broke.</p>}
          {transcript.map((entry, index) => (
            <div key={index}>
              <p className="break-all font-mono text-sm text-gold">$ {entry.command}</p>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-ink">
                {entry.output.split('\n').map((line, lineIndex, lines) => (
                  <span className={line.endsWith(': PASS') ? 'lab-pass' : line.endsWith(': FAIL') ? 'lab-fail' : undefined} key={lineIndex}>{line}{lineIndex < lines.length - 1 ? '\n' : ''}</span>
                ))}
              </pre>
            </div>
          )).reverse()}
        </div>
      </div>
    </section>
  )
}
