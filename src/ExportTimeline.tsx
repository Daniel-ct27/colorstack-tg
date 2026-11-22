import { useState } from 'react'

const log = [
  { time: '21:40', event: 'Scheduled run starts', detail: 'Scheduler starts the nightly job on time.' },
  { time: '21:41', event: 'Report query finishes', detail: 'The report query returns 12 records.' },
  { time: '21:42', event: 'Export receives input', detail: 'The export receives zero records and skips writing a file.' },
  { time: '21:43', event: 'Dashboard refreshes', detail: 'No new export exists. The dashboard keeps yesterday’s report.' },
  { time: '23:57', event: 'Manual retry finishes', detail: 'A manual retry writes a file from the same query.' },
]

export function ExportTimeline({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [selected, setSelected] = useState<number>()
  const [feedback, setFeedback] = useState('')
  return (
    <section className="lab-workbench" aria-labelledby="timeline-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="timeline-title">Find where the export went quiet.</h2>
        <p className="lab-lede">Scrub through the events from the last shift. Flag the first evidence that the scheduled run had gone wrong.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Wednesday night</h3></div>
        <div className="timeline-events" role="group" aria-label="Events in time order">
          {log.map(({ time }, index) => <button key={time} className="filter" type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setFeedback('') }}>{time}</button>)}
        </div>
        {selected === undefined ? <p className="mt-4 text-muted">Pick a timestamp to inspect it.</p> : (
          <div className="mt-4">
            <h4 className="font-bold">{log[selected].event}</h4>
            <p className="mt-2 text-muted">{log[selected].detail}</p>
            <button className="lab-primary mt-4" type="button" onClick={() => {
              if (selected === 2) {
                setFeedback(solved ? 'Correct. This case is already solved.' : 'Failure located. Timestamp pinned to the evidence board.')
                if (!solved) onSolve()
              } else { setFeedback('That event isn’t the first sign of trouble. Compare it with the events right before and after it.') }
            }}>Flag this event</button>
          </div>
        )}
        <p className="lab-result" role="status">{feedback}</p>
      </div>
    </section>
  )
}
