import Embed from 'quill/blots/embed'
import Quill from 'quill/core/quill'

class FormulaBlot extends Embed {
  static create (value) {
    let node = super.create(value)
    if (typeof value === 'string') {
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: '#f00'
      })
      node.setAttribute('data-value', value)
    }
    return node
  }

  static value (domNode) {
    return domNode.getAttribute('data-value')
  }
}
FormulaBlot.blotName = 'formula'
FormulaBlot.className = 'ql-formula'
FormulaBlot.tagName = 'SPAN'

class FormulaPlus {
  constructor (quill, options) {
    this.quill = quill
    options = options || {}
    this.options = options
    this.quill.on('selection-change', this.handleSelectionChange)
    this.quill.on('text-change', this.handleTextChange)
    Quill.register(FormulaBlot, true)
    if (window.katex == null) {
      throw new Error('Formula module requires KaTeX.')
    }
  }

  handleSelectionChange = (e) => {
    if (!e || !e.index) {
      return
    }
    var deltaBefore = this.quill.getContents(e.index - 1, 1)
    var delta = this.quill.getContents(e.index, 1)
    var deltaAfter = this.quill.getContents(e.index + 1, 1)
    try {
      var index = null
      var oldFormula = null
      if (deltaBefore.ops[0] && deltaBefore.ops[0].insert.formula) {
        index = e.index - 1
        oldFormula = deltaBefore.ops[0].insert.formula
      } else if (delta.ops[0] && delta.ops[0].insert.formula) {
        index = e.index
        oldFormula = delta.ops[0].insert.formula
      } else if (deltaAfter.ops[0] && deltaAfter.ops[0].insert.formula) {
        index = e.index
        oldFormula = deltaAfter.ops[0].insert.formula
      }
      if (oldFormula) {
        this.showTooltip()
        window.mathField.latex(oldFormula)
        window.mathEmbed = {
          index: index,
          formula: oldFormula
        }
      } else {
        this.hideTooltip()
        window.focusIndex = index = e.index + e.length
      }
    } catch (error) {
      console.error(error)
    }
  }

  handleTextChange = () => {
    const range = this.quill.getSelection(true)
    const index = range.index + range.length
    window.focusIndex = index
  }

  showTooltip = () => {
    var tooltip = document.getElementById('formula-editor-container')
    tooltip.style.height = 'unset'
    tooltip.style.visibility = 'visible'
  }

  hideTooltip = () => {
    var tooltip = document.getElementById('formula-editor-container')
    tooltip.style.height = '0px'
    tooltip.style.visibility = 'hidden'
  }
}

export { FormulaBlot, FormulaPlus as default }
