<template>
  <div class="title-container">
    <input class="title" placeholder="Untitled" v-model="title">
  </div>
</template>

<script>
export default {
  name: 'DocumentTitle',
  computed: {
    title: {
      get () {
        return this.$store.getters.title
      },
      set (value) {
        if (value) {
          this.$store.commit('changeTitle', { title: value })
        } else {
          this.$store.commit('changeTitle', { title: 'untitled' })
        }
      }
    }
  }
}
</script>

<style scoped>
.title-container {
  margin: 40px 50px;
}

.title {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  width: 100%;
  margin: 0px;
  padding: 30px 10px 10px 10px;

  background: transparent;

  outline: none;
  border: none;
}
</style>
