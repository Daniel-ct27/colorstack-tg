export const trail = [
  { id: 'e01', time: '21:33', source: 'Dashboard', run: 'J-57', result: 'Preview opened · 3 jobs · complete' },
  { id: 'e02', time: '21:34', source: 'Dashboard', run: 'J-61', result: 'Showcase refreshed · 12 jobs · complete' },
  { id: 'e03', time: '21:35', source: 'Scheduler', run: 'J-61', result: 'Refresh heartbeat received' },
  { id: 'e04', time: '21:36', source: 'Dashboard', run: 'J-57', result: 'Preview refreshed · 1 job · incomplete' },
  { id: 'e05', time: '21:37', source: 'Gateway', run: 'J-61', result: 'Response prepared · 12 jobs' },
  { id: 'e06', time: '21:38', source: 'Gateway', run: 'J-57', result: 'Preview response accepted' },
  { id: 'e07', time: '21:39', source: 'Dashboard', run: 'J-61', result: 'Showcase refreshed · 12 jobs · complete' },
  { id: 'e08', time: '21:40', source: 'Scheduler', run: 'J-61', result: 'Queued destination refresh' },
  { id: 'e09', time: '21:41', source: 'Gateway', run: 'J-61', result: 'Response prepared · 12 jobs' },
  { id: 'e10', time: '21:42', source: 'Scheduler', run: 'J-57', result: 'Preview closed' },
  { id: 'e11', time: '21:43', source: 'Dashboard', run: 'J-61', result: 'Showcase refreshed · 7 jobs · incomplete' },
  { id: 'e12', time: '21:44', source: 'Gateway', run: 'J-61', result: 'Retry prepared · 12 jobs' },
  { id: 'e13', time: '21:45', source: 'Dashboard', run: 'J-61', result: 'Showcase retry · 7 jobs · incomplete' },
  { id: 'e14', time: '21:46', source: 'Dashboard', run: 'J-66', result: 'Staff test refreshed · 5 jobs · complete' },
] as const

export function checkWindow(pins: readonly string[]) {
  if (pins.length !== 2) return { solved: false, feedback: 'Pin exactly two records to submit a window.' }
  if (pins.includes('e07') && pins.includes('e11')) {
    return { solved: true, feedback: 'Window confirmed. The showcase went incomplete between 21:39 and 21:43.' }
  }
  const selected = pins.map((id) => trail.find((entry) => entry.id === id))
  if (selected.some((entry) => entry?.run !== 'J-61')) {
    return { solved: false, feedback: 'At least one record is from a different run. Match the showcase run ID in the rehearsal note.' }
  }
  if (selected.some((entry) => entry?.source !== 'Dashboard')) {
    return { solved: false, feedback: 'A heartbeat or a prepared response cannot prove what viewers saw. Look for dashboard records.' }
  }
  return { solved: false, feedback: 'Those are showcase records. Narrow the window to the last complete view and the first incomplete view.' }
}
