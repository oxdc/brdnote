<template>
  <div id="app-split-root">
    <Split
     v-model="rootSplit"
     :min="sidebarVisibility ? '62px' : '0px'">
      <side-bar-plane slot="left"></side-bar-plane>
      <div slot="right">
        <toolbar-plane>
          <toolbar slot="toolbar"></toolbar>
          <formula-editor slot="tooltip"></formula-editor>
        </toolbar-plane>
        <document-body id="document-body">
          <quill-editor
           :options="editorOption"
           @change="onChange"
           slot="content"
          ></quill-editor>
        </document-body>
      </div>
    </Split>
    <status-bar-plane>
      <div>
        <Icon
         :type="status ? 'md-checkmark-circle' : 'md-information-circle'"
         :style="{'color': status ? '#19be6b' : '#fcbb58'}"
        ></Icon>
        {{ status ? 'Saved !' : 'Press `Ctrl + S` to save.' }}
      </div>
      <div id="word-counter" style="float: right;"></div>
      <div id="symbol-counter" style="float: right;"></div>
      <div style="float: right;"> {{ timer }} </div>
    </status-bar-plane>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'
import DocumentBody from '@/components/Document/DocumentBody'
import ToolbarPlane from '@/components/Toolbar/ToolbarPlane'
import Toolbar from '@/components/Toolbar/Toolbar'
import FormulaEditor from '@/components/Toolbar/FormulaEditor'
import StatusBarPlane from '@/components/Toolbar/StatusBarPlane'
import SideBarPlane from '@/components/SideBar/SideBarPlane'
import QuillEditor from '@/components/Editor/QuillEditor'

export default {
  name: 'Editor',
  components: {
    'document-body': DocumentBody,
    'toolbar-plane': ToolbarPlane,
    'quill-editor': QuillEditor,
    'toolbar': Toolbar,
    'status-bar-plane': StatusBarPlane,
    'side-bar-plane': SideBarPlane,
    'formula-editor': FormulaEditor
  },
  data: () => {
    return {
      timer: '0h 0m 0s'
    }
  },
  methods: {
    onChange (event) {
      this.$store.commit('updateSavingStatus', false)
    },
    setPosition () {
      var splitRoot = document.getElementById('app-split-root')
      splitRoot.style.height = getSize().height - 25 + 'px'
      console.log(this.rootSplit)
    }
  },
  computed: {
    editorOption: {
      get () {
        return {
          theme: 'snow',
          scrollingContainer: '#document-body',
          modules: {
            syntax: {
              highlight: text => window.hljs.highlightAuto(text).value
            },
            formulaPlus: true,
            toolbar: {
              container: '#toolbar',
              handlers: {'emoji': () => {}}
            },
            wordcounter: {
              container: '#word-counter',
              unit: 'word'
            },
            symbolcounter: {
              container: '#symbol-counter',
              unit: 'symbol'
            },
            history: {
              delay: 1000,
              maxStack: 500,
              userOnly: false
            },
            blotFormatter: {},
            markdownShortcuts: {},
            markplusShortcuts: {},
            magicUrl: true,
            emojiShortname: true,
            emojiToolbar: true
          }
        }
      }
    },
    status: {
      get () {
        return this.$store.getters.saved
      }
    },
    sidebarVisibility: {
      get () {
        return this.$store.getters.sidebarVisibility
      }
    },
    rootSplit: {
      get () {
        return this.$store.getters.rootSplit
      },
      set (value) {
        this.$store.commit('setRootSplit', value)
      }
    }
  },
  mounted () {
    var openingTime = new Date().getTime()
    setInterval(() => {
      var now = new Date().getTime()
      var distance = now - openingTime
      var hours = Math.floor(distance / (1000 * 60 * 60))
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
      this.timer = hours + 'h ' + minutes + 'm ' + seconds + 's'
      var remindingTime = 1000 * 60 * 30
      if (distance % remindingTime === 0) {
        this.$Message.info({
          content: 'You have been working for ' + this.timer + ', you\'d better take a break.',
          duration: 15
        })
      }
    }, 1000)
    this.setPosition()
    window.addEventListener('resize', () => {
      this.setPosition()
    })
  }
}
</script>
