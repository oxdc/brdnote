<template>
  <sidebar-item
   class="result-item"
   icon="md-paper"
   :title="displayTitle"
   :extra="date">
    <div slot="label">
      <div>
        <Icon type="md-code" />
        <span>{{ displayPath }}</span>
      </div>
      <div>
        <Icon type="md-pricetag" />
        <span>{{ displayTags }}</span>
      </div>
      <p>
        {{ displayContents }}
      </p>
    </div>
  </sidebar-item>
</template>

<script>
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'

export default {
  name: 'SideBarDocItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    },
    delta: {
      type: Array,
      default: () => []
    },
    date: {
      type: String,
      default: 'date'
    }
  },
  components: {
    'sidebar-item': SideBarItem
  },
  computed: {
    displayPath () {
      return this.path ? this.path : 'Unsaved'
    },
    displayTitle () {
      return this.title ? this.title : 'Untitled'
    },
    displayTags () {
      return this.tags.map(e => e.tag).slice(0, 5).join(' , ') +
        (this.tags.length > 5 ? ' ...' : '') +
        (this.tags.length === 0 ? 'None' : '')
    },
    displayContents () {
      if (this.delta.length > 0) {
        return this.delta
          .slice(0, 20)
          .map(e => e.insert.toString())
          .map(e => (e !== '[object Object]' ? e : ' {block} '))
          .join('')
          .substring(0, 100) + '...'
      } else {
        return 'Empty'
      }
    }
  }
}
</script>

<style scoped>
.result-item p {
  white-space: initial;
  word-break: break-all;
  margin-top: 5px;
  left: -25px;
  position: relative;
}
</style>

<style>
.result-item .ivu-cell-footer {
  top: 18px !important;
}

.result-item .ivu-cell-icon {
  top: 20px !important;
  position: relative !important;
  vertical-align: top !important;
}
</style>
