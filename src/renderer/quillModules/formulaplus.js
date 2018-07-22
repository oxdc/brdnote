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
    var { index, formula } = this.searchFormula(e.index)
    if (formula) {
      this.showTooltip()
      window.mathField.latex(formula)
      if (window.cmFormulaEditor) {
        window.cmFormulaEditor.doc.setValue(formula)
      }
      window.mathEmbed = {
        index: index,
        formula: formula
      }
    } else {
      this.hideTooltip()
      window.focusIndex = index = e.index + e.length
    }
  }

  handleTextChange = () => {
    const range = this.quill.getSelection(true)
    const index = range.index + range.length
    window.focusIndex = index
    var { formula } = this.searchFormula(index)
    if (!formula) {
      this.hideTooltip()
    }
  }

  searchFormula = (index) => {
    var deltaBefore = this.quill.getContents(index - 1, 1)
    var delta = this.quill.getContents(index, 1)
    var deltaAfter = this.quill.getContents(index + 1, 1)
    var formulaIndex = null
    var formula = null
    try {
      if (deltaBefore.ops[0] && deltaBefore.ops[0].insert.formula) {
        formulaIndex = index - 1
        formula = deltaBefore.ops[0].insert.formula
      } else if (delta.ops[0] && delta.ops[0].insert.formula) {
        formulaIndex = index
        formula = delta.ops[0].insert.formula
      } else if (deltaAfter.ops[0] && deltaAfter.ops[0].insert.formula) {
        formulaIndex = index
        formula = deltaAfter.ops[0].insert.formula
      }
    } catch (error) {
      console.error(error)
    }
    return {
      index: formulaIndex,
      formula: formula
    }
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
