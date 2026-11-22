import { useState, type FormEvent } from 'react'
import { GamePopup } from './GamePopup.tsx'

const tour = [
  { title: 'Read the assignment', text: 'The briefing tells you what you’re trying to do. The evidence in the workspace gives you what you need to figure it out.' },
  { title: 'Inspect the evidence', text: 'Open the dispatch note and tap a card to see what it contains. In other cases, you might inspect a log, a file, or a message replay.' },
  { title: 'Ask the crew', text: 'Tap Giblet for a broad nudge or Jub for something specific to look at. Field notes explain any technical words you’re unfamiliar with.' },
  { title: 'Try a move', text: 'Type your answer in the practice room, then choose Check answer. Read the feedback and try again if you need to. In the campaign, a clear opens the next case.' },
]

const practice = [
  {
    title: 'Find the toolkit', note: 'Nia: The toolkit crate came from the west loading dock and has a blue seal.',
    prompt: 'Which crate holds the toolkit?', answer: 'K-32',
    evidence: [['M-14', 'West dock · orange seal'], ['K-32', 'West dock · blue seal'], ['T-55', 'East dock · blue seal']],
    hints: ['One matching detail is only a start. Look for both marks on the same crate.', 'You can rule out any crate from the east dock first.'],
  },
  {
    title: 'Pick the rehearsal room', note: 'Miles: We need a room with a projector and enough seats for 12 people.',
    prompt: 'Which room should Miles reserve?', answer: 'B-12',
    evidence: [['A-08', 'Projector · 8 seats'], ['B-12', 'Projector · 12 seats'], ['C-20', 'Whiteboard only · 20 seats']],
    hints: ['Check the equipment as well as the seat count.', 'A room with plenty of seats can still be missing something Miles needs.'],
  },
  {
    title: 'Confirm the delivery', note: 'Nia: Mark the delivery that made it all the way to the rehearsal crew. A dispatch record alone doesn’t count.',
    prompt: 'Which delivery reached the rehearsal crew?', answer: 'D-27',
    evidence: [['D-14', '18:06 dispatched · no reply'], ['D-27', '18:04 dispatched · 18:08 received'], ['D-88', '18:09 packed · waiting for dispatch']],
    hints: ['Look for a record from the receiving side.', 'A later timestamp doesn’t necessarily mean a delivery went farther.'],
  },
] as const

type Popup = { kind: 'tour'; index: number } | { kind: 'hint'; mascot: 'giblet' | 'bulldog' } | { kind: 'clear' }

