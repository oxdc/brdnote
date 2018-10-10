// Load basic libraies - Vue and axios
import Vue from 'vue'
import axios from 'axios'

// Load App
import App from './App'
import router from './router'
import store from './store'

// Load themes
import '@/assets/Themes/base.css'
import '@/assets/Themes/default.css'

// Load Simplebar
import 'simplebar'
import 'simplebar/dist/simplebar.css'

// Load Highlight.js
import hljs from 'highlight.js'
import 'highlight.js/styles/vs.css'

// Load iView
import iView from 'iview'
import locale from 'iview/dist/locale/en-US'
import 'iview/dist/styles/iview.css'

// Load Katex
import katex from 'katex'
import 'katex/dist/katex.min.css'

// Load MathQuill editor
import '../../static/mathquill/mathquill.min.js'
import '../../static/mathquill/mathquill.css'

// Load CodeMirror editor
import CodeMirror from 'codemirror/lib/codemirror.js'
import VueCodemirror from '@/components/Editor/CodeMirror'
import 'codemirror/lib/codemirror.css'

// Load CodeMirror modes
import 'codemirror/mode/stex/stex.js'

// Load CodeMirror add-ons
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/display/placeholder.js'

// Load Quill editor
import Quill from 'quill'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Load extended Quill styles
import ImageFormat from '@/quillModules/extendimg'
import VideoFormat from '@/quillModules/extendvideo'
import '@/assets/Themes/Quill/quill.extend.css'
import '@/assets/Themes/Quill/quill.emoji.css'
import 'quill-mention/dist/quill.mention.min.css'
// import '@/quillModules/formats/focus.css'

// Load Quill modules
import MarkdownShortcuts from '@/quillModules/markdown'
import MarkPlusShortcuts from '@/quillModules/markplus'
import Counter from '@/quillModules/counter'
import BlotFormatter from 'quill-blot-formatter'
import MagicUrl from '@/quillModules/magicurl'
import EmojiBlot from '@/quillModules/emoji/format-emoji-blot'
import ShortNameEmoji from '@/quillModules/emoji/module-emoji'
import ToolbarEmoji from '@/quillModules/emoji/module-toolbar-emoji'
import TextAreaEmoji from '@/quillModules/emoji/module-textarea-emoji'
import FormulaPlus from '@/quillModules/formulaplus'
import 'quill-mention/src/quill.mention'
// import Focus from '@/quillModules/focus'

// Config Katex and Highlight
window.katex = katex
window.hljs = hljs

// Config editors
window.CodeMirror = CodeMirror
window.Quill = Quill

// Register extended Quill styles
window.Quill.register(ImageFormat, true)
window.Quill.register(VideoFormat, true)

// Register Quill modules
window.Quill.register('modules/markdownShortcuts', MarkdownShortcuts)
window.Quill.register('modules/markplusShortcuts', MarkPlusShortcuts)
window.Quill.register('modules/wordcounter', Counter)
window.Quill.register('modules/symbolcounter', Counter)
window.Quill.register('modules/blotFormatter', BlotFormatter)
window.Quill.register('modules/magicUrl', MagicUrl)
window.Quill.register('modules/textAreaEmoji', TextAreaEmoji)
window.Quill.register('formats/emoji', EmojiBlot)
window.Quill.register('modules/emojiShortname', ShortNameEmoji)
window.Quill.register('modules/emojiToolbar', ToolbarEmoji)
window.Quill.register('modules/emojiTextarea', TextAreaEmoji)
window.Quill.register('modules/formulaPlus', FormulaPlus)
// window.Quill.register('modules/focus', Focus)

// Config Vue modules
Vue.use(VueQuillEditor)
Vue.use(VueCodemirror)
Vue.use(iView, { locale })

// Config Vue App
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
