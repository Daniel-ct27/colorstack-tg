export const mascotHints: Readonly<Partial<Record<number, readonly [string, string]>>> = {
  1: ['The filename appears twice. Read the handoff before choosing a copy.', 'Trace the folder path from the starting directory shown in the brief.'],
  2: ['Run the report before you change anything. Which check fails?', 'Inspect the diff and look for the change that would affect which jobs appear.'],
  3: ['Compare what the query produces with what the exporter reads.', 'If data starts coming through but the dashboard stays stale, compare the working directories.'],
  4: ['Two fields can look identical in one capture and diverge in another.', 'Check what changed on retry, then compare what remains after closeout.'],
  5: ['The screenshot tells you which run mattered to viewers.', 'Separate what a service says it sent from what the audience actually saw.'],
  6: ['The two replies tell you about different points in the process.', 'Watch how many writes happen when you lose the last reply. What lets the receiver recognize the same work?'],
  7: ['Study the characters at the edge of the note before trying a tool.', 'The archive contains two readable instructions. Compare each decoded copy with the tag Dispatch recorded.'],
  8: ['Take a look at what each job needs before putting a worker on it.', 'Jobs in the same round can’t unblock each other. Compare the needs on each card with what your workers finished earlier.'],
  9: ['Compare the revision numbers before comparing the status words.', 'Look closely at the cases with equal revisions. Do both copies actually agree?'],
  10: ['Think about what you would need if the rehearsal went wrong.', 'Run both scenarios and compare the first step where the plan stops.'],
}
