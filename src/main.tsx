import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, missionsForChapter, type Chapter } from './missions.ts'
import { MissingCommit } from './MissingCommit.tsx'
import { chapterScenes, evidenceNotes, missionScenes } from './story.ts'
import { HiddenSystem } from './HiddenSystem.tsx'
import { stageStatus } from './progress.ts'
import { CampusBackdrop } from './CampusBackdrop.tsx'
import { TrailMascot } from './TrailMascot.tsx'
import { EvidenceBoard } from './EvidenceBoard.tsx'
import { ExportTimeline } from './ExportTimeline.tsx'
import { RecoveryJobs } from './RecoveryJobs.tsx'
import { GatewayLab } from './GatewayLab.tsx'
import { SignalsLab } from './SignalsLab.tsx'
import { RelayLab } from './RelayLab.tsx'
import { EncodingLab } from './EncodingLab.tsx'
import { ReconcileLab } from './ReconcileLab.tsx'
import { FinaleLab } from './FinaleLab.tsx'
import { GamePopup } from './GamePopup.tsx'
import './style.css'

const progressKey = 'colorstack-code-hunt:completed-stages'

const chapterContacts: Partial<Record<Chapter, { name: string; note: string }>> = {
  Investigation: { name: 'Nia · Dispatch', note: 'I saved the retries and the handoff notes. Follow the job IDs when the timestamps get messy.' },
  Recovery: { name: 'Miles · Rehearsal crew', note: 'The room is ready. I’ll hold the public dashboard until your rehearsal clears.' },
}

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
  const [playtest, setPlaytest] = useState(() => {
    if (!import.meta.env.DEV) return false
    try { return sessionStorage.getItem('colorstack:playtest') !== 'off' }
    catch { return true }
  })

  function togglePlaytest() {
    setPlaytest(!playtest)
    setPreviewSolved(null)
    setRevealedSolve(null)
    setDismissedClear(null)
    try { sessionStorage.setItem('colorstack:playtest', playtest ? 'off' : 'on') }
    catch { /* The setting still works on this page. */ }
  }
  const [previewSolved, setPreviewSolved] = useState<number | null>(null)
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
  const [justSolved, setJustSolved] = useState<number | null>(null)
  const [briefingOpen, setBriefingOpen] = useState(false)
  const [dismissedClear, setDismissedClear] = useState<number | null>(null)
  const [revealedSolve, setRevealedSolve] = useState<number | null>(null)

  useEffect(() => {
    const stage = justSolved ?? previewSolved
    if (stage === null) return
    const timer = window.setTimeout(() => setRevealedSolve(stage), 1000)
    return () => window.clearTimeout(timer)
  }, [justSolved, previewSolved])
  const displayed = missionsForChapter(chapter)
  const allMissions = missionsForChapter('All')
  const current = allMissions.find(({ id }) => stageStatus(id, completed) === 'current')
  const completedCount = allMissions.filter(({ id }) => stageStatus(id, completed) === 'complete').length

  function recordSolve(id: number) {
    const status = stageStatus(id, completed)
    if (status === 'locked' && playtest) setPreviewSolved(id)
    if (status !== 'current') return
    const updated = [...completed, id]
    setCompleted(updated)
    setJustSolved(id)
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
          <img src="/art/fisk-colorstack.jpg" width="128" height="128" alt="" />
          <span><strong>ColorStack</strong><small>Fisk University</small></span>
        </a>
        <a className="nav-link masthead-cases" href="/#missions">Case files <span aria-hidden="true">↗</span></a>
      </header>
      {import.meta.env.DEV && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded border border-line bg-panel px-4 py-2">
          <p className="text-sm text-muted">{playtest ? 'Playtest mode · All case files are open. Out-of-order solves do not change campaign progress.' : 'Campaign mode · Solve each case to unlock the next.'}</p>
          <button className="filter text-sm" type="button" aria-pressed={playtest} onClick={togglePlaytest}>Playtest mode</button>
        </div>
      )}

      {mission && (
        <nav className="campaign-hud" aria-label="Campaign checkpoints">
          <a className="hud-back" href="/#missions">← Course map</a>
          <ol>
            {allMissions.map(({ id, title }) => {
              const status = stageStatus(id, completed)
              const active = id === mission.id
              const label = `Stage ${id}: ${title}${status === 'locked' ? (playtest ? ', preview' : ', locked') : status === 'complete' ? ', solved' : ''}`
              return (
                <li key={id} data-state={status}>
                  {active ? (
                    <span aria-current="step" aria-label={label}>{id}</span>
                  ) : status !== 'locked' || playtest ? (
                    <a href={missionUrl(id)} aria-label={label}>{status === 'complete' ? '✓' : id}</a>
                  ) : (
                    <span aria-label={label}>{id}</span>
                  )}
                </li>
              )
            })}
          </ol>
          <span className="hud-count">{completedCount}/{allMissions.length} cleared</span>
        </nav>
      )}
      {path !== '/' ? (
        <section className="case-files" aria-labelledby="case-title">
          {!mission && <a className="nav-link inline-block" href="/#missions">← Course map</a>}
          {mission ? (
            <>
              <div className="arena-banner" data-chapter={mission.chapter}>
                <span className="arena-number" aria-hidden="true">{String(mission.id).padStart(2, '0')}</span>
                <div>
                  <p className="eyebrow">{mission.chapter} · Stage {String(mission.id).padStart(2, '0')} · {mission.focus}</p>
                  <h1 id="case-title">{mission.title}</h1>
                </div>
                <button type="button" className="arena-briefing" onClick={() => setBriefingOpen(true)}>Mission briefing ↗</button>
              </div>
              {!playtest && stageStatus(mission.id, completed) === 'locked' ? (
                <div className="stage-lock">
                  <h2 className="font-bold text-gold">Stage locked</h2>
                  <p className="mt-1 text-muted">Complete the earlier missions to open this case file.</p>
                  {current && <a className="nav-link mt-2 inline-block" href={missionUrl(current.id)}>Go to Stage {String(current.id).padStart(2, '0')} →</a>}
                </div>
              ) : (
                <>
                  <div className="arena-floor">
                  {mission.id === 1 ? (
                    <HiddenSystem solved={completed.includes(1) || previewSolved === 1} onSolve={() => recordSolve(1)} />
                  ) : mission.id === 2 ? (
                    <MissingCommit solved={completed.includes(2) || previewSolved === 2} onSolve={() => recordSolve(2)} progressNotice="" />
                  ) : mission.id === 3 ? (
                    <ExportTimeline solved={completed.includes(3) || previewSolved === 3} onSolve={() => recordSolve(3)} />
                  ) : mission.id === 4 ? (
                    <GatewayLab solved={completed.includes(4) || previewSolved === 4} onSolve={() => recordSolve(4)} />
                  ) : mission.id === 5 ? (
                    <SignalsLab solved={completed.includes(5) || previewSolved === 5} onSolve={() => recordSolve(5)} />
                  ) : mission.id === 6 ? (
                    <RelayLab solved={completed.includes(6) || previewSolved === 6} onSolve={() => recordSolve(6)} />
                  ) : mission.id === 7 ? (
                    <EncodingLab solved={completed.includes(7) || previewSolved === 7} onSolve={() => recordSolve(7)} />
                  ) : mission.id === 9 ? (
                    <ReconcileLab solved={completed.includes(9) || previewSolved === 9} onSolve={() => recordSolve(9)} />
                  ) : mission.id === 10 ? (
                    <FinaleLab solved={completed.includes(10) || previewSolved === 10} onSolve={() => recordSolve(10)} />
                  ) : mission.id === 8 ? (
                    <RecoveryJobs solved={completed.includes(8) || previewSolved === 8} onSolve={() => recordSolve(8)} />
                  ) : (
                    <p className="mt-6 text-sm text-gold">Briefing available. Playable investigation in development.</p>
                  )}
                  </div>
                  {previewSolved === mission.id && <p className="mt-4 text-sm text-gold">Playtest solve verified. Campaign progress is unchanged.</p>}
                  {progressNotice && <p className="mt-4 text-sm text-gold" role="status">{progressNotice}</p>}
                  {stageStatus(mission.id, completed) === 'complete' && (justSolved !== mission.id || revealedSolve === mission.id) && !progressNotice && (
                    <div className="case-unlock" data-new={justSolved === mission.id}>
                    <span className="case-stamp">Case solved</span>
                    {mission.id < allMissions.length ? (
                      <a className="primary-link" href={missionUrl(mission.id + 1)}>Open next case →</a>
                    ) : (
                      <a className="primary-link" href="/#missions">Return to the completed case files →</a>
                    )}
                  </div>
                  )}
                </>
              )}
            </>
          ) : (
            <h1 id="case-title" className="mt-4 text-3xl font-bold">Case file not found</h1>
          )}
          <EvidenceBoard completed={completed} />
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
          <a href="#missions" className="primary-link">View course map <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section id="missions" className="case-files game-map" aria-labelledby="mission-title">
        <div className="case-heading">
          <div>
            <p className="eyebrow">Operation Lost Access</p>
            <h2 id="mission-title">Course map</h2>
          </div>
          <p>Follow the route from Discovery to Recovery. Clear a checkpoint to open the next case.</p>
        </div>
        <div className="trail-summary">
          <div>
            <p className="eyebrow">{current ? 'Next case' : 'Investigation complete'}</p>
            <h3>{current?.title ?? 'All case files solved'}</h3>
            {current && <p className="trail-detail">{current.chapter} · Stage {String(current.id).padStart(2, '0')}</p>}
            {current && <a className="primary-link" href={missionUrl(current.id)}>{completedCount ? 'Continue investigation' : 'Start investigation'} <span aria-hidden="true">→</span></a>}
          </div>
          <div className="trail-progress">
            <p><strong>{completedCount}/{allMissions.length}</strong> stages solved</p>
            <div className="trail-ticks" aria-hidden="true">
              {allMissions.map(({ id }) => <span key={id} data-state={stageStatus(id, completed)} />)}
            </div>
          </div>
        </div>
        <EvidenceBoard completed={completed} />
        <div className="chapter-filters" role="group" aria-label="Filter missions by chapter">
          {(['All', ...chapters] as const).map((option) => (
            <button key={option} type="button" className="filter" aria-pressed={chapter === option} onClick={() => setChapter(option)}>
              {option === 'All' ? 'All chapters' : option}
            </button>
          ))}
        </div>
        {progressNotice && <p className="mb-4 text-sm text-muted">{progressNotice}</p>}
        {chapters.filter((name) => chapter === 'All' || name === chapter).map((name) => {
          const scene = chapterScenes[name]
          const contact = chapterContacts[name]
          return (
            <section className="chapter" key={name} aria-labelledby={scene.image}>
              <div className="chapter-scene">
                <img src={`/art/${scene.image}.jpg`} alt="" loading="lazy" />
                <div className="chapter-intro">
                  <p className="eyebrow">Chapter {scene.number}</p>
                  <h3 id={scene.image}>{name}</h3>
                  <p>{scene.story}</p>
                  {contact && <div className="chapter-contact"><strong>{contact.name}</strong><p>{contact.note}</p></div>}
                </div>
              </div>
              <ol className="course-track">
                {displayed.filter((mission) => mission.chapter === name).map((mission) => {
                  const status = stageStatus(mission.id, completed)
                  const contents = (
                    <>
                      <span className="stage-number"><span className="sr-only">Stage </span>{String(mission.id).padStart(2, '0')}</span>
                      <strong className="course-title">{mission.title}</strong>
                      <span className="mission-action">
                        {status === 'locked' ? (playtest ? 'Preview' : 'Locked') : status === 'complete' ? 'Cleared' : 'Play →'}
                      </span>
                    </>
                  )
                  return (
                    <li key={mission.id}>
                      {status === 'locked' && !playtest ? (
                        <div className="course-stop" data-state={status}>{contents}</div>
                      ) : (
                        <a className="course-stop" data-state={status === 'locked' && playtest ? 'preview' : status} href={missionUrl(mission.id)} aria-current={status === 'current' ? 'step' : undefined}>{contents}</a>
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

      {mission && briefingOpen && (
        <GamePopup kind="briefing" title={mission.title} close={() => setBriefingOpen(false)}>
          {missionScenes[mission.id] && <p>{missionScenes[mission.id]?.opening}</p>}
          <h3>Your assignment</h3>
          <p>{evidenceNotes[mission.id] ?? mission.briefing}</p>
          {missionScenes[mission.id] && <><h3>What to carry forward</h3><p>{missionScenes[mission.id]?.handoff}</p></>}
          <div className="game-popup-actions"><button type="button" className="lab-primary" onClick={() => setBriefingOpen(false)}>Back to the mission</button></div>
        </GamePopup>
      )}
      {mission && !briefingOpen && revealedSolve === mission.id && dismissedClear !== mission.id && (
        <GamePopup kind="clear" title={mission.id === allMissions.length && justSolved === mission.id ? 'Campaign cleared!' : 'Checkpoint cleared!'} close={() => setDismissedClear(mission.id)}>
          <div className="clear-medal" aria-hidden="true">✓</div>
          <p>{mission.title}</p>
          <p>{previewSolved === mission.id ? 'Playtest complete. Campaign progress is unchanged.' : 'New clue pinned to the evidence board.'}</p>
          <div className="game-popup-actions">
            <button type="button" className="filter" onClick={() => setDismissedClear(mission.id)}>Keep playing</button>
            {!progressNotice && (mission.id < allMissions.length
              ? <a className="lab-primary" href={missionUrl(mission.id + 1)}>Continue to Stage {String(mission.id + 1).padStart(2, '0')} →</a>
              : <a className="lab-primary" href="/#missions">Return to course map →</a>)}
          </div>
        </GamePopup>
      )}
      <TrailMascot solvedStage={justSolved === revealedSolve && dismissedClear !== revealedSolve ? revealedSolve : null} activeStage={mission && (stageStatus(mission.id, completed) === 'current' || (playtest && !completed.includes(mission.id))) ? mission.id : undefined} />
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

createRoot(document.getElementById('root')!).render(<><CampusBackdrop /><App /></>)
