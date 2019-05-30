'use strict'

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  shell
} from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import path from 'path'
import isValid from 'is-valid-path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let loading
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const staticPath = process.env.NODE_ENV === 'development'
  ? path.resolve(__dirname, '../../static/')
  : `file://${__dirname}/static/`

global.vuexState = null
app.filepath = null

ipcMain.on('vuex-state', (e, state) => {
  global.vuexState = state
})

function createWindow () {
  /**
   * Initial window options
   */
  const loadingHeight = 400
  const loadingWidth = 550

  loading = new BrowserWindow({
    height: loadingHeight,
    width: loadingWidth,
    maxHeight: loadingHeight,
    maxWidth: loadingWidth,
    minHeight: loadingHeight,
    minWidth: loadingWidth,
    transparent: true,
    frame: false,
    center: true,
    useContentSize: true,
    webPreferences: {
      webSecurity: process.env.NODE_ENV !== 'development'
    }
  })

  loading.loadURL(`file:/${staticPath}/loading.html`)
  loading.show()

  mainWindow = new BrowserWindow({
    height: 742,
    width: 1200,
    minHeight: 600,
    minWidth: 400,
    useContentSize: true,
    icon: process.env.NODE_ENV !== 'development'
      ? path.join(__dirname, '/../../../icon.png')
      : path.join(__dirname, '/icon.png')
  })

  mainWindow.hide()

  mainWindow.loadURL(winURL)

  mainWindow.webContents.on('did-finish-load', (e) => {
    if (app.filepath) {
      mainWindow.webContents.send('command', 'cmdopen', app.filepath)
    }
    mainWindow.show()
    loading.destroy()
  })

  var handleRedirect = (e, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)

  mainWindow.on('close', (e) => {
    e.preventDefault()
    e.returnValue = false
    mainWindow.webContents.send('command', 'close')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    loading = null
  })

  ipcMain.on('vuex-state', (e, state) => {
    global.vuexState = state
  })
}

app.on('ready', () => {
  if (process.argv.length >= 2) {
    for (var arg of process.argv) {
      if (!isValid(arg)) continue
      if (!isSupportedFile(arg)) continue
      if (path.isAbsolute(arg)) {
        app.filepath = arg
        break
      } else {
        app.filepath = path.join(__dirname, './../../../../', arg)
        break
      }
    }
  }
  createWindow()
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+S', () => {
    mainWindow.webContents.send('command', 'save')
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+O', () => {
    mainWindow.webContents.send('command', 'open')
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+E', () => {
    mainWindow.webContents.send('command', 'printpdf')
  })
  electronLocalshortcut.register(mainWindow, 'CommandOrControl+P', () => {
    mainWindow.webContents.send('command', 'print')
  })
  electronLocalshortcut.register(mainWindow, 'F12', () => {
    mainWindow.webContents.openDevTools()
  })
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    mainWindow.destroy()
  })
})

app.on('open-file', (e, filepath) => {
  e.preventDefault()
  if (!isValid(filepath) || !isSupportedFile(filepath)) return
  if (path.isAbsolute(filepath)) {
    app.filepath = filepath
  } else {
    app.filepath = path.join(__dirname, './../../../../', filepath)
  }
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

function isSupportedFile (file) {
  if (path.extname(file) === '.brdnote' ||
      path.extname(file) === '.brdnb' ||
      path.extname(file) === '.txt' ||
      path.extname(file) === '.md'
  ) {
    return true
  } else {
    return false
  }
}
