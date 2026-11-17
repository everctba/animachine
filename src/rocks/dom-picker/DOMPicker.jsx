import React, {PropTypes} from 'react'
import {afflatus, createComputedValue} from 'afflatus'
import state from './state'
import {setPickedDOMNode} from './actions'
import {Button} from 'react-matterkit'

// Erro visível na página (não depende do console) e guardado para o animachineDiag()
function showProblem(message) {
  global.__animachineLastError = message
  try {
    const el = document.createElement('div')
    el.textContent = message
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);' +
      'z-index:2147483647;background:#b3261e;color:#fff;font:13px/1.4 system-ui,sans-serif;' +
      'padding:10px 14px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.4);pointer-events:none'
    document.body.appendChild(el)
    setTimeout(() => {
      try { el.parentNode.removeChild(el) } catch (e) {}
    }, 8000)
  }
  catch (e) {}
}

@afflatus
export default class DomPicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    getBounds: PropTypes.func,
    buttonSize: PropTypes.number,
    borderSize: PropTypes.number,
  }

  static defaultProps = {
    getBounds: () => ({
      x: 0,
      y: 0,
      w: window.innerWidth,
      h: window.innerHeight,
    }),
    buttonSize: 21,
    borderSize: 2,
  }

  constructor(props) {
    super(props)
    this.state = {hover: false}

    this.selector = createComputedValue(() => {
      const generateSelector = BETON.require('generate-selector')
      const node = state.pickedDOMNode
      const selector = node && generateSelector({node})
      return selector
    })

    // Cria a track no mousedown (antes do contact-layer limpar a selecao) e sem
    // depender do estado global: usa o no/seletor capturados no momento do pick.
    this.handleAddTrack = (e) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (this._addingTrack) {
        return
      }
      this._addingTrack = true
      setTimeout(() => { this._addingTrack = false }, 500)
      this.addNewTrack()
    }
  }

  handleMouseEnter = (e) => {
    this.setState({hover: true})
  }

  handleMouseLeave = (e) => {
    // this.setState({hover: false})
  }

  addNewTrack() {
    const node = this._cachedNode
    const query = this._cachedQuery
    const {state} = BETON.require('project-manager')
    try {
      if (!node || !query) {
        throw new Error('nenhum elemento selecionado')
      }
      if (!state.currentTimeline) {
        throw new Error('nenhuma timeline ativa')
      }
      const timeline = state.currentTimeline
      const before = timeline.tracks.getLength()
      const track = timeline.addTrack({
        name: `new track for "${query}"`,
        selectors: [{selectorType: 'css', query}],
      })
      timeline.currentTrack = track
      const after = timeline.tracks.getLength()
      const targets = track.targets.length
      console.log('[animachine] track criada', {query, antes: before, depois: after, alvos: targets})
      if (after <= before) {
        throw new Error('a track nao foi adicionada a timeline')
      }
      if (!targets) {
        showProblem(`track criada, mas o seletor nao encontrou elemento: ${query}`)
      }
      else {
        // o contact-layer pode zerar currentTrack no mesmo clique; reafirma logo depois
        setTimeout(() => {
          if (timeline.currentTrack == null) {
            timeline.currentTrack = track
          }
        }, 50)
      }
      setPickedDOMNode(null)
    }
    catch (e) {
      console.error('[animachine] nao consegui criar a track', e)
      showProblem('animachine: ' + e.message)
    }
  }

  getRect() {
    const node = state.pickedDOMNode
    const {buttonSize, getBounds} = this.props
    let {top, left, width, height} = node.getBoundingClientRect()
    const [oTop, oLeft, oWidth, oHeight] = [top, left, width, height]
    const {x: wLeft, y: wTop, w: wWidth, h: wHeight} = getBounds()

    width = Math.max(buttonSize, oWidth)
    height = Math.max(buttonSize, oHeight)

    left += (oWidth - width) / 2
    top += (oHeight - height) / 2

    if (left < wLeft + buttonSize) {
        left = wLeft + buttonSize
        width = Math.max(buttonSize, oLeft + oWidth - left)
    }
    if (top < wTop + buttonSize) {
        top = wTop + buttonSize
        height = Math.max(buttonSize, oTop + oHeight - top)
    }
    if (left + width > wLeft + wWidth - buttonSize) {
      width = wLeft + wWidth - buttonSize - left
    }
    if (top + height > wTop + wHeight - buttonSize) {
      height = wTop + wHeight - buttonSize - top
    }

    return {left, top, width, height}
  }

  render() {
    const node = state.pickedDOMNode
    const {onChange, buttonSize, borderSize} = this.props

    // captura o no e o seletor no momento do pick: o clique no "+" não pode
    // depender de o estado global ainda estar preenchido
    if (node && this._cachedNode !== node) {
      this._cachedNode = node
      this._cachedQuery = this.selector()
    }

    if (!node) {
      return <div hidden/>
    }

    const {left, top, width, height} = this.getRect()
    const baseStyle = {
      position: 'fixed',
      left, top, width, height,
      boxSizing: 'border-box',
      pointerEvents: 'none',
      borderStyle: 'solid',
      borderColor: '#eee',
      borderWidth: borderSize,
      pointerEvents: 'none',
    }
    const dashedStyle = {
      width: '100%',
      height: '100%',
      borderStyle: 'dashed',
      borderColor: '#444',
      borderWidth: borderSize,
      transform: `translate(-${borderSize}px,-${borderSize}px)`,
    }
    const buttonContainerStyle = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }

    function selectNode(nextNode) {
      setPickedDOMNode(nextNode)
    }

    function renderButton(icon, tooltip, onClick, originalStyle, hidden) {
      if (hidden) {
        return null
      }

      let style = {
        ...originalStyle,
        margin: null,
        width: buttonSize,
        height: buttonSize,
        textShadow: '0 0 2px #555, 0 0 2px #555',
        pointerEvents: 'auto',
      }

      if (originalStyle.margin) {
        style = {
          ...style,
          position: 'absolute',
          marginTop: originalStyle.margin[0],
          marginBottom: originalStyle.margin[0],
          marginLeft: originalStyle.margin[1],
          marginRight: originalStyle.margin[1],
        }
      }

      return <Button
        icon = {icon}
        mod = {{kind: 'stamp'}}
        tooltip = {tooltip}
        onClick = {onClick}
        style = {style}/>
    }

    return <div
      style = {baseStyle}
      onMouseEnter = {this.handleMouseEnter}
      onMouseLeave = {this.handleMouseLeave}
      >
      <div style={dashedStyle}/>
      <div style={buttonContainerStyle}>
        {renderButton(
          'chevron-up',
          'up one level',
          () => selectNode(node.parentElement),
          {top: `-${buttonSize}px`, left: 0, right: 0, margin: ['0', 'auto']},
          !node.parentElement
        )}
        {renderButton(
          'chevron-right',
          'next sibling',
          () => selectNode(node.nextElementSibling),
          {right: `-${buttonSize}px`, top: 0, bottom: 0, margin: ['auto', '0']},
          !node.nextElementSibling
        )}
        {renderButton(
          'chevron-down',
          'down one level',
          () => selectNode(node.firstElementChild),
          {bottom: `-${buttonSize}px`, left: 0, right: 0, margin: ['0', 'auto']},
          !node.firstElementChild
        )}
        {renderButton(
          'chevron-left',
          'previous sibling',
          () => selectNode(node.previousElementSibling),
          {left: `-${buttonSize}px`, top: 0, bottom: 0, margin: ['auto', '0']},
          !node.previousElementSibling
        )}
        {renderButton(
          'times',
          'close',
          () => setPickedDOMNode(null),
          {right: `-${buttonSize}px`, top: `-${buttonSize}px`, margin: [0, 0]}
        )}
        {this.selector() && (
          <div
            role = 'button'
            title = 'create a new track with this node'
            onMouseDown = {this.handleAddTrack}
            onClick = {this.handleAddTrack}
            style = {{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#6bb6c4',
              color: '#10222a',
              fontSize: 18,
              fontWeight: 700,
              lineHeight: '26px',
              textAlign: 'center',
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,.35)',
            }}
          >+</div>
        )}
      </div>
    </div>
  }
}
