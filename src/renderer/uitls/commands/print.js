import fs from 'fs'
import {
  remote
} from 'electron'

export function print (vueRoot, callback) {
  if (!vueRoot) {
    return
  }

  var mainWindow = remote.getCurrentWindow()
  remote.dialog.showSaveDialog({
    filters: [
      { name: 'PDF', extensions: ['pdf'] }
    ]
  }, (fileName) => {
    if (fileName === undefined) {
      return
    }

    mainWindow.webContents.printToPDF({
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
      pageSize: 'A4'
    }, (error, data) => {
      if (error) {
        vueRoot.$Notice.error({
          title: 'Error',
          desc: 'An error ocurred while printing ' + error
        })
      }
      fs.writeFile(fileName, data, (error) => {
        if (error) {
          vueRoot.$Notice.error({
            title: 'Error',
            desc: 'An error ocurred while printing ' + error
          })
        }
        vueRoot.$Notice.success({
          title: 'Success',
          desc: 'Export to PDF successfully!'
        })
      })

      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}

export default print
