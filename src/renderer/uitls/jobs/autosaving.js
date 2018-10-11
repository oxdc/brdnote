export default function autosaving (duration, limit) {
  setInterval(() => {
    if (window.storejs && window.vueStore && window.editor) {
      var docId = window.vueStore.getters.docId
      var drafts = window.storejs.get(docId)
      if (!drafts) {
        window.storejs.set(docId, [])
        drafts = []
      }
      if (drafts.length >= limit) {
        drafts.shift()
      }
      drafts.push({
        docId: window.vueStore.getters.docId,
        title: window.vueStore.getters.title,
        path: window.vueStore.getters.path,
        tags: window.vueStore.getters.tags,
        saved: window.vueStore.getters.saved,
        totalTime: window.vueStore.getters.totalTime,
        lastSavedTime: window.vueStore.getters.lastSavedTime,
        openingTime: window.vueStore.getters.openingTime,
        encrypted: window.vueStore.getters.encrypted,
        delta: window.editor.getContents(),
        time: new Date().getTime()
      })
      window.storejs.set(docId, drafts)
    }
  }, duration)
}
