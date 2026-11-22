import {serialise} from 'afflatus'
import {saveAs} from 'file-saver'
import {extractBundleData} from './extract-bundle-data'

const FILE_EXT = '.am.json'

function projectName(state) {
  return (state.currentProject && state.currentProject.name) || 'project'
}

function pickFile(accept, onText) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.style.display = 'none'
  input.onchange = () => {
    const file = input.files && input.files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => onText(String(reader.result), file)
    reader.readAsText(file)
  }
  input.click()
}

BETON.define({
  id: 'project-file',
  dependencies: ['toolbar', 'project-manager'],
  init({toolbar, projectManager}) {
    const {state} = projectManager

    const reportError = message => {
      global.__animachineLastError = message
      console.error('[animachine] ' + message)
      window.alert(message)
    }

    const loadProjectSource = source => {
      const project = state.loadProject(source)
      if (!project.currentTimeline && project.timelines[0]) {
        project.currentTimeline = project.timelines[0]
      }
      project.timelines.forEach(timeline => {
        timeline.registerPreview(document.body, new TimelineMax())
      })
      state.currentProject = project
      return project
    }

    // Abre um projeto salvo em .am.json (formato de edição)
    const openJsonProject = () => {
      pickFile('.json,.am.json,application/json', text => {
        try {
          loadProjectSource(JSON.parse(text))
        }
        catch (e) {
          reportError('Could not open project: ' + e.message)
        }
      })
    }

    // Abre um export .am.js de volta no editor (lê __ANIMACHINE_BUNDLE__, não executa)
    const openBundleSource = text => {
      const bundle = extractBundleData(text)
      if (!bundle || !bundle.project) {
        throw new Error('not a valid animachine .am.js export (missing __ANIMACHINE_BUNDLE__)')
      }
      const project = loadProjectSource(bundle.project)
      console.log('[animachine] animation reopened from .am.js', {
        name: bundle.name,
        timelines: bundle.timelines ? bundle.timelines.length : 0,
      })
      return project
    }

    const openAmJs = () => {
      pickFile('.js,.am.js', text => {
        try {
          openBundleSource(text)
        }
        catch (e) {
          reportError('Could not open animation: ' + e.message)
        }
      })
    }

    const saveProject = () => {
      if (!state.currentProject) {
        return
      }
      const source = JSON.stringify(serialise(state.currentProject), null, 2)
      saveAs(new Blob([source], {type: 'application/json'}), projectName(state) + FILE_EXT)
    }

    toolbar.actions.addItem({
      icon: 'folder-open',
      label: 'open project (.am.json)',
      order: 5,
      onClick: openJsonProject,
    })

    toolbar.actions.addItem({
      icon: 'floppy-o',
      label: 'save project (.am.json)',
      order: 6,
      onClick: saveProject,
    })

    toolbar.actions.addItem({
      icon: 'file-code-o',
      label: 'open animation (.am.js)',
      order: 7,
      onClick: openAmJs,
    })

    // Atalho de console/teste: __animachineOpenBundle(sourceText)
    global.__animachineOpenBundle = openBundleSource
  },
})
