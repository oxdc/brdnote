<template>
  <div
   id="formula-editor-container"
   class="formula-editor-container noselect"
   :style="{
    'visibility': tooltip === 'formula' ? 'visible' : 'hidden',
    'height': tooltip === 'formula' ? 'unset' : '0px'
   }">
    <div id="formula-editor" class="formula-editor">
      <div class="formula-editor-row formula-editor-flex-row">
        <div class="formula-editor-flex-column">
          <span class="formula-editor-title">Formula Editor</span>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" shape="circle" size="small" icon="md-close" @click="onClickCancle"></Button>
        </div>
      </div>
      <div class="formula-editor-row" :class="{ 'formula-editor-row-hidden': !professionalMode }">
        <codemirror v-model="code" :options="cmOptions" @ready="onReady"></codemirror>
      </div>
      <div class="formula-editor-row" v-show="professionalMode">
        <div class="formula-label noselect"> Formula Preview </div>
        <div class="formula-preview" id="formula"></div>
      </div>
      <div class="formula-editor-row" id="math-field" style="box-shadow: none;" @keydown.tab="onPressTab" v-show="!professionalMode">
      </div>
      <div class="formula-editor-row latex-preview-container tiny-scrollbar" v-show="!professionalMode">
        <span class="formula-label noselect"> LaTeX Preview </span>
        <span class="latex-preview" id="latex"></span>
      </div>
      <div class="formula-editor-row formula-editor-flex-row">
        <div class="formula-editor-flex-column">
          <Button type="default" icon="md-copy" @click="onClickCopy"> Copy LaTeX </Button>
          <Button type="default" icon="md-options" @click="onClickProMode"> {{ professionalMode ? 'Easy mode' : 'Professional Mode' }} </Button>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" @click="onClickCancle"> Cancle </Button>
          <Button type="primary" icon="md-checkmark" @click="onClickOk"> Ok </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import codemirror from '@/components/Editor/CodeMirror/codemirror.vue'
import 'codemirror/mode/stex/stex.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/display/placeholder.js'
import Quill from 'quill/core/quill'
const Delta = Quill.import('delta')

export default {
  name: 'FormulaEditor',
  components: {
    'codemirror': codemirror
  },
  data () {
    return {
      professionalMode: false,
      code: ''
    }
  },
  computed: {
    cmOptions: {
      get () {
        return {
          tabSize: 2,
          mode: 'text/x-stex',
          theme: 'default',
          lineNumbers: true,
          line: true,
          styleActiveLine: true,
          placeholder: 'Write your code here\n'
        }
      }
    },
    tooltip: {
      get () {
        return this.$store.getters.editors.richText.tooltip
      }
    }
  },
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
          window.editor.insertEmbed(window.mathEmbed.index, 'formula', this.professionalMode ? this.code : window.mathField.latex())
          window.editor.setSelection(window.mathEmbed.index + 1, 0)
        }
      } else if (window.focusIndex) {
        window.editor.insertEmbed(window.focusIndex, 'formula', this.professionalMode ? this.code : window.mathField.latex())
        window.editor.setSelection(window.focusIndex + 1, 0)
      } else {
        window.editor.insertEmbed(0, 'formula', this.professionalMode ? this.code : window.mathField.latex())
        window.editor.setSelection(1, 0)
      }
      window.mathField.latex('')
      window.mathEmbed = {
        index: null,
        formula: null
      }
      window.focusIndex = null
      this.$store.commit('setTooltip', {
        editor: 'richText',
        tooltip: null
      })
    },
    onClickCopy () {
      this.$electron.clipboard.writeText(this.professionalMode ? this.code : window.mathField.latex())
      this.$Notice.success({
        title: 'Success',
        desc: 'Copying to clipboard was successful!'
      })
    },
    onClickCancle () {
      window.mathField.latex('')
      window.mathEmbed = {
        index: null,
        formula: null
      }
      window.focusIndex = null
      this.$store.commit('setTooltip', {
        editor: 'richText',
        tooltip: null
      })
    },
    onPressTab (event) {
      if (event.ctrlKey) {
        this.onClickOk()
      }
    },
    onClickProMode (event) {
      if (this.professionalMode) {
        window.mathField.latex(this.code)
      }
      this.professionalMode = !this.professionalMode
    },
    onReady (cmFormulaEditor) {
      window.cmFormulaEditor = cmFormulaEditor
    }
  },
  watch: {
    code (value) {
      var node = document.getElementById('formula')
      if (window.katex) {
        window.katex.render(value, node, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#f00'
        })
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
  padding: 10px;
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
  display: flex;
  justify-content: flex-end;
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

.formula-preview {
  min-height: 20px;
  display: flex;
  justify-content: center;
}
</style>

<style>
.formula-editor-row .CodeMirror {
  height: 100px !important;
}

.formula-editor-row-hidden {
  visibility: hidden;
}

.formula-editor-row-hidden .CodeMirror {
  visibility: hidden;
  height: 0px !important;
}

.formula-editor-row .CodeMirror pre.CodeMirror-placeholder {
  color: rgb(153, 153, 153);
}
</style>
