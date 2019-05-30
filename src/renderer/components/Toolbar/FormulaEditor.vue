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
          <span class="formula-editor-title">公式编辑</span>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" shape="circle" size="small" icon="md-close" @click="onClickCancle"></Button>
        </div>
      </div>
      <div class="formula-editor-row" :class="{ 'formula-editor-row-hidden': !professionalMode }">
        <codemirror v-model="code" :options="cmOptions" @ready="onReady"></codemirror>
      </div>
      <div class="formula-editor-row" v-show="professionalMode">
        <div class="formula-label noselect"> 公式预览 </div>
        <div class="formula-preview" id="formula"></div>
      </div>
      <div class="formula-editor-row" id="math-field" style="box-shadow: none;" @keydown.tab="onPressTab" v-show="!professionalMode">
      </div>
      <div class="formula-editor-row latex-preview-container tiny-scrollbar" v-show="!professionalMode">
        <span class="formula-label noselect"> LaTeX 预览 </span>
        <span class="latex-preview" id="latex"></span>
      </div>
      <div class="formula-editor-row formula-editor-flex-row">
        <div class="formula-editor-flex-column">
          <Button type="default" icon="md-copy" @click="onClickCopy"> 复制 LaTeX 代码 </Button>
          <Button type="default" icon="md-options" @click="onClickProMode"> {{ professionalMode ? '简单模式' : '专业模式' }} </Button>
        </div>
        <div class="formula-editor-flex-column align-right">
          <Button type="text" @click="onClickCancle"> 取消 </Button>
          <Button type="primary" icon="md-checkmark" @click="onClickOk"> 插入 </Button>
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
          placeholder: '输入 LaTeX 代码 ...\n'
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
        title: '成功',
        desc: '成功复制到剪贴板!'
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
