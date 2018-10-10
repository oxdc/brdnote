<template>
  <div>
    <Divider>
      <Icon type="md-help-buoy" class="side-bar-group-header"/>
      <label>User Guide</label>
    </Divider>
    <CellGroup>
      <Cell title="Getting Started">
        <Icon type="md-document" slot="icon" />
      </Cell>
      <Cell title="LaTeX commands">
        <Icon type="md-document" slot="icon" />
      </Cell>
    </CellGroup>
    <Divider>
      <Icon type="md-heart-outline" />
      <label>About</label>
    </Divider>
    <CellGroup>
      <Cell title="Version" extra="v0.1.35">
        <Icon type="md-pricetag" slot="icon" />
      </Cell>
    </CellGroup>
  </div>
</template>

<script>
export default {
  name: 'SideBarHelp'
}
</script>

<style scope>
.side-bar-group-header {
  vertical-align: unset !important;
}
</style>

