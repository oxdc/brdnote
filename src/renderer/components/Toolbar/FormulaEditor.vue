<template>
  <div id="formula-editor-container" class="formula-editor-container noselect">
    <div id="formula-editor" class="formula-editor">
      <div class="formula-editor-row" id="math-field" style="box-shadow: none;" @keypress.tab="onClickOk">
      </div>
      <div class="formula-editor-row latex-preview-container">
        <span class="formula-label noselect"> LaTeX Preview </span>
        <span class="latex-preview" id="latex"></span>
      </div>
      <div class="formula-editor-row align-right">
        <Button type="text" @click="onClickCopy"> Copy LaTeX </Button>
        <Button type="text" @click="onClickCancle"> Cancle </Button>
        <Button type="primary" @click="onClickOk"> Ok </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill/core/quill'
const Delta = Quill.import('delta')

export default {
  name: 'FormulaEditor',
  mounted () {
    if (window.MathQuill) {
      var mathFieldSpan = document.getElementById('math-field')
      var latexSpan = document.getElementById('latex')
      var MQ = window.MathQuill.getInterface(2)
      var mathField = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true,
        handlers: {
          edit: function () {
            latexSpan.textContent = mathField.latex()
          }
        }
      })
      window.mathField = mathField
      window.mathEmbed = {
        index: null,
        formula: null
      }
    }
  },
  methods: {
    onClickOk () {
      if (!window.editor) return
      if (window.mathEmbed.formula && window.mathEmbed.index) {
        if (window.mathField.latex() !== window.mathEmbed.formula) {
          window.editor.updateContents(new Delta()
            .retain(window.mathEmbed.index)
            .delete(1)
          )
          window.editor.insertEmbed(window.mathEmbed.index, 'formula', window.mathField.latex())
          window.editor.setSelection(window.mathEmbed.index + 1, 0)
        }
      } else if (window.focusIndex) {
        window.editor.insertEmbed(window.focusIndex, 'formula', window.mathField.latex())
        window.editor.setSelection(window.focusIndex + 1, 0)
      } else {
        window.editor.insertEmbed(0, 'formula', window.mathField.latex())
        window.editor.setSelection(1, 0)
      }
      window.mathField.latex('')
      var tooltip = document.getElementById('formula-editor-container')
      tooltip.style.height = '0px'
      tooltip.style.visibility = 'hidden'
      window.mathEmbed = {
        index: null,
        formula: null
      }
      window.focusIndex = null
    },
    onClickCopy () {
      this.$electron.clipboard.writeText(window.mathField.latex())
      this.$Notice.success({
        title: 'Success',
        desc: 'Copying to clipboard was successful!'
      })
    },
    onClickCancle () {
      window.mathField.latex('')
      var tooltip = document.getElementById('formula-editor-container')
      tooltip.style.height = '0px'
      tooltip.style.visibility = 'hidden'
      window.mathEmbed = {
        index: null,
        formula: null
      }
      window.focusIndex = null
    }
  }
}
</script>

<style scoped>
.formula-editor-container {
  height: 0px;
  visibility: hidden;
}

.formula-editor {
  margin: auto;
  max-width: 900px;
  font-size: 16px;
}

.formula-editor-row {
  margin: 5px;
  display: block;
}

.formula-label {
  color: gray;
  font-size: 14px;
  margin-right: 15px;
}

.align-right {
  text-align: right;
}

.latex-preview-container {
  max-height: 100px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.latex-preview {
  word-break: break-all;
  font-family: "Droid Sans Mono", monospace, monospace, "Droid Sans Fallback";
}
</style>
