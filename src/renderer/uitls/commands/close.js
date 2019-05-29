import {
  remote
} from 'electron'
import save from './save'

export function close (vueRoot, callback, keep = false) {
  if (vueRoot.$store.getters.saved) {
    exeCallback(vueRoot, callback, keep)
  } else {
    vueRoot.$Modal.confirm({
      title: 'Notice',
      content: 'Do you want to save the changes?',
      closable: true,
      okText: 'Save',
      cancelText: 'Discard',
      onOk: () => {
        save(vueRoot, () => {
          exeCallback(vueRoot, callback, keep)
        })
      },
      onCancel: () => {
        exeCallback(vueRoot, callback, keep)
      }
    })
  }
}

function exeCallback (vueRoot, callback, keep) {
  var mainWindow = remote.getCurrentWindow()
  if (typeof callback === 'function') {
    callback()
  }
  if (keep) {
    initMeta(vueRoot)
  } else {
    mainWindow.destroy()
  }
}

function initMeta (vueRoot) {
  vueRoot.$store.commit('updateEncryptionStatus', false)
  vueRoot.$store.commit('updatePassword', {
    password: null
  })
  vueRoot.$store.commit('updatePath', {
    path: null
  })
  vueRoot.$store.commit('initDocId', {
    docId: null
  })
  vueRoot.$store.commit('updateTitle', {
    title: ''
  })
  vueRoot.$store.commit('initTags', {
    tags: []
  })
  vueRoot.$store.commit('updateTotalTime', {
    newTime: 0
  })
  vueRoot.$store.commit('initLastSavedTime', {
    lastSavedTime: 0
  })
  vueRoot.$store.commit('initOpeningTime', {
    openingTime: new Date().getTime()
  })
  vueRoot.$store.commit('updateSavingStatus', false)
}

export default close
