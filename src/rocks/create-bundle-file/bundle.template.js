var createAnimationSource = require('animachine-connect/create-animation-source')

// Dados do projeto injetados no export (ver src/rocks/create-bundle-file/index.js).
// Sem `eval` no bundle: o JSON entra como literal e é válido mesmo com aspas.
var projectSource = 'PLACEHOLDER_PROJECT_SOURCE'
var timelineSources = 'PLACEHOLDER_TIMELINE_SOURCES'

// Metadados para reabrir este arquivo no editor (menu > open animation .am.js).
var __ANIMACHINE_BUNDLE__ = 'PLACEHOLDER_BUNDLE_INFO'

var animations = {}

timelineSources.forEach(function (timelineSource) {
  animations[timelineSource.name] = createAnimationSource(timelineSource)
})

// Compatibilidade com o uso original: require('...am.js') -> mapa de animações.
module.exports = animations

// Registro estável no browser (independente do nome do projeto):
//   window.__animachine['<nome do projeto>']['<timeline>'](rootTarget)
if (typeof window !== 'undefined') {
  window.__animachine = window.__animachine || {}
  window.__animachine['PLACEHOLDER_LIBRARY_NAME'] = animations
}
