import UUID from 'uuid-js'

const state = {
  title: null,
  path: null,
  tags: [],
  saved: false,
  totalTime: 0,
  lastSavedTime: 0,
  openingTime: null,
  encrypted: false,
  password: null
}

const getters = {
  title: state => {
    return state.title
  },
  path: state => {
    return state.path
  },
  tags: state => {
    return state.tags
  },
  saved: state => {
    return state.saved
  },
  getTag: state => tag => {
    return state.tags.findIndex((element) => {
      return element.tag === tag
    })
  },
  totalTime: state => {
    return state.totalTime
  },
  lastSavedTime: state => {
    return state.lastSavedTime
  },
  openingTime: state => {
    return state.openingTime
  },
  encrypted: state => {
    return state.encrypted
  },
  password: state => {
    return state.password
  }
}

const actions = {}

const mutations = {
  updateTitle: (state, { title }) => {
    state.title = title
  },
  updatePath: (state, { path }) => {
    state.path = path
  },
  updateSavingStatus: (state, status) => {
    state.saved = status
  },
  updateTotalTime: (state, { newTime }) => {
    state.totalTime = newTime
  },
  updateEncryptionStatus: (state, status) => {
    state.encrypted = status
  },
  updatePassword: (state, { password }) => {
    if (password) {
      state.password = password
      state.encrypted = true
    } else {
      state.password = null
      state.encrypted = false
    }
  },
  initLastSavedTime: (state, { lastSavedTime }) => {
    state.lastSavedTime = lastSavedTime
  },
  initOpeningTime: (state, { openingTime }) => {
    state.openingTime = openingTime
  },
  initTags: (state, { tags }) => {
    state.tags = tags
  },
  addTag: (state, { tag }) => {
    const index = state.tags.findIndex((element) => {
      return element.tag === tag
    })
    if (index < 0) {
      state.tags.push({
        id: UUID.create(4).toString(),
        tag: tag
      })
    }
  },
  deleteTag: (state, { id }) => {
    const index = state.tags.findIndex((element) => {
      return element.id === id
    })
    if (index >= 0) {
      state.tags.splice(index, 1)
    }
  },
  changeTag: (state, { id, tag }) => {
    const index = state.tags.findIndex((element) => {
      return element.tag === tag
    })
    if (index < 0) {
      const target = state.tags.findIndex((element) => {
        return element.id === id
      })
      state.tags[target].tag = tag
    }
  },
  initDoc: (state) => {
    state.title = null
    state.path = null
    state.tags = []
    state.saved = false
    state.encrypted = false
    state.password = null
    state.totalTime = 0
    state.lastSavedTime = 0
    state.openingTime = new Date().getTime()
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
