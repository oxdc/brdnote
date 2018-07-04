import {
  remote
} from 'electron'
import save from './save'

export function close (vueRoot) {
  var mainWindow = remote.getCurrentWindow()

  if (vueRoot.$store.getters.saved) {
    mainWindow.destroy()
  } else {
    vueRoot.$Modal.confirm({
      title: 'Notice',
      content: 'Do you want to save the changes?',
      closable: true,
      okText: 'Save',
      cancelText: 'Discard',
      onOk: () => {
        save(vueRoot, () => {
          mainWindow.destroy()
        })
      },
      onCancel: () => {
        mainWindow.destroy()
      }
    })
  }
}

export default close
