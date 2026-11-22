import { useEffect, useRef, type ReactNode } from 'react'

export function GamePopup({ kind, title, close, children }: {
  kind: 'briefing' | 'clear' | 'tutorial'
  title: string
  close: () => void
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const panel = dialog.current
    if (!panel) return
    const previous = document.activeElement
    panel.showModal()
    return () => {
      panel.close()
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog ref={dialog} className="game-popup" data-kind={kind} aria-labelledby="game-popup-title" onCancel={(event) => { event.preventDefault(); close() }}>
      <header>
        <p>{kind === 'tutorial' ? 'Practice guide' : kind === 'briefing' ? 'Mission briefing' : 'Checkpoint result'}</p>
        <button type="button" onClick={close} aria-label="Close popup" autoFocus>×</button>
      </header>
      <div className="game-popup-body">
        <h2 id="game-popup-title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}
