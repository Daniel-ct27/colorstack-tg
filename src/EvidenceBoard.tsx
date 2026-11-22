import { stageStatus } from './progress.ts'

const clues = [
  { id: 1, name: 'Nightly export path', detail: 'The scheduler starts in /showcase. The script is nightly/scripts/export.sh.' },
  { id: 2, name: 'Report filter diff', detail: 'Commit ac2d4e1 dropped queued jobs. The repair kept the new title and sort order.' },
  { id: 3, name: 'Nightly export diagnosis', detail: 'At 21:42, the exporter read rows, but the nightly query returned records. Reading records and writing the report where the dashboard watches repairs both run modes.' },
  { id: 8, name: 'Recovery job order', detail: 'Mount the snapshot, rebuild the export, then refresh the dashboard.' },
]

export function EvidenceBoard({ completed }: { completed: readonly number[] }) {
  const collected = clues.filter(({ id }) => stageStatus(id, completed) === 'complete')
  return (
    <details id="evidence" className="evidence-board">
      <summary>Evidence board <small>{collected.length} {collected.length === 1 ? 'clue' : 'clues'} collected</small></summary>
      {collected.length ? (
        <ul>
          {collected.map(({ id, name, detail }) => (
            <li key={id}><small>Stage {String(id).padStart(2, '0')}</small><strong>{name}</strong><p>{detail}</p></li>
          ))}
        </ul>
      ) : <p className="mt-3 text-muted">Your first clue appears here when you solve Stage 01.</p>}
    </details>
  )
}
