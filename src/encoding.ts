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
