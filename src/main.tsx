import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, missionsForChapter, type Chapter } from './missions.ts'
import { MissingCommit } from './MissingCommit.tsx'
import { chapterScenes, evidenceNotes } from './story.ts'
import { HiddenSystem } from './HiddenSystem.tsx'
import { stageStatus } from './progress.ts'
import './style.css'

const progressKey = 'colorstack-code-hunt:completed-stages'

function missionUrl(id: number) {
  return `/missions/${String(id).padStart(2, '0')}`
}

const path = window.location.pathname
const match = /^\/missions\/(\d{2})\/?$/.exec(path)
const mission = match && missionsForChapter('All').find(({ id }) => id === Number(match[1]))

if (path !== '/') {
  document.title = mission ? `${mission.title} | ColorStack Code Hunt` : 'Case file not found | ColorStack Code Hunt'
}

function App() {
  const [chapter, setChapter] = useState<Chapter | 'All'>('All')
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(progressKey) ?? '[]')
      const ids = Array.isArray(saved) ? saved.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 10) : []
      if (localStorage.getItem('colorstack-code-hunt:missing-commit') === 'solved' && !ids.includes(2)) ids.push(2)
      return ids
    } catch {
      return []
    }
  })
  const [progressNotice, setProgressNotice] = useState('')
  const displayed = missionsForChapter(chapter)
  const allMissions = missionsForChapter('All')
  const current = allMissions.find(({ id }) => stageStatus(id, completed) === 'current')
  const completedCount = allMissions.filter(({ id }) => stageStatus(id, completed) === 'complete').length

  function recordSolve(id: number) {
    if (stageStatus(id, completed) !== 'current') return
    const updated = [...completed, id]
    setCompleted(updated)
    try {
      localStorage.setItem(progressKey, JSON.stringify(updated))
    } catch {
      setProgressNotice('Browser storage is unavailable. Progress cannot follow you to another page.')
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
              {stageStatus(mission.id, completed) === 'locked' ? (
                <div className="stage-lock">
                  <h2 className="font-bold text-gold">Stage locked</h2>
                  <p className="mt-1 text-muted">Complete the earlier missions to open this case file.</p>
                  {current && <a className="nav-link mt-2 inline-block" href={missionUrl(current.id)}>Go to Stage {String(current.id).padStart(2, '0')} →</a>}
                </div>
              ) : (
                <>
                  <p className="max-w-prose leading-relaxed text-muted">{evidenceNotes[mission.id] ?? mission.briefing}</p>
                  {mission.id === 1 ? (
                    <HiddenSystem solved={completed.includes(1)} onSolve={() => recordSolve(1)} />
                  ) : mission.id === 2 ? (
                    <MissingCommit solved={completed.includes(2)} onSolve={() => recordSolve(2)} progressNotice="" />
                  ) : (
                    <p className="mt-6 text-sm text-gold">Briefing available. Playable investigation in development.</p>
                  )}
                  {progressNotice && <p className="mt-4 text-sm text-gold" role="status">{progressNotice}</p>}
                  {mission.id < allMissions.length && stageStatus(mission.id, completed) === 'complete' && !progressNotice && (
                    <a className="primary-link" href={missionUrl(mission.id + 1)}>Next stage →</a>
                  )}
                </>
              )}
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
            <h2 id="mission-title">Mission path</h2>
          </div>
          <p>Follow the evidence through three chapters. Solving your current stage opens the next case file.</p>
        </div>
        <div className="chapter-filters" role="group" aria-label="Filter missions by chapter">
          {(['All', ...chapters] as const).map((option) => (
            <button key={option} type="button" className="filter" aria-pressed={chapter === option} onClick={() => setChapter(option)}>
              {option === 'All' ? 'All chapters' : option}
            </button>
          ))}
        </div>
        <p className="case-count" role="status">{completedCount} of {allMissions.length} stages solved</p>
        {current && <a className="nav-link path-resume" href={missionUrl(current.id)}>{completedCount ? 'Continue' : 'Start'} Stage {String(current.id).padStart(2, '0')} →</a>}
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
              <ol className="mission-list mission-path">
                {displayed.filter((mission) => mission.chapter === name).map((mission) => {
                  const status = stageStatus(mission.id, completed)
                  const contents = (
                    <>
                      <span className="stage-number"><span className="sr-only">Stage </span>{String(mission.id).padStart(2, '0')}</span>
                      <span><strong>{mission.title}</strong><small>{mission.focus}</small></span>
                      <span className="mission-action">
                        {status === 'locked' ? 'Locked' : status === 'complete' ? 'Solved' : 'Current'}
                      </span>
                    </>
                  )
                  return (
                    <li key={mission.id}>
                      {status === 'locked' ? (
                        <div className="mission" data-state={status}>{contents}</div>
                      ) : (
                        <a className="mission" data-state={status} href={missionUrl(mission.id)} aria-current={status === 'current' ? 'step' : undefined}>{contents}</a>
                      )}
                    </li>
                  )
                })}
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
