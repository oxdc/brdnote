<template>
  <div>
    <sidebar-group>
      <sidebar-item
       title="Notebook Directory"
       to="/"
       :arrow="notebookDirectoryMenu ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onNotebookDirectoryMenu"
      >
        <sidebar-group slot="children" v-show="notebookDirectoryMenu">
          <sidebar-item fulltitle>
            <Input
             v-model="path"
             placeholder="Notebook Directory"
             slot="title"/>
          </sidebar-item>
          <sidebar-item
           title="Open Notebook"
           icon="md-bookmarks"
           @click="onOpenNotebook">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
      <sidebar-item
       title="Filter"
       icon="ios-funnel">
        <i-switch v-model="showFilter" slot="extra" />
        <sidebar-group v-show="showFilter" slot="children" class="filters">
          <sidebar-item
           title="Name"
           icon="md-locate">
            <Input
             v-model="filters.name"
             placeholder="None"
             slot="extra"/>
          </sidebar-item>
          <sidebar-item
           title="Path"
           icon="md-locate">
            <Input
             v-model="filters.path"
             placeholder="None"
             slot="extra"/>
          </sidebar-item>
          <sidebar-item
           title="Date"
           icon="md-locate">
            <DatePicker
             type="datetimerange"
             placeholder="Select date"
             slot="extra"
             :transfer="true"
             @on-change="(d, t) => { filters.date = d; filters.datetype = t }">
            </DatePicker>
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
    <sidebar-group>
      <sidebar-item
       title="Results">
        <sidebar-group slot="children">
          <sidebar-docitem
            v-for="result in results"
            :title="result.title"
            :date="(new Date(result.time)).toLocaleTimeString()"
            :path="result.path"
            :tags="result.tags"
            :delta="result.delta.ops"
            :key="result.id">
          </sidebar-docitem>
          <sidebar-item
           title="No match result."
           v-show="results.length === 0"
           icon="md-more">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
  </div>
</template>

<script>
import commands from '@/uitls/commands'
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'
import SideBarDocItem from '@/components/SideBar/SideBarBase/SideBarDocItem'
import { extname } from 'path'

export default {
  name: 'SideBarHelp',
  data: () => {
    return {
      notebookDirectoryMenu: true,
      path: '',
      showFilter: false,
      filters: {
        path: '',
        name: '',
        date: '',
        datetype: null
      },
      results: []
    }
  },
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem,
    'sidebar-docitem': SideBarDocItem
  },
  methods: {
    onNotebookDirectoryMenu (event) {
      this.notebookDirectoryMenu = !this.notebookDirectoryMenu
    },
    onOpenNotebook (event) {
      commands.opendir(this.$root, path => {
        this.path = path
        commands.listdir(path, (err, files) => {
          if (err) {
            console.error(err)
          }
          var brdnotes = files.filter(result => extname(result) === '.brdnote')
        })
      })
    }
  }
}
</script>

<style>
.filters .ivu-cell-footer {
  left: 100px !important;
}

.filters .ivu-date-picker {
  width: 100% !important;
}
</style>
