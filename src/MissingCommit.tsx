import { useState, type FormEvent } from 'react'
import { matchesCommit, repositoryHistory } from './missing-commit.ts'

interface MissingCommitProps {
  solved: boolean
  onSolve: () => void
  progressNotice: string
}

export function MissingCommit({ solved, onSolve, progressNotice }: MissingCommitProps) {
  const [answer, setAnswer] = useState('')
  const [incorrect, setIncorrect] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (solved) return
    if (matchesCommit(answer)) onSolve()
    else setIncorrect(true)
  }

  return (
    <section className="mt-6 border-t border-line pt-5" aria-labelledby="practice-title">
      <h3 id="practice-title" className="text-lg font-bold">Practice investigation</h3>
      <p className="mt-2 text-sm text-muted">Yesterday the report included queued jobs. Today it shows completed jobs only. Review the fictional Git history and submit the short hash of the change responsible.</p>
      <details className="mt-4 rounded-md border border-line p-3" open>
        <summary className="cursor-pointer font-semibold text-gold">Repository history</summary>
        <ul className="mt-2 divide-y divide-line">
          {repositoryHistory.map((commit) => (
            <li key={commit.hash} className="py-2 text-sm">
              <code className="text-gold">{commit.hash}</code> {commit.summary}
              <p className="mt-1 text-muted">{commit.change}</p>
            </li>
          ))}
        </ul>
      </details>
      <form className="mt-4" onSubmit={submit}>
        <label className="block text-sm font-semibold" htmlFor="commit-hash">Short commit hash</label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input id="commit-hash" className="min-w-0 flex-1 rounded-md border border-line bg-navy px-3 py-2 font-mono" value={answer} onChange={(event) => {
            setAnswer(event.target.value)
            setIncorrect(false)
          }} required autoComplete="off" spellCheck={false} disabled={solved} />
          <button className="filter" type="submit" disabled={solved}>Check answer</button>
        </div>
        <p className="mt-2 text-sm text-gold" role="status">
          {solved && 'Solved. This change filtered the report to completed jobs.'}
          {incorrect && !solved && 'Try again. Look for the change that controls which statuses the report includes.'}
          {progressNotice && <span className="mt-1 block text-muted">{progressNotice}</span>}
        </p>
      </form>
    </section>
  )
}
