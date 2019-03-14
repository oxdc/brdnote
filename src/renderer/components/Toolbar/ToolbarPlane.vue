<template>
  <div class="toolbar-plane-container" id="toolbar-plane">
    <div class="toolbar-plane">
      <slot name="toolbar">
      </slot>
    </div>
    <div class="tooltip-plane">
      <slot name="tooltip">
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
  min-height: 40px;
  z-index: 5;
}

.toolbar-plane {
  margin: 0px auto;
  width: fit-content;
  height: 100%;
}
</style>
