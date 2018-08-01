<template>
  <Poptip
   title="Add a new tag:"
   placement="bottom"
   v-model="visible"
  >
    <Button
     icon="md-add"
     type="dashed"
     size="small"
    >
      New
    </Button>
    <div slot="content">
      <div class="add-tag-tool-line">
        <Input
         v-model="value"
         style="width: 200px"
         size="small"
         @on-keypress.enter="onAdd"
         clearable
        />
      </div>
      <div class="add-tag-tool-line align-right">
        <Button
         type="default"
         shape="circle"
         size="small"
         class="add-tag-tool-btn"
         @click="onCancle"
        >
          Cancel
        </Button>
        <Button
         type="primary"
         shape="circle"
         size="small"
         class="add-tag-tool-btn"
         @click="onAdd"
        >
          Add
        </Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
export default {
  name: 'TagAddBtn',
  data () {
    return {
      value: '',
      visible: false
    }
  },
  methods: {
    onCancle (event) {
      this.visible = false
      this.value = ''
    },
    onAdd (event) {
      if (!this.value) {
        this.$Notice.error({
          title: 'Error',
          desc: 'Tags must not be empty'
        })
        return
      }

      if (this.$store.getters.getTag(this.value) < 0) {
        this.$store.commit('addTag', {
          tag: this.value
        })
        this.visible = false
        this.value = ''
      } else {
        this.$Notice.error({
          title: 'Error',
          desc: 'The tag is duplicated.'
        })
      }
    }
  }
}
</script>

<style scoped>
.add-tag-tool-line {
  margin: 5px 0px;
}

.align-right {
  float: right;
}

.add-tag-tool-btn {
  margin: 0px 5px;
}
</style>
