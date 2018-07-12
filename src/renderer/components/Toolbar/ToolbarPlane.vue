<template>
  <div class="toolbar-plane-container" id="toolbar-plane">
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
  top: 0px;
  position: fixed;
  min-height: 40px;
  z-index: 5;
}

.toolbar-plane {
  margin: 0px auto;
  width: fit-content;
  height: 100%;
}
</style>
