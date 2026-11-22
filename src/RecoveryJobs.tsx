import { useState } from 'react'
import { checkSchedule, jobs, type Job } from './recovery-plan.ts'

const jobIds = Object.keys(jobs) as Job[]
const roundNumbers = [1, 2, 3] as const

export function RecoveryJobs({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [placements, setPlacements] = useState<Partial<Record<Job, number>>>({})
  const [selected, setSelected] = useState<Job>()
  const [feedback, setFeedback] = useState('')
  const [passed, setPassed] = useState(false)
  const rounds = roundNumbers.map((round) => jobIds.filter((id) => placements[id] === round))

  function place(round?: number) {
    if (!selected) return
    setPlacements({ ...placements, [selected]: round })
    setSelected(undefined)
    setFeedback('')
    setPassed(false)
  }

  return (
    <section className="lab-workbench" aria-labelledby="recovery-title">
      <div className="lab-brief">
        <p className="eyebrow">Dependency scheduling</p>
        <h2 id="recovery-title">Finish in three rounds.</h2>
        <p className="lab-lede">Two workers are available per round. A job takes a full round and can start only after its prerequisites finish.</p>
        <p className="text-sm text-muted">Choose a job card, then assign it to a round. Select it again anytime to move it.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Recovery job board</h3><span className="lab-label">{rounds.flat().length}/6 scheduled</span></div>
        <ul className="schedule-tray">
          {jobIds.map((id) => (
            <li key={id}>
              <button type="button" className="decision-tile" aria-pressed={selected === id} onClick={() => setSelected(selected === id ? undefined : id)}>
                <strong>{jobs[id].title}</strong>
                <small>{jobs[id].needs.length ? 'Needs: ' + jobs[id].needs.map((job) => jobs[job].title).join(', ') : 'No prerequisites'}</small>
                <small>{placements[id] ? `Round ${placements[id]}` : 'Waiting for a worker'}</small>
              </button>
            </li>
          ))}
        </ul>
        <p className="schedule-selection" aria-live="polite">{selected ? `Assigning: ${jobs[selected].title}` : 'Choose a job card to assign it.'}</p>
        <div className="schedule-rounds">
          {rounds.map((round, index) => (
            <section key={index} aria-label={`Round ${index + 1}`}>
              <h4>Round {index + 1}</h4>
              <p className={round.length > 2 ? 'lab-fail' : 'text-muted'}>{round.length}/2 workers</p>
              <ul>{round.map((id) => <li key={id}>{jobs[id].title}</li>)}</ul>
              <button className="filter" type="button" disabled={!selected} onClick={() => place(index + 1)}>Assign to round {index + 1}</button>
            </section>
          ))}
        </div>
        {selected && placements[selected] && <button className="filter mt-2" type="button" onClick={() => place()}>Return job to queue</button>}
        <button data-crew-action className="lab-primary mt-4" type="button" onClick={() => {
          const error = checkSchedule(rounds)
          setPassed(error === null)
          setFeedback(error ?? 'All six jobs finished within three rounds.')
          if (error === null && !solved) onSolve()
        }}>Start the workers</button>
        <p className={passed ? 'lab-result' : 'lab-fail mt-3'} role="status">{feedback}</p>
      </div>
    </section>
  )
}
