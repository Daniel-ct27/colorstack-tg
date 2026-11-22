import { copyFile, mkdir } from 'node:fs/promises'
import { missions } from '../src/missions.ts'

const dist = new URL('../dist/', import.meta.url)
const index = new URL('index.html', dist)

// Each mission gets a real directory so a fresh visit or reload works on static hosting.
const routes = [...missions.map(({ id }) => `missions/${String(id).padStart(2, '0')}/`), 'epilogue/']
await Promise.all(routes.map(async (route) => {
  const directory = new URL(route, dist)
  await mkdir(directory, { recursive: true })
  await copyFile(index, new URL('index.html', directory))
}))
