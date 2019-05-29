class MarkPlusShortcuts {
  constructor (quill, options) {
    this.quill = quill
    this.options = options

    this.ignoreTags = ['PRE']
    this.matches = [
      {
        name: 'plaintext',
        pattern: /^\\\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' ', null)
          }, 0)
        }
      },
      {
        name: 'questions',
        pattern: /^-\?\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' ? ', {
              'color': '#339966'
            })
          }, 0)
        }
      },
      {
        name: 'keypoints',
        pattern: /^->\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' > ', {
              'color': '#993366'
            })
          }, 0)
        }
      },
      {
        name: 'feedback',
        pattern: /^-=\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' = ', {
              'color': '#ff6600'
            })
          }, 0)
        }
      },
      {
        name: 'important',
        pattern: /^-!\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' ! ', {
              'color': '#ff0000',
              'bold': true
            })
          }, 0)
        }
      },
      {
        name: 'comments',
        pattern: /^-o\s/g,
        action: (text, selection, pattern) => {
          var match = pattern.exec(text)
          if (!match) return
          const size = match[0].length
          setTimeout(() => {
            this.quill.deleteText(selection.index - size, size)
            this.quill.insertText(selection.index - size, ' \u25cf ', {
              'color': '#3366ff'
            })
          }, 0)
        }
      }
    ]

    // Handler that looks for insert deltas that match specific characters
    this.quill.on('text-change', (delta, oldContents, source) => {
      for (let i = 0; i < delta.ops.length; i++) {
        if (delta.ops[i].hasOwnProperty('insert')) {
          if (delta.ops[i].insert === ' ') {
            this.onSpace()
          } else if (delta.ops[i].insert === '\n') {
            this.onEnter()
          }
        }
      }
    })
  }

  isValid (text, tagName) {
    return (
      typeof text !== 'undefined' &&
      text &&
      this.ignoreTags.indexOf(tagName) === -1
    )
  }

  onSpace () {
    const selection = this.quill.getSelection()
    if (!selection) return
    const [line, offset] = this.quill.getLine(selection.index)
    const text = line.domNode.textContent
    const lineStart = selection.index - offset
    if (this.isValid(text, line.domNode.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern)
        if (matchedText) {
          // We need to replace only matched text not the whole line
          console.log('matched:', match.name, text)
          match.action(text, selection, match.pattern, lineStart)
          return
        }
      }
    }
  }

  onEnter () {
    let selection = this.quill.getSelection()
    if (!selection) return
    const [line, offset] = this.quill.getLine(selection.index)
    const text = line.domNode.textContent + ' '
    const lineStart = selection.index - offset
    selection.length = selection.index++
    if (this.isValid(text, line.domNode.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern)
        if (matchedText) {
          console.log('matched', match.name, text)
          match.action(text, selection, match.pattern, lineStart)
          return
        }
      }
    }
  }
}

export default MarkPlusShortcuts
