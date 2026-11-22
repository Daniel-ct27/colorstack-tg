export const sealedNote = '64 48 4a 76 63 48 68 6c 49 47 56 79 62 32 5a 6c 59 69 42 30 62 32 68 7a 63 47 46 75 63 79 42 30 62 6e 56 76 62 51 3d 3d'
export const restartNote = 'mount snapshot before export'

export function decodeLayer(value: string, action: 'hex' | 'base64' | 'reverse' | 'url') {
  if (action === 'reverse') return [...value].reverse().join('')
  if (action === 'url') return decodeURIComponent(value)
  if (action === 'hex') {
    const pairs = value.trim().split(/\s+/)
    if (!pairs.every((pair) => /^[\da-f]{2}$/i.test(pair))) throw new Error('Hex expects pairs of digits such as 4d 32.')
    return pairs.map((pair) => String.fromCharCode(Number.parseInt(pair, 16))).join('')
  }
  return atob(value)
}

export const archiveCopies = {
  amber: '6c 61 73 72 61 65 68 65 72 25 32 30 65 72 6f 66 65 62 25 32 30 72 6f 72 72 69 6d 25 32 30 74 6e 75 6f 6d',
  blue: sealedNote,
} as const

export type ArchiveCopy = keyof typeof archiveCopies

export function archiveTag(value: string) {
  const sum = [...value].reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0)
  return (sum % 251).toString(16).padStart(2, '0').toUpperCase()
}

export const dispatchTag = archiveTag(restartNote)

export function identifyArchive(values: Record<ArchiveCopy, string>, inspected: readonly ArchiveCopy[], chosen: ArchiveCopy) {
  if (!inspected.includes('amber') || !inspected.includes('blue')) return { passed: false, detail: 'Read the tag on both decoded copies before deciding.' }
  if (values.amber !== 'mount mirror before rehearsal' || values.blue !== restartNote) {
    return { passed: false, detail: 'At least one copy still has a layer to undo. Both notes should read like instructions.' }
  }
  if (archiveTag(values[chosen]) !== dispatchTag) return { passed: false, detail: 'That instruction is readable, but its tag does not match Dispatch’s log.' }
  return { passed: true, detail: 'Dispatch tag matched. Carry the verified restart note to the recovery board.' }
}
