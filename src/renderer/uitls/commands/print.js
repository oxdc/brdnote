import {
  remote
} from 'electron'

export function print (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  var mainWindow = remote.getCurrentWindow()
  mainWindow.webContents.print({
    printBackground: true,
    callback: callback
  })
}

export default print
