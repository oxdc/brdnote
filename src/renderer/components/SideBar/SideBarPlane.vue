<template>
  <div class="sidebar-plane" ref="sidebar-plane">
    <Button type="primary" shape="circle" icon="home" class="sidebar-toggle-btn"></Button>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'

export default {
  name: 'SideBarPlane',
  methods: {
    setPosition () {
      var sidebar = this.$refs['sidebar-plane']
      var toolbar = document.getElementById('toolbar-plane')
      if (sidebar && toolbar) {
        sidebar.style.top = toolbar.clientHeight + 'px'
        sidebar.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
      }
    }
  },
  mounted () {
    this.setPosition()
    window.addEventListener('resize', () => {
      this.setPosition()
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
