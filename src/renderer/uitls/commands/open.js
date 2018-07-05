import fs from 'fs'
import {
  remote
} from 'electron'

export function open (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  remote.dialog.showOpenDialog({
    filters: [
      { name: 'Notes', extensions: ['brdnote'] },
      { name: 'Notebooks', extensions: ['brdnb'] },
      { name: 'Plain texts', extensions: ['txt', 'md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }, (fileNames) => {
    if (fileNames === undefined || fileNames[0] === undefined) {
      return
    }

    fs.readFile(fileNames[0], 'utf-8', (err, content) => {
      if (err) {
        vueRoot.$Notice.error({
          title: 'Error',
          desc: 'An error ocurred reading the file :' + err.message
        })
        return
      }

      vueRoot.$store.commit('updatePath', {
        path: fileNames[0]
      })

      var data = JSON.parse(content)

      try {
        data.content = JSON.parse(data.content)
        window.editor.setContents(data.content.ops)
        vueRoot.$store.commit('updateTitle', {
          title: data.title
        })
        vueRoot.$store.commit('initTags', {
          tags: data.tags
        })
      } catch (error) {
        vueRoot.$Notice.error({
          title: 'Error',
          desc: 'The file is not consistent with brdnote. Exception: ' + error
        })
      }

      vueRoot.$store.commit('updateSavingStatus', true)

      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}

export default open
