export const initialConfig = '{\n  "inputKey": "rows",\n  "skipEmpty": true\n}'

interface ExportConfig {
  inputKey: string
  skipEmpty: boolean
}

type QueryOutput = Record<string, number[]>

function exportRows(config: ExportConfig, output: QueryOutput) {
  const records = output[config.inputKey] ?? []
  return records.length || !config.skipEmpty ? records : null
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
      !('skipEmpty' in config) || typeof config.skipEmpty !== 'boolean') {
    return { error: 'Use a string for inputKey and true or false for skipEmpty.' } as const
  }

  const options = { inputKey: config.inputKey, skipEmpty: config.skipEmpty }
  const nightly = exportRows(options, { records: [14, 25, 31] })
  const manual = exportRows(options, { rows: [14, 25, 31], records: [14, 25, 31] })
  const empty = exportRows(options, { records: [] })

  return {
    checks: [
      { label: 'Scheduled run writes all three records', passed: nightly?.join() === '14,25,31' },
      { label: 'Manual retry still writes all three records', passed: manual?.join() === '14,25,31' },
      { label: 'Empty runs leave the previous report intact', passed: empty === null },
    ],
  } as const
}
