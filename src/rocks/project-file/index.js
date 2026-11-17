import {serialise} from 'afflatus'
import {saveAs} from 'file-saver'

const FILE_EXT = '.am.json'

function projectName(state) {
  return (state.currentProject && state.currentProject.name) || 'project'
}

BETON.define({
  id: 'project-file',
  dependencies: ['toolbar', 'project-manager'],
  init({toolbar, projectManager}) {
    const {state} = projectManager

    const saveProject = () => {
      if (!state.currentProject) {
        return
      }
      const source = JSON.stringify(serialise(state.currentProject), null, 2)
      saveAs(new Blob([source], {type: 'application/json'}), projectName(state) + FILE_EXT)
    }

    const openProject = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,.am.json,application/json'
      input.style.display = 'none'
      input.onchange = () => {
        const file = input.files && input.files[0]
        if (!file) {
          return
        }
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const project = state.loadProject(JSON.parse(String(reader.result)))
            if (!project.currentTimeline && project.timelines[0]) {
              project.currentTimeline = project.timelines[0]
            }
            project.timelines.forEach(timeline => {
              timeline.registerPreview(document.body, new TimelineMax())
            })
            state.currentProject = project
          }
          catch (e) {
            window.alert('Could not open project: ' + e.message)
          }
        }
        reader.readAsText(file)
      }
      input.click()
    }

    toolbar.actions.addItem({
      icon: 'folder-open',
      label: 'open project (.am.json)',
      order: 5,
      onClick: openProject,
    })

    toolbar.actions.addItem({
      icon: 'floppy-o',
      label: 'save project (.am.json)',
      order: 6,
      onClick: saveProject,
    })
  },
})
