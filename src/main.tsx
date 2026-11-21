import { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, missionsForChapter, type Chapter } from './missions.ts'
import './style.css'

function App() {
  const [chapter, setChapter] = useState<Chapter | 'All'>('All')
  const [selected, setSelected] = useState<ReturnType<typeof missionsForChapter>[number]>()
  const dialog = useRef<HTMLDialogElement>(null)
  const displayed = missionsForChapter(chapter)

  useLayoutEffect(() => {
    if (selected) dialog.current?.showModal()
  }, [selected])

  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-10">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-6">
        <span className="font-bold text-gold">ColorStack <span className="text-ink">/ Fisk University</span></span>
        <a className="text-muted hover:text-gold" href="#missions">Mission dashboard</a>
      </header>

      <section className="hero" aria-labelledby="title">
        <p className="font-mono text-sm uppercase tracking-widest text-gold">Operation Lost Access</p>
        <h1 id="title" className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Code <span className="text-gold">Hunt</span></h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">A development system has gone offline. Follow the evidence across three chapters to find out what happened and reconstruct the recovery.</p>
        <a href="#missions" className="mt-7 inline-block rounded-md bg-gold px-5 py-3 font-bold text-navy">Explore missions <span aria-hidden="true">↓</span></a>
      </section>

      <section id="missions" className="scroll-mt-6" aria-labelledby="mission-title">
        <h2 id="mission-title" className="text-3xl font-bold">Mission dashboard</h2>
        <div className="my-5 flex flex-wrap gap-2" role="group" aria-label="Filter missions by chapter">
          {(['All', ...chapters] as const).map((option) => (
            <button key={option} type="button" className="filter" aria-pressed={chapter === option} onClick={() => setChapter(option)}>
              {option === 'All' ? 'All chapters' : option}
            </button>
          ))}
        </div>
        <p className="mb-4 text-sm text-muted" role="status">{displayed.length} mission briefings</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((mission) => (
            <li key={mission.id}>
              <button type="button" className="mission" onClick={() => setSelected(mission)}>
                <span className="font-mono text-sm text-gold">Stage {String(mission.id).padStart(2, '0')} · {mission.chapter}</span>
                <span className="mt-2 block text-xl font-bold">{mission.title}</span>
                <span className="mt-1 block text-sm text-muted">{mission.focus}</span>
                <span className="mt-5 block text-sm font-semibold text-gold">View briefing <span aria-hidden="true">↗</span></span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <dialog ref={dialog} className="briefing" aria-labelledby="briefing-title" onClose={() => setSelected(undefined)}>
        <p className="font-mono text-sm text-gold">{selected?.chapter} · Stage {selected?.id}</p>
        <h2 id="briefing-title" className="mt-2 text-2xl font-bold">{selected?.title}</h2>
        <p className="mt-4 leading-relaxed text-muted">{selected?.briefing}</p>
        <form method="dialog" className="mt-6">
          <button className="filter" autoFocus>Close briefing</button>
        </form>
      </dialog>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
