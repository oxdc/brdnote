<template>
  <div class="app-split-root">
    <Split
     v-model="rootSplit"
     min="350px"
     max="300px"
     @on-moving="onResize">
      <side-bar-plane slot="left"></side-bar-plane>
      <div slot="right" ref="right-view">
        <toolbar-plane>
          <toolbar slot="toolbar"></toolbar>
          <formula-editor slot="tooltip"></formula-editor>
        </toolbar-plane>
        <Tooltip
         content="Home"
         placement="right"
         class="sidebar-toggle-btn">
          <Button
           type="primary"
           shape="circle"
           icon="md-home"
           v-show="!sidebarVisibility"
           @click="onClickToggle">
          </Button>
        </Tooltip>
        <document-body id="document-body">
          <quill-editor
           :options="editorOption"
           @change="onChange"
           @ready="onReady"
           slot="content">
          </quill-editor>
        </document-body>
      </div>
    </Split>
    <status-bar-plane>
      <div>
        <Icon
         :type="status ? 'md-checkmark-circle' : 'md-information-circle'"
         :style="{'color': status ? '#19be6b' : '#fcbb58'}">
        </Icon>
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

export default {
  name: 'Editor',
  components: {
    'document-body': DocumentBody,
    'toolbar-plane': ToolbarPlane,
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
      this.setDocumentPosition()
      if (!this.sidebarVisibility) {
        this.rootSplit = '0px'
      }
      if (!this.sidebarExpanded) {
        this.rootSplit = '62px'
      }
      if (
        (getSize().width < 600 || this.$refs['right-view'].clientWidth < 300) &&
        this.sidebarVisibility &&
        this.sidebarExpanded
      ) {
        this.rootSplit = '62px'
      }
    },
    onClickToggle () {
      this.$store.commit('showSidebar')
    },
    onResize (event) {
      this.setDocumentPosition()
      if (!this.sidebarVisibility) {
        this.rootSplit = '0px'
      }
      if (!this.sidebarExpanded) {
        this.rootSplit = '62px'
      }
    },
    setDocumentPosition () {
      setTimeout(() => {
        var documentBody = document.getElementById('document-body')
        var toolbar = document.getElementById('toolbar-plane')
        if (documentBody && toolbar) {
          documentBody.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
        }
      }, 1)
    },
    onReady (quill) {
      window.editor = quill
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
    sidebarExpanded: {
      get () {
        return this.$store.getters.sidebarExpanded
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
    this.$store.commit('initOpeningTime', {
      openingTime: new Date().getTime()
    })
    setInterval(() => {
      var openingTime = this.$store.getters.openingTime
      var now = new Date().getTime()
      var distance = now - openingTime
      var lastStoredTime = this.$store.getters.lastSavedTime
      var newTime = lastStoredTime + distance
      this.$store.commit('updateTotalTime', {
        newTime: newTime
      })
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

<style scoped>
.sidebar-toggle-btn {
  position: absolute;
  margin: 20px;
}

.app-split-root {
  position: absolute;
  top: 0px;
  bottom: 25px;
  left: 0px;
  right: 0px;
}
</style>
