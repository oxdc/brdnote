import fs from 'fs'
import {
  remote
} from 'electron'

export function printpdf (vueRoot, callback) {
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
          title: '出错啦',
          desc: '打印出错。以下内容可能有所帮助：' + error
        })
      }
      fs.writeFile(fileName, data, (error) => {
        if (error) {
          vueRoot.$Notice.error({
            title: '出错啦',
            desc: '打印出错。以下内容可能有所帮助：' + error
          })
        }
        vueRoot.$Notice.success({
          title: '成功',
          desc: '文件已成功导出为pdf'
        })
      })

      if (typeof callback === 'function') {
        callback()
      }
    })
  })
}

export default printpdf
