<template>
  <div>
    <Cell
     :title="title"
     :label="label"
     :extra="extra"
     :to="to"
     @click.native="onClick">
      <Icon v-if="icon" :type="icon" slot="icon" />
      <Icon v-if="arrow" :type="arrow" slot="arrow" />
      <slot name="icon" slot="icon"></slot>
      <slot name="extra" slot="extra"></slot>
      <slot name="arrow" slot="arrow"></slot>
    </Cell>
    <div>
      <slot name="children"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBarItem',
  props: {
    icon: {
      type: String
    },
    arrow: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    extra: {
      type: String
    },
    to: {
      type: [String, Object]
    }
  },
  methods: {
    onClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

