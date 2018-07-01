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
  mounted () {
    this.$refs['document-body'].style.top =
      document.getElementById('toolbar-plane').clientHeight + 'px'
    this.$refs['document-body'].style.height =
      getSize().height - 25 - document.getElementById('toolbar-plane').clientHeight + 'px'
    window.addEventListener('resize', () => {
      this.$refs['document-body'].style.top =
        document.getElementById('toolbar-plane').clientHeight + 'px'
      this.$refs['document-body'].style.height =
        getSize().height - 25 - document.getElementById('toolbar-plane').clientHeight + 'px'
    }, true)
  }
}
</script>

<style scoped>
.document-container {
  position: fixed;
  overflow: scroll;
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
