export default class Focus {
  constructor (quill, options) {
    this.quill = quill
    this.options = options
    this.container = quill.container
    this.focusClass = options.focusClass || 'focused-blot'
    this.quill.container.classList.add('quill-focus')

    const _this = this

    this.removeHighlighting()
    quill.on('selection-change', function (range) {
      _this.highlightBlot(range)
    })
  }

  removeHighlighting () {
    const _this = this
    this.container.querySelectorAll('.' + this.focusClass).forEach(function (blot) {
      if (blot && blot.classList) {
        blot.classList.remove(_this.focusClass)
      }
    })
  }

  highlightBlot (range) {
    this.removeHighlighting()
    if (range && range.index !== undefined) {
      var [line] = this.quill.getLine(range.index)
      if (line && line.domNode) {
        line.domNode.classList.add(this.focusClass)
      }
    }
  }
}
