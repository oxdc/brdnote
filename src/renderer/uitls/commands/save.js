import fs from 'fs'
import {
  remote
} from 'electron'
import {
  encryptContent
} from '../miscellaneous'

export function save (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  var content = null

  if (window.editor) {
    content = JSON.stringify(window.editor.getContents())
  }

  var password = vueRoot.$store.getters.password

  if (password) {
    content = encryptContent(content, password)
    content = window.btoa(content)
  }

  var data = {
    title: vueRoot.$store.getters.title,
    tags: vueRoot.$store.getters.tags,
    totalTime: vueRoot.$store.getters.totalTime,
    encrypted: vueRoot.$store.getters.encrypted,
    content: content
  }

  var path = vueRoot.$store.getters.path

  if (path) {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if (err) {
        vueRoot.$Notice.error({
          title: 'Error',
          desc: 'An error ocurred while creating the file ' + err.message
        })
        return
      }

      vueRoot.$store.commit('updatePath', {
        path: path
      })

      vueRoot.$store.commit('updateSavingStatus', true)

      if (typeof callback === 'function') {
        callback()
      }
    })
  } else {
    remote.dialog.showSaveDialog({
      filters: [
        { name: 'Notes', extensions: ['brdnote'] },
        { name: 'Notebooks', extensions: ['brdnb'] },
        { name: 'Plain texts', extensions: ['txt', 'md'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }, (fileName) => {
      if (fileName === undefined) {
        return
      }

      fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) {
          vueRoot.$Notice.error({
            title: 'Error',
            desc: 'An error ocurred while creating the file ' + err.message
          })
          return
        }

        vueRoot.$store.commit('updatePath', {
          path: fileName
        })

        vueRoot.$store.commit('updateSavingStatus', true)

        if (typeof callback === 'function') {
          callback()
        }
      })
    })
  }
}

export default save
