'use strict'

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import path from 'path'

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
    width: 1100,
    minHeight: 500,
    minWidth: 300,
    useContentSize: true,
    icon: process.env.NODE_ENV !== 'development'
      ? path.join(__dirname, '/../../../icon.png')
      : path.join(__dirname, '/icon.png')
  })

  mainWindow.loadURL(winURL)

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
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+S', () => {
    mainWindow.webContents.send('command', 'save')
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+O', () => {
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
