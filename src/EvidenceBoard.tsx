import { stageStatus } from './progress.ts'

const clues = [
  { id: 1, name: 'Nightly export path', detail: 'The scheduler starts in /showcase. The script is nightly/scripts/export.sh.' },
  { id: 2, name: 'Report filter diff', detail: 'Commit ac2d4e1 dropped queued jobs. The repair kept the new title and sort order.' },
  { id: 3, name: 'Nightly export diagnosis', detail: 'At 21:42, the exporter read rows, but the nightly query returned records. Reading records and writing the report where the dashboard watches repairs both run modes.' },
  { id: 4, name: 'Gateway field mapping', detail: 'Use the live jobs list, stable dispatch tickets, and phase codes. K2 is queued and Q7 is completed.' },
  { id: 5, name: 'Showcase failure window', detail: 'Run J-61 was complete at 21:39 and incomplete by 21:43. Inspect service activity between those dashboard refreshes.' },
  { id: 6, name: 'Delivery policy', detail: 'Wait for the commit acknowledgement. Retry after its deadline using the original delivery ID.' },
  { id: 7, name: 'Restart note', detail: 'Mount snapshot before export.' },
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
