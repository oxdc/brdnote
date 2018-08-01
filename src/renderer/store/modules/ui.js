const state = {
  sidebarVisibility: false,
  sidebarExpanded: true,
  rootSplit: '0px'
}

const getters = {
  sidebarVisibility: state => {
    return state.sidebarVisibility
  },
  sidebarExpanded: state => {
    return state.sidebarExpanded
  },
  rootSplit: state => {
    return state.rootSplit
  }
}

const actions = {}

const mutations = {
  showSidebar: (state) => {
    state.sidebarVisibility = true
    state.sidebarExpanded = true
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
      state.sidebarExpanded = true
      state.rootSplit = '350px'
    }
    state.sidebarVisibility = !state.sidebarVisibility
  },
  expandSidebar: (state) => {
    state.sidebarExpanded = true
    state.rootSplit = '350px'
  },
  minimizeSidebar: (state) => {
    state.sidebarExpanded = false
    state.rootSplit = '62px'
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
