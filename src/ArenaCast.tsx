import { useState } from 'react'

const cast = [
  { id: 'nia', name: 'Nia', line: 'Dispatch here. The mission briefing has my handoff if you need it.' },
  { id: 'miles', name: 'Miles', line: 'I’m keeping the checklist. Any clues you earn will be on the evidence board.' },
  { id: 'giblet', name: 'Giblet', line: 'Gobble! If you get stuck, tap me in the lower corner for a hint.' },
  { id: 'bulldog', name: 'Fisk Bulldog', line: 'Woof! Keep going. The showcase crew is rooting for you.' },
] as const

export function ArenaCast() {
  const [selected, setSelected] = useState<(typeof cast)[number]>()
  const [reaction, setReaction] = useState(0)

  return (
    <aside className="arena-cast" aria-label="Showcase crew">
      <div className="cast-stage">
        {cast.map((member) => (
          <button className="cast-member" type="button" key={member.id} data-sprite={member.id} aria-pressed={selected?.id === member.id} onClick={() => {
            setSelected(member)
            setReaction((current) => current + 1)
          }}>
            <span className="cast-sprite" key={selected?.id === member.id ? reaction : 0} data-reacting={selected?.id === member.id} aria-hidden="true" />
            <span className="cast-name">{member.name}</span>
          </button>
        ))}
      </div>
      <p className="cast-dialogue" role="status">{selected ? `${selected.name}: ${selected.line}` : 'Tap a character to get a reaction.'}</p>
    </aside>
  )
}
