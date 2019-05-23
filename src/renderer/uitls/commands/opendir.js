// import fs from 'fs'
import {
  remote
} from 'electron'

export function opendir (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  remote.dialog.showOpenDialog({
    properties: [
      'openDirectory',
      'createDirectory'
    ]
  }, (dirpath) => {
    if (dirpath === undefined || dirpath[0] === undefined) {
      return null
    }

    if (typeof callback === 'function') {
      callback(dirpath[0])
    }

    return dirpath
  })
}

export default opendir
