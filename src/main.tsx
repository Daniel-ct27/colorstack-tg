import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, missionsForChapter, type Chapter } from './missions.ts'
import { MissingCommit } from './MissingCommit.tsx'
import { chapterScenes, evidenceNotes } from './story.ts'
import './style.css'

const progressKey = 'colorstack-code-hunt:missing-commit'

const path = window.location.pathname
const match = /^\/missions\/(\d{2})\/?$/.exec(path)
const mission = match && missionsForChapter('All').find(({ id }) => id === Number(match[1]))

if (path !== '/') {
  document.title = mission ? `${mission.title} | ColorStack Code Hunt` : 'Case file not found | ColorStack Code Hunt'
}

function App() {
  const [chapter, setChapter] = useState<Chapter | 'All'>('All')
  const [missingCommitSolved, setMissingCommitSolved] = useState(() => {
    try {
      return localStorage.getItem(progressKey) === 'solved'
    } catch {
      return false
    }
  })
  const [progressNotice, setProgressNotice] = useState('')
  const displayed = missionsForChapter(chapter)

  function recordMissingCommitSolve() {
    setMissingCommitSolved(true)
    try {
      localStorage.setItem(progressKey, 'solved')
    } catch {
      setProgressNotice('Browser storage is unavailable. This solve lasts until you reload the page.')
    }
  }

  return (
    <main className="shell" id="top">
      <header className="masthead">
        <a className="identity" href="/">
          <img src="/art/fisk-colorstack.jpg" width="52" height="52" alt="" />
          <span><strong>ColorStack</strong><small>Fisk University</small></span>
        </a>
        <a className="nav-link" href="/#missions">Case files <span aria-hidden="true">↗</span></a>
      </header>

      {path !== '/' ? (
        <section className="case-files" aria-labelledby="case-title">
          <a className="nav-link inline-block" href="/#missions">← All case files</a>
          {mission ? (
            <>
              <p className="eyebrow mt-5">{mission.chapter} · Stage {String(mission.id).padStart(2, '0')} · {mission.focus}</p>
              <div className="case-heading mt-2"><h1 id="case-title">{mission.title}</h1></div>
              <p className="max-w-prose leading-relaxed text-muted">{evidenceNotes[mission.id] ?? mission.briefing}</p>
              {mission.id === 2 ? (
                <MissingCommit solved={missingCommitSolved} onSolve={recordMissingCommitSolve} progressNotice={progressNotice} />
              ) : (
                <p className="mt-6 text-sm text-gold">Briefing available. Playable investigation in development.</p>
              )}
              {mission.id < 10 && <a className="nav-link mt-6 inline-block" href={`/missions/${String(mission.id + 1).padStart(2, '0')}`}>Next case file →</a>}
            </>
          ) : (
            <h1 id="case-title" className="mt-4 text-3xl font-bold">Case file not found</h1>
          )}
        </section>
      ) : (
      <>
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
                    <a className="mission" href={`/missions/${String(mission.id).padStart(2, '0')}`}>
                      <span className="stage-number"><span className="sr-only">Stage </span>{String(mission.id).padStart(2, '0')}</span>
                      <span><strong>{mission.title}</strong><small>{mission.focus}</small></span>
                      <span className="mission-action">
                        {mission.id === 2 ? (missingCommitSolved ? 'Solved' : 'Play') : 'Briefing'} <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </section>
      </>
      )}

      <footer className="site-footer">
        <p>ColorStack at Fisk University · A fictional campus mystery</p>
        <details>
          <summary>Photography credits</summary>
          <p><a href="https://commons.wikimedia.org/wiki/File:JubileeHallFiskU.jpg">Jubilee Hall by Fhaywood25</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, cropped and tinted in this layout)</p>
          <p>Chapter photos from Unsplash. <a href="https://unsplash.com/photos/QUHuwyNgSA0">Discovery</a> · <a href="https://unsplash.com/photos/RUyWmB5e-00">Investigation</a> · <a href="https://unsplash.com/photos/FjtWczJWRlc">Recovery</a></p>
        </details>
      </footer>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
