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
      <div> {{ status ? 'Saved !' : 'Press `Ctrl + S` to save.' }} </div>
    </status-bar-plane>
  </div>
</template>

<script>
import DocumentBody from '@/components/Document/DocumentBody'
import ToolbarPlane from '@/components/Toolbar/ToolbarPlane'
import Toolbar from '@/components/Toolbar/Toolbar'
import StatusBarPlane from '@/components/Toolbar/StatusBarPlane'
import QuillEditor from '@/components/Editor/QuillEditor'

export default {
  name: 'Editor',
  components: {
    'document-body': DocumentBody,
    'toolbar-plane': ToolbarPlane,
    'quill-editor': QuillEditor,
    'toolbar': Toolbar,
    'status-bar-plane': StatusBarPlane
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
            toolbar: '#toolbar'
          }
        }
      }
    },
    status: {
      get () {
        return this.$store.getters.saved
      }
    }
  }
}
</script>
