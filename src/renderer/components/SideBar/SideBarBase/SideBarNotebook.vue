<template>
  <sidebar-item
   :notebook-id="id"
   :title="title"
   icon="md-bookmarks"
   to="/"
   :arrow="showMenu ? 'ios-arrow-down' : 'ios-arrow-forward'"
   @click="onShowMenu">
    <div slot="label">
      <div>Shared by <b>{{ owner }}</b></div>
      <Rate allow-half :value="rate"/>
    </div>
    <div slot="extra">
      <Icon type="md-lock" v-show="accesskey !== '' && accesskey != '---'" />
      <Icon type="md-share" v-show="accesskey === '---' || shared" />
    </div>
    <sidebar-group v-show="showMenu" slot="children">
      <sidebar-item
       title="打开笔记本"
       icon="md-book"
       primary
       to="/"
       @click="onOpen">
      </sidebar-item>
      <sidebar-item
       title="上传当前文档"
       icon="md-cloud-upload"
       @click="onUpload">
      </sidebar-item>
      <sidebar-item
       title="分享"
       icon="md-share"
       v-show="!shared"
       @click="onShare">
      </sidebar-item>
      <sidebar-item
       title="更多选项"
       to="/"
       :arrow="showMore ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onShowMore"
       v-show="accesskey !== '---'">
        <sidebar-group slot="children" v-show="showMore">
          <sidebar-item
           icon="md-create">
            <div slot="title">
              <span>更改标题</span>
              <Input
               placeholder="新标题"
               v-model="newName">
                <Button slot="append" @click="onChangeTitle">确定</Button>
              </Input>
            </div>
          </sidebar-item>
          <sidebar-item
           icon="md-create">
            <div slot="title">
              <span>更改访问密码</span>
              <Input
               placeholder="新的访问密码"
               type="password"
               v-model="newSecret">
                <Button slot="append" @click="onChangeSecret">确定</Button>
              </Input>
            </div>
          </sidebar-item>
          <sidebar-item
           title="取消分享"
           icon="md-close-circle"
           v-show="shared"
           @click="onCancleShare">
          </sidebar-item>
          <sidebar-item
           title="删除"
           icon="md-trash"
           @click="onDelete">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
  </sidebar-item>
</template>

<script>
import request from 'request'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'

export default {
  name: 'SideBarNotebook',
  props: {
    notebook: {
      type: String,
      default: ':Untitled Notebook'
    },
    id: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      default: 2.5
    },
    owner: {
      type: String,
      default: 'Anonymous'
    },
    accesskey: {
      type: String,
      default: ''
    },
    shared: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  data: () => {
    return {
      showMenu: false,
      showMore: false,
      newName: '',
      newSecret: ''
    }
  },
  methods: {
    onShowMenu (event) {
      this.showMenu = !this.showMenu
    },
    onShowMore (event) {
      this.showMore = !this.showMore
    },
    onShare (event) {
      var token = this.$store.getters.token
      var param = '&shared=True&'
      if (this.accesskey !== '---' && this.accesskey !== '') {
        param += 'access_key=' + this.accesskey
      }
      request.put('http://123.206.107.58:8000/notebooks/' + this.notebook + '?token=' + token + param, (err, res, body) => {
        if (err) this.$emit('on-error', err)
        var r = JSON.parse(body)
        if (r.status !== 'ok') this.$emit('on-error', r.message)
      })
      this.$emit('to-refresh', true)
    },
    onCancleShare (event) {
      var token = this.$store.getters.token
      var param = '&shared=False&'
      if (this.accesskey !== '---' && this.accesskey !== '') {
        param += 'access_key=' + this.accesskey
      }
      request.put('http://123.206.107.58:8000/notebooks/' + this.notebook + '?token=' + token + param, (err, res, body) => {
        if (err) this.$emit('on-error', err)
        var r = JSON.parse(body)
        if (r.status !== 'ok') this.$emit('on-error', r.message)
      })
      this.$emit('to-refresh', true)
    },
    onDelete (event) {
      var _this = this
      this.$Modal.confirm({
        title: '注意',
        content: '确定删除笔记本？',
        closable: true,
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          var token = _this.$store.getters.token
          var param = '&'
          if (_this.accesskey !== '---' && _this.accesskey !== '') {
            param += 'access_key=' + _this.accesskey
          }
          request.delete('http://123.206.107.58:8000/notebooks/' + _this.notebook + '?token=' + token + param, (err, res, body) => {
            if (err) _this.$emit('on-error', err)
            var r = JSON.parse(body)
            if (r.status !== 'ok') _this.$emit('on-error', r.message)
          })
          _this.$emit('to-refresh', true)
        },
        onCancel: () => {
        }
      })
    },
    onOpen (event) {
      this.$emit('open-notebook', {
        id: this.id,
        notebook: this.notebook,
        access_key: this.accesskey,
        owner: this.owner,
        rate: this.rate,
        shared: this.shared
      })
    },
    onUpload (event) {
      this.$emit('upload-to-notebook', {
        id: this.id,
        notebook: this.notebook,
        access_key: this.accesskey,
        owner: this.owner,
        rate: this.rate,
        shared: this.shared
      })
    },
    onChangeTitle (event) {
      var token = this.$store.getters.token
      var username = this.$store.getters.username
      var param = '&new_name=' + username + ':' + this.newName
      request.put('http://123.206.107.58:8000/notebooks/' + this.notebook + '?token=' + token + param, (err, res, body) => {
        if (err) this.$emit('on-error', err)
        var r = JSON.parse(body)
        if (r.status !== 'ok') this.$emit('on-error', r.message)
      })
      this.$emit('to-refresh', true)
    },
    onChangeSecret (event) {
      var token = this.$store.getters.token
      var param = '&access_key=' + this.newSecret
      request.put('http://123.206.107.58:8000/notebooks/' + this.notebook + '?token=' + token + param, (err, res, body) => {
        if (err) this.$emit('on-error', err)
        var r = JSON.parse(body)
        if (r.status !== 'ok') this.$emit('on-error', r.message)
      })
      this.$emit('to-refresh', true)
    }
  },
  computed: {
    title: {
      get () {
        if (this.notebook.search(':') >= 0) {
          var splited = this.notebook.split(':')
          if (splited.length > 1) {
            return splited[1]
          }
        }
        return this.notebook
      }
    }
  }
}
</script>

