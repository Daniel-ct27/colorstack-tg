import { useState } from 'react'
import { crewCases, crewNames, type CrewId } from './crew-story.ts'

const cast = Object.keys(crewNames) as CrewId[]

export function ArenaCast({ stage, actionCount }: { stage: number; actionCount: number }) {
  const [selection, setSelection] = useState<{ id: CrewId; atAction: number }>()
  const [reaction, setReaction] = useState(0)
  const scene = crewCases[stage]
  const reactingToAction = actionCount > 0 && selection?.atAction !== actionCount
  const selected = reactingToAction ? scene?.action.speaker : selection?.id ?? scene?.lead
  const line = reactingToAction ? scene?.action.text : selected && scene?.lines[selected]

  return (
    <aside className="arena-cast" aria-label="Showcase crew">
      <div className="cast-stage">
        {cast.map((member) => (
          <button className="cast-member" type="button" key={member} data-sprite={member} aria-pressed={selected === member} onClick={() => {
            setSelection({ id: member, atAction: actionCount })
            setReaction((current) => current + 1)
          }}>
            <span className="cast-sprite" key={selected === member ? `${actionCount}:${reaction}` : "idle"} data-reacting={selected === member && (actionCount > 0 || reaction > 0)} aria-hidden="true" />
            <span className="cast-name">{crewNames[member]}</span>
          </button>
        ))}
      </div>
      <p className="cast-dialogue" role="status">{selected && line ? <><strong>{crewNames[selected]}</strong> · {line}</> : null}</p>
    </aside>
  )
}
