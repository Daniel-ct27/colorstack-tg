export function DecisionTiles({ title, choices, value, onChange }: {
  title: string
  choices: readonly (readonly [string, string])[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="decision-row" role="group" aria-label={title}>
      <p className="decision-title">{title}</p>
      <div className="decision-tiles">
        {choices.map(([id, label]) => <button type="button" className="decision-tile" key={id} aria-pressed={value === id} onClick={() => onChange(id)}>{label}</button>)}
      </div>
    </div>
  )
}
