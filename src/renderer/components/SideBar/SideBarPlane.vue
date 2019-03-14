<template>
  <div
   class="sidebar-plane noselect"
   ref="sidebar-plane">
    <div class="sidebar-left">
      <Tooltip
       content="Hide"
       placement="right">
        <Button
         type="text"
         shape="circle"
         icon="md-close"
         class="sidebar-btn"
         @click="onClickHide">
        </Button>
      </Tooltip>
      <Tooltip
       :content="expanded ? 'Minilize' : 'Expand'"
       placement="right">
        <Button
         type="text"
         shape="circle"
         :icon="expanded ? 'ios-arrow-back' : 'ios-arrow-forward'"
         class="sidebar-btn"
         @click="onClickExpand">
        </Button>
      </Tooltip>
      <Tooltip
       content="Open"
       placement="right">
        <Button
         type="primary"
         shape="circle"
         icon="md-folder-open"
         class="sidebar-btn"
         @click="onOpen"
         ghost>
        </Button>
      </Tooltip>
      <Tooltip
       content="Save"
       placement="right">
        <Button
         type="primary"
         shape="circle"
         icon="md-arrow-down"
         class="sidebar-btn"
         @click="onSave"
         ghost>
        </Button>
      </Tooltip>
      <Tooltip
       content="Print"
       placement="right">
        <Button
         type="primary"
         shape="circle"
         icon="md-print"
         class="sidebar-btn"
         @click="onPrint"
         ghost>
        </Button>
      </Tooltip>
      <Divider />
      <Tooltip
       content="Document"
       placement="right">
        <Button
         :type="view === 1 ? 'primary' : 'default'"
         shape="circle"
         icon="md-infinite"
         class="sidebar-btn"
         @click="onView(1)">
        </Button>
      </Tooltip>
      <!--
      <Tooltip
       content="Explorer"
       placement="right">
        <Button
         :type="view === 2 ? 'primary' : 'default'"
         shape="circle"
         icon="md-folder"
         class="sidebar-btn"
         @click="onView(2)">
        </Button>
      </Tooltip>
      -->
      <Tooltip
       content="Outline"
       placement="right">
        <Button
         :type="view === 3 ? 'primary' : 'default'"
         shape="circle"
         icon="md-list"
         class="sidebar-btn"
         @click="onView(3)">
        </Button>
      </Tooltip>
      <Tooltip
       content="History"
       placement="right">
        <Button
         :type="view === 4 ? 'primary' : 'default'"
         shape="circle"
         icon="md-git-branch"
         class="sidebar-btn"
         @click="onView(4)">
        </Button>
      </Tooltip>
      <!--
      <Tooltip
       content="Searching"
       placement="right">
        <Button
         :type="view === 5 ? 'primary' : 'default'"
         shape="circle"
         icon="md-search"
         class="sidebar-btn"
         @click="onView(5)">
        </Button>
      </Tooltip>
      -->
      <!--
      <Tooltip
       content="Settings"
       placement="right">
        <Button
         :type="view === 6 ? 'primary' : 'default'"
         shape="circle"
         icon="md-settings"
         class="sidebar-btn"
         @click="onView(6)">
        </Button>
      </Tooltip>
      -->
      <Tooltip
       content="Help"
       placement="right">
        <Button
         :type="view === 7 ? 'primary' : 'default'"
         shape="circle"
         icon="md-help"
         class="sidebar-btn"
         @click="onView(7)">
        </Button>
      </Tooltip>
    </div>
    <div class="sidebar-right">
      <div class="sidebar-explorer" id="sidebar-explorer">
        <div class="sidebar-explorer-head"> {{ titles[view] }} </div>
        <div class="sidebar-explorer-body tiny-scrollbar">
          <sidebar-document v-show="view === 1"></sidebar-document>
          <sidebar-outline  v-show="view === 3"></sidebar-outline>
          <sidebar-history v-show="view === 4"></sidebar-history>
          <sidebar-help v-show="view === 7"></sidebar-help>
          <div v-show="view !== 1 && view !== 3 && view !== 4 && view !== 7" style="text-align: center; margin: 15px;">Comming soon ... </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSize } from '@/uitls/miscellaneous'
import commands from '@/uitls/commands'
import SideBarDocument from '@/components/SideBar/SideBarViews/SideBarDocument'
import SideBarOutline from '@/components/SideBar/SideBarViews/SideBarOutline'
import SideBarHelp from '@/components/SideBar/SideBarViews/SideBarHelp'
import SideBarHistory from '@/components/SideBar/SideBarViews/SideBarHistory'

export default {
  name: 'SideBarPlane',
  components: {
    'sidebar-document': SideBarDocument,
    'sidebar-outline': SideBarOutline,
    'sidebar-help': SideBarHelp,
    'sidebar-history': SideBarHistory
  },
  data () {
    return {
      view: 1
    }
  },
  methods: {
    onClickHide (event) {
      this.$store.commit('hideSidebar')
      this.setDocumentPosition()
    },
    onClickExpand (event) {
      if (this.expanded) {
        this.$store.commit('minimizeSidebar')
      } else {
        this.$store.commit('expandSidebar')
      }
      this.setDocumentPosition()
    },
    onView (view) {
      this.view = view
    },
    onOpen (event) {
      commands.open(this.$root)
    },
    onSave (event) {
      commands.save(this.$root)
    },
    onPrint (event) {
      commands.print(this.$root)
    },
    setDocumentPosition () {
      setTimeout(() => {
        var documentBody = document.getElementById('document-body')
        var toolbar = document.getElementById('toolbar-plane')
        if (documentBody && toolbar) {
          documentBody.style.height = getSize().height - 25 - toolbar.clientHeight + 'px'
        }
      }, 1)
    }
  },
  computed: {
    visible: {
      get () {
        return this.$store.getters.sidebarVisibility
      }
    },
    expanded: {
      get () {
        return this.$store.getters.sidebarExpanded
      }
    },
    titles: {
      get () {
        return {
          '1': 'Document',
          '2': 'Explorer',
          '3': 'Outline',
          '4': 'History',
          '5': 'Searching',
          '6': 'Settings',
          '7': 'Help'
        }
      }
    }
  }
}
</script>

<style scoped>
.sidebar-plane {
  height: 100%;
  display: flex;
  outline: none;
  border: none;
  background: rgb(240, 240, 240);
}

.sidebar-left {
  width: 62px;
  padding: 15px;
}

.sidebar-right {
  width: 100%;
}

.sidebar-btn {
  margin: 5px 0px;
}

.sidebar-btn:first {
  margin-top: 0px;
}

.sidebar-explorer {
  display: inline-table;
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 0px;
  background: rgb(222, 222, 222);
  border: none;
}

.sidebar-explorer-head {
  height: 90px;
  padding: 40px 16px 0px;
  background: gray;
  text-align: center;
  color: #e6e6e6;
  font-size: 18px;
  font-weight: 700;
}

.sidebar-explorer-body {
  position: absolute;
  top: 90px;
  bottom: 0px;
  width: 100%;
  overflow: auto;
  font-size: 16px;
}
</style>
