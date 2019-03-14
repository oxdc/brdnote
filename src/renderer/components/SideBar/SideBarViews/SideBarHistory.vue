<template>
  <div>
    <sidebar-group-header icon="md-brush" title="Drafts"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       icon="md-git-commit"
       v-for="draft in drafts"
       :title="draft.title ? draft.title : 'Untitled draft'"
       :extra="(new Date(draft.time)).toLocaleTimeString()"
       @click="recover(draft)"
       :key="draft.id">
        <div slot="label">
          <div>{{ 'Path: ' + (draft.path ? draft.path : 'Unsaved') }}</div>
          <div>
            {{
              'Tags: ' +
              draft.tags.map(e => e.tag).slice(0, 5).join(' , ') + 
              (draft.tags.length > 5 ? ' ...' : '') +
              (draft.tags.length === 0 ? 'None' : '') 
            }}
          </div>
          <div>
            {{
              'Content: ' +
              draft.delta.ops
                .slice(0, 20)
                .map(e => e.insert.toString())
                .map(e => (e !== '[object Object]' ? e : ' {block} '))
                .join('')
                .substring(0, 30)
              + '...'
            }}
          </div>
        </div>
      </sidebar-item>
      <sidebar-item
       title="No draft here"
       icon="md-more"
       v-if="drafts.length === 0">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-time" title="Saved Versions"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="No saved version here"
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

export default {
  name: 'SideBarHistory',
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  data () {
    return {
      drafts: [],
      versions: []
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
    }
  }
}
</script>
