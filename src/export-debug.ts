export const initialConfig = JSON.stringify({
  inputKey: 'rows',
  outputPath: 'reports/report.json',
  skipEmpty: true,
}, null, 2)

const dashboardPath = '/showcase/reports/report.json'

function replay(inputKey: string, outputPath: string, skipEmpty: boolean, cwd: string, output: Record<string, number[]>) {
  const records = Object.hasOwn(output, inputKey) ? output[inputKey] : []
  if (!records.length && skipEmpty) return null
  return { records, path: outputPath.startsWith('/') ? outputPath : `${cwd}/${outputPath}` }
}

export function checkExport(source: string) {
  let config: unknown
  try {
    config = JSON.parse(source)
  } catch {
    return { error: 'The config is not valid JSON. Check the quotes, comma, and braces.' } as const
  }

  if (!config || typeof config !== 'object' ||
      !('inputKey' in config) || typeof config.inputKey !== 'string' ||
      !('outputPath' in config) || typeof config.outputPath !== 'string' || !config.outputPath.trim() ||
      !('skipEmpty' in config) || typeof config.skipEmpty !== 'boolean') {
    return { error: 'Use text for inputKey and outputPath, and true or false for skipEmpty.' } as const
  }

  const { inputKey, outputPath, skipEmpty } = config
  const records = [14, 25, 31]
  const nightly = replay(inputKey, outputPath, skipEmpty, '/showcase/nightly', { records })
  const manual = replay(inputKey, outputPath, skipEmpty, '/showcase', { rows: records, records })
  const empty = replay(inputKey, outputPath, skipEmpty, '/showcase/nightly', { records: [] })

  return {
    checks: [
      { label: 'Scheduled run exports all three jobs', passed: nightly?.records.join() === records.join() },
      { label: nightly ? `Scheduled output reaches the dashboard (wrote ${nightly.path})` : 'Scheduled output reaches the dashboard (no file written)', passed: nightly?.path === dashboardPath },
      { label: 'Manual retry still updates the dashboard', passed: manual?.path === dashboardPath && manual.records.join() === records.join() },
      { label: 'Empty runs leave the previous report intact', passed: empty === null },
    ],
  } as const
}
