import { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, missionsForChapter, type Chapter } from './missions.ts'
import { MissingCommit } from './MissingCommit.tsx'
import { chapterScenes, evidenceNotes } from './story.ts'
import './style.css'

const progressKey = 'colorstack-code-hunt:missing-commit'

function App() {
  const [chapter, setChapter] = useState<Chapter | 'All'>('All')
  const [selected, setSelected] = useState<ReturnType<typeof missionsForChapter>[number]>()
  const [missingCommitSolved, setMissingCommitSolved] = useState(() => {
    try {
      return localStorage.getItem(progressKey) === 'solved'
    } catch {
      return false
    }
  })
  const [progressNotice, setProgressNotice] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const displayed = missionsForChapter(chapter)

  function recordMissingCommitSolve() {
    setMissingCommitSolved(true)
    try {
      localStorage.setItem(progressKey, 'solved')
    } catch {
      setProgressNotice('Browser storage is unavailable. This solve lasts until you reload the page.')
    }
  }

  useLayoutEffect(() => {
    if (selected) dialog.current?.showModal()
  }, [selected])

  return (
    <main className="shell" id="top">
      <header className="masthead">
        <a className="identity" href="#top">
          <img src="/art/fisk-colorstack.jpg" width="52" height="52" alt="" />
          <span><strong>ColorStack</strong><small>Fisk University</small></span>
        </a>
        <a className="nav-link" href="#missions">Case files <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero" aria-labelledby="title">
        <img className="hero-photo" src="/art/jubilee-hall.jpg" alt="" fetchPriority="high" />
        <div className="hero-content">
          <p className="eyebrow"><span className="signal" /> Thanksgiving Break · A Fisk ColorStack mystery</p>
          <h1 id="title">CODE <em>HUNT</em></h1>
          <p className="case-name">Operation Lost Access</p>
          <p className="hero-story">On the night before Thanksgiving, the student team’s showcase system goes dark. The last report is missing jobs, the services disagree, and the team has left campus. Reconstruct what happened before the post-break demo.</p>
          <a href="#missions" className="primary-link">Open the case files <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="missions" className="case-files" aria-labelledby="mission-title">
        <div className="case-heading">
          <div>
            <p className="eyebrow">Operation Lost Access</p>
            <h2 id="mission-title">The case files</h2>
          </div>
          <p>Follow the three chapters in order for the full story. Open any briefing to see the evidence you’ll need. Stage 02 is playable now.</p>
        </div>
        <div className="chapter-filters" role="group" aria-label="Filter missions by chapter">
          {(['All', ...chapters] as const).map((option) => (
            <button key={option} type="button" className="filter" aria-pressed={chapter === option} onClick={() => setChapter(option)}>
              {option === 'All' ? 'All chapters' : option}
            </button>
          ))}
        </div>
        <p className="case-count" role="status">{displayed.length} mission briefings</p>
        {progressNotice && <p className="mb-4 text-sm text-muted">{progressNotice}</p>}
        {chapters.filter((name) => chapter === 'All' || name === chapter).map((name) => {
          const scene = chapterScenes[name]
          return (
            <section className="chapter" key={name} aria-labelledby={scene.image}>
              <div className="chapter-scene">
                <img src={`/art/${scene.image}.jpg`} alt="" loading="lazy" />
                <div className="chapter-intro">
                  <p className="eyebrow">Chapter {scene.number}</p>
                  <h3 id={scene.image}>{name}</h3>
                  <p>{scene.story}</p>
                </div>
              </div>
              <ol className="mission-list">
                {displayed.filter((mission) => mission.chapter === name).map((mission) => (
                  <li key={mission.id}>
                    <button type="button" className="mission" onClick={() => setSelected(mission)}>
                      <span className="stage-number"><span className="sr-only">Stage </span>{String(mission.id).padStart(2, '0')}</span>
                      <span><strong>{mission.title}</strong><small>{mission.focus}</small></span>
                      <span className="mission-action">
                        {mission.id === 2 ? (missingCommitSolved ? 'Solved' : 'Play') : 'Briefing'} <span aria-hidden="true">↗</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </section>

      <footer className="site-footer">
        <p>ColorStack at Fisk University · A fictional campus mystery</p>
        <details>
          <summary>Photography credits</summary>
          <p><a href="https://commons.wikimedia.org/wiki/File:JubileeHallFiskU.jpg">Jubilee Hall by Fhaywood25</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, cropped and tinted in this layout)</p>
          <p>Chapter photos from Unsplash. <a href="https://unsplash.com/photos/QUHuwyNgSA0">Discovery</a> · <a href="https://unsplash.com/photos/RUyWmB5e-00">Investigation</a> · <a href="https://unsplash.com/photos/FjtWczJWRlc">Recovery</a></p>
        </details>
      </footer>

      <dialog ref={dialog} className="briefing" aria-labelledby="briefing-title" onClose={() => setSelected(undefined)}>
        <p className="font-mono text-sm text-gold">{selected?.chapter} · Stage {selected?.id}</p>
        <h2 id="briefing-title" className="mt-2 text-2xl font-bold">{selected?.title}</h2>
        <p className="mt-4 leading-relaxed text-muted">{selected && (evidenceNotes[selected.id] ?? selected.briefing)}</p>
        {selected?.id === 2 && <MissingCommit solved={missingCommitSolved} onSolve={recordMissingCommitSolve} progressNotice={progressNotice} />}
        <form method="dialog" className="mt-6">
          <button className="filter" autoFocus>Close briefing</button>
        </form>
      </dialog>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
