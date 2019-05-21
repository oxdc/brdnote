<template>
  <Modal
    title="Chart Editor"
    v-model="visible"
    closable
    width="732"
    class="chart-editor no-select"
    @on-ok="onOk"
  >
    <func-editor
     v-for="func in funcList"
     :name="func"
     :key="func"
     @calculated="onCalculated"
     @delete="onDelete">
    </func-editor>
    <Button ghost type="warning" @click="onClearAll">Clear All</Button>
    <div class="add-func">
      <span class="chart-editor-title">Add a new function: </span>
      <Input placeholder="function name" v-model="newFuncName">
        <Button slot="append" icon="ios-add" @click="onAdd"></Button>
      </Input>
    </div>
    <vue-plotly
     :data="data"
     :layout="layout"
     :options="options"
     ref="plotly"
    />
  </Modal>
</template>

<script>
import VuePlotly from '@statnett/vue-plotly'
import FuncEditor from './FuncEditor'

export default {
  name: 'ChartEditor',
  components: {
    VuePlotly,
    FuncEditor
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      visible: this.value,
      charts: false,
      newFuncName: '',
      funcList: ['f1'],
      funcs: {
        'f1': [
          {
            x: [1, 1],
            y: [2, 2],
            name: 'f1'
          }
        ]
      },
      data: [
        {
          x: [1, 1],
          y: [2, 2],
          name: 'f1'
        }
      ],
      layout: {
        autosize: true,
        margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 4
        }
      },
      options: {
        displayModeBar: true
      }
    }
  },
  watch: {
    visible (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.visible = val
    }
  },
  methods: {
    onOk (event) {
      var index = window.currentIndex ? window.currentIndex : 0
      this.$refs.plotly.toImage().then(img => window.editor.insertEmbed(index, 'image', img))
    },
    onCalculated (event) {
      var {name, data} = event
      this.funcs[name] = data
      this.updateChart()
    },
    updateChart () {
      this.data = []
      for (var func in this.funcs) {
        if (this.funcs.hasOwnProperty(func)) {
          this.data.push(this.funcs[func])
        }
      }
    },
    onAdd () {
      if (this.newFuncName && !this.funcList.find(e => e === this.newFuncName)) {
        this.funcs[this.newFuncName] = []
        this.funcList.push(this.newFuncName)
      }
    },
    onDelete (name) {
      this.funcList = this.funcList.filter(e => e !== name)
      delete this.funcs[name]
      this.updateChart()
    },
    onClearAll (e) {
      var _this = this
      this.$Modal.confirm({
        title: 'Notice',
        content: 'Do you want to delete all functions?',
        closable: true,
        okText: 'Clear',
        cancelText: 'No',
        onOk: () => {
          _this.funcList = []
          _this.funcs = {}
          _this.data = []
          _this.updateChart()
        }
      })
    }
  }
}
</script>


<style>
.chart-editor .ivu-modal-body {
  overflow: auto;
}
</style>

<style scoped>
.chart-editor #chart {
  outline: none;
}

.chart-editor .chart-editor-title {
  font-size: 14px;
  font-family: monospace;
  color: gray;
}

.chart-editor .editor-bar {
  margin: 5px 0;
}

.chart-editor .func-button {
  margin: 0 5px;
}

.add-func {
  margin: 5px 0;
  max-width: 200px;
}
</style>
