<template>
  <div class="sidebar-outline-explorer">
    <CellGroup>
      <Cell v-for="item in headers" :title="item.title" :key="item.key"></Cell>
    </CellGroup>
  </div>
</template>

<script>
export default {
  name: 'SideBarOutline',
  data () {
    return {
      headers: []
    }
  },
  methods: {
    getHeaders () {
      var headerList = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      var preparedList = []
      var i = 0
      for (var header of headerList) {
        var level = parseInt(header.tagName.substring(1))
        preparedList.push({
          key: i,
          title: '···'.repeat(level - 1) + '  ' + header.innerText,
          level: level
        })
        i += 1
      }
      return preparedList
    }
  },
  mounted () {
    setInterval(() => {
      this.headers = this.getHeaders()
    }, 1000)
  }
}
</script>
