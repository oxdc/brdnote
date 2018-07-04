<template>
  <div class="tag-bar-plane">
    <tag-btn
     v-for="item in tags"
     :key="item.id"
     :id="item.id"
     :name="item.id"
     :tag="item.tag"
     closable
    ></tag-btn>
    <tag-add-btn></tag-add-btn>
  </div>
</template>

<script>
import TagAddBtn from '@/components/TagBar/TagAddBtn'
import TagBtn from '@/components/TagBar/TagBtn'

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
