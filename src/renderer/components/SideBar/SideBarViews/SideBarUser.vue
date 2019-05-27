<template>
  <div>
    <Alert banner show-icon type="error" v-show="error">{{ error }}</Alert>
    <sidebar-group v-show="!isLoggedIn">
      <sidebar-item
       title="Login"
       icon="md-log-in"
       v-show="task === 'none'"
       @click="onLogin"
       to="/">
      </sidebar-item>
      <sidebar-item
       title="Sign Up"
       icon="md-person-add"
       v-show="task === 'none'"
       @click="onSignUp"
       to="/">
      </sidebar-item>
      <sidebar-item
       :title="task"
       v-show="task !== 'none'"
       to="/"
       arrow="ios-arrow-down">
        <sidebar-group slot="children">
          <sidebar-item
           title=""
           icon="md-person"
           class="login-form-item login-form-item-ok">
            <Form slot="extra">
              <FormItem :error="isUsernameError ? ' ' : ''">
                <Input
                 placeholder="Username" v-model="username"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <!-- <sidebar-item
           title=""
           icon="md-lock"
           class="login-form-item"
           :class="'login-form-item-ok'"
           v-show="task === 'change password'">
            <Form slot="extra">
              <FormItem>
                <Input
                 type="password"
                 placeholder="Current Password"/>
              </FormItem>
            </Form>
          </sidebar-item> -->
          <sidebar-item
           title=""
           icon="md-lock"
           class="login-form-item login-form-item-ok">
            <Form slot="extra">
              <FormItem :error="isPasswordError ? ' ' : ''">
                <Input
                 type="password"
                 placeholder="Password"
                 v-model="password"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title=""
           icon="md-lock"
           class="login-form-item login-form-item-ok"
           v-show="task === 'Sign Up'">
            <Form slot="extra">
              <FormItem :error="isPasswordAgainError ? ' ' : ''">
                <Input
                 type="password"
                 placeholder="Comfirm password"
                 v-model="passwordAgain"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title="Submit"
           icon="md-checkmark"
           @click="onSubmit"
           primary
           to="/">
          </sidebar-item>
          <sidebar-item
           title="Back"
           @click="onBack"
           to="/">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
    </sidebar-group>
    <sidebar-group v-show="isLoggedIn">
      <sidebar-item fulltitle>
        <div slot="title">
          <Avatar style="background-color: #87d068" icon="ios-person" size="large"/>
          <span class="user">{{ username }}</span>
        </div>
      </sidebar-item>
      <sidebar-item
       title="Logout"
       icon="md-log-out"
       to="/"
       @click="onLogout">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-bookmarks" title="My Notebooks" v-show="isLoggedIn"></sidebar-group-header>
    <sidebar-group v-show="isLoggedIn">
      <sidebar-item
       icon="md-refresh"
       title="Refresh List"
       @click="onRefreshMyNotebookList">
      </sidebar-item>
      <sidebar-item
       icon="md-add"
       title="New Notebook"
       @click="onNewNotebook">
        <sidebar-group v-show="isAddingNewNotebook" slot="children">
          <sidebar-item
           title="Title"
           icon="md-bookmarks"
           class="editor-item">
            <Input slot="extra" v-model="newNotebook.title" placeholder="Untitled"/>
          </sidebar-item>
          <sidebar-item
           title="Secret"
           icon="md-key"
           class="editor-item">
            <Input
             type="password"
             slot="extra"
             v-model="newNotebook.accessKey"
             placeholder="Access with secret."/>
          </sidebar-item>
          <sidebar-item
           title="Share This Notebook"
           icon="md-share">
            <i-switch slot="extra" v-model="newNotebook.sharing"/>
          </sidebar-item>
          <sidebar-item
           title="Comfirm"
           icon="md-checkmark"
           primary
           to="/"
           @click="onComfirm"
          ></sidebar-item>
          <sidebar-item
           title="Cancel"
           icon="md-close"
           @click="onCancle"
          ></sidebar-item>
        </sidebar-group>
      </sidebar-item>
      <sidebar-item fulltitle>
        <Input search slot="title" placeholder="type your keyword ..." v-model="searchMyNotebook"/>
      </sidebar-item>
      <sidebar-notebook
       v-for="notebook in myNotebooksFiltered"
       :notebook="notebook.notebook"
       :owner="notebook.owner"
       :rate="notebook.rate"
       :shared="notebook.shared"
       :accesskey="notebook.access_key"
       :id="notebook.id.toString()"
       :key="notebook.id"
       @on-error="onError"
       @to-refresh="onRefreshMyNotebookList"
       @open-notebook="onOpenNotebook"
       @upload-to-notebook="onUpload">
      </sidebar-notebook>
    </sidebar-group>
    <sidebar-group-header icon="md-bookmarks" title="Shared Notebooks" v-show="isLoggedIn"></sidebar-group-header>
    <sidebar-group v-show="isLoggedIn">
      <sidebar-item
       icon="md-refresh"
       title="Refresh List"
       @click="onRefreshSharedNotebookList">
      </sidebar-item>
      <sidebar-item fulltitle>
        <Input search slot="title" placeholder="type your keyword ..." v-model="searchSharedNotebook"/>
      </sidebar-item>
      <sidebar-notebook
       v-for="notebook in sharedNotebooksFiltered"
       :notebook="notebook.notebook"
       :owner="notebook.owner"
       :rate="notebook.rate"
       :shared="true"
       :accesskey="'---'"
       :id="notebook.id.toString()"
       :key="notebook.id"
       @on-error="onError"
       @to-refresh="onRefreshSharedNotebookList"
       @open-notebook="onOpenNotebook"
       @upload-to-notebook="onUpload">
      </sidebar-notebook>
    </sidebar-group>
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'
import SideBarNotebook from '@/components/SideBar/SideBarBase/SideBarNotebook'
import request from 'request'
import crypto from 'crypto'
import {
  encryptContent,
  utoa
} from '@/uitls/miscellaneous'

