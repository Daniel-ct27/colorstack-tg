import { useState, type ReactNode } from 'react'
import { crewCases, crewNames, type CrewId } from './crew-story.ts'

const roles: Record<CrewId, string> = {
  nia: 'Dispatch',
  miles: 'Results desk',
  giblet: 'Hype crew',
  bulldog: 'Sideline mascot',
}

const chirps = {
  giblet: [[370, 490], [390, 290], [330, 440]],
  bulldog: [[180, 95], [205, 115]],
} as const

async function playMascotSound(id: keyof typeof chirps) {
  if (!window.AudioContext) return
  const audio = new AudioContext()
  try {
    await audio.resume()
    const start = audio.currentTime + .02
    chirps[id].forEach(([from, to], index) => {
      const sound = audio.createOscillator()
      const gain = audio.createGain()
      const time = start + index * .083
      sound.type = id === 'giblet' ? 'triangle' : 'sawtooth'
      sound.frequency.setValueAtTime(from, time)
      sound.frequency.exponentialRampToValueAtTime(to, time + .07)
      gain.gain.setValueAtTime(.001, time)
      gain.gain.exponentialRampToValueAtTime(.055, time + .015)
      gain.gain.exponentialRampToValueAtTime(.001, time + .07)
      sound.connect(gain).connect(audio.destination)
      sound.start(time)
      sound.stop(time + .075)
      if (index === chirps[id].length - 1) sound.onended = () => { void audio.close() }
    })
  } catch {
    if (audio.state !== 'closed') void audio.close()
  }
}

export function ArenaCast({ stage, actionCount, children }: { stage: number; actionCount: number; children: ReactNode }) {
  const [reactions, setReactions] = useState<Partial<Record<CrewId, { count: number; atAction: number }>>>({})
  const scene = crewCases[stage]

  function character(id: CrewId) {
    const tap = reactions[id]
    const responding = Boolean(actionCount && scene?.action.speaker === id && tap?.atAction !== actionCount)
    const mascot = id === 'giblet' || id === 'bulldog'
    const line = responding ? scene?.action.text : tap || !mascot ? scene?.lines[id] : undefined
    const noise = tap && mascot && !responding ? (id === 'giblet' ? 'Gobble!' : 'Woof!') : ''

    return (
      <aside className="cast-station" data-station={id} aria-label={`${crewNames[id]} · ${roles[id]}`}>
        <button className="cast-member" type="button" data-sprite={id} onClick={() => {
          setReactions((previous) => ({ ...previous, [id]: { count: (previous[id]?.count ?? 0) + 1, atAction: actionCount } }))
          if (mascot) void playMascotSound(id).catch(() => {})
        }}>
          <span className="cast-sprite" key={responding ? `action:${actionCount}` : tap?.count ?? 0} data-reacting={responding || Boolean(tap)} aria-hidden="true" />
          <span className="cast-name">{crewNames[id]}</span>
          <span className="cast-role">{roles[id]}</span>
        </button>
        <p className="cast-dialogue" role="status" hidden={!line}>
          {noise && <strong className="cast-noise">{noise} </strong>}{line}
        </p>
      </aside>
    )
  }

  return (
    <div className="arena-floor cast-around">
      {character('nia')}
      {character('miles')}
      {children}
      {character('giblet')}
      {character('bulldog')}
    </div>
  )
}
