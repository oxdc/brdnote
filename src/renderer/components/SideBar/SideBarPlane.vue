<template>
  <div class="sidebar-plane" ref="sidebar-plane">
    <Button type="primary" shape="circle" icon="home" class="sidebar-toggle-btn"></Button>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'

export default {
  name: 'SideBarPlane',
  mounted () {
    this.$refs['sidebar-plane'].style.top =
      document.getElementById('toolbar-plane').clientHeight + 'px'
    this.$refs['sidebar-plane'].style.height =
      getSize().height - 25 - document.getElementById('toolbar-plane').clientHeight + 'px'
    window.addEventListener('resize', () => {
      this.$refs['sidebar-plane'].style.top =
        document.getElementById('toolbar-plane').clientHeight + 'px'
      this.$refs['sidebar-plane'].style.height =
        getSize().height - 25 - document.getElementById('toolbar-plane').clientHeight + 'px'
    }, true)
  }
}
</script>

<style scoped>
.sidebar-plane {
  padding: 15px;
  position: fixed;
  background: transparent;
  outline: none;
  border: none;
}

.sidebar-toggle-btn {
  box-shadow: 0px 0px 8px rgb(45, 140, 240);
}
</style>
