let inited = false

function init() {
  // idempotente tambem entre injecoes (extensao clicada duas vezes)
  if (inited || global.__animachineInited) {
    return
  }
  inited = true
  global.__animachineInited = true

  console.log('INIT ANIMACHINE')
  require('./beton')
  require('./rocks/dom-picker')
  require('./rocks/config')
  require('./rocks/contact-layer')
  require('./rocks/create-bundle-file')
  require('./rocks/file-save')
  require('./rocks/generate-selector')
  require('./rocks/hack-open-first-possible-project')
  require('./rocks/selector-editor-dialog')
  // require('./rocks/open-project-dialog')
  require('./rocks/preview-animation-synchronizer')
  require('./rocks/preview-registry')
  require('./rocks/project-manager')
  require('./rocks/project-file')
  require('./rocks/timeline-pusher')
  require('./rocks/timeline-tab')
  require('./rocks/toolbar')
  require('./rocks/tracker')
  require('./rocks/transform-tool')
  require('./rocks/welcome-dialog')
  // require('./rocks/welcome-process')
  require('./rocks/workspace')

  BETON.require('welcome-dialog').show()
  BETON.require('hack-open-first-possible-project')()
}

const animachine = {
  init
}
export default animachine

if (!SKIP_AUTO_INIT_ANIMACHINE) {
  animachine.init()
}

import Perf from 'react-addons-perf'
global.perfSeek = function () {
  PPP.clear()
  Perf.start()
  BETON.projectManager.state.currentTimeline.currentTime = ~~(2000 * Math.random())
  setTimeout(function () {
    Perf.stop()
    Perf.printInclusive()
    Perf.printExclusive()
    Perf.printWasted()
    PPP.log()
  }, 200)
}
global.Perf = Perf
// Diagnóstico rápido no console da página: `animachineDiag()`
global.animachineDiag = function () {
  const out = {
    url: location.href,
    inited: !!global.__animachineInited,
    gsap: typeof window.TweenMax !== 'undefined',
    editor: typeof window.BETON !== 'undefined',
  }
  try {
    const pm = BETON.require('project-manager')
    out.project = !!pm.state.currentProject
    out.timeline = pm.state.currentTimeline ? pm.state.currentTimeline.name : null
    out.tracks = pm.state.currentTimeline ? pm.state.currentTimeline.tracks.getLength() : 0
    out.trackParams = pm.state.currentTimeline && pm.state.currentTrack
      ? pm.state.currentTrack.params.map(p => p.name)
      : []
  }
  catch (e) {
    out.error = e.message
  }
  try {
    const node = BETON.require('dom-picker').state.pickedDOMNode
    out.picked = node ? (node.id || node.tagName) : null
  }
  catch (e) {
    out.pickedError = e.message
  }
  console.log('[animachine] diag', out)
  return out
}
global.PPP = (function () {
  let data = {}
  return {
    clear() {
      data = {}
    },
    start(name) {
      const t = performance.now()
      return () => data[name] = (data[name] || 0) + (performance.now() - t)
    },
    log() {
      console.log(data)
    }
  }
}())
