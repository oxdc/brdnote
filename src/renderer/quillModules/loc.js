class QuillLoc {
  constructor (quill, options) {
    this.quill = quill
    options = options || {}
    this.options = options
    this.quill.on('selection-change', this.handleSelectionChange)
    this.quill.on('text-change', this.handleTextChange)
  }

  handleSelectionChange = (e) => {
    if (!e || !e.index) {
      return
    }
    window.currentIndex = e.index
  }

  handleTextChange = () => {
    const range = this.quill.getSelection(true)
    const index = range.index + range.length
    window.currentIndex = index
  }
}

export { QuillLoc as default }
