<template>
  <Poptip
   title="编辑标签"
   placement="bottom"
   v-model="visible"
  >
    <Tag
     closable
     @on-close="onClickDelete"
    >
      <span
       @click="onDisplay"
      >
        {{ tag }}
      </span>
    </Tag>
    <div slot="content">
      <div class="edit-tag-tool-line">
        <Input
         v-model="value"
         style="width: 200px"
         size="small"
         @on-keypress.enter="onOK"
         clearable
        />
      </div>
      <div class="edit-tag-tool-line align-right">
        <Button
         type="default"
         shape="circle"
         size="small"
         class="edit-tag-tool-btn"
         @click="onCancle"
        >
         取消
        </Button>
        <Button
         type="primary"
         shape="circle"
         size="small"
         class="edit-tag-tool-btn"
         @click="onOK"
        >
         确定
        </Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
export default {
  name: 'TagBtn',
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      value: '',
      visible: false
    }
  },
  methods: {
    onDisplay (event) {
      this.visible = true
    },
    onClickDelete (event, name) {
      this.$store.commit('deleteTag', {
        id: this.id
      })
    },
    onCancle (event) {
      this.visible = false
      this.value = ''
    },
    onOK (event) {
      if (!this.value) {
        this.$Notice.error({
          title: '出错啦',
          desc: '标签不能为空'
        })
        return
      }

      if (this.$store.getters.getTag(this.value) < 0) {
        this.$emit('change', {
          id: this.id,
          tag: this.value
        })
        this.visible = false
        this.value = ''
      } else {
        this.$Notice.error({
          title: '出错啦',
          desc: '标签不能重复'
        })
      }
    }
  }
}
</script>

<style scoped>
.edit-tag-tool-line {
  margin: 5px 0px;
}

.align-right {
  float: right;
}

.edit-tag-tool-btn {
  margin: 0px 5px;
}
</style>
