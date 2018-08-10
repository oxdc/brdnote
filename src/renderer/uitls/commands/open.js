import fs from 'fs'
import {
  remote
} from 'electron'
import {
  decryptContent
} from '@/uitls/miscellaneous'

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
          desc: 'An error ocurred while reading the file :' + err.message
        })
        return
      }

      vueRoot.$store.commit('updatePath', {
        path: fileNames[0]
      })

      var data = JSON.parse(content)
      vueRoot.$store.commit('updateEncryptionStatus', data.encrypted)

      if (data.encrypted) {
        var password = ''
        vueRoot.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: password,
                autofocus: true,
                type: 'password',
                placeholder: 'Please enter your password ...'
              },
              on: {
                input: (value) => {
                  password = value
                }
              }
            })
          },
          onOk: () => {
            try {
              var content = ''
              window.editor.setText(data.content)
              content = window.editor.getText()
              content = window.atob(content)
              content = decryptContent(content, password)
              content = JSON.parse(content)
              window.editor.setContents(content)
              vueRoot.$store.commit('updatePassword', {
                password: password
              })
              updateMeta(vueRoot, data)
              vueRoot.$Notice.success({
                title: 'Success',
                desc: ''
              })
            } catch (err) {
              vueRoot.$Notice.error({
                title: 'Error',
                desc: 'Password error. ' + err.message
              })
            }
          }
        })
      } else {
        data.content = JSON.parse(data.content)
        window.editor.setContents(data.content.ops)
        updateMeta(vueRoot, data)
      }

      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}

function updateMeta (vueRoot, data) {
  try {
    vueRoot.$store.commit('updateTitle', {
      title: data.title
    })
    vueRoot.$store.commit('initTags', {
      tags: data.tags
    })
    vueRoot.$store.commit('updateTotalTime', {
      newTime: data.totalTime
    })
    vueRoot.$store.commit('initLastSavedTime', {
      lastSavedTime: data.totalTime
    })
    vueRoot.$store.commit('initOpeningTime', {
      openingTime: new Date().getTime()
    })
    vueRoot.$store.commit('updateSavingStatus', true)
  } catch (error) {
    vueRoot.$Notice.error({
      title: 'Error',
      desc: 'The file is not consistent with brdnote. Exception: ' + error
    })
  }
}

export default open
