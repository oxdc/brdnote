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
      title: '出错啦',
      desc: '读取文件时出错，以下信息可能有所帮助:' + err.message
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
      title: '该文档无法加密！',
      render: (h) => {
        return h('Input', {
          props: {
            value: password,
            autofocus: true,
            type: 'password',
            placeholder: '请键入密码 ...'
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
            title: '成功',
            desc: ''
          })
          vueRoot.$store.commit('updatePath', {
            path: path
          })
        } catch (err) {
          vueRoot.$Notice.error({
            title: '出错啦',
            desc: '密码错误。以下内容可能有所帮助：' + err.message
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
      title: '出错啦',
      desc: '文件已损坏。以下内容可能有所帮助：' + err.message
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
      title: '出错啦',
      desc: '文件不兼容。以下内容可能有所帮助：' + error
    })
  }
}

export default open
