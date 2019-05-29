<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import initApp from '@/uitls/initapp'

export default {
  name: 'brdnote',
  mounted () {
    window.vueStore = this.$store
    window.vueRoot = this.$root
    initApp()
  }
}
</script>
