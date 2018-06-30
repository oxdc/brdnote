<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import fs from 'fs'
import { loadTheme } from '@/uitls/miscellaneous'

export default {
  name: 'brdnote',
  mounted () {
    loadTheme('default')
    this.initCmdHander()
  },
  methods: {
    initCmdHander () {
      this.$electron.ipcRenderer.on('command', (event, arg) => {
        if (arg === 'save') {
          var content = null

          if (window.editor) {
            content = JSON.stringify(window.editor.getContents(), null, 2)
          }

          var data = {
            title: this.$store.getters.title,
            content: content
          }

          var path = this.$store.getters.path

          if (path) {
            fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
              if (err) {
                console.log('An error ocurred creating the file ' + err.message)
              }

              this.$store.commit('updateSavingStatus', true)
              console.log('The file has been succesfully saved')
            })
            return
          }

          this.$electron.remote.dialog.showSaveDialog((fileName) => {
            if (fileName === undefined) {
              console.log('No file selected')
              return
            }

            fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
              if (err) {
                console.log('An error ocurred creating the file ' + err.message)
              }

              this.$store.commit('updateSavingStatus', true)
              console.log('The file has been succesfully saved')
            })
          })
        } else if (arg === 'open') {
          this.$electron.remote.dialog.showOpenDialog((fileNames) => {
            if (fileNames === undefined || fileNames[0] === undefined) {
              console.log('No file selected')
              return
            }

            fs.readFile(fileNames[0], 'utf-8', (err, content) => {
              if (err) {
                console.log('An error ocurred reading the file :' + err.message)
                return
              }

              this.$store.commit('updatePath', { path: fileNames[0] })

              var data = JSON.parse(content)

              if (window.editor && data.content) {
                data.content = JSON.parse(data.content)
                window.editor.setContents(data.content.ops)
                this.$store.commit('updateTitle', { title: data.title })
              }

              this.$store.commit('updateSavingStatus', true)
            })
          })
        }
      })
    }
  }
}
</script>

<style>
  /* CSS */
</style>
