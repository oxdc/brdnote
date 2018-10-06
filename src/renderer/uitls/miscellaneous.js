import fs from 'fs'
import sjcl from 'sjcl'

export function loadTheme (theme) {
  document.body.className = 'theme-' + theme
}

export function getSize () {
  var w = window
  var d = document
  var e = d.documentElement
  var g = d.getElementsByTagName('body')[0]
  var x = w.innerWidth || e.clientWidth || g.clientWidth
  var y = w.innerHeight || e.clientHeight || g.clientHeight
  return {
    width: x,
    height: y
  }
}

export function getSelectionCoords (win) {
  win = win || window
  var doc = win.document
  var sel = doc.selection
  var range
  var rects
  var rect
  var x = 0
  var y = 0
  if (sel) {
    if (sel.type !== 'Control') {
      range = sel.createRange()
      range.collapse(true)
      x = range.boundingLeft
      y = range.boundingTop
    }
  } else if (win.getSelection) {
    sel = win.getSelection()
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange()
      if (range.getClientRects) {
        range.collapse(true)
        rects = range.getClientRects()
        if (rects.length > 0) {
          rect = rects[0]
        }
        x = rect ? rect.left : 0
        y = rect ? rect.top : 0
      }
      // Fall back to inserting a temporary element
      if (x === 0 && y === 0) {
        var span = doc.createElement('span')
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild(doc.createTextNode('\u200b'))
          range.insertNode(span)
          rect = span.getClientRects()[0]
          x = rect ? rect.left : 0
          y = rect ? rect.top : 0
          var spanParent = span.parentNode
          spanParent.removeChild(span)

          // Glue any broken text nodes back together
          spanParent.normalize()
        }
      }
    }
  }
  return {
    x: x,
    y: y
  }
}

export function getFilesizeInBytes (filename) {
  var stats = fs.statSync(filename)
  var fileSizeInBytes = stats['size']
  return fileSizeInBytes
}

export function encryptContent (content, password) {
  return sjcl.encrypt(password, content)
}

export function decryptContent (content, password) {
  return sjcl.decrypt(password, content)
}

export function checkPassword (content, password) {
  try {
    var test = JSON.parse(sjcl.decrypt(password, content))
    if (test.ops) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

// ucs-2 string to base64 encoded ascii
export function utoa (str) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

// base64 encoded ascii to ucs-2 string
export function atou (str) {
  return decodeURIComponent(escape(window.atob(str)))
}

export default {
  loadTheme,
  getSize,
  getSelectionCoords,
  getFilesizeInBytes,
  decryptContent,
  encryptContent,
  checkPassword,
  utoa,
  atou
}
