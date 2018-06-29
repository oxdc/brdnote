<template>
  <div class="status-bar-plane-container" ref="status-bar">
    <slot>
    </slot>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'

export default {
  name: 'StatusBarPlane',
  mounted () {
    window.addEventListener('resize', () => {
      this.$refs['status-bar'].style.top = getSize().height - 25 + 'px'
    }, true)
  }
}
</script>

<style scoped>
.status-bar-plane-container {
  position: fixed;
  height: 25px;
  width: 100%;
  z-index: 5;
  background-color: rgb(0, 122, 204);
  color: rgb(255, 255, 255);
}
</style>
