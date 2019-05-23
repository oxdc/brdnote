<template>
  <div class="sidebar-item" :primary="primary">
    <Cell
     :title="title"
     :label="label"
     :extra="extra"
     :to="to"
     v-if="!fulltitle"
     @click.native="onClick">
      <Icon v-if="icon" :type="icon" :size="iconsize" slot="icon" />
      <Icon v-if="arrow" :type="arrow" slot="arrow" />
      <slot name="icon" slot="icon"></slot>
      <slot name="extra" slot="extra"></slot>
      <slot name="arrow" slot="arrow"></slot>
      <slot name="label" slot="label"></slot>
      <slot name="title"></slot>
    </Cell>
    <div v-if="fulltitle" class="cell-like">
      <slot name="title"></slot>
    </div>
    <div class="sidebar-item-children">
      <slot name="children"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBarItem',
  props: {
    primary: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    iconsize: {
      type: Number,
      default: 18
    },
    arrow: {
      type: String
    },
    title: {
      type: String
    },
    label: {
      type: String
    },
    extra: {
      type: String
    },
    to: {
      type: [String, Object]
    },
    fulltitle: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
.cell-like {
  padding: 7px 16px;
}

.sidebar-item-children .sidebar-item {
  background: rgb(237, 237, 237);
  cursor: pointer;
}

.sidebar-item-children .sidebar-item:hover {
  background: rgb(243, 243, 243);
}

.sidebar-item[primary] {
  background: #5cadff !important;
  cursor: pointer;
}

.sidebar-item[primary] .ivu-cell:hover {
  background: #74b9ff !important;
}

.sidebar-item[primary] .ivu-cell {
  color: white !important;
}
</style>
