import { useState } from 'react'

const jobs = {
  refresh: { title: 'Refresh the dashboard', needs: 'A rebuilt export' },
  mount: { title: 'Mount the snapshot', needs: 'No prerequisite' },
  rebuild: { title: 'Rebuild the export', needs: 'A mounted snapshot' },
}

export function RecoveryJobs({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [order, setOrder] = useState<(keyof typeof jobs)[]>(['refresh', 'mount', 'rebuild'])
  const [feedback, setFeedback] = useState('')

  function move(index: number, offset: number) {
    const updated = [...order]
    const target = index + offset
    const job = updated[index]
    updated[index] = updated[target]
    updated[target] = job
    setOrder(updated)
    setFeedback('')
  }

  return (
    <section className="lab-workbench" aria-labelledby="recovery-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="recovery-title">Unstick the job queue.</h2>
        <p className="lab-lede">Move the cards into a runnable sequence. Each job must get what it needs from an earlier step.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Recovery dependency board</h3></div>
        <ol className="dependency-jobs">
          {order.map((id, index) => (
            <li key={id}>
              <span>{index + 1}</span>
              <div><strong>{jobs[id].title}</strong><p className="text-sm text-muted">{jobs[id].needs}</p></div>
              <button className="filter" type="button" aria-label={`Move ${jobs[id].title} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
              <button className="filter" type="button" aria-label={`Move ${jobs[id].title} down`} disabled={index === order.length - 1} onClick={() => move(index, 1)}>↓</button>
            </li>
          ))}
        </ol>
        <button className="lab-primary mt-4" type="button" onClick={() => {
          if (order.join() === 'mount,rebuild,refresh') {
            setFeedback(solved ? 'Correct. This case is already solved.' : 'Job order verified. Recovery can begin.')
            if (!solved) onSolve()
          } else { setFeedback('A job starts before its prerequisite is ready. Check what each card needs.') }
        }}>Test job order</button>
        <p className="lab-result" role="status">{feedback}</p>
      </div>
    </section>
  )
}
