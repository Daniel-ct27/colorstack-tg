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

export const missionScenes: Readonly<Partial<Record<number, { title: string; opening: string; handoff: string }>>> = {
  3: {
    title: 'The empty export folder',
    opening: 'Wednesday, 9:42 p.m. You’ve restored the missing jobs to the report, but the rehearsal dashboard still shows yesterday’s entries. A teammate sends a photo of the empty export folder from just before they left for break. The scheduler marked the run successful anyway.',
    handoff: 'Find the last step that produced usable output. The team needs to know where the nightly export stopped before anyone tries to replay it.',
  },
  4: {
    title: 'A green light on stale data',
    opening: 'Thanksgiving morning. The dashboard says its last refresh succeeded, but the students testing it can still see Wednesday’s rehearsal. The archived response and the dashboard’s sample both describe the same jobs, so someone assumes they should be interchangeable.',
    handoff: 'Work out which fields the two sides agree on. Use that shared format to compare the right records in the next case.',
  },
  5: {
    title: 'One useful minute',
    opening: 'By noon, the system has written hundreds of routine records. Scheduled checks and test submissions crowd the timeline, and two volunteers remember different times for the first bad report. The only record everyone trusts is a screenshot from the last good rehearsal.',
    handoff: 'Find the smallest set of records that brackets the failure. Carry those timestamps forward so the next investigator knows which exchange to inspect.',
  },
  6: {
    title: 'The reply that never came',
    opening: 'Late Thanksgiving afternoon, you find the exchange inside the window you identified. The report service says it sent the data. The dashboard says it never accepted it. During the rehearsal, everyone saw a spinner, then the old dashboard quietly came back.',
    handoff: 'Read the exchange in order and locate the first missing or unexpected reply. Bring the exact point of failure to the recovery team.',
  },
  7: {
    title: 'A note for the next shift',
    opening: 'Thursday evening. A teammate remembers saving a restart note before leaving campus. The copy in the project archive looks scrambled. They explain that the note passed through two tools on its way into the archive, and each tool wrote it in a different format.',
    handoff: 'Undo the format changes in order. Keep the recovered instruction handy when you decide which recovery job to start first.',
  },
  8: {
    title: 'Everything is waiting',
    opening: 'Friday morning. The recovery team finishes breakfast and opens the job board together. Every task looks ready until someone tries to start it. Each worker is waiting for another task to finish, and retrying the whole batch puts everyone back where they started.',
    handoff: 'Map the dependencies and pick a safe first move. Record the order you can defend from the evidence.',
  },
  9: {
    title: 'Two versions of ready',
    opening: 'By Sunday afternoon, the recovery jobs have run. One service shows the newest reports. The other says those same reports are still waiting. The team has time for one rehearsal, and a blind overwrite could erase the clean results you just recovered.',
    handoff: 'Use the timestamps and status history to decide what should be reconciled. Leave a record of which version you kept and why.',
  },
  10: {
    title: 'The rehearsal before doors open',
    opening: 'Monday morning. The showcase team is back on campus and setting up the room. Your handoff contains the export location, the report repair, the failed exchange, the restart instruction, and the reconciliation decision. Now the whole system has to work in one rehearsal.',
    handoff: 'Put the earlier findings in the order the team can execute them. Verify the report and dashboard agree before you tell the students they can open the doors.',
  },
}
