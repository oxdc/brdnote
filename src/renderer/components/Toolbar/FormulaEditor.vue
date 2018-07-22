<template>
  <div id="formula-editor-container" class="formula-editor-container noselect">
    <div id="formula-editor" class="formula-editor">
      <div class="formula-editor-row formula-editor-flex-row">
        <div class="formula-editor-flex-column">
          <span class="formula-editor-title">Formula Editor</span>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" shape="circle" size="small" icon="close-round" @click="onClickCancle"></Button>
        </div>
      </div>
      <div class="formula-editor-row" id="math-field" style="box-shadow: none;" @keydown.tab="onPressTab">
      </div>
      <div class="formula-editor-row latex-preview-container tiny-scrollbar">
        <span class="formula-label noselect"> LaTeX Preview </span>
        <span class="latex-preview" id="latex"></span>
      </div>
      <div class="formula-editor-row formula-editor-flex-row">
        <div class="formula-editor-flex-column">
          <Button type="ghost" icon="ios-copy-outline" @click="onClickCopy"> Copy LaTeX </Button>
          <Button type="ghost" icon="android-options"> Professional Mode </Button>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" @click="onClickCancle"> Cancle </Button>
          <Button type="primary" @click="onClickOk"> Ok </Button>
        </div>
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
    },
    onPressTab (event) {
      if (event.ctrlKey) {
        this.onClickOk()
      }
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

.formula-editor-title {
  font-size: 14px;
  font-family: monospace;
  color: gray;
}

.formula-editor-row {
  margin: 5px;
  display: block;
}

.formula-editor-flex-row {
  display: flex;
}

.formula-editor-flex-column {
  width: 50%;
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
  font-weight: bold;
  font-family: "Droid Sans Mono", monospace, monospace, "Droid Sans Fallback";
}
</style>