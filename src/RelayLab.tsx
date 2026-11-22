import { useState } from 'react'
import { DecisionTiles } from './DecisionTiles.tsx'
import { rehearseRelay } from './relay.ts'

const policyFields = [
  { key: 'retry', title: 'When do you retry?', choices: [['receipt', 'Immediately after receipt'], ['timeout', 'When the commit deadline expires'], ['never', 'Never retry']] },
  { key: 'identity', title: 'Which delivery ID does a retry use?', choices: [['rotate', 'A new delivery ID'], ['reuse', 'The original delivery ID']] },
  { key: 'finish', title: 'When is the report delivered?', choices: [['commit', 'After COMMITTED'], ['receipt', 'After RECEIVED']] },
] as const

export function RelayLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [policy, setPolicy] = useState({ retry: '', identity: '', finish: '' })
  const [results, setResults] = useState<ReturnType<typeof rehearseRelay>>()

  const [activeRun, setActiveRun] = useState(0)
  const [currentEvent, setEvent] = useState(0)
  const result = results?.[activeRun]
  const trace = result?.detail.split('\n') ?? []

  return (
    <section className="lab-workbench" aria-labelledby="relay-title">
      <div className="lab-brief">
        <p className="eyebrow">Network fundamentals</p>
        <h2 id="relay-title">Deliver exactly one report.</h2>
        <p className="lab-lede">The exporter sends a report and waits for the dashboard. A message can disappear in either direction. Repair the sender policy so a retry recovers a missing report without duplicating an existing one.</p>
        <details className="lab-hint" open><summary>Recorded exchange · 21:41–21:43</summary><pre className="mt-3 whitespace-pre-wrap font-mono text-sm">{'Exporter → Dashboard  PUBLISH id=R-61\nDashboard → Exporter  RECEIVED id=R-61\nDashboard             write report\nDashboard → Exporter  COMMITTED id=R-61 [lost]'}</pre></details>
        <details className="lab-hint"><summary>Receiver contract</summary><p>RECEIVED means work started. COMMITTED means the write is durable. A repeat delivery ID returns the stored outcome without writing again.</p></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Sender policy</h3></div>
        <form className="mt-4 grid gap-3" onSubmit={(event) => {
          event.preventDefault()
          const next = rehearseRelay(policy)
          setResults(next)
          setActiveRun(0)
          setEvent(0)
          if (next.every(({ passed }) => passed) && !solved) onSolve()
        }}>
          {policyFields.map(({ key, title, choices }) => (
            <DecisionTiles key={key} title={title} choices={choices} value={policy[key]} onChange={(value) => {
              setPolicy({ ...policy, [key]: value })
              setResults(undefined)
            }} />
          ))}
          <button className="lab-primary justify-self-start" disabled={!Object.values(policy).every(Boolean)}>Replay the exchange</button>
        </form>
        {results && result && (
          <section className="relay-replay" aria-label="Replay messages">
            <div className="lab-controls" role="group" aria-label="Replay scenario">
              {results.map(({ label, passed }, index) => (
                <button className="filter" type="button" key={label} aria-pressed={activeRun === index} onClick={() => { setActiveRun(index); setEvent(0) }}>
                  {['Normal delivery', 'Lost publish', 'Lost reply'][index]} · {passed ? 'PASS' : 'FAIL'}
                </button>
              ))}
            </div>
            <div className="relay-event" role="status" aria-atomic="true">
              <p className="lab-label">Event {currentEvent + 1} of {trace.length}</p>
              <p>{trace[currentEvent]}</p>
            </div>
            <div className="lab-controls">
              <button className="filter" type="button" disabled={currentEvent === 0} onClick={() => setEvent(currentEvent - 1)}>← Previous event</button>
              <button className="filter" type="button" disabled={currentEvent === trace.length - 1} onClick={() => setEvent(currentEvent + 1)}>Next event →</button>
            </div>
            <details className="lab-hint"><summary>Read the full replay</summary><pre className="mt-2 whitespace-pre-wrap text-sm">{result.detail}</pre></details>
          </section>
        )}
      </div>
    </section>
  )
}
