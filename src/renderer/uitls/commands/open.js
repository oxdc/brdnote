import fs from 'fs'
import {
  remote
} from 'electron'
import {
  decryptContent,
  atou
} from '@/uitls/miscellaneous'
import request from 'request'

export function open (vueRoot, callback, path = null) {
  if (!vueRoot) {
    return
  }

  if (path) {
    openDocument(path, vueRoot)
  } else {
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

      openDocument(fileNames[0], vueRoot)

      if (typeof callback === 'function') {
        callback(fileNames[0])
      }
    })
  }
}

function openDocument (path, vueRoot) {
  if (path.startsWith('brdweb://')) {
    var token = vueRoot.$store.getters.token
    var matches = path.match(/^brdweb:\/\/notes\/(.+)$/)
    var noteid = matches[1]
    request.get('http://123.206.107.58:8000/download/' + noteid + '?token=' + token, (err, res, body) => {
      if (err) return
      var r = JSON.parse(body)
      if (r.status !== 'ok') return
      readContent(null, null, r.content, vueRoot)
    })
  } else {
    fs.readFile(path, 'utf-8', (err, content) => readContent(err, path, content, vueRoot))
  }
}

function readContent (err, path, content, vueRoot) {
  if (err) {
    vueRoot.$Notice.error({
      title: 'Error',
      desc: 'An error ocurred while reading the file :' + err.message
    })
    closeDocument(vueRoot)
    return
  }
  if (content.startsWith('ENCRYPTED')) {
    vueRoot.$store.commit('updateEncryptionStatus', true)
  } else {
    vueRoot.$store.commit('updateEncryptionStatus', false)
  }
  if (content.startsWith('ENCRYPTED')) {
    content = content.substring(9)
    var password = ''
    vueRoot.$Modal.confirm({
      title: 'This document has been encrypted !',
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
          content = decryptContent(JSON.parse(atou(content)), password)
          extractContent(content, vueRoot)
          vueRoot.$store.commit('updatePassword', {
            password: password
          })
          vueRoot.$Notice.success({
            title: 'Success',
            desc: ''
          })
          vueRoot.$store.commit('updatePath', {
            path: path
          })
        } catch (err) {
          vueRoot.$Notice.error({
            title: 'Error',
            desc: 'Password error. ' + err.message
          })
          closeDocument(vueRoot)
        }
      },
      onCancel: () => {}
    })
  } else {
    extractContent(content, vueRoot)
    vueRoot.$store.commit('updatePath', {
      path: path
    })
  }
}

function extractContent (content, vueRoot) {
  try {
    var data = JSON.parse(content)
    data.content = JSON.parse(data.content)
    window.editor.setContents(data.content.ops)
    updateMeta(vueRoot, data)
  } catch (err) {
    vueRoot.$Notice.error({
      title: 'Error',
      desc: 'Broken files. ' + err.message
    })
  }
}

function closeDocument (vueRoot) {
  vueRoot.$store.commit('initDoc')
  window.editor.setContents(null)
}

function updateMeta (vueRoot, data) {
  try {
    vueRoot.$store.commit('initDocId', {
      docId: data.docId
    })
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
