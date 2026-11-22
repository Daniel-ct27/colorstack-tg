import { useState } from 'react'

export function TrailMascot({ solvedStage }: { solvedStage: number | null }) {
  const [open, setOpen] = useState(false)
  const [dismissedStage, setDismissedStage] = useState<number | null>(null)
  const celebrating = solvedStage !== null && solvedStage !== dismissedStage
  const visible = open || celebrating

  function toggle() {
    if (visible) {
      setDismissedStage(solvedStage)
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <aside className="trail-mascot" aria-label="Thanksgiving mascot">
      <div className="mascot-bubble" id="mascot-message" hidden={!visible}>
        {celebrating ? (
          <><strong>Gobble. Case closed!</strong><p>{solvedStage === 1 ? 'You found the overnight export.' : 'The showcase report is back.'}</p></>
        ) : (
          <><strong>Meet Giblet</strong><p>Keep following the evidence. I’ll keep an eye on the leftovers.</p></>
        )}
      </div>
      <button type="button" className="mascot-toggle" data-celebrating={celebrating} aria-label={visible ? 'Close Giblet’s message' : 'Say hi to Giblet'} aria-expanded={visible} aria-controls="mascot-message" onClick={toggle}>
        <span key={celebrating ? solvedStage : 'idle'} aria-hidden="true">🦃</span>
      </button>
      <span className="sr-only" role="status">{celebrating ? 'Giblet says: Case closed!' : ''}</span>
    </aside>
  )
}
