// Extrai os metadados de um `.am.js` exportado (var __ANIMACHINE_BUNDLE__ = {...}).
// Lê o texto e faz o parse de um JSON balanceado — o arquivo NÃO é executado.

const MARKER = '__ANIMACHINE_BUNDLE__'

export function extractBundleData(text) {
  const source = String(text || '')
  const markerAt = source.indexOf(MARKER)
  if (markerAt === -1) {
    return null
  }

  const start = source.indexOf('{', markerAt)
  if (start === -1) {
    return null
  }

  let depth = 0
  let inString = false
  let quote = ''
  let escaped = false

  for (let i = start; i < source.length; ++i) {
    const char = source[i]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) {
        inString = false
      }
      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      continue
    }

    if (char === '{') {
      depth += 1
    }
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return JSON.parse(source.slice(start, i + 1))
      }
    }
  }

  return null
}
