const state = {
  token: null,
  username: ''
}

const getters = {
  username: state => {
    return state.username
  },
  token: state => {
    return state.token
  },
  isLoggedIn: state => {
    if (state.token) {
      return true
    } else {
      return false
    }
  }
}

const actions = {}

const mutations = {
  updateUsername: (state, { username }) => {
    if (username) {
      state.username = username
    } else {
      state.username = ''
    }
  },
  updateToken: (state, { token }) => {
    state.token = token
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
