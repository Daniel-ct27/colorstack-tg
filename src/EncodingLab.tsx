import { useState } from 'react'
import { archiveCopies, archiveTag, decodeLayer, dispatchTag, identifyArchive, type ArchiveCopy } from './encoding.ts'

const tools = [['hex', 'Decode hex'], ['base64', 'Decode Base64'], ['reverse', 'Reverse characters'], ['url', 'Decode URL escapes']] as const
const copies = ['amber', 'blue'] as const
const copyNames = { amber: 'Amber copy', blue: 'Blue copy' } as const
type Layer = { label: string; value: string }

export function EncodingLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [active, setActive] = useState<ArchiveCopy>('amber')
  const [layers, setLayers] = useState<Record<ArchiveCopy, Layer[]>>({
    amber: [{ label: 'Archived bytes', value: archiveCopies.amber }],
    blue: [{ label: 'Archived bytes', value: archiveCopies.blue }],
  })
  const [checked, setChecked] = useState<Partial<Record<ArchiveCopy, string>>>({})
  const [feedback, setFeedback] = useState('')
  const history = layers[active]
  const current = history[history.length - 1]

  function update(next: Layer[]) {
    setLayers({ ...layers, [active]: next })
    setChecked({ ...checked, [active]: undefined })
    setFeedback('')
  }

  function apply(action: (typeof tools)[number][0], label: string) {
    try {
      const value = decodeLayer(current.value, action)
      if (value === current.value) {
        setFeedback('That tool did not change the note. Try a different format.')
        return
      }
      update([...history, { label, value }])
    } catch {
      setFeedback('That tool could not read this layer. Compare the characters with its reference example.')
    }
  }

  function verify() {
    const values = { amber: layers.amber.at(-1)!.value, blue: layers.blue.at(-1)!.value }
    const result = identifyArchive(values, copies.filter((id) => checked[id] !== undefined), active)
    setFeedback(result.detail)
    if (result.passed && !solved) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="encoding-title">
      <div className="lab-brief">
        <p className="eyebrow">Encoding and transformations</p>
        <h2 id="encoding-title">Recover the right restart note.</h2>
        <p className="lab-lede">Two archived copies contain different instructions. Decode both, read their tags, and send Dispatch the one that matches the incident log.</p>
        <div className="rounded border border-line bg-navy p-3">
          <strong>Dispatch log · expected tag</strong>
          <p className="mt-1 font-mono text-xl text-gold">{dispatchTag}</p>
        </div>
        <details className="lab-hint"><summary>Tool reference</summary><dl className="mt-2 grid gap-2 text-sm text-muted">
          <div><dt className="font-bold">Base64</dt><dd>Uses letters, digits, + and /. It can end in =. Example: <code>SGk=</code>.</dd></div>
          <div><dt className="font-bold">URL escapes</dt><dd>A percent sign followed by two hex digits represents one character. Example: <code>Hi%20there</code>.</dd></div>
          <div><dt className="font-bold">Reverse</dt><dd>Reads the characters from the end to the start. Example: <code>iH</code>.</dd></div>
          <div><dt className="font-bold">Hex bytes</dt><dd>Pairs of digits from 0–9 and A–F. Example: <code>48 69</code>.</dd></div>
        </dl></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Decoding workbench</h3></div>
        <div className="lab-controls" role="group" aria-label="Archive copies">
          {copies.map((id) => <button className="filter" type="button" key={id} aria-pressed={active === id} onClick={() => { setActive(id); setFeedback('') }}>{copyNames[id]}{checked[id] ? ` · tag ${checked[id]}` : ''}</button>)}
        </div>
        <ol className="mt-4 grid gap-2">
          {history.map(({ label, value }, index) => <li key={index} className="rounded border border-line bg-navy p-3"><strong className="text-sm">{label}</strong><pre className="mt-1 whitespace-pre-wrap break-all text-sm">{value}</pre></li>)}
        </ol>
        <div className="lab-controls">
          {tools.map(([action, label]) => <button className="filter" type="button" data-crew-action key={action} onClick={() => apply(action, label)} disabled={history.length >= 8}>{label}</button>)}
          <button className="filter" type="button" disabled={history.length === 1} onClick={() => update(history.slice(0, -1))}>Undo</button>
          <button className="filter" type="button" onClick={() => {
            setChecked({ ...checked, [active]: archiveTag(current.value) })
            setFeedback('Tag recorded. If the note still looks scrambled, keep decoding and read the tag again.')
          }}>Read current tag</button>
        </div>
        <button type="button" className="lab-primary mt-4" onClick={verify}>Send this note to Dispatch</button>
        <p className="lab-result" role="status">{feedback}</p>
      </div>
    </section>
  )
}
