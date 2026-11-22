const commits = [
  { hash: 'ee10b3a', summary: 'Standardize the export heading', diff: '- title: Daily Activity\n+ title: Daily Jobs' },
  { hash: 'ac2d4e1', summary: 'Align export with metrics defaults', diff: '- statuses: [queued, completed]\n+ statuses: [completed]' },
  { hash: '7f01da9', summary: 'Normalize report sorting', diff: '- sort: oldest-first\n+ sort: newest-first' },
] as const

export const repositoryCommits = commits.map(({ hash, summary }) => ({ hash, summary }))

const regression = commits[1].hash

export interface LabState {
  inspected: string[]
  reverted: string[]
  solved: boolean
}

export const initialLab: LabState = { inspected: [], reverted: [], solved: false }

export function runCommand(state: LabState, input: string): { state: LabState; output: string } {
  const command = input.trim().toLowerCase().replace(/\s+/g, ' ')
  if (command === 'help') {
    return { state, output: 'git log --oneline  View commit history\ngit show HASH     Inspect the changes in a commit\ngit revert HASH   Undo one change in the sandbox\nrun report        Check the report against acceptance criteria\nreset             Restore the sandbox to its starting state' }
  }
  if (command === 'git log --oneline' || command === 'git log') {
    return { state, output: [...commits].reverse().map(({ hash, summary }) => `${hash} ${summary}`).join('\n') }
  }
  if (command === 'reset') return { state: initialLab, output: 'Sandbox restored. Run the report to see the original failure.' }

  if (command === 'run report') {
    const queued = state.reverted.includes(regression)
    const heading = !state.reverted.includes(commits[0].hash)
    const sort = !state.reverted.includes(commits[2].hash)
    const solved = queued && heading && sort && state.inspected.includes(regression)
    return {
      state: { ...state, solved },
      output: [
        `Queued jobs included: ${queued ? 'PASS' : 'FAIL'}`,
        'Completed jobs included: PASS',
        'Cancelled jobs excluded: PASS',
        `Title is Daily Jobs: ${heading ? 'PASS' : 'FAIL'}`,
        `Newest jobs appear first: ${sort ? 'PASS' : 'FAIL'}`,
        solved ? 'Recovery verified. The report is ready for the showcase.' :
          queued && heading && sort ? 'The report passes. Inspect the reverted commit to confirm the cause.' : 'The report still fails the recovery criteria.',
      ].join('\n'),
    }
  }

  const match = /^git (show|revert) ([a-f0-9]{7})$/.exec(command)
  if (!match) return { state, output: 'Command unavailable. Enter help for the commands supported by this sandbox.' }
  const commit = commits.find(({ hash }) => hash === match[2])
  if (!commit) return { state, output: 'Commit not found. Check the short hash in git log --oneline.' }
  if (match[1] === 'show') {
    return {
      state: { ...state, inspected: [...new Set([...state.inspected, commit.hash])] },
      output: `${commit.hash} ${commit.summary}\n\n${commit.diff}`,
    }
  }
  if (state.reverted.includes(commit.hash)) return { state, output: 'That change is already reverted. Use reset to start over.' }
  return {
    state: { ...state, reverted: [...state.reverted, commit.hash], solved: false },
    output: `Reverted ${commit.hash}. Run the report to see what changed.`,
  }
}

export function runCommands(state: LabState, input: string) {
  const entries: { command: string; output: string }[] = []
  let verified = false
  for (const line of input.split(/\r?\n/)) {
    const command = line.trim()
    if (!command) continue
    const result = runCommand(state, command)
    state = result.state
    entries.push({ command, output: result.output })
    verified ||= state.solved
  }
  return { state, entries, verified }
}
