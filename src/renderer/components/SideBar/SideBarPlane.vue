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
      <Tooltip content="Document details" placement="right">
        <Button
         v-show="visible"
         :type="view === 1 ? 'primary' : 'default'"
         shape="circle"
         icon="md-infinite"
         class="sidebar-btn"
         @click="onView(1)">
        </Button>
      </Tooltip>
      <Tooltip content="Explorer" placement="right">
        <Button
         v-show="visible"
         :type="view === 2 ? 'primary' : 'default'"
         shape="circle"
         icon="md-document"
         class="sidebar-btn"
         @click="onView(2)">
        </Button>
      </Tooltip>
      <Tooltip content="Outline" placement="right">
        <Button
         v-show="visible"
         :type="view === 3 ? 'primary' : 'default'"
         shape="circle"
         icon="md-list"
         class="sidebar-btn"
         @click="onView(3)">
        </Button>
      </Tooltip>
      <Tooltip content="Searching" placement="right">
        <Button
         v-show="visible"
         :type="view === 4 ? 'primary' : 'default'"
         shape="circle"
         icon="md-search"
         class="sidebar-btn"
         @click="onView(4)">
        </Button>
      </Tooltip>
      <Tooltip content="Settings" placement="right">
        <Button
         v-show="visible"
         :type="view === 5 ? 'primary' : 'default'"
         shape="circle"
         icon="md-settings"
         class="sidebar-btn"
         @click="onView(5)">
        </Button>
      </Tooltip>
    </div>
    <div class="sidebar-right">
      <Card class="sidebar-explorer tiny-scrollbar" id="sidebar-explorer" v-show="visible">
        <p slot="title"> {{ titles[view] }} </p>
        <side-bar-outline  v-show="view === 3"></side-bar-outline>
        <p v-show="view !== 3"> Comming soon </p>
      </Card>
    </div>
  </div>
</template>

<script>
// import { getSize } from '@/uitls/miscellaneous'
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
    onView (view) {
      this.view = view
    }
  },
  computed: {
    visible: {
      get () {
        return this.$store.getters.sidebarVisibility
      }
    },
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
  height: 100%;
  border-radius: 0px !important;
  overflow-x: hidden;
  overflow-y: scroll;
  background: rgb(222, 222, 222) !important;
}
</style>
