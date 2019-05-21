<template>
  <div class="editor-bar no-select">
    <span class="chart-editor-title">{{name}}(x) = </span>
    <div :id="name + '-chart'" style="box-shadow: none;"></div>
    <span class="chart-editor-title">from x = </span>
    <div :id="name + '-start-point'" style="box-shadow: none;"></div>
    <span class="chart-editor-title">to x = </span>
    <div :id="name + '-end-point'" style="box-shadow: none;"></div>
    <span class="chart-editor-title"> with </span>
    <InputNumber :min="10" v-model="sample"></InputNumber>
    <span class="chart-editor-title"> points as sample. </span>
    <Button
     type="primary"
     shape="circle"
     icon="md-checkmark"
     size="small"
     class="func-button"
     @click="onGenChart"
    >
    </Button>
    <Button
     type="error"
     shape="circle"
     icon="md-trash"
     size="small"
     class="func-button"
     @click="onDelete"
    >
    </Button>
  </div>
</template>

<script>
import latex2js from '@/uitls/latex2js'
import * as math from 'mathjs'

export default {
  name: 'FuncEditor',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      func: '',
      startPoint: '-10',
      endPoint: '10',
      sample: 1000
    }
  },
  methods: {
    onGenChart (event) {
      console.log(this.func, this.endPoint, this.startPoint)
      var startvalue = math.eval(latex2js(this.startPoint))
      var endvalue = math.eval(latex2js(this.endPoint))
      var func = math.eval(latex2js('f(x) =' + this.func))
      console.log(startvalue, endvalue)
      var step = (endvalue - startvalue) / this.sample
      var x = startvalue
      var data = {}
      data.x = []
      data.y = []
      data.name = this.name
      while (x <= endvalue) {
        data.x.push(x)
        data.y.push(func(x))
        x += step
      }
      this.$emit('calculated', {
        name: this.name,
        data: data
      })
    },
    onDelete (event) {
      this.$emit('delete', this.name)
    }
  },
  mounted () {
    var _this = this
    var mathFieldSpan = document.getElementById(this.name + '-chart')
    var startPointSpan = document.getElementById(this.name + '-start-point')
    var endPointSpan = document.getElementById(this.name + '-end-point')
    var MQ = window.MathQuill.getInterface(2)
    var mathField = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: true,
      handlers: {
        edit: function () {
          _this.func = mathField.latex()
        }
      }
    })
    var startPointField = MQ.MathField(startPointSpan, {
      spaceBehavesLikeTab: true,
      handlers: {
        edit: function () {
          _this.startPoint = startPointField.latex()
        }
      }
    })
    startPointField.latex('-10')
    var endPointField = MQ.MathField(endPointSpan, {
      spaceBehavesLikeTab: true,
      handlers: {
        edit: function () {
          _this.endPoint = endPointField.latex()
        }
      }
    })
    endPointField.latex('10')
  }
}
</script>
