<template>
  <sidebar-item
   :notebook-id="id"
   :title="title"
   icon="md-bookmarks"
   to="/"
   :arrow="showMenu ? 'ios-arrow-down' : 'ios-arrow-forward'"
   @click="onShowMenu">
    <sidebar-group v-show="showMenu" slot="children">
      <sidebar-item
       title="Open"
       icon="md-book"
       primary
       to="/">
      </sidebar-item>
      <sidebar-item
       title="Upload This Document"
       icon="md-cloud-upload">
      </sidebar-item>
      <sidebar-item
       title="Share"
       icon="md-share">
      </sidebar-item>
      <sidebar-item
       title="Info"
       icon="md-information-circle"
       to="/"
       :arrow="showInfo ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onShowInfo">
        <sidebar-group slot="children" v-show="showInfo">
          <sidebar-item
           title="Shared by"
           icon="md-people">
          </sidebar-item>
          <sidebar-item
           title="Rate"
           icon="md-thumbs-up">
            <Rate allow-half :value="rate" slot="extra"/>
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
      <sidebar-item
       title="More Option"
       to="/"
       :arrow="showMore ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onShowMore">
        <sidebar-group slot="children" v-show="showMore">
          <sidebar-item
           title="Cancle Sharing"
           icon="md-close-circle">
          </sidebar-item>
          <sidebar-item
           title="Delete"
           icon="md-trash">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
  </sidebar-item>
</template>

<script>
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'

export default {
  name: 'SideBarNotebook',
  props: {
    title: {
      type: String,
      default: 'Untitled Notebook'
    },
    id: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      default: 2.5
    }
  },
  components: {
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  data: () => {
    return {
      showMenu: false,
      showMore: false,
      showInfo: false
    }
  },
  methods: {
    onShowMenu (event) {
      this.showMenu = !this.showMenu
    },
    onShowMore (event) {
      this.showMore = !this.showMore
    },
    onShowInfo (event) {
      this.showInfo = !this.showInfo
    }
  }
}
</script>

