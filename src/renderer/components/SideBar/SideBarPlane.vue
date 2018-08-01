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
         @click="onClickToggle">
        </Button>
      </Tooltip>
      <Tooltip
       content="Expand"
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
         ghost>
        </Button>
      </Tooltip>
      <Divider />
      <Tooltip
       content="Document details"
       placement="right">
        <Button
         :type="view === 1 ? 'primary' : 'default'"
         shape="circle"
         icon="md-infinite"
         class="sidebar-btn"
         @click="onView(1)">
        </Button>
      </Tooltip>
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
       content="Searching"
       placement="right">
        <Button
         :type="view === 4 ? 'primary' : 'default'"
         shape="circle"
         icon="md-search"
         class="sidebar-btn"
         @click="onView(4)">
        </Button>
      </Tooltip>
      <Tooltip
       content="Settings"
       placement="right">
        <Button
         :type="view === 5 ? 'primary' : 'default'"
         shape="circle"
         icon="md-settings"
         class="sidebar-btn"
         @click="onView(5)">
        </Button>
      </Tooltip>
      <Tooltip
       content="Help"
       placement="right">
        <Button
         :type="view === 6 ? 'primary' : 'default'"
         shape="circle"
         icon="md-help"
         class="sidebar-btn"
         @click="onView(6)">
        </Button>
      </Tooltip>
    </div>
    <div class="sidebar-right">
      <Card class="sidebar-explorer" id="sidebar-explorer">
        <p slot="title"> {{ titles[view] }} </p>
        <side-bar-outline  v-show="view === 3"></side-bar-outline>
        <p v-show="view !== 3"> Comming soon </p>
      </Card>
    </div>
  </div>
</template>

<script>
import commands from '@/uitls/commands'
import SideBarOutline from '@/components/SideBar/SideBarOutline'

export default {
  name: 'SideBarPlane',
  components: {
    'side-bar-outline': SideBarOutline
  },
  data () {
    return {
      view: 1
    }
  },
  methods: {
    onClickToggle (event) {
      this.$store.commit('toggleSidebar')
    },
    onClickExpand (event) {
      if (this.expanded) {
        this.$store.commit('minimizeSidebar')
      } else {
        this.$store.commit('expandSidebar')
      }
    },
    onView (view) {
      this.view = view
    },
    onOpen (event) {
      commands.open(this.$root)
    },
    onSave (event) {
      commands.save(this.$root)
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
          '1': 'Document details',
          '2': 'Explorer',
          '3': 'Outline',
          '4': 'Searching',
          '5': 'Settings',
          '6': 'Help'
        }
      }
    }
  },
  mounted () {
    document
      .getElementById('sidebar-explorer')
      .getElementsByClassName('ivu-card-body')[0]
      .classList.add('tiny-scrollbar')
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
  height: 100%;
  width: 100%;
  border-radius: 0px !important;
  overflow-x: hidden;
  overflow-y: scroll;
  background: rgb(222, 222, 222) !important;
  border: none !important;
}
</style>

<style>
.sidebar-explorer .ivu-card-head {
  height: 90px !important;
  padding: 40px 16px 25px !important;
  background: gray;
  text-align: center;
}

.sidebar-explorer .ivu-card-head p,
.sidebar-explorer .ivu-card-head-inner {
  color: #e6e6e6 !important;
  font-size: 16px !important;
}

.sidebar-explorer .ivu-card-body {
  position: absolute;
  top: 90px;
  bottom: 0px;
  width: 100%;
  padding-bottom: 300px;
  overflow: scroll !important;
}
</style>
