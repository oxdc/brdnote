<template>
  <div>
    <sidebar-group-header icon="md-help-buoy" title="User Guide"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="Getting Started"
       icon="md-paper">
      </sidebar-item>
      <sidebar-item
       title="LaTeX commands"
       icon="md-paper">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-heart-outline" title="About"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="Version"
       extra="v0.1.35"
       icon="md-pricetag">
      </sidebar-item>
      <sidebar-item
       title="Fork me on GitHub"
       icon="logo-github"
       to="/"
       @click="onFork">
      </sidebar-item>
      <sidebar-item
       title="Powered by Project AIAS"
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
