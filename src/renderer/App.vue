<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { loadTheme } from '@/uitls/miscellaneous'

export default {
  name: 'brdnote',
  mounted () {
    loadTheme('default')
  }
}
</script>

<style>
  /* CSS */
</style>
