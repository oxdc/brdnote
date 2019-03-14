<template>
  <Divider>
    <Icon
     v-if="icon"
     :type="icon"
     :size="iconsize"
     class="side-bar-group-header"/>
    <label class="side-bar-group-header-text">{{ title }}</label>
  </Divider>
</template>

<script>
export default {
  name: 'SideBarGroupHeader',
  props: {
    icon: {
      type: String
    },
    iconsize: {
      type: Number,
      default: 18
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

.side-bar-group-header-text {
  margin-left: 10px; 
  font-size: 17px;
  font-weight: bold;
}
</style>
