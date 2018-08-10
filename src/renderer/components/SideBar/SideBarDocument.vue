<template>
  <div>
    <Divider>Details</Divider>
    <CellGroup>
      <Cell title="Name" :label="title" @click.native="onCopy(title)"/>
      <Cell title="Size" :extra="fileSize" @click.native="onCopy(fileSize)"/>
      <Cell title="Words" :extra="words" @click.native="onCopy(words)"/>
      <Cell title="Symbols" :extra="symbols" @click.native="onCopy(symbols)"/>
      <Cell title="Total editing time" :label="totalTime" @click.native="onCopy(totalTime)"/>
      <Cell title="File path" :label="path" @click.native="onCopy(path)"/>
    </CellGroup>
    <Divider>Tools</Divider>
    <CellGroup>
      <Cell title="Encrypted">
        <i-switch v-model="encrypted" slot="extra" />
      </Cell>
      <div v-show="encrypted" class="cell-like child-cell">
        <Select v-model="method" filterable>
          <Option v-for="item in enMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div v-show="encrypted" class="cell-like child-cell">
        <Input v-model="password" placeholder="Password" type="password" />
      </div>
      <CellGroup v-show="encrypted">
        <Cell title="Encrypt" class="child-cell" @click.native="onEncryption">
          <Icon type="md-lock" slot="icon"/>
        </Cell>
      </CellGroup>
      <Cell title="Import" to="/" @click.native="onImport">
        <Icon :type="importMenu ? 'ios-arrow-down' : 'ios-arrow-forward'" slot="arrow" />
      </Cell>
      <CellGroup v-show="importMenu">
        <Cell title="Plain texts" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
        <Cell title="Markdown" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
        <Cell title="HTML" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
      </CellGroup>
      <Cell title="Export" to="/" @click.native="onExport">
        <Icon :type="exportMenu ? 'ios-arrow-down' : 'ios-arrow-forward'" slot="arrow" />
      </Cell>
      <CellGroup v-show="exportMenu">
        <Cell title="Plain texts" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
        <Cell title="Markdown" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
        <Cell title="HTML" class="child-cell">
          <Icon type="md-arrow-dropright" slot="icon"/>
        </Cell>
      </CellGroup>
    </CellGroup>
  </div>
</template>

<script>
import { getFilesizeInBytes } from '@/uitls/miscellaneous'

export default {
  name: 'SideBarDocument',
  data () {
    return {
      importMenu: false,
      exportMenu: false,
      encrypted: false,
      method: '',
      enMethods: [
        {
          value: 'AES',
          label: 'AES'
        },
        {
          value: 'RSA',
          label: 'RSA'
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
  }
}
</script>

<style scoped>
.cell-like {
  padding: 7px 16px;
}

.child-cell {
  background: rgb(237, 237, 237);
  cursor: pointer;
}

.child-cell:hover {
  background: rgb(243, 243, 243);
}
</style>
