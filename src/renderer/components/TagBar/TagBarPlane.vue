<template>
  <div class="tag-bar-plane">
    <tag-btn
     v-for="item in tags"
     :key="item.id"
     :id="item.id"
     :name="item.id"
     :tag="item.tag"
     @change="onChange"
     closable>
    </tag-btn>
    <tag-add-btn @add="onAdd"></tag-add-btn>
  </div>
</template>

<script>
import TagAddBtn from '@/components/TagBar/TagBarButtons/TagAddBtn'
import TagBtn from '@/components/TagBar/TagBarButtons/TagBtn'

export default {
  name: 'TagBarPlane',
  components: {
    'tag-btn': TagBtn,
    'tag-add-btn': TagAddBtn
  },
  computed: {
    tags: {
      get () {
        return this.$store.getters.tags
      }
    }
  },
  methods: {
    onChange ({ id, tag }) {
      this.$store.commit('changeTag', {
        id: id,
        tag: tag
      })
    },
    onAdd ({ tag }) {
      this.$store.commit('addTag', {
        tag: tag
      })
    }
  }
}
</script>

<style scoped>
.tag-bar-plane {
  margin: 0px 0px 30px;
  padding: 10px 60px;
  background: #f7f7f7;
}
</style>
