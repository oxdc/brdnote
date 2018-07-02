<template>
  <div class="document-container" ref="document-body">
    <div class="document-body">
      <document-title></document-title>
      <div class="content-container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'
import DocumentTitle from '@/components/Document/DocumentTitle'

export default {
  name: 'DocumentBody',
  components: {
    'document-title': DocumentTitle
  },
  methods: {
    setDocumentPosition () {
      var documentBody = this.$refs['document-body']
      var toolbar = document.getElementById('toolbar-plane')
      if (documentBody && toolbar) {
        documentBody.style.top = toolbar.clientHeight + 'px'
        documentBody.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
      }
    }
  },
  mounted () {
    this.setDocumentPosition()
    window.addEventListener('resize', () => {
      this.setDocumentPosition()
    }, true)
  }
}
</script>

<style scoped>
.document-container {
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  padding: 100px 0px 800px 0px;
}

.document-body {
  max-width: 900px;
  min-height: 200px;
  margin: 10px auto;
  padding: 15px 0px 50px;
  border-radius: 10px;
}

.content-container {
  margin: 10px 60px;
  outline: none;
}
</style>
