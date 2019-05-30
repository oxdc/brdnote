<template>
  <div>
    <sidebar-group-header icon="md-help-buoy" title="用户指南"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="快速开始"
       icon="md-paper">
      </sidebar-item>
      <sidebar-item
       title="LaTeX 命令"
       icon="md-paper">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-heart-outline" title="关于"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="版本"
       extra="v0.2.15"
       icon="md-pricetag">
      </sidebar-item>
      <sidebar-item
       title="访问 GitHub 项目"
       icon="logo-github"
       to="/"
       @click="onFork">
      </sidebar-item>
      <sidebar-item
       title="项目基于 AIAS"
       icon="md-jet"></sidebar-item>
    </sidebar-group>
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'

export default {
  name: 'SideBarHelp',
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  methods: {
    onFork () {
      this.$electron.shell.openExternal('https://github.com/oxdc/brdnote')
    }
  }
}
</script>
