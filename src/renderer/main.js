import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'simplebar'
import 'simplebar/dist/simplebar.css'

import iView from 'iview'

import 'iview/dist/styles/iview.css'

import '@/assets/Themes/base.css'
import '@/assets/Themes/default.css'
import '@/assets/Themes/Quill/quill.core.css'
import '@/assets/Themes/Quill/quill.snow.css'
import '@/assets/Themes/Quill/quill.bubble.css'

import 'katex/dist/katex.min.css'

import katex from 'katex'
window.katex = katex

Vue.use(iView)

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
