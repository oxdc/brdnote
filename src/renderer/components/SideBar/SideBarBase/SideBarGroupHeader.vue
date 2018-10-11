<template>
  <Divider>
    <Icon v-if="icon" :type="icon" class="side-bar-group-header"/>
    <label>{{ title }}</label>
  </Divider>
</template>

<script>
export default {
  name: 'SideBarGroupHeader',
  props: {
    icon: {
      type: String
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scope>
.side-bar-group-header {
  vertical-align: unset !important;
}
</style>
