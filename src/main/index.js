'use strict'

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

global.vuexState = null

ipcMain.on('vuex-state', (e, state) => {
  global.vuexState = state
})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 618,
    width: 1000,
    minHeight: 500,
    minWidth: 300,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.onbeforeunload = (e) => {
    console.log('aa')
    var answer = confirm('Do you really want to close the application?')
    e.returnValue = answer // this will *prevent* the closing no matter what value is passed
    if (answer) {
      mainWindow.destroy()
    } // this will close the app
  }
  mainWindow.on('close', (e) => {
    e.preventDefault()
    e.returnValue = false
    mainWindow.webContents.send('command', 'close')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('vuex-state', (e, state) => {
    global.vuexState = state
  })
}

app.on('ready', () => {
  createWindow()
  globalShortcut.register('CommandOrControl+S', () => {
    mainWindow.webContents.send('command', 'save')
  })
  globalShortcut.register('CommandOrControl+O', () => {
    mainWindow.webContents.send('command', 'open')
  })
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    mainWindow.destroy()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
