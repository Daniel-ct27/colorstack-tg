import { useState } from 'react'
import { checkExport, initialConfig } from './export-debug.ts'

const logs = {
  'Scheduled run': [
    '21:41:58 INFO  scheduler cwd=/showcase/nightly',
    '21:41:59 INFO  query completed count=3 output.keys=[records]',
    '21:42:00 INFO  exporter read inputKey=rows count=0',
    '21:42:00 WARN  exporter skipped writing: empty input',
    '21:42:01 INFO  dashboard watches /showcase/reports/report.json',
  ],
  'Manual retry': [
    '23:57:00 INFO  retry cwd=/showcase compatibility=true',
    '23:57:01 INFO  query completed count=3 output.keys=[records,rows]',
    '23:57:01 INFO  exporter read inputKey=rows count=3',
    '23:57:02 INFO  exporter wrote /showcase/reports/report.json',
  ],
  'Empty run': [
    '03:00:10 INFO  query completed count=0 output.keys=[records]',
    '03:00:11 INFO  exporter skipped writing: empty input',
    '03:00:12 INFO  dashboard kept previous report',
  ],
} as const

export function ExportTimeline({ solved, onSolve }: { solved: boolean; onSolve: () => void }) {
  const [selected, setSelected] = useState<keyof typeof logs>('Scheduled run')
  const [compare, setCompare] = useState(false)
  const [source, setSource] = useState(initialConfig)
  const [result, setResult] = useState<ReturnType<typeof checkExport>>()

  function verify() {
    const next = checkExport(source)
    setResult(next)
    if (next.checks?.every(({ passed }) => passed) && !solved) onSolve()
  }

  return (
    <section className="lab-workbench" aria-labelledby="timeline-title">
      <div className="lab-brief">
        <p className="eyebrow">Your objective</p>
        <h2 id="timeline-title">Get the nightly export writing again.</h2>
        <p className="lab-lede">The query found jobs, but the scheduled export wrote nothing. Compare the scheduled run with the manual retry, then edit the exporter config. Empty runs should still leave yesterday’s report alone.</p>
      </div>
      <div className="lab-console">
        <div className="lab-console-bar"><h3>Export logs</h3></div>
        <div className="timeline-events" role="group" aria-label="Choose a run to inspect">
          {(Object.keys(logs) as (keyof typeof logs)[]).map((name) => <button key={name} className="filter" type="button" aria-pressed={!compare && selected === name} onClick={() => { setSelected(name); setCompare(false) }}>{name}</button>)}
          <button className="filter" type="button" aria-pressed={compare} onClick={() => setCompare(!compare)}>Compare scheduled vs. retry</button>
        </div>
        {compare ? (
          <div className="run-comparison">
            {(['Scheduled run', 'Manual retry'] as const).map((name) => (
              <section key={name} aria-label={`${name} comparison`}>
                <h4>{name}</h4>
                <pre className="whitespace-pre-wrap break-words font-mono text-sm">{logs[name].join('\n')}</pre>
              </section>
            ))}
          </div>
        ) : (
          <pre className="mt-4 whitespace-pre-wrap break-words rounded border border-line bg-navy p-3 font-mono text-sm" aria-label={`${selected} log`}>{logs[selected].join('\n')}</pre>
        )}
        <form className="mt-5" onSubmit={(event) => { event.preventDefault(); verify() }}>
          <label className="block font-semibold" htmlFor="export-config">export.config.json</label>
          <textarea id="export-config" className="mt-2 w-full rounded border border-line bg-navy p-3 font-mono" rows={5} spellCheck={false} value={source} onChange={(event) => { setSource(event.target.value); setResult(undefined) }} />
          <button className="lab-primary mt-2" type="submit">Run export checks</button>
        </form>
        <div className="mt-4 space-y-2" role="status">
          {result?.error && <p className="lab-fail">{result.error}</p>}
          {result?.checks && (
            <ul className="space-y-1">
              {result.checks.map(({ label, passed }) => <li key={label} className={passed ? 'lab-pass' : 'lab-fail'}><strong>{passed ? 'PASS' : 'FAIL'}</strong> · {label}</li>)}
            </ul>
          )}
          {result?.checks?.every(({ passed }) => passed) && <p className="lab-result">Export repaired. All four checks passed.</p>}
        </div>
      </div>
    </section>
  )
}
