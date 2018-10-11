<template>
  <div>
    <sidebar-group-header icon="md-help-buoy" title="User Guide"></sidebar-group-header>
    <CellGroup>
      <Cell title="Getting Started">
        <Icon type="md-document" slot="icon" />
      </Cell>
      <Cell title="LaTeX commands">
        <Icon type="md-document" slot="icon" />
      </Cell>
    </CellGroup>
    <sidebar-group-header icon="md-heart-outline" title="About"></sidebar-group-header>
    <CellGroup>
      <Cell title="Version" extra="v0.1.35">
        <Icon type="md-pricetag" slot="icon" />
      </Cell>
    </CellGroup>
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'

export default {
  name: 'SideBarHelp',
  components: {
    'sidebar-group-header': SideBarGroupHeader
  }
}
</script>
