import fs from 'fs'

export function cmdopen (vueRoot, path, callback) {
  if (!vueRoot) {
    return
  }

  if (!path) {
    return
  }

  fs.readFile(path, 'utf-8', (err, content) => {
    if (err) {
      vueRoot.$Notice.error({
        title: 'Error',
        desc: 'An error ocurred while reading the file :' + err.message
      })
      return
    }

    vueRoot.$store.commit('updatePath', {
      path: path
    })

    var data = JSON.parse(content)

    try {
      data.content = JSON.parse(data.content)
      window.editor.setContents(data.content.ops)
      vueRoot.$store.commit('updateTitle', {
        title: data.title
      })
      vueRoot.$store.commit('initTags', {
        tags: data.tags
      })
    } catch (error) {
      vueRoot.$Notice.error({
        title: 'Error',
        desc: 'The file is not consistent with brdnote. Exception: ' + error
      })
    }

    vueRoot.$store.commit('updateSavingStatus', true)

    if (typeof callback === 'function') {
      callback()
    }
  })
}

export default cmdopen