export function DemoLevel({ mapUrl, firstMission }: { mapUrl: string; firstMission: string }) {
  const [taskIndex, setTaskIndex] = useState(0)
  const [popup, setPopup] = useState<Popup | null>({ kind: 'tour', index: 0 })
  const [noteOpen, setNoteOpen] = useState(false)
  const [read, setRead] = useState(false)
  const [record, setRecord] = useState<number>()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [passed, setPassed] = useState(false)
  const task = practice[taskIndex]
  const last = taskIndex === practice.length - 1

  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const correct = answer.trim().toUpperCase().replace(/\s+/g, '') === task.answer
    if (correct) {
      setPassed(true)
      setFeedback('Correct. Nice work following the evidence.')
      setPopup({ kind: 'clear' })
    } else {
      setFeedback('That ID doesn’t match the assignment. Compare the dispatch note with the card details and try again.')
    }
  }

  function nextTask() {
    setTaskIndex(taskIndex + 1)
    setNoteOpen(false)
    setRead(false)
    setRecord(undefined)
    setAnswer('')
    setFeedback('')
    setPassed(false)
    setPopup(null)
  }

  return (
    <section className="demo-level case-files" aria-labelledby="demo-title">
      <a href={mapUrl} className="hud-back">← Course map</a>
      <h1 id="demo-title">Practice room</h1>
      <p className="max-w-prose text-muted">Practice reading clues, trying a move, and using feedback. Your campaign starts at Stage 01.</p>
      <button className="filter mt-3" type="button" onClick={() => setPopup({ kind: 'tour', index: 0 })}>Show the quick tour</button>
      <div className="lab-workbench">
        <div className="lab-brief">
          <p className="eyebrow">Practice {taskIndex + 1} of {practice.length}</p>
          <h2>{task.title}</h2>
          <ol className="demo-steps">
            <li data-done={read}>Read the dispatch note.</li>
            <li data-done={record !== undefined}>Inspect the evidence cards.</li>
            <li data-done={passed}>Type an answer and check it.</li>
          </ol>
          <details className="lab-hint"><summary>Field notes</summary><p>An ID is a short label that tells one item apart from another. Use the exact label from an evidence card.</p></details>
          <div className="demo-helpers" role="group" aria-label="Practice room hints">
            {(['giblet', 'bulldog'] as const).map((mascot) => (
              <button className="cast-member" type="button" data-sprite={mascot} key={mascot} onClick={() => setPopup({ kind: 'hint', mascot })}>
                <span className="cast-sprite" aria-hidden="true" />
                <span className="cast-name">{mascot === 'giblet' ? 'Ask Giblet' : 'Ask Jub'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="lab-console">
          <div className="lab-console-bar"><h3>Practice workspace</h3></div>
          <button type="button" className="filter mt-4" aria-expanded={noteOpen} aria-controls="demo-note" onClick={() => { setNoteOpen(!noteOpen); setRead(true) }}>{noteOpen ? 'Close dispatch note' : 'Open dispatch note'}</button>
          <p id="demo-note" hidden={!noteOpen} className="demo-note">{task.note}</p>
          <div className="demo-crates" role="group" aria-label="Inspect evidence">
            {task.evidence.map(([id], index) =>
              <button type="button" key={id} className="decision-tile demo-crate" aria-pressed={record === index} onClick={() => setRecord(index)}>
                <span aria-hidden="true">▣</span>{id}
              </button>
            )}
          </div>
          {record !== undefined && <p className="demo-note" role="status"><strong>{task.evidence[record][0]}</strong> · {task.evidence[record][1]}</p>}
          <form className="mt-4" onSubmit={check}>
            <label htmlFor="practice-answer" className="block font-bold">{task.prompt}</label>
            <input id="practice-answer" className="mt-2 w-full rounded border border-line bg-navy px-3 py-2 font-mono" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback('') }} placeholder="Type an ID from a card" maxLength={20} autoComplete="off" spellCheck={false} required />
            <button type="submit" className="lab-primary mt-3" disabled={!answer.trim()}>Check answer</button>
          </form>
          <p className="lab-result" role="status">{feedback}</p>
          {passed && (last
            ? <a className="primary-link" href={firstMission}>Start Stage 01 →</a>
            : <button type="button" className="primary-link" onClick={nextTask}>Next practice task →</button>)}
        </div>
      </div>

      {popup?.kind === 'tour' && (
        <GamePopup kind="tutorial" title={tour[popup.index].title} close={() => setPopup(null)}>
          <p className="eyebrow">{popup.index + 1} of {tour.length}</p>
          <p>{tour[popup.index].text}</p>
          <div className="game-popup-actions">
            <button type="button" className="filter" onClick={() => setPopup(null)}>Skip tour</button>
            <button type="button" className="lab-primary" onClick={() => setPopup(popup.index === tour.length - 1 ? null : { kind: 'tour', index: popup.index + 1 })}>
              {popup.index === tour.length - 1 ? 'Start practicing' : 'Next tip'}
            </button>
          </div>
        </GamePopup>
      )}
      {popup?.kind === 'hint' && (
        <GamePopup kind="tutorial" title={popup.mascot === 'giblet' ? 'Giblet’s hint' : 'Jub’s hint'} close={() => setPopup(null)}>
          <p>{task.hints[popup.mascot === 'giblet' ? 0 : 1]}</p>
          <div className="game-popup-actions"><button type="button" className="lab-primary" onClick={() => setPopup(null)}>Back to practice</button></div>
        </GamePopup>
      )}
      {popup?.kind === 'clear' && (
        <GamePopup kind="clear" title={last ? 'Practice complete!' : 'Practice task cleared!'} close={() => setPopup(null)}>
          <p>{last ? 'You’ve read clues, checked evidence, and solved cases. The campaign is ready when you are.' : 'You matched the evidence to the assignment. Try the next case.'}</p>
          <div className="game-popup-actions">
            {last ? <a className="lab-primary" href={firstMission}>Start Stage 01 →</a> : <button type="button" className="lab-primary" onClick={nextTask}>Next practice task →</button>}
          </div>
        </GamePopup>
      )}
    </section>
  )
}
