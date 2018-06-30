const state = {
  title: null,
  path: null,
  saved: false
}

const getters = {
  title: state => {
    return state.title
  },
  path: state => {
    return state.path
  },
  saved: state => {
    return state.saved
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
