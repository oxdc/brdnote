<template>
  <div>
    <toolbar-plane>
      <toolbar></toolbar>
    </toolbar-plane>
    <document-body>
      <quill-editor
       :options="editorOption"
       @change="onChange"
      ></quill-editor>
    </document-body>
    <status-bar-plane>
      <div>
        <Icon
         :type="status ? 'checkmark-circled' : 'information-circled'"
         :style="{'color': status ? '#19be6b' : '#fcbb58'}"
        ></Icon>
        {{ status ? 'Saved !' : 'Press `Ctrl + S` to save.' }}
      </div>
      <div id="word-counter" style="float: right;"></div>
      <div id="symbol-counter" style="float: right;"></div>
      <div style="float: right;"> {{ timer }} </div>
    </status-bar-plane>
    <side-bar-plane></side-bar-plane>
  </div>
</template>

<script>
import DocumentBody from '@/components/Document/DocumentBody'
import ToolbarPlane from '@/components/Toolbar/ToolbarPlane'
import Toolbar from '@/components/Toolbar/Toolbar'
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
    'side-bar-plane': SideBarPlane
  },
  data: () => {
    return {
      timer: '0h 0m 0s'
    }
  },
  methods: {
    onChange (event) {
      this.$store.commit('updateSavingStatus', false)
    }
  },
  computed: {
    editorOption: {
      get () {
        return {
          theme: 'snow',
          modules: {
            formula: true,
            toolbar: '#toolbar',
            wordcounter: {
              container: '#word-counter',
              unit: 'word'
            },
            symbolcounter: {
              container: '#symbol-counter',
              unit: 'symbol'
            }
          }
        }
      }
    },
    status: {
      get () {
        return this.$store.getters.saved
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
          duration: 10
        })
      }
    }, 1000)
  }
}
</script>
