import {serialise} from 'afflatus'
const rawBundle = require('raw!./bundled/bundle.js')

BETON.define({
  id: 'create-bundle-file',
  dependencies: ['project-manager'],
  init
})

const ROTATION_PARAM_NAMES = ['rotation', 'rotationX', 'rotationY', 'rotationZ']

function replacePlaceholder(source, name, value) {
  const rx = new RegExp(`['|"]PLACEHOLDER_${name}['|"]`, 'g')
  return source.replace(rx, value)
}

// O bundle é gerado sem `eval` (webpack.bundle.config.js > devtool: false), então o JSON
// entra como literal: nada de escapar aspas (era o que quebrava nomes de track com ").
function stringify(obj) {
  return JSON.stringify(obj)
}

// Versões antigas acumulavam "_short" nos valores (bug de mutação). Normaliza na saída:
// no projeto salvo o valor é numérico; na timeline de animação o GSAP exige exatamente
// UM sufixo "_short" (rotação pelo caminho mais curto).
function cleanRotationValue(value, keepShort) {
  if (typeof value !== 'string' || value.indexOf('_short') === -1) {
    return value
  }
  const number = parseFloat(value.replace(/(?:_short)+$/, ''))
  if (isNaN(number)) {
    return value
  }
  return keepShort ? `${number}_short` : number
}

function cleanProjectSource(entries) {
  if (!Array.isArray(entries)) {
    return entries
  }
  const byId = {}
  entries.forEach(entry => {
    if (entry && entry.$id !== undefined) {
      byId[entry.$id] = entry
    }
  })
  entries.forEach(entry => {
    if (!entry || ROTATION_PARAM_NAMES.indexOf(entry.name) === -1 || !Array.isArray(entry.keys)) {
      return
    }
    entry.keys.forEach(keyId => {
      const key = byId[keyId]
      if (key && key.value !== undefined) {
        key.value = cleanRotationValue(key.value, false)
      }
    })
  })
  return entries
}

function cleanTimelineSources(timelines) {
  if (!Array.isArray(timelines)) {
    return timelines
  }
  timelines.forEach(timeline => {
    if (!timeline || !Array.isArray(timeline.tracks)) {
      return
    }
    timeline.tracks.forEach(track => {
      if (!track || !Array.isArray(track.params)) {
        return
      }
      track.params.forEach(param => {
        if (ROTATION_PARAM_NAMES.indexOf(param.name) === -1 || !Array.isArray(param.keys)) {
          return
        }
        param.keys.forEach(key => {
          if (key && key.value !== undefined) {
            key.value = cleanRotationValue(key.value, true)
          }
        })
      })
    })
  })
  return timelines
}

function init({projectManager}) {
  return function() {
    const {currentProject} = projectManager.state
    const projectSource = cleanProjectSource(serialise(currentProject))
    const timelineSources = cleanTimelineSources(currentProject.timelines.map(timeline => {
      return timeline.animationSource
    }))
    const name = currentProject.name || 'unnamed'

    // Metadados lidos pelo editor em "open animation (.am.js)" (project-file rock).
    const bundleInfo = {
      schema: 1,
      name,
      project: projectSource,
      timelines: timelineSources,
    }

    let source = replacePlaceholder(rawBundle, 'LIBRARY_NAME', `'${name}'`)
    source = replacePlaceholder(source, 'PROJECT_SOURCE', stringify(projectSource))
    source = replacePlaceholder(source, 'TIMELINE_SOURCES', stringify(timelineSources))
    source = replacePlaceholder(source, 'BUNDLE_INFO', stringify(bundleInfo))

    // O UMD do webpack 1 usa `this` como root; em contexto estrito isso vira undefined.
    // Fixa o global explicitamente para funcionar via <script> em qualquer página.
    source = source.replace(
      '})(this, function() {',
      '})(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this, function() {'
    )

    return {
      fileName: `${name}.am.js`,
      source: source
    }
  }
}
