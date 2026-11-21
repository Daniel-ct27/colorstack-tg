export const chapters = ['Discovery', 'Investigation', 'Recovery'] as const

export type Chapter = (typeof chapters)[number]

interface Mission {
  id: number
  chapter: Chapter
  title: string
  focus: string
  briefing: string
}

export const missions: readonly Mission[] = [
  { id: 1, chapter: 'Discovery', title: 'The Hidden System', focus: 'Terminal navigation', briefing: 'Explore a fictional project directory and use its notes to piece together the first clue.' },
  { id: 2, chapter: 'Discovery', title: 'The Missing Commit', focus: 'Git history', briefing: 'Trace a change through the history of a fictional repository and identify the commit that explains the discrepancy.' },
  { id: 3, chapter: 'Discovery', title: 'The Silent Failure', focus: 'Debugging', briefing: 'Compare expected output with test results to explain why a job stopped producing its report.' },
  { id: 4, chapter: 'Investigation', title: 'The Undocumented Gateway', focus: 'API reasoning', briefing: 'Read a fictional API reference and compare sample responses to reconstruct the expected request contract.' },
  { id: 5, chapter: 'Investigation', title: 'Signals in the Noise', focus: 'Data analysis', briefing: 'Review a synthetic data set and identify the records that point to a break in the timeline.' },
  { id: 6, chapter: 'Investigation', title: 'A Conversation Interrupted', focus: 'Network fundamentals', briefing: 'Read a fictional exchange and determine where the two services stopped communicating.' },
  { id: 7, chapter: 'Investigation', title: 'The Layered Cipher', focus: 'Encoding', briefing: 'Recognize the formats in a sequence of encoded clues and recover the underlying message.' },
  { id: 8, chapter: 'Recovery', title: 'Deadlock in the Pipeline', focus: 'Algorithms', briefing: 'Map task dependencies and decide which ordering lets the pipeline finish.' },
  { id: 9, chapter: 'Recovery', title: 'Services Out of Sync', focus: 'Systems integration', briefing: 'Compare timestamps and status records to explain why two fictional services disagree.' },
  { id: 10, chapter: 'Recovery', title: 'The Final Recovery', focus: 'Evidence synthesis', briefing: 'Combine evidence from the earlier chapters to reconstruct the recovery sequence.' },
]

export function missionsForChapter(chapter: Chapter | 'All') {
  return chapter === 'All' ? missions : missions.filter((mission) => mission.chapter === chapter)
}
