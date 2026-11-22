const steps: Readonly<Partial<Record<number, readonly string[]>>> = {
  "1": [
    "Open handoff.txt in the workstation.",
    "Explore the folders and read the script descriptions. Use Parent folder to back up.",
    "Type the path from the starting folder and choose Check path."
  ],
  "2": [
    "Choose Test report to see what broke.",
    "Open Commit history or click a commit card to inspect its changes.",
    "Use the console to try a repair. Run the report again to see whether it worked."
  ],
  "3": [
    "Choose Compare scheduled vs. retry.",
    "Read both logs and edit export.config.json based on what differs.",
    "Run export checks. The results tell you which behavior still needs work."
  ],
  "4": [
    "Open Dispatch notes at the Evidence desk.",
    "Switch between captures and use the notes to decide what each field means.",
    "Pick your mappings, then choose Run the live queue to try them."
  ],
  "5": [
    "Read the rehearsal note, then search the timeline.",
    "Pin records that show when the failure began and choose Verify window.",
    "Follow the handoff and link the record that matches the affected delivery."
  ],
  "6": [
    "Read the recorded exchange and check the Shift clock.",
    "Choose a sender policy, then select Replay the exchange.",
    "Step through each scenario and revise anything that fails."
  ],
  "7": [
    "Open an archive copy and look at the characters.",
    "Use the Tool reference to decide what to try. Undo any change that doesn’t help.",
    "Read the tag on both decoded notes, then send Dispatch the one you trust."
  ],
  "8": [
    "Read what each job card needs.",
    "Tap jobs to assign workers, then choose Send workers out.",
    "Finish the round to free the workers. Undo a round if the schedule gets stuck."
  ],
  "9": [
    "Choose a ticket and compare the two versions.",
    "Route the ticket and read the preview to see what would change.",
    "Rehearse the handoff, open any incoming updates, then dispatch the revised tickets."
  ],
  "10": [
    "Read the handoff and add actions to the runbook.",
    "Use the arrows to reorder steps. Start a rehearsal and advance through the results.",
    "Make the release decision when the gate opens. Try the same runbook in both rehearsals."
  ]
}

export function MissionGuide({ stage }: { stage: number }) {
  const moves = steps[stage]
  if (!moves) return null
  return (
    <details className="mission-guide">
      <summary><strong>Start here</strong><span>{moves[0]}</span></summary>
      <ol start={2}>{moves.slice(1).map((move) => <li key={move}>{move}</li>)}</ol>
    </details>
  )
}
