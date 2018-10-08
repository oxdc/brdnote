import { getSize } from '@/uitls/miscellaneous'

const state = {
  sidebarVisibility: false,
  sidebarExpanded: true,
  rootSplit: '0px',
  editors: {
    richText: {
      tooltip: null
    }
  }
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
  },
  editors: state => {
    return state.editors
  }
}

const actions = {}

const mutations = {
  showSidebar: (state) => {
    state.sidebarVisibility = true
    state.sidebarExpanded = true
    if (getSize().width < 600) {
      state.rootSplit = getSize().width - 0 + 'px'
    } else {
      state.rootSplit = '350px'
    }
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
      if (getSize().width < 600) {
        state.rootSplit = getSize().width - 0 + 'px'
      } else {
        state.rootSplit = '350px'
      }
    }
    state.sidebarVisibility = !state.sidebarVisibility
  },
  expandSidebar: (state) => {
    state.sidebarVisibility = true
    state.sidebarExpanded = true
    if (getSize().width < 600) {
      state.rootSplit = getSize().width - 0 + 'px'
    } else {
      state.rootSplit = '350px'
    }
  },
  minimizeSidebar: (state) => {
    state.sidebarVisibility = true
    state.sidebarExpanded = false
    state.rootSplit = '62px'
  },
  setRootSplit: (state, value) => {
    state.rootSplit = value
  },
  setTooltip: (state, { editor, tooltip }) => {
    if (editor in state.editors) {
      state.editors[editor].tooltip = tooltip
    }
    setTimeout(() => {
      var documentBody = document.getElementById('document-body')
      var toolbar = document.getElementById('toolbar-plane')
      if (documentBody && toolbar) {
        documentBody.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
      }
    }, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
