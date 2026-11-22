export const crewNames = { nia: 'Nia', miles: 'Miles', giblet: 'Giblet', bulldog: 'Fisk Bulldog' } as const

export type CrewId = keyof typeof crewNames

interface CrewCase {
  lead: CrewId
  lines: Record<CrewId, string>
  action: { speaker: CrewId; text: string }
  clear: string
}

export const crewCases: Readonly<Partial<Record<number, CrewCase>>> = {
  1: {
    lead: 'nia',
    lines: { nia: 'I left two copies of the export script. My handoff says which one the scheduler was meant to run.', miles: 'Tell me where it is relative to the scheduler’s starting folder. I’ll add it to the overnight checklist.', giblet: 'Two files, same name. I once made the same mistake with the pie tins.', bulldog: 'The Bulldog noses at the handoff note.' },
    action: { speaker: 'miles', text: 'I’ll check that path from the scheduler’s starting folder.' },
    clear: 'Good find. I’ll pass the script location to the teammate checking the report history.',
  },
  2: {
    lead: 'miles',
    lines: { nia: 'My rehearsal screenshot still had the queued jobs. Compare it with what the current report prints.', miles: 'I kept the Git history. Undo the change that lost jobs, but leave the title and sorting fixes in place.', giblet: 'Read what the commit did. The title is only the label on the leftovers.', bulldog: 'The Bulldog watches the output window for the missing jobs.' },
    action: { speaker: 'miles', text: 'The console will record each command and its result. Let’s see what changes.' },
    clear: 'The report logic is fixed. Nia, check why the overnight export still left the dashboard stale.',
  },
  3: {
    lead: 'nia',
    lines: { nia: 'I pulled both runs from the workstation. The scheduled run and the retry weren’t started the same way.', miles: 'Even after the export writes a file, the dashboard has to find it. Run all four checks before you hand it back.', giblet: 'An empty run shouldn’t throw out yesterday’s leftovers.', bulldog: 'The Bulldog sniffs around the empty export folder.' },
    action: { speaker: 'miles', text: 'I’m replaying the scheduled and manual runs against that config.' },
    clear: 'The export lands where the dashboard watches. I’ll pull the gateway captures next.',
  },
  4: {
    lead: 'nia',
    lines: { nia: 'The dispatch notes track what really happened to each case. Trust those when the payload fields disagree.', miles: 'Watch the live queue after closeout. An old receipt mustn’t turn into an active job.', giblet: 'A receipt can say dinner arrived. It can’t tell you who finished eating.', bulldog: 'The Bulldog waits for the live queue to clear.' },
    action: { speaker: 'nia', text: 'I’ll replay your adapter against the first sync, retry, and closeout.' },
    clear: 'The dashboard is reading the live cases again. Use the rehearsal note to narrow down when it first went wrong.',
  },
  5: {
    lead: 'nia',
    lines: { nia: 'I checked the screenshot footer. The staff test and preview weren’t the run the audience saw.', miles: 'Give me two timestamps I can defend: the last good view and the first incomplete one.', giblet: 'A service saying “I sent it” isn’t the same as the dashboard showing it.', bulldog: 'The Bulldog keeps its nose on the showcase trail.' },
    action: { speaker: 'nia', text: 'I’m checking your two pins against what the audience actually saw.' },
    clear: 'That gives us the window. I’ll pull the conversation between the exporter and dashboard.',
  },
  6: {
    lead: 'nia',
    lines: { nia: 'Here’s the exchange from that window. The exporter got one reply, but the other went missing.', miles: 'A retry can fix a missing delivery or make a second copy. I’ll replay both situations.', giblet: 'A receipt tells you the kitchen heard the order. Wait for them to say it’s ready.', bulldog: 'The Bulldog listens for the second reply.' },
    action: { speaker: 'miles', text: 'Replaying normal delivery and both ways a message can get lost.' },
    clear: 'One report, even when a reply gets lost. The archive still has the restart note we need.',
  },
  7: {
    lead: 'giblet',
    lines: { nia: 'I pulled the exact bytes from the archive. The tools changed the format, but the instruction is still in there.', miles: 'Keep the intermediate results. Each one tells you which tool to try next.', giblet: 'I found the note under the snack sign-up. It looks like someone wrapped it more than once.', bulldog: 'The Bulldog paws at the sealed note.' },
    action: { speaker: 'giblet', text: 'Peek at the new layer. Does it look like a format you recognize?' },
    clear: 'That’s a readable restart instruction! Miles can use it on the recovery board.',
  },
  8: {
    lead: 'miles',
    lines: { nia: 'The restart note tells us one job can’t begin before the snapshot is mounted.', miles: 'I have two workers and three rounds. Check the dependencies before you assign anyone.', giblet: 'Two cooks can work at once. Neither can serve what hasn’t finished cooking.', bulldog: 'The Bulldog waits beside the worker board.' },
    action: { speaker: 'miles', text: 'I’m starting the workers. Watch for the first round that can’t run.' },
    clear: 'All six jobs finished. Now check that the archive and dashboard agree about what’s ready.',
  },
  9: {
    lead: 'miles',
    lines: { nia: 'I froze both copies so you can compare them. A withdrawal is a real update, even if the older record looked ready.', miles: 'Route each ticket separately. If the same revision tells two different stories, send it to review.', giblet: 'Please don’t bring a withdrawn dish back to the table.', bulldog: 'The Bulldog guards the review queue.' },
    action: { speaker: 'miles', text: 'Dry-running the ticket routes. I’ll flag the first one that needs another look.' },
    clear: 'The tickets are routed. Carry the withdrawal and conflict rules into the release rehearsal.',
  },
  10: {
    lead: 'miles',
    lines: { nia: 'I’ll compare the staging report with the archive. The doors stay closed until we agree.', miles: 'Build one runbook that handles a clean rehearsal and protects the live dashboard if something goes wrong.', giblet: 'Save a plate before you try the new recipe. That way nobody goes hungry if it flops.', bulldog: 'The Bulldog is standing by the doors in its game-day bandana.' },
    action: { speaker: 'nia', text: 'Running the same plan with a clean report and a mismatch. Watch how each run ends.' },
    clear: 'The showcase is ready and the crew can open the doors. Thanks for sticking with us.',
  },
}
