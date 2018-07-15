import fs from 'fs'
import {
  remote
} from 'electron'

export function save (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  var content = null

  if (window.editor) {
    content = JSON.stringify(window.editor.getContents())
  }

  var data = {
    title: vueRoot.$store.getters.title,
    tags: vueRoot.$store.getters.tags,
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

      fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
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
