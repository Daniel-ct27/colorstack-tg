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
    <section className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" aria-labelledby="practice-title">
      <div className="rounded border border-line bg-panel p-5">
        <h2 id="practice-title" className="text-xl font-bold">Restore the showcase report</h2>
        <p className="mt-2 text-muted">Queued work disappeared after a handful of edits. Find the change responsible, revert it, and verify that the other improvements survive.</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>Include queued and completed jobs. Exclude cancelled jobs.</li>
          <li>Keep the title “Daily Jobs” and show newest jobs first.</li>
        </ul>
        <details className="mt-5">
          <summary className="cursor-pointer text-gold">Investigation hint</summary>
          <p className="mt-2 text-sm text-muted">Run the report to establish what broke. A commit title is a clue. Inspect its diff to see what it actually changed.</p>
        </details>
        <p className="mt-5 text-sm text-gold" role="status">{solved && 'Stage 02 completed on this browser.'} {progressNotice}</p>
      </div>

      <div className="min-w-0 rounded border border-line bg-panel p-5">
        <h3 className="font-mono text-sm text-gold">Showcase repository sandbox</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {['run report', 'git log --oneline', 'help', 'reset'].map((action) => (
            <button key={action} type="button" className="filter font-mono text-xs" onClick={() => run(action)}>{action}</button>
          ))}
        </div>
        <form className="mt-4" onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="lab-command">Command</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="lab-command" className="min-w-0 flex-1 rounded border border-line bg-navy px-3 py-2 font-mono" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="git show HASH" maxLength={100} autoComplete="off" spellCheck={false} required />
            <button className="filter" type="submit">Run</button>
          </div>
        </form>
        <div className="mt-4 max-h-96 space-y-4 overflow-auto rounded border border-line bg-navy p-4" role="log" aria-label="Sandbox output">
          {transcript.length === 0 && <p className="text-sm text-muted">Run the report or inspect the commit history to begin.</p>}
          {transcript.map((entry, index) => (
            <div key={index}>
              <p className="break-all font-mono text-sm text-gold">$ {entry.command}</p>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-ink">{entry.output}</pre>
            </div>
          )).reverse()}
        </div>
      </div>
    </section>
  )
}
