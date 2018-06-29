<template>
  <div class="toolbar-plane-container">
    <div class="toolbar-plane">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolbarPlane'
}
</script>

<style scoped>
.toolbar-plane-container {
  position: fixed;
  min-height: 40px;
  width: 100%;
  z-index: 5;
}

.toolbar-plane {
  align-self: center;
  margin: 0px auto;
  max-width: 900px;
  height: 100%;
}
</style>
