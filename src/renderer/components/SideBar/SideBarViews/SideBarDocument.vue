<template>
  <div>
    <sidebar-group-header icon="md-document" title="Details"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="Name"
       :label="title"
       @click="onCopy(title)">
      </sidebar-item>
      <sidebar-item
       title="Size"
       :label="fileSize"
       @click="onCopy(fileSize)">
      </sidebar-item>
      <sidebar-item
       title="Words"
       :label="words"
       @click="onCopy(words)">
      </sidebar-item>
      <sidebar-item
       title="Symbols"
       :label="symbols"
       @click="onCopy(symbols)">
      </sidebar-item>
      <sidebar-item
       title="Total editing time"
       :label="totalTime"
       @click="onCopy(totalTime)">
      </sidebar-item>
      <sidebar-item
       title="File path"
       :label="path"
       @click="onCopy(path)">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-hammer" title="Tools"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="Encryption"
       icon="md-lock">
        <i-switch v-model="encrypted" slot="extra" />
        <sidebar-group v-show="encrypted" slot="children">
          <sidebar-item fulltitle>
            <Select
             v-model="method"
             filterable
             slot="title">
              <Option v-for="item in enMethods" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </sidebar-item>
          <sidebar-item fulltitle>
            <Input
             v-model="password"
             placeholder="Password"
             type="password"
             slot="title"/>
          </sidebar-item>
          <sidebar-item
           :title="hasEncrypted ? 'Change Password' : 'Encrypt'"
           :icon="hasEncrypted ? 'md-key' : 'md-checkmark'"
           @click="onEncryption">
          </sidebar-item>
          <sidebar-item
           title="Clear Password"
           icon="md-unlock"
           v-show="hasEncrypted"
           @click="onClearPassword">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
      <!--
      <sidebar-item
       title="Import"
       to="/"
       icon="md-arrow-round-forward" 
       :arrow="importMenu ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onImport">
        <sidebar-group v-show="importMenu" slot="children">
          <sidebar-item
           title="Plain texts"
           icon="md-document">
          </sidebar-item>
          <sidebar-item
           title="Markdown"
           icon="logo-markdown">
          </sidebar-item>
          <sidebar-item
           title="HTML"
           icon="md-code">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
      -->
      <!--
      <sidebar-item
       title="Export"
       to="/"
       icon="md-arrow-round-back"
       :arrow="exportMenu ? 'ios-arrow-down' : 'ios-arrow-forward'"
       @click="onExport">
        <sidebar-group v-show="exportMenu" slot="children">
          <sidebar-item
           title="Plain texts"
           icon="md-document">
          </sidebar-item>
          <sidebar-item
           title="Markdown"
           icon="logo-markdown">
          </sidebar-item>
          <sidebar-item
           title="HTML"
           icon="md-code">
          </sidebar-item>
        </sidebar-group>
      </sidebar-item>
      -->
      <!--
      <sidebar-item title="Sync" icon="md-sync"></sidebar-item>
      -->
      <!--
      <sidebar-item title="Share" icon="md-share"></sidebar-item>
      -->
    </sidebar-group>
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'
import { getFilesizeInBytes } from '@/uitls/miscellaneous'

export default {
  name: 'SideBarDocument',
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  data () {
    return {
      importMenu: false,
      exportMenu: false,
      encrypted: false,
      method: '',
      enMethods: [
        {
          value: 'Default',
          label: 'Default'
        }
      ],
      words: '0',
      symbols: '0',
      password: ''
    }
  },
  methods: {
    onImport (e) {
      this.importMenu = !this.importMenu
    },
    onExport (e) {
      this.exportMenu = !this.exportMenu
    },
    onCopy (text) {
      this.$electron.clipboard.writeText(text)
    },
    onEncryption (e) {
      this.$store.commit('updatePassword', {
        password: this.password
      })
      this.$Notice.success({
        title: 'Success',
        desc: 'Password updated'
      })
    },
    onClearPassword (e) {
      this.$store.commit('updatePassword', {
        password: null
      })
      this.$Notice.success({
        title: 'Success',
        desc: 'Password cleared'
      })
      this.encrypted = false
      this.password = ''
    }
  },
  computed: {
    fileSize: {
      get () {
        return this.$store.getters.path ? getFilesizeInBytes(this.$store.getters.path) / 1000 + ' kB' : 'Unsaved file'
      }
    },
    path: {
      get () {
        var path = this.$store.getters.path
        if (path) {
          return path
        } else {
          return 'Unsaved file'
        }
      }
    },
    title: {
      get () {
        var t = this.$store.getters.title
        if (t) {
          return t
        } else {
          return 'Untitled'
        }
      }
    },
    hasEncrypted: {
      get () {
        return this.$store.getters.encrypted
      }
    },
    totalTime: {
      get () {
        var tTime = this.$store.getters.totalTime
        var hours = Math.floor(tTime / (1000 * 60 * 60))
        var minutes = Math.floor((tTime % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((tTime % (1000 * 60)) / 1000)
        return hours +
          (hours <= 1 ? ' hour ' : ' hours ') +
          minutes +
          (minutes <= 1 ? ' minute ' : ' minutes ') +
          seconds +
          (seconds <= 1 ? ' second ' : ' seconds ')
      }
    }
  },
  mounted () {
    setInterval(() => {
      var wordCounter = document.getElementById('word-counter')
      if (wordCounter) {
        this.words = wordCounter.innerHTML
      } else {
        this.words = '0 word'
      }
      var symbolCounter = document.getElementById('symbol-counter')
      if (symbolCounter) {
        this.symbols = symbolCounter.innerHTML
      } else {
        this.symbols = '0 symbol'
      }
    }, 1000)
  },
  watch: {
    encrypted (newVal) {
      if (!newVal) {
        this.onClearPassword()
      }
    },
    hasEncrypted (newVal) {
      if (newVal) {
        this.encrypted = newVal
      }
    }
  }
}
</script>
