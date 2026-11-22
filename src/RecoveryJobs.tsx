import { useState } from 'react'
import { checkSchedule, jobs, type Job } from './recovery-plan.ts'

const jobIds = Object.keys(jobs) as Job[]
const roundNumbers = [1, 2, 3] as const

export function RecoveryJobs({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [placements, setPlacements] = useState<Partial<Record<Job, number>>>({})
  const [feedback, setFeedback] = useState('')
  const [passed, setPassed] = useState(false)
  const rounds = roundNumbers.map((round) => jobIds.filter((id) => placements[id] === round))

  return (
    <section className="lab-workbench" aria-labelledby="recovery-title">
      <div className="lab-brief">
        <p className="eyebrow">Dependency scheduling</p>
        <h2 id="recovery-title">Finish in three rounds.</h2>
        <p className="lab-lede">Two workers are available each round. Every job takes one full round. A job can start only after all of its prerequisites finish in earlier rounds.</p>
        <p className="text-sm text-muted">The restart note is still useful. Mount the snapshot before you rebuild the export.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Recovery job board</h3></div>
        <ul className="dependency-jobs schedule-jobs">
          {jobIds.map((id) => (
            <li key={id}>
              <div><strong>{jobs[id].title}</strong><p className="text-sm text-muted">{jobs[id].needs.length ? 'Needs: ' + jobs[id].needs.map((job) => jobs[job].title).join(', ') : 'No prerequisites'}</p></div>
              <select className="rounded border border-line bg-navy p-2" aria-label={`Round for ${jobs[id].title}`} value={placements[id] ?? ''} onChange={(event) => {
                setPlacements({ ...placements, [id]: Number(event.target.value) || undefined })
                setFeedback('')
                setPassed(false)
              }}>
                <option value="">Unassigned</option>
                {roundNumbers.map((round) => <option key={round} value={round}>Round {round}</option>)}
              </select>
            </li>
          ))}
        </ul>
        <div className="lab-controls" aria-label="Worker usage">
          {rounds.map((round, index) => <span key={index} className={round.length > 2 ? 'lab-fail' : 'text-muted'}>Round {index + 1} · {round.length}/2 workers</span>)}
        </div>
        <button className="lab-primary mt-4" type="button" onClick={() => {
          const error = checkSchedule(rounds)
          setPassed(error === null)
          setFeedback(error ?? 'All six jobs finished within three rounds.')
          if (error === null && !solved) onSolve()
        }}>Run schedule</button>
        <p className={passed ? 'lab-result' : 'lab-fail mt-3'} role="status">{feedback}</p>
      </div>
    </section>
  )
}
