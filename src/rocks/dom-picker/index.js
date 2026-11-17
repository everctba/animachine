import React from 'react'
import DOMPicker from './DOMPicker'
import state from './state'
import * as actions from './actions'
import {HotKeys} from 'react-hotkeys'

BETON.define({
  id: 'dom-picker',
  dependencies: ['workspace', 'generate-selector', 'toolbar', 'project-manager'],
  init: ({workspace, toolbar, projectManager}) => {

    // Plano B para sites onde o picker não chega (iframe, shadow DOM, overlay):
    // cria a track digitando o seletor CSS.
    toolbar.actions.addItem({
      icon: 'plus',
      label: 'add track (css selector)',
      order: 15,
      onClick: () => {
        const query = window.prompt('CSS selector for the new track (ex: .hero h1)')
        if (!query) {
          return
        }
        const timeline = projectManager.state.currentTimeline
        if (!timeline) {
          window.alert('Start a project first (Hello dialog > start).')
          return
        }
        try {
          const track = timeline.addTrack({
            name: `track for "${query}"`,
            selectors: [{selectorType: 'css', query}],
          })
          timeline.currentTrack = track
          console.log('[animachine] track criada por seletor', query)
        }
        catch (e) {
          console.error('[animachine] seletor invalido', e)
          window.alert('Could not add track: ' + e.message)
        }
      },
    })

    const hotkeyMap = {
      'cancel': ['esc']
    }
    const hotkeyHandlers = {
      cancel: () => console.log('canceled')
    }

    workspace.overlays.setOverlay('dom-picker', {
      index: 110,
      getElement: () => {
        return <HotKeys keyMap={hotkeyMap} handlers={hotkeyHandlers}>
          <DOMPicker/>
        </HotKeys>
      }
    })

    return {
      state,
      actions,
    }
  }
})
