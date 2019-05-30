<template>
  <div>
    <sidebar-group-header icon="md-document" title="详情"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="文档名称"
       :label="title"
       @click="onCopy(title)">
      </sidebar-item>
      <sidebar-item
       title="文档大小"
       :label="fileSize"
       @click="onCopy(fileSize)">
      </sidebar-item>
      <sidebar-item
       title="词数"
       :label="words"
       @click="onCopy(words)">
      </sidebar-item>
      <sidebar-item
       title="字符数"
       :label="symbols"
       @click="onCopy(symbols)">
      </sidebar-item>
      <sidebar-item
       title="编辑时长统计"
       :label="totalTime"
       @click="onCopy(totalTime)">
      </sidebar-item>
      <sidebar-item
       title="文件路径"
       :label="path"
       @click="onCopy(path)">
      </sidebar-item>
    </sidebar-group>
    <sidebar-group-header icon="md-hammer" title="工具"></sidebar-group-header>
    <sidebar-group>
      <sidebar-item
       title="加密"
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
             placeholder="密码"
             type="password"
             slot="title"/>
          </sidebar-item>
          <sidebar-item
           :title="hasEncrypted ? '更改密码' : '加密'"
           :icon="hasEncrypted ? 'md-key' : 'md-checkmark'"
           @click="onEncryption">
          </sidebar-item>
          <sidebar-item
           title="清除密码"
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
        title: '成功',
        desc: '密码更改成功'
      })
    },
    onClearPassword (e) {
      this.$store.commit('updatePassword', {
        password: null
      })
      this.$Notice.success({
        title: '成功',
        desc: '密码清除成功'
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
          return '文件未保存'
        }
      }
    },
    title: {
      get () {
        var t = this.$store.getters.title
        if (t) {
          return t
        } else {
          return '未命名'
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
          (hours <= 1 ? ' 时 ' : ' 时 ') +
          minutes +
          (minutes <= 1 ? ' 分 ' : ' 分 ') +
          seconds +
          (seconds <= 1 ? ' 秒 ' : ' 秒 ')
      }
    }
  },
  mounted () {
    setInterval(() => {
      var wordCounter = document.getElementById('word-counter')
      if (wordCounter) {
        this.words = wordCounter.innerHTML
      } else {
        this.words = '0 词'
      }
      var symbolCounter = document.getElementById('symbol-counter')
      if (symbolCounter) {
        this.symbols = symbolCounter.innerHTML
      } else {
        this.symbols = '0 字符'
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
