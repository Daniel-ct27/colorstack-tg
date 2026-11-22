import { useState } from 'react'
import { checkRound, jobs, type Job } from './recovery-plan.ts'

const jobIds = Object.keys(jobs) as Job[]

export function RecoveryJobs({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [rounds, setRounds] = useState<Job[][]>([])
  const [queue, setQueue] = useState<Job[]>([])
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [blocked, setBlocked] = useState(false)
  const finished = new Set(rounds.flat())
  const round = rounds.length + 1
  const complete = finished.size === jobIds.length
  const expired = round > 3 && !complete

  function select(id: Job) {
    setQueue(queue.includes(id) ? queue.filter((job) => job !== id) : [...queue, id])
    setFeedback('')
    setBlocked(false)
  }

  function dispatch() {
    const error = checkRound(queue, finished, round)
    setBlocked(Boolean(error))
    if (error) {
      setFeedback(error)
      return
    }
    setRunning(true)
    setFeedback(`Round ${round} is in motion. Finish the round to release the workers.`)
  }

  function finishRound() {
    const next = [...rounds, queue]
    const finishedCount = next.flat().length
    setRounds(next)
    setQueue([])
    setRunning(false)
    if (finishedCount === jobIds.length) {
      setFeedback('All six jobs finished. The showcase is ready to reconcile.')
      if (!solved) onSolve()
    } else if (next.length === 3) {
      setFeedback('Time is up with jobs still in the queue. Undo the last round or restart the shift.')
    } else {
      setFeedback(`Round ${round} finished. Check which jobs the workers unlocked.`)
    }
  }

  function reset(previous: Job[][]) {
    setRounds(previous)
    setQueue([])
    setRunning(false)
    setFeedback('')
    setBlocked(false)
  }

  return (
    <section className="lab-workbench" aria-labelledby="recovery-title">
      <div className="lab-brief">
        <p className="eyebrow">Dependency scheduling</p>
        <h2 id="recovery-title">Run the recovery shift.</h2>
        <p className="lab-lede">Get all six jobs done in three rounds. You have two workers. A job can only use work that finished in an earlier round.</p>
        <p className="text-sm text-muted">Tap a job to assign it to a free worker, then send the workers out. Finish the round to bring them back and free up both slots.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Recovery dispatch</h3><span className="lab-label">{finished.size}/6 finished</span></div>
        <div className="worker-shift" data-running={running}>
          <h4>{complete ? 'Shift complete' : expired ? 'Shift ended' : `Round ${round} of 3`}</h4>
          <div className="worker-lanes">
            {[0, 1].map((worker) => <div className="worker-lane" key={worker}>
              <strong>Worker {worker + 1}</strong>
              <p>{queue[worker] ? jobs[queue[worker]].title : 'Free'}</p>
              {running && queue[worker] && <span aria-hidden="true" />}
            </div>)}
          </div>
          <div className="lab-controls">
            {running ? (
              <button className="lab-primary" type="button" onClick={finishRound}>Finish round {round}</button>
            ) : (
              <button className="lab-primary" data-crew-action type="button" disabled={!queue.length || expired || complete} onClick={dispatch}>Send workers out</button>
            )}
            <button className="filter" type="button" disabled={!rounds.length || running} onClick={() => reset(rounds.slice(0, -1))}>Undo last round</button>
            <button className="filter" type="button" disabled={!rounds.length && !queue.length} onClick={() => reset([])}>Restart shift</button>
          </div>
          <p className={blocked || expired ? 'lab-fail mt-3' : 'lab-result'} role="status">{feedback}</p>
        </div>
        <ul className="schedule-tray" aria-label="Recovery job cards">
          {jobIds.map((id) => {
            const assigned = queue.includes(id)
            const done = finished.has(id)
            return (
              <li key={id}>
                <button type="button" className="decision-tile" aria-pressed={assigned} disabled={done || running || expired || (!assigned && queue.length >= 2)} onClick={() => select(id)}>
                  <strong>{jobs[id].title}</strong>
                  <small>{jobs[id].needs.length ? 'Needs: ' + jobs[id].needs.map((job) => jobs[job].title).join(', ') : 'No prerequisites'}</small>
                  <small>{done ? '✓ Finished' : assigned ? (running ? 'In progress' : 'Assigned') : 'Waiting'}</small>
                </button>
              </li>
            )
          })}
        </ul>
        {rounds.length > 0 && <ol className="worker-history" aria-label="Finished rounds">
          {rounds.map((jobsDone, index) => <li key={index}><strong>✓ Round {index + 1}</strong> · {jobsDone.map((job) => jobs[job].title).join(' + ')}</li>)}
        </ol>}
      </div>
    </section>
  )
}
