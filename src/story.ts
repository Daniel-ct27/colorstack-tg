import type { Chapter } from './missions.ts'

export const chapterScenes = {
  Discovery: {
    number: 'I',
    image: 'discovery',
    story: 'Start at the last workstation used before the holiday. A forgotten directory, a changed report, and a quiet failure give you the first pieces of the timeline.',
  },
  Investigation: {
    number: 'II',
    image: 'investigation',
    story: 'Follow the trail beyond the workstation. Compare service records and decode a handoff note to find out where the showcase data stopped moving.',
  },
  Recovery: {
    number: 'III',
    image: 'recovery',
    story: 'Put the pieces back in order. Resolve the stalled jobs, reconcile the services, and use the evidence you collected to bring the showcase back online.',
  },
} satisfies Record<Chapter, { number: string; image: string; story: string }>

export const evidenceNotes: Readonly<Record<number, string>> = {
  1: 'The last student on shift left a directory listing with the handoff notes. Find the project that generated the showcase report.',
  2: 'The last report still runs, but half the team’s work has vanished from it. Compare the history to determine which change altered what the report includes.',
  3: 'The scheduled export stopped writing files without raising an alarm. Read the test output and find where the export went quiet.',
  4: 'The report and the showcase dashboard expect different formats. Compare the sample responses to reconstruct the format they can both use.',
  5: 'The job records are full of routine activity. Narrow them down to the entries that establish when the report went incomplete.',
  6: 'Two services began a normal exchange, then stopped agreeing about the next step. Read their recorded messages to locate the handoff that stalled.',
  7: 'The last shift left a layered handoff note. Decode it to recover the instruction needed for the restart.',
  8: 'Several recovery jobs are each waiting on another job. Trace their dependencies and work out which tasks can run first.',
  9: 'The showcase dashboard and report archive show conflicting states. Use their timestamps to decide which records to reconcile.',
  10: 'Reconstruct the complete recovery sequence from the evidence and verify that the showcase is ready for the post-break demo.',
}
