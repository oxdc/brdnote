<template>
  <div class="status-bar-plane-container" ref="status-bar">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'StatusBarPlane'
}
</script>

<style scoped>
.status-bar-plane-container {
  overflow: hidden;
  position: fixed;
  height: 25px;
  bottom: 0px;
  width: 100%;
  z-index: 5;
  vertical-align: -webkit-baseline-middle;
  vertical-align: center;
  padding: 0px 10px;
  font-size: 16px;
  background-color: rgb(0, 122, 204);
  color: rgb(255, 255, 255);
}

.status-bar-plane-container > div {
  display: inline;
  margin: 0px 10px;
}
</style>
