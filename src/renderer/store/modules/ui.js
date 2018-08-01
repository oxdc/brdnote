const state = {
  sidebarVisibility: false,
  rootSplit: '0px'
}

const getters = {
  sidebarVisibility: state => {
    return state.sidebarVisibility
  },
  rootSplit: state => {
    return state.rootSplit
  }
}

const actions = {}

const mutations = {
  showSidebar: (state) => {
    state.sidebarVisibility = true
    state.rootSplit = '350px'
  },
  hideSidebar: (state) => {
    state.sidebarVisibility = false
    state.rootSplit = '0px'
  },
  toggleSidebar: (state) => {
    if (state.sidebarVisibility) {
      state.rootSplit = '0px'
    } else {
      state.rootSplit = '350px'
    }
    state.sidebarVisibility = !state.sidebarVisibility
  },
  setRootSplit: (state, value) => {
    state.rootSplit = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
