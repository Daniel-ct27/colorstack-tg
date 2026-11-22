import { useState, type FormEvent } from 'react'

type Entry = { name: string; content?: string }
const files: Record<string, Entry[]> = {
  '/showcase': [
    { name: 'handoff.txt', content: 'Nia: The preview is for live demos. Tonight’s scheduler uses the script in the nightly project.' },
    { name: 'preview' }, { name: 'nightly' }, { name: 'archive' },
  ],
  '/showcase/preview': [{ name: 'scripts' }],
  '/showcase/nightly': [{ name: 'scripts' }],
  '/showcase/archive': [{ name: 'export.csv', content: 'Yesterday’s exported report. This file is output from the job.' }],
  '/showcase/preview/scripts': [{ name: 'export.sh', content: 'Preview export. Rebuilds the short report used during live demos.' }],
  '/showcase/nightly/scripts': [{ name: 'export.sh', content: 'Nightly export. Builds the full report for the overnight scheduler.' }],
}

export function HiddenSystem({ onSolve, solved }: { onSolve: () => void; solved: boolean }) {
  const [folder, setFolder] = useState('/showcase')
  const [openFile, setOpenFile] = useState<Entry>()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (answer.trim().replace(/^\.\//, '') === 'nightly/scripts/export.sh') {
      setFeedback(solved ? 'Correct. This case is already solved.' : 'Export located. Stage 02 is unlocked.')
      if (!solved) onSolve()
    } else {
      setFeedback('That path does not run the nightly export from /showcase. Check both clues.')
    }
  }

  return (
    <section className="lab-workbench" aria-labelledby="handoff-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="handoff-title">Trace the overnight export.</h2>
        <p className="lab-lede">The scheduler starts in <code>/showcase</code>. Open the handoff and explore the folders, then enter the relative path the scheduler should run.</p>
        <details className="lab-hint">
          <summary>Need a hint?</summary>
          <p>Both scripts share a name. Use the handoff to pick the correct folder, then trace the full path from the working directory.</p>
        </details>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Workstation evidence</h3></div>
        <section className="workstation-files" aria-label="Workstation file browser">
          <div className="lab-controls">
            <button type="button" className="filter" disabled={folder === '/showcase'} onClick={() => { setFolder(folder.slice(0, folder.lastIndexOf('/'))); setOpenFile(undefined) }}>↑ Parent folder</button>
            <code className="self-center break-all text-sm text-gold">{folder}</code>
          </div>
          <ul className="mt-2 grid gap-1">
            {files[folder].map((entry) => (
              <li key={entry.name}>
                <button type="button" className="filter w-full text-left font-mono text-sm" onClick={() => {
                  if (entry.content) setOpenFile(entry)
                  else { setFolder(folder + '/' + entry.name); setOpenFile(undefined) }
                }}>{entry.name}{entry.content ? '' : '/'}</button>
              </li>
            ))}
          </ul>
          {openFile && <div className="mt-3 rounded border border-line bg-navy p-3" role="status"><strong>{openFile.name}</strong><p className="mt-1 text-sm text-muted">{openFile.content}</p></div>}
        </section>
        <form className="mt-5" onSubmit={submit}>
          <label className="block text-sm font-semibold" htmlFor="export-path">Path relative to /showcase</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input id="export-path" className="min-w-0 flex-1 rounded border border-line bg-navy px-3 py-2 font-mono" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback('') }} autoComplete="off" spellCheck={false} required />
            <button className="lab-primary">Check path</button>
          </div>
        </form>
        <p className="lab-result" role="status">{feedback}</p>
      </div>
    </section>
  )
}
