<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { loadTheme } from '@/uitls/miscellaneous'
import commands from '@/uitls/commands'

export default {
  name: 'brdnote',
  mounted () {
    loadTheme('default')
    this.initCmdHander()
    this.initStyle()
    this.autosave()
    window.vueStore = this.$store
  },
  methods: {
    autosave () {
      setInterval(() => {
        if (this.$store.getters.path) {
          commands.save(this.$root)
        }
      }, 10000)
    },
    initCmdHander () {
      this.$electron.ipcRenderer.on('command', (event, cmd, arg) => {
        switch (cmd) {
          case 'save':
            commands.save(this.$root)
            break

          case 'open':
            commands.open(this.$root)
            break

          case 'close':
            commands.close(this.$root)
            break

          case 'printpdf':
            commands.printpdf(this.$root)
            break

          case 'cmdopen':
            commands.cmdopen(this.$root, arg)
            break

          case 'print':
            commands.print(this.$root)
            break

          default:
            break
        }
      })
    },
    initStyle () {
      function changeMargins () {
        var notice = document.getElementsByClassName('ivu-notice')
        var toolbar = document.getElementById('toolbar-plane')
        if (notice) {
          Array.from(notice).forEach((e) => {
            e.style.marginTop = toolbar.clientHeight + 'px'
          })
        }
        var message = document.getElementsByClassName('ivu-message')
        if (message) {
          Array.from(message).forEach((e) => {
            e.style.marginTop = toolbar.clientHeight + 'px'
          })
        }
      }

      changeMargins()
      window.addEventListener('resize', changeMargins, true)

      var targetNode = document.body
      var config = { childList: true }
      var callback = () => {
        changeMargins()
      }

      var observer = new MutationObserver(callback)
      observer.observe(targetNode, config)
    }
  }
}
</script>

<style>
  /* CSS */
</style>
