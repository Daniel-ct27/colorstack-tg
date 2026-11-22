const notes: Readonly<Partial<Record<number, readonly (readonly [string, string])[]>>> = {
  "1": [
    [
      "Working directory",
      "The folder a command starts in."
    ],
    [
      "Relative path",
      "Directions from the starting folder to a file. It does not begin with /."
    ],
    [
      "Scheduler",
      "The service that runs jobs at set times."
    ]
  ],
  "2": [
    [
      "Commit",
      "A saved change in the project’s history."
    ],
    [
      "Hash",
      "The short ID used to point to a specific commit."
    ],
    [
      "Diff",
      "The lines a commit added or removed."
    ],
    [
      "Revert",
      "Undo one commit by making a new change. Other commits stay in place."
    ]
  ],
  "3": [
    [
      "cwd",
      "Current working directory. Relative paths start here."
    ],
    [
      "Query",
      "A request for records, such as a list of jobs."
    ],
    [
      "Config",
      "The settings the exporter uses to read data and decide where to write it."
    ],
    [
      "Regression check",
      "A check that something which used to work still works after your repair."
    ]
  ],
  "4": [
    [
      "Gateway",
      "A service that passes data from one part of the system to another."
    ],
    [
      "JSON",
      "Text that stores named fields and lists. Curly braces group fields; square brackets surround a list."
    ],
    [
      "Contract",
      "The fields and values two services agree to use."
    ],
    [
      "Adapter",
      "A small piece of code that translates one service’s format into another’s."
    ]
  ],
  "5": [
    [
      "Run ID",
      "A label that ties records from the same run together across services."
    ],
    [
      "Heartbeat",
      "A routine signal that a service is still running."
    ],
    [
      "Bracket a failure",
      "Use two observations to bound when a change could have happened."
    ]
  ],
  "6": [
    [
      "Acknowledgement",
      "A reply confirming that a message reached a certain step."
    ],
    [
      "Commit",
      "In this task, the dashboard has saved the report so it can still find it after a restart."
    ],
    [
      "Deadline",
      "How long the sender waits before deciding a reply is missing."
    ],
    [
      "Duplicate",
      "A second copy of work that should only happen once."
    ]
  ],
  "7": [
    [
      "Encoding",
      "A way to write the same data using a different set of symbols."
    ],
    [
      "Layer",
      "One transformation applied to the output of another."
    ],
    [
      "Padding",
      "Extra characters some formats add to finish a block of data."
    ]
  ],
  "8": [
    [
      "Prerequisite",
      "A job that must finish before another job can start."
    ],
    [
      "Parallel jobs",
      "Jobs that run at the same time on different workers."
    ],
    [
      "Capacity",
      "How much work a system can handle at once."
    ]
  ],
  "9": [
    [
      "Revision",
      "A version number for a record. A higher number means a newer version."
    ],
    [
      "Withdrawn",
      "The job was removed from the active list. The removal itself is a recorded change."
    ],
    [
      "Conflict",
      "Two copies disagree and neither has a newer revision."
    ],
    [
      "Reconcile",
      "Decide how to bring the two services into agreement."
    ]
  ],
  "10": [
    [
      "Public report",
      "The report people can see on the live dashboard."
    ],
    [
      "Staging",
      "A separate copy where the team can try changes safely."
    ],
    [
      "Checkpoint",
      "A saved copy you can restore if the release goes wrong."
    ],
    [
      "Promote or roll back",
      "Put the checked copy live, or restore the previous safe copy."
    ]
  ]
}

export function FieldNotes({ stage }: { stage: number }) {
  const terms = notes[stage]
  if (!terms) return null

  return (
    <details className="field-notes">
      <summary>Field notes <small>Look up a term</small></summary>
      <dl>
        {terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}
      </dl>
    </details>
  )
}
