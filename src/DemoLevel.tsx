import { useState } from 'react'

const crates = ['M-14', 'K-32', 'T-55'] as const
type Crate = (typeof crates)[number]

export function DemoLevel({ mapUrl, firstMission }: { mapUrl: string; firstMission: string }) {
  const [read, setRead] = useState(false)
  const [selected, setSelected] = useState<Crate>()
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="demo-level case-files" aria-labelledby="demo-title">
      <a href={mapUrl} className="hud-back">← Course map</a>
      <h1 id="demo-title">Practice room</h1>
      <p className="max-w-prose text-muted">Try one quick case before the campaign. A toolkit for the showcase was packed into one of three crates. Find it and send it to the rehearsal crew.</p>
      <div className="lab-workbench">
        <div className="lab-brief">
          <h2>Find the toolkit</h2>
          <ol className="demo-steps">
            <li data-done={read}>Open the dispatch note.</li>
            <li data-done={Boolean(selected)}>Pick a crate that fits the clue.</li>
            <li data-done={done}>Check your choice.</li>
          </ol>
          <p className="mt-3 text-sm text-muted">You can change your mind and try again. This room is separate from your campaign progress.</p>
        </div>
        <div className="lab-console">
          <div className="lab-console-bar"><h3>Loading dock</h3></div>
          <button type="button" className="filter mt-4" aria-expanded={read} aria-controls="demo-note" onClick={() => setRead(!read)}>{read ? 'Close dispatch note' : 'Open dispatch note'}</button>
          <p id="demo-note" hidden={!read} className="demo-note">Nia: The toolkit is in a crate with a number greater than 20. Its label ends in an even number.</p>
          <div className="demo-crates" role="group" aria-label="Choose a crate">
            {crates.map((id) => <button type="button" key={id} className="decision-tile demo-crate" aria-pressed={selected === id} onClick={() => { setSelected(id); setFeedback('') }}><span aria-hidden="true">▣</span>{id}</button>)}
          </div>
          <button type="button" className="lab-primary mt-3" disabled={!selected} onClick={() => {
            if (selected === 'K-32') {
              setDone(true)
              setFeedback('Toolkit delivered. You’re ready for Stage 01.')
            } else {
              setFeedback('That crate does not fit both clues. Reopen the note and compare the last two digits.')
            }
          }}>Check crate</button>
          <p className="lab-result" role="status">{feedback}</p>
          {done && <a className="primary-link" href={firstMission}>Start Stage 01 →</a>}
        </div>
      </div>
    </section>
  )
}
