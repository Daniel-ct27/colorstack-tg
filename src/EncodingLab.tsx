import { useState } from 'react'
import { decodeLayer, restartNote, sealedNote } from './encoding.ts'

const tools = [['hex', 'Decode hex'], ['base64', 'Decode Base64'], ['reverse', 'Reverse characters'], ['url', 'Decode URL escapes']] as const

export function EncodingLab({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [layers, setLayers] = useState([{ label: 'Archived note', value: sealedNote }])
  const [feedback, setFeedback] = useState('')
  const current = layers[layers.length - 1]

  function apply(action: (typeof tools)[number][0], label: string) {
    try {
      const value = decodeLayer(current.value, action)
      if (value === current.value) {
        setFeedback('The tool changed nothing. Look for a different format.')
        return
      }
      setLayers([...layers, { label, value }])
      setFeedback('')
    } catch {
      setFeedback('That format does not fit this layer. Check the characters against the tool notes.')
    }
  }

  return (
    <section className="lab-workbench" aria-labelledby="encoding-title">
      <div className="lab-brief">
        <p className="eyebrow">Encoding and transformations</p>
        <h2 id="encoding-title">Unwrap the restart note.</h2>
        <p className="lab-lede">Each tool changed the output from the previous one. Inspect each layer and undo the transformations until the instruction reads like a sentence.</p>
        <details className="lab-hint" open><summary>Tool notes</summary><p>Hex uses two digits per byte. Base64 commonly ends in = padding. URL escapes look like %20. If the letters are readable but backwards, reverse them.</p></details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Decoding workbench</h3></div>
        <ol className="mt-4 grid gap-2">
          {layers.map(({ label, value }, index) => <li key={index} className="rounded border border-line bg-navy p-3">
            <strong className="text-sm">{label}</strong>
            <pre className="mt-1 whitespace-pre-wrap break-all text-sm">{value}</pre>
          </li>)}
        </ol>
        <div className="lab-controls">
          {tools.map(([action, label]) => <button className="filter" type="button" data-crew-action key={action} onClick={() => apply(action, label)} disabled={layers.length >= 8}>{label}</button>)}
          <button className="filter" type="button" disabled={layers.length === 1} onClick={() => { setLayers(layers.slice(0, -1)); setFeedback('') }}>Undo</button>
        </div>
        <button type="button" className="lab-primary mt-4" onClick={() => {
          const correct = current.value === restartNote
          setFeedback(correct ? 'Note recovered. Use this instruction on the recovery board.' : 'There is still a layer to undo. Inspect your most recent output.')
          if (correct && !solved) onSolve()
        }}>Verify the note</button>
        <p className="lab-result" role="status">{feedback}</p>
      </div>
    </section>
  )
}
