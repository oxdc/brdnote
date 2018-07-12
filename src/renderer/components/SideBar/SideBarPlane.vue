<template>
  <div
   :class="{
     'sidebar-plane': true,
     'noselect': true,
     'sidebar-plane-active': visible
    }"
   ref="sidebar-plane">
    <Tooltip
     :content="visible ? 'Hide': 'Home'"
     placement="right">
      <Button
       :type="visible ? 'text' : 'primary'"
       shape="circle"
       :icon="visible ? 'close-round' : 'home'"
       :class="{
         'sidebar-btn': true,
         'sidebar-toggle-btn-open': visible
        }"
       @click="onClickHome">
      </Button>
    </Tooltip>
    <Tooltip content="Document details" placement="right">
      <Button
       v-show="visible"
       :type="view === 1 ? 'primary' : 'default'"
       shape="circle"
       icon="information"
       class="sidebar-btn"
       @click="onView(1)">
      </Button>
    </Tooltip>
    <Tooltip content="Explorer" placement="right">
      <Button
       v-show="visible"
       :type="view === 2 ? 'primary' : 'default'"
       shape="circle"
       icon="android-document"
       class="sidebar-btn"
       @click="onView(2)">
      </Button>
    </Tooltip>
    <Tooltip content="Outline" placement="right">
      <Button
       v-show="visible"
       :type="view === 3 ? 'primary' : 'default'"
       shape="circle"
       icon="android-list"
       class="sidebar-btn"
       @click="onView(3)">
      </Button>
    </Tooltip>
    <Tooltip content="Searching" placement="right">
      <Button
       v-show="visible"
       :type="view === 4 ? 'primary' : 'default'"
       shape="circle"
       icon="ios-search-strong"
       class="sidebar-btn"
       @click="onView(4)">
      </Button>
    </Tooltip>
    <Tooltip content="Settings" placement="right">
      <Button
       v-show="visible"
       :type="view === 5 ? 'primary' : 'default'"
       shape="circle"
       icon="settings"
       class="sidebar-btn"
       @click="onView(5)">
      </Button>
    </Tooltip>
    <Card class="sidebar-explorer" id="sidebar-explorer" v-show="visible" data-simplebar>
      <p slot="title"> {{ titles[view] }} </p>
      <side-bar-outline  v-show="view === 3"></side-bar-outline>
      <p v-show="view !== 3"> Comming soon </p>
    </Card>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'
import SideBarOutline from '@/components/SideBar/SideBarOutline'

export default {
  name: 'SideBarPlane',
  components: {
    'side-bar-outline': SideBarOutline
  },
  data () {
    return {
      visible: false,
      view: 1
    }
  },
  methods: {
    setPosition () {
      var sidebar = this.$refs['sidebar-plane']
      var toolbar = document.getElementById('toolbar-plane')
      var sidebarexplorer = document.getElementById('sidebar-explorer')
      var documentBody = document.getElementById('document-body')
      if (sidebar && sidebarexplorer) {
        sidebar.style.height = getSize().height - 25 + 'px'
        sidebarexplorer.style.height = getSize().height - 25 + 'px'
      }
      if (documentBody && sidebar && toolbar) {
        if (this.visible) {
          sidebar.style.paddingTop = 15 + 'px'
          documentBody.style.left = sidebarexplorer.clientWidth + 62 + 'px'
          toolbar.style.width = documentBody.style.width = getSize().width - sidebarexplorer.clientWidth - 62 + 'px'
        } else {
          sidebar.style.paddingTop = toolbar.clientHeight + 15 + 'px'
          documentBody.style.left = 0 + 'px'
          toolbar.style.width = documentBody.style.width = getSize().width + 'px'
        }
      }
    },
    onClickHome (event) {
      this.visible = !this.visible
    },
    onView (view) {
      this.view = view
    }
  },
  mounted () {
    this.setPosition()
    window.addEventListener('resize', () => {
      this.setPosition()
    }, true)

    var targetNode = this.$refs['sidebar-plane']
    var config = { attributes: true, childList: true, subtree: true }
    var callback = () => {
      this.setPosition()
    }

    var observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
  },
  computed: {
    titles: {
      get () {
        return {
          '1': 'Document details',
          '2': 'Explorer',
          '3': 'Outline',
          '4': 'Searching',
          '5': 'Settings'
        }
      }
    }
  }
}
</script>

<style scoped>
.sidebar-plane {
  width: 62px;
  padding: 15px;
  position: fixed;
  background: transparent;
  outline: none;
  border: none;
}

.sidebar-plane-active {
  background: rgb(240, 240, 240) !important;
}

.sidebar-btn {
  margin: 5px 0px;
}

.sidebar-btn:first {
  margin-top: 0px;
}

.sidebar-toggle-btn-close {
  box-shadow: 0px 0px 8px rgb(45, 140, 240);
}

.sidebar-explorer {
  top: 0px;
  left: 62px;
  min-width: 260px;
  max-width: 400px;
  border-radius: 0px !important;
  position: fixed;
  overflow-x: hidden;
  overflow-y: scroll;
  resize: horizontal;
  background: rgb(222, 222, 222) !important;
}

.sidebar-explorer > .simplebar-track {
  z-index: 1;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 2px !important;
}
</style>
