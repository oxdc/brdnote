import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'simplebar'
import 'simplebar/dist/simplebar.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import iView from 'iview'
import locale from 'iview/dist/locale/en-US'

import '@/quillModules/formats/focus.css'

import '@/assets/Themes/base.css'
import '@/assets/Themes/default.css'
import '@/assets/Themes/Quill/quill.core.css'
import '@/assets/Themes/Quill/quill.snow.css'
import '@/assets/Themes/Quill/quill.bubble.css'
import '@/assets/Themes/Quill/quill.extend.css'
import '@/assets/Themes/Quill/quill.emoji.css'
import 'iview/dist/styles/iview.css'

import 'katex/dist/katex.min.css'
import '../../static/mathquill/mathquill.css'
import katex from 'katex'
import '../../static/mathquill/mathquill.min.js'

import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'

window.katex = katex
window.hljs = hljs
window.CodeMirror = CodeMirror

Vue.use(iView, { locale })

require.config({
  packages: [{
    name: 'codemirror',
    location: '../../node_modules/codemirror',
    main: 'lib/codemirror'
  }]
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
