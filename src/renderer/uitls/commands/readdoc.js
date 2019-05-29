import fs from 'fs'

export function readdoc (path, callback) {
  fs.readFile(path, 'utf-8', (err, content) => {
    if (err) {
      return
    }

    var meta = null

    if (content.startsWith('ENCRYPTED')) {
      meta = {
        path: path,
        date: null,
        title: 'ENCRYPTED NOTE',
        tags: [],
        delta: {
          ops: [
            { insert: 'ENCRYPTED NOTE' }
          ]
        }
      }
    } else {
      var data = JSON.parse(content)
      data.content = JSON.parse(data.content)

      meta = {
        path: path,
        date: null,
        title: data.title,
        tags: data.tags,
        delta: data.content
      }
    }

    fs.stat(path, (err, stats) => {
      if (err) {
        return
      }

      meta.date = stats.birthtime

      if (typeof callback === 'function') {
        callback(meta)
      }
    })
  })
}

export default readdoc
