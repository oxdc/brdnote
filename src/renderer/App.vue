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
    this.initStyle()
    this.autosave()
  },
  methods: {
    autosave () {
      setInterval(() => {
        if (this.$store.getters.path) {
          this.save()
        }
      }, 10000)
    },
    open () {
      this.$electron.remote.dialog.showOpenDialog((fileNames) => {
        if (fileNames === undefined || fileNames[0] === undefined) {
          return
        }

        fs.readFile(fileNames[0], 'utf-8', (err, content) => {
          if (err) {
            this.$Notice.error({
              title: 'Error',
              desc: 'An error ocurred reading the file :' + err.message
            })
            return
          }

          this.$store.commit('updatePath', { path: fileNames[0] })

          var data = JSON.parse(content)

          if (window.editor && data.content) {
            data.content = JSON.parse(data.content)
            window.editor.setContents(data.content.ops)
            this.$store.commit('updateTitle', { title: data.title })
          } else {
            this.$Notice.error({
              title: 'Error',
              desc: 'The file is not consistent with brdnote.'
            })
            return
          }

          this.$store.commit('updateSavingStatus', true)
        })
      })
    },
    save () {
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
            this.$Notice.error({
              title: 'Error',
              desc: 'An error ocurred creating the file ' + err.message
            })
            return
          }

          this.$store.commit('updatePath', { path: path })

          this.$store.commit('updateSavingStatus', true)
        })
      } else {
        this.$electron.remote.dialog.showSaveDialog((fileName) => {
          if (fileName === undefined) {
            return
          }

          fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
            if (err) {
              this.$Notice.error({
                title: 'Error',
                desc: 'An error ocurred creating the file ' + err.message
              })
              return
            }

            this.$store.commit('updatePath', { path: fileName })

            this.$store.commit('updateSavingStatus', true)
          })
        })
      }
    },
    close () {
      var mainWindow = this.$electron.remote.getCurrentWindow()

      if (this.$store.getters.saved) {
        mainWindow.destroy()
      } else {
        this.$Modal.confirm({
          title: 'Notice',
          content: 'Do you want to save the changes?',
          closable: true,
          okText: 'Save',
          cancelText: 'Discard',
          onOk: () => {
            this.save()
            mainWindow.destroy()
          },
          onCancel: () => {
            mainWindow.destroy()
          }
        })
      }
    },
    initCmdHander () {
      this.$electron.ipcRenderer.on('command', (event, arg) => {
        switch (arg) {
          case 'save':
            this.save()
            break

          case 'open':
            this.open()
            break

          case 'close':
            this.close()
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
