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

export default {
  loadTheme,
  getSize
}
