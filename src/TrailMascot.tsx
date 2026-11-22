import { useState } from 'react'

const hints: Readonly<Partial<Record<number, [string, string]>>> = {
  1: ['Compare the handoff with the directory listing. The filename appears twice.', 'Start at /showcase and follow the nightly folder. Your answer should be relative to /showcase.'],
  2: ['Test the report first. Which requirement actually fails?', 'Use git show to inspect the commit that touched the status list. A change to sorting or the title cannot restore missing jobs.'],
  3: ['Compare the keys the query returns in each run. Which one is the exporter trying to read?', 'Use the key both runs provide. Then compare their working directories and point the exporter to the full path the dashboard watches.'],
  4: ['Compare the first gateway response with the two dashboard entries. Where is the array?', 'Read each job from jobs. Match the ID and state from a gateway row, then translate waiting and done into the dashboard vocabulary.'],
  8: ['Find the job with no prerequisite. It should go first.', 'The export needs a mounted snapshot, and the dashboard needs an exported report.'],
}

export function TrailMascot({ solvedStage, activeStage }: { solvedStage: number | null; activeStage?: number }) {
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const [dismissedStage, setDismissedStage] = useState<number | null>(null)
  const celebrating = solvedStage !== null && solvedStage !== dismissedStage
  const visible = open || celebrating
  const hint = activeStage === undefined ? undefined : hints[activeStage]

  function toggle() {
    if (visible) {
      setDismissedStage(solvedStage)
      setOpen(false)
      setMore(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <aside className="trail-mascot" aria-label="Thanksgiving mascot">
      <div className="mascot-bubble" id="mascot-message" hidden={!visible}>
        {celebrating ? (
          <><strong>Gobble. Case closed!</strong><p>Check your evidence board for the clue you just earned.</p></>
        ) : hint ? (
          <>
            <strong>Giblet’s hint</strong>
            <p>{hint[0]}</p>
            <button type="button" className="mascot-hint-button" aria-expanded={more} aria-controls="mascot-second-hint" onClick={() => setMore(!more)}>
              {more ? 'Hide second hint' : 'Give me another nudge'}
            </button>
            <p id="mascot-second-hint" hidden={!more}>{hint[1]}</p>
          </>
        ) : (
          <><strong>Meet Giblet</strong><p>Open your current case and tap me if you get stuck.</p></>
        )}
      </div>
      <button type="button" className="mascot-toggle" data-celebrating={celebrating} aria-label={visible ? 'Close Giblet’s message' : hint ? 'Ask Giblet for a hint' : 'Say hi to Giblet'} aria-expanded={visible} aria-controls="mascot-message" onClick={toggle}>
        <span key={celebrating ? solvedStage : 'idle'} aria-hidden="true">🦃</span>
      </button>
      <span className="sr-only" role="status">{celebrating ? 'Giblet says: Case closed!' : ''}</span>
    </aside>
  )
}