export default {
  name: 'SideBarHelp',
  data: () => {
    return {
      task: 'none',
      username: '',
      password: '',
      passwordAgain: '',
      isPasswordError: false,
      isUsernameError: false,
      error: null,
      myNotebooks: [],
      sharedNotebooks: [],
      isAddingNewNotebook: false,
      newNotebook: {
        title: '',
        accessKey: '',
        sharing: false
      },
      searchMyNotebook: '',
      searchSharedNotebook: ''
    }
  },
  computed: {
    isPasswordAgainError: {
      get () {
        return (this.task === 'Sign Up' && this.password !== this.passwordAgain) ||
          this.password === '' || this.passwordAgain === ''
      }
    },
    isLoggedIn: {
      get () {
        return this.$store.getters.isLoggedIn
      }
    },
    myNotebooksFiltered: {
      get () {
        return this.myNotebooks.filter(
          notebook => {
            return notebook.notebook.search(this.searchMyNotebook) >= 0 ||
              notebook.owner.search(this.searchMyNotebook) >= 0
          }
        )
      }
    },
    sharedNotebooksFiltered: {
      get () {
        return this.sharedNotebooks.filter(
          notebook => {
            return notebook.notebook.search(this.searchSharedNotebook) >= 0 ||
              notebook.owner.search(this.searchSharedNotebook) >= 0
          }
        )
      }
    }
  },
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem,
    'sidebar-notebook': SideBarNotebook
  },
  methods: {
    onLogin (event) {
      this.task = 'Login'
    },
    onSignUp (event) {
      this.task = 'Sign Up'
    },
    onSubmit (event) {
      this.isPasswordError = this.password === ''
      this.isUsernameError = this.username === ''
      const hash = crypto.createHmac('sha512', this.password).update(this.password).digest('hex')
      if (this.task === 'Login') {
        request.post('http://123.206.107.58:8000/users/login/' + this.username + ':' + hash, (err, res, body) => {
          if (err) {
            this.onError(err)
            return
          }
          var r = JSON.parse(body)
          if (r.status === 'ok') {
            this.$store.commit('updateToken', { token: r.token })
            this.$store.commit('updateUsername', { username: this.username })
            this.isPasswordError = this.isUsernameError = false
            this.task = 'none'
            this.error = null
            this.onRefreshMyNotebookList()
          } else {
            this.isPasswordError = this.isUsernameError = true
            this.$Notice.error({
              title: 'Failed to login',
              desc: r.message
            })
            this.error = r.message
          }
        })
      } else if (this.task === 'Sign Up') {
        request.post('http://123.206.107.58:8000/users/signup/' + this.username + ':' + hash, (err, res, body) => {
          if (err) {
            this.onError(err)
            return
          }
          var r = JSON.parse(body)
          if (r.status === 'ok') {
            this.isPasswordError = this.isUsernameError = false
            this.$Notice.success({
              title: 'Welcome! ' + this.username,
              desc: 'You have just signed up. Please login.'
            })
            this.task = 'Login'
            this.error = null
          } else {
            this.isPasswordError = this.isUsernameError = true
            this.$Notice.error({
              title: 'Failed to signup',
              desc: r.message
            })
            this.error = r.message
          }
        })
      }
    },
    onBack (event) {
      this.task = 'none'
    },
    onLogout (event) {
      var token = this.$store.getters.token
      request.post('http://123.206.107.58:8000/users/logout?token=' + token, (err, res, body) => {
        if (err) {
          this.onError(err)
          return
        }
        var r = JSON.parse(body)
        if (r.status === 'ok') {
          this.error = null
          this.password = this.username = ''
          this.$store.commit('updateUsername', { username: '' })
          this.$store.commit('updateToken', { token: null })
        }
      })
    },
    onRefreshMyNotebookList (event) {
      var token = this.$store.getters.token
      request.get('http://123.206.107.58:8000/notebooks?token=' + token, (err, res, body) => {
        if (err) {
          this.onError(err)
          return
        }
        var r = JSON.parse(body)
        if (r.status === 'ok') {
          this.$set(this, 'myNotebooks', r.records)
          this.error = null
        } else {
          this.$Notice.error({
            title: 'Error happened while refreshing notebook list',
            desc: r.message
          })
          this.error = r.message
        }
      })
    },
    onNewNotebook (event) {
      this.isAddingNewNotebook = true
    },
    onComfirm (event) {
      var token = this.$store.getters.token
      var title = this.newNotebook.title ? this.newNotebook.title : 'Untitled'
      var notebook = this.username + ':' + title
      var params = '&'
      if (this.newNotebook.sharing) {
        params += 'shared=True&'
      } else {
        params += 'shared=False&'
      }
      if (this.newNotebook.accessKey) {
        params += 'access_key=' + this.newNotebook.accessKey
      }
      request.post('http://123.206.107.58:8000/notebooks/' + notebook + '?token=' + token + params, (err, res, body) => {
        if (err) {
          this.onError(err)
          return
        }
        var r = JSON.parse(body)
        if (r.status === 'ok') {
          this.newNotebook.title = ''
          this.newNotebook.accessKey = ''
          this.newNotebook.sharing = false
          this.isAddingNewNotebook = false
          this.onRefreshMyNotebookList()
        } else {
          this.$Notice.error({
            title: 'Error happened while refreshing notebook list',
            desc: r.message
          })
          this.error = r.message
        }
      })
    },
    onCancle (event) {
      this.isAddingNewNotebook = false
    },
    onRefreshSharedNotebookList (event) {
      var token = this.$store.getters.token
      request.get('http://123.206.107.58:8000/notebooks/shared?token=' + token, (err, res, body) => {
        if (err) {
          this.onError(err)
          return
        }
        var r = JSON.parse(body)
        if (r.status === 'ok') {
          this.$set(this, 'sharedNotebooks', r.records)
          this.error = null
        } else {
          this.$Notice.error({
            title: 'Error happened while refreshing shared notebook list',
            desc: r.message
          })
          this.error = r.message
        }
      })
    },
    onError (err) {
      this.$Notice.error({
        title: 'Error',
        desc: err.toString()
      })
      this.error = err.toString()
    },
    onOpenNotebook (params) {
      this.$emit('open-web', params)
    },
    onUpload (params) {
      var token = this.$store.getters.token
      var _this = this
      var content = null
      if (window.editor) {
        content = JSON.stringify(window.editor.getContents())
      }

      var data = {
        docId: this.$store.getters.docId,
        title: this.$store.getters.title,
        tags: this.$store.getters.tags,
        totalTime: this.$store.getters.totalTime,
        content: content
      }

      var password = this.$store.getters.password

      var fileContent = password
        ? 'ENCRYPTED' + utoa(JSON.stringify(encryptContent(JSON.stringify(data), password)))
        : JSON.stringify(data)

      request.post('http://123.206.107.58:8000/upload/' + data.docId + '?token=' + token + '&content=' + fileContent, (err, res, body) => {
        if (err) {
          _this.onError(err)
          return
        }
        var r = JSON.parse(body)
        if (r.status !== 'ok') {
          _this.onError(r.message)
        } else {
          var param = '&'
          if (params.access_key !== '---' && params.access_key !== '') {
            param += 'access_key=' + params.access_key
          }
          console.log('http://123.206.107.58:8000/notebooks/' + params.notebook + '/' + data.docId + '?token=' + token + param)
          request.post('http://123.206.107.58:8000/notebooks/' + params.notebook + '/' + data.docId + '?token=' + token + param, (err, res, body) => {
            if (err) {
              _this.onError(err)
              return
            }
            var r = JSON.parse(body)
            if (r.status === 'ok') {
              this.$Notice.success({
                title: 'Uploaded!',
                desc: 'Your note has already been uploaded.'
              })
              this.error = null
            } else {
              this.$Notice.error({
                title: 'Error happened while uploading',
                desc: r.message
              })
              this.error = r.message
            }
          })
        }
      })
    }
  },
  mounted (event) {
    request.get('http://123.206.107.58:8000/', (err, res, body) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(JSON.parse(body).version)
    })
  }
}
</script>

<style>
.login-form-item .ivu-cell-footer {
  left: 50px !important;
}

.editor-item .ivu-cell-footer {
  left: 100px !important;
}

.login-form-item .ivu-cell-item {
  min-height: 24px !important;
  line-height: 24px !important;
}

.login-form-item-error .ivu-cell {
  height: 62px !important;
}

.login-form-item-ok .ivu-form-item {
  margin-bottom: 0 !important;
}

.login-form-item-error .ivu-cell {
  height: 62px !important;
}
</style>

<style scoped>
.user {
  margin: 0 10px;
}
</style>
