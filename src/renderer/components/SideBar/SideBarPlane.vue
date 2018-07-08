<template>
  <div class="sidebar-plane" ref="sidebar-plane">
    <Tooltip
     :content="visible ? 'Hide': 'Home'"
     placement="right"
    >
      <Button
       :type="visible ? 'error' : 'primary'"
       shape="circle"
       :icon="visible ? 'close-round' : 'home'"
       :class="{
         'sidebar-btn': true,
         'sidebar-toggle-btn-open': visible,
         'sidebar-toggle-btn-close': !visible
        }"
       @click="onClickHome"
      ></Button>
    </Tooltip>
    <!-- <Tooltip content="Document details" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="information"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Explorer" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="android-document"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Outline" placement="right">
      <Button
       v-show="visible" details" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="information"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Explorer" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="android-document"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Outline" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="android-list"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Search" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="ios-search-strong"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Settings" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="settings"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
       type="default"
       shape="circle"
       icon="android-list"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Search" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="ios-search-strong"
       class="sidebar-btn"
      ></Button>
    </Tooltip>
    <Tooltip content="Settings" placement="right">
      <Button
       v-show="visible"
       type="default"
       shape="circle"
       icon="settings"
       class="sidebar-btn"
      ></Button>
    </Tooltip> -->
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'

export default {
  name: 'SideBarPlane',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    setPosition () {
      var sidebar = this.$refs['sidebar-plane']
      var toolbar = document.getElementById('toolbar-plane')
      if (sidebar && toolbar) {
        sidebar.style.top = toolbar.clientHeight + 'px'
        sidebar.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
      }
    },
    onClickHome (event) {
      this.visible = !this.visible
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
  width: 62px;
  padding: 15px;
  position: fixed;
  background: transparent;
  outline: none;
  border: none;
}

.sidebar-btn {
  margin: 5px 0px;
}

.sidebar-btn:first {
  margin-top: 0px;
}

.sidebar-toggle-btn-open {
  box-shadow: 0px 0px 8px rgb(237, 63, 20);
}

.sidebar-toggle-btn-close {
  box-shadow: 0px 0px 8px rgb(45, 140, 240);
}
</style>
