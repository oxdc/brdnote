<template>
  <div>
    <sidebar-group-header icon="md-brush" title="草稿"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="草稿列表"
       to="/"
       :arrow="showDrafts ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onShowDrafts">
        <sidebar-group slot="children" v-show="showDrafts">
          <sidebar-docitem
           v-for="draft in drafts"
           :title="draft.title ? draft.title : '未命名草稿'"
           :date="(new Date(draft.time)).toLocaleTimeString()"
           :path="draft.path"
           :tags="draft.tags"
           :delta="draft.delta.ops"
           @click.native="recover(draft)"
           :key="draft.id">
          </sidebar-docitem>
          <sidebar-item
           title="暂无草稿"
           icon="md-more"
           v-if="!drafts">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-time" title="已保存的版本"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="暂无已保存的文档"
       icon="md-more"
       v-if="versions.length === 0">
      </sidebar-item>
    </sidebar-group>
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'
import SideBarDocItem from '@/components/SideBar/SideBarBase/SideBarDocItem'

export default {
  name: 'SideBarHistory',
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem,
    'sidebar-docitem': SideBarDocItem
  },
  data () {
    return {
      drafts: [],
      versions: [],
      showDrafts: true
    }
  },
  mounted () {
    var docId = this.$store.getters.docId
    setInterval(() => {
      this.drafts = window.storejs.get(docId)
      if (this.drafts) this.drafts = this.drafts.reverse()
    }, 1000)
  },
  methods: {
    recover (draft) {
      this.saveDraft()
      window.editor.setContents(draft.delta)
      this.$store.commit('updateTitle', { title: draft.title })
      this.$store.commit('initTags', { tags: draft.tags })
      this.$store.commit('updatePath', { path: draft.path })
    },
    saveDraft () {
      var docId = this.$store.getters.docId
      var drafts = window.storejs.get(docId)
      if (!drafts) {
        window.storejs.set(docId, [])
        drafts = []
      }
      drafts.push({
        docId: this.$store.getters.docId,
        title: this.$store.getters.title,
        path: this.$store.getters.path,
        tags: this.$store.getters.tags,
        saved: this.$store.getters.saved,
        totalTime: this.$store.getters.totalTime,
        lastSavedTime: this.$store.getters.lastSavedTime,
        openingTime: this.$store.getters.openingTime,
        encrypted: this.$store.getters.encrypted,
        delta: window.editor.getContents(),
        time: new Date().getTime()
      })
      window.storejs.set(docId, drafts)
    },
    onShowDrafts (event) {
      this.showDrafts = !this.showDrafts
    }
  }
}
</script>
