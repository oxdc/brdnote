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
           icon="md-locate"
           class="filter"
           :class="isNameFilterValid ? 'filter-ok' : 'filter-error'">
            <Form slot="extra">
              <FormItem :error="isNameFilterValid ? '' : 'Invalid regular expression.'">
                <Input
                 v-model="filters.name"
                 placeholder="None"
                 />
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title="Path"
           icon="md-locate"
           class="filter"
           :class="isPathFilterValid ? 'filter-ok' : 'filter-error'">
            <Form slot="extra">
              <FormItem :error="isPathFilterValid ? '' : 'Invalid regular expression.'">
                <Input
                 v-model="filters.path"
                 placeholder="None"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title="Tags"
           icon="md-locate"
           class="filter"
           :class="isTagFilterValid ? 'filter-ok' : 'filter-error'">
            <Form slot="extra">
              <FormItem :error="isTagFilterValid ? '' : 'Invalid regular expression.'">
                <Input
                 v-model="filters.tags"
                 placeholder="None"/>
              </FormItem>
            </Form>
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
       title="Refresh List"
       icon="md-refresh"
       @click="onRefresh">
      </sidebar-item>
      <sidebar-item
       :title="'Results  (' + filtered.length +' item' + (filtered.length > 1 ? 's' : '') +')'"
       to="/"
       :arrow="showResults ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onShowResults">
        <sidebar-group slot="children" v-show="showResults">
          <sidebar-docitem
            v-for="result in filtered"
            :title="result.title"
            :date="(new Date(result.date)).toLocaleTimeString()"
            :path="result.path"
            :tags="result.tags"
            :delta="result.delta.ops"
            :key="result.id"
            @click.native="onOpenNote(result.path)">
          </sidebar-docitem>
          <sidebar-item
           title="No match result."
           v-show="filtered.length === 0"
           icon="md-more">
          </sidebar-item>
          <Spin size="large" fix v-if="loading"></Spin>
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
      loading: false,
      notebookDirectoryMenu: true,
      path: '',
      showFilter: false,
      filters: {
        path: '',
        name: '',
        date: '',
        tags: '',
        datetype: null
      },
      results: [],
      showResults: true
    }
  },
  computed: {
    isNameFilterValid: {
      get () {
        return this.validRegex(this.filters.name)
      }
    },
    isPathFilterValid: {
      get () {
        return this.validRegex(this.filters.path)
      }
    },
    isTagFilterValid: {
      get () {
        return this.filters.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
          .every(tag => this.validRegex(tag))
      }
    },
    filtered: {
      get () {
        var targetTags = this.filters.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
        var datelist = this.filters.date
          ? this.filters.date
            .filter(date => date)
            .map(date => new Date(date.trim()))
          : null

        if (!this.isNameFilterValid ||
            !this.isPathFilterValid ||
            !this.isTagFilterValid) {
          return this.results.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
          })
        }

        return this.results
          .filter(result => {
            if (result.title.search(this.filters.name) >= 0 &&
                result.path.search(this.filters.path) >= 0) {
              return true
            } else {
              return false
            }
          })
          .filter(result => {
            if (!targetTags.length) return true
            var tags = result.tags.map(item => item.tag.trim()).join()
            return targetTags.some(target => tags.search(target) >= 0)
          })
          .filter(result => {
            if (!datelist || datelist.length < 2) return true
            var date = new Date(result.date)
            return date >= datelist[0] && date <= datelist[1]
          })
          .sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
          })
      }
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
    onRefresh (event) {
      this.loading = true
      this.$set(this, 'results', [])
      var _this = this

      if (this.path) {
        this.fetchResults(this.path)
      } else {
        commands.opendir(this.$root, path => {
          this.path = path
          _this.fetchResults(path)
        })
      }
    },
    fetchResults (path) {
      var _this = this

      commands.listdir(path, (err, files) => {
        if (err) {
          console.error(err)
        }

        var notes = files.filter(result => extname(result) === '.brdnote')

        for (var note of notes) {
          commands.readdoc(note, (meta) => _this.results.push(meta))
        }

        this.loading = false
      })
    },
    onOpenNotebook (event) {
      this.loading = true
      this.results = []
      var _this = this

      commands.opendir(this.$root, path => {
        this.path = path
        _this.fetchResults(path)
      })
    },
    onOpenNote (path) {
      commands.close(this.$root, () => {
        commands.open(this.$root, null, path)
      }, true)
    },
    validRegex (regex) {
      var checkRegex = function (regex) {
        try {
          return new RegExp(regex)
        } catch (err) {
          return err
        }
      }
      return checkRegex(regex).toString().startsWith('/')
    },
    onShowResults (event) {
      this.showResults = !this.showResults
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

.filter-error .ivu-cell {
  height: 62px !important;
}

.filter-ok .ivu-form-item {
  margin-bottom: 0 !important;
}
</style>
