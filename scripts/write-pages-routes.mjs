import { copyFile, mkdir } from 'node:fs/promises'
import { missions } from '../src/missions.ts'

const dist = new URL('../dist/', import.meta.url)
const index = new URL('index.html', dist)

// Each mission gets a real directory so a fresh visit or reload works on static hosting.
await Promise.all(missions.map(async ({ id }) => {
  const directory = new URL(`missions/${String(id).padStart(2, '0')}/`, dist)
  await mkdir(directory, { recursive: true })
  await copyFile(index, new URL('index.html', directory))
}))
