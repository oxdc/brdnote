<template>
  <Modal
   title="化学方程式编辑"
   v-model="visible"
   closable
   width="732"
   @on-ok="onOk">
    <Input v-model="formula "/>
    <div class="parser" v-html="parser">
    </div>
    <div class="errors" v-show="errors">
      <Icon type="md-warning" />
      <span>{{ errors }}</span>
    </div>
    <div class="chem-preview" id="chem-preview">
    </div>
  </Modal>
</template>

<script>
import chemCalc from '@/uitls/chemcalc'

export default {
  name: 'ChemEditor',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      visible: this.value,
      errors: '',
      formula: '',
      status: true,
      indexes: [],
      parser: ''
    }
  },
  computed: {
    chem: {
      get () {
        return '\\ce{' + this.formula + '}'
      }
    }
  },
  watch: {
    visible (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.visible = val
    },
    chem (val) {
      if (window.katex) {
        var node = document.getElementById('chem-preview')
        window.katex.render(val, node, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#f00'
        })
      }
      var { status, msg, indexes } = chemCalc(this.formula)
      this.status = status
      this.errors = msg
      this.indexes = indexes

      var arr = this.chem.split()

      if (this.indexes) {
        this.indexes.forEach(index => {
          var start = index[0]
          var stop = index[0]
          arr.splice(start, 0, '<span style="color: red;">')
          arr.splice(stop, 0, '</span>')
        })
      }

      this.parser = arr.toString().replace(',', '')
    }
  },
  methods: {
    onOk (e) {
      var index = window.currentIndex ? window.currentIndex : 0
      if (window.editor) {
        window.editor.insertEmbed(index, 'formula', this.chem)
      }
    }
  }
}
</script>

<style scoped>
.parser {
  margin: 15px 0;
  font-family: monospace;
  font-size: 15px;
  font-weight: bold;
}

.errors {
  font-size: 14px;
  color: red;
  font-family: sans-serif;
  margin: 15px 0;
}
</style>
