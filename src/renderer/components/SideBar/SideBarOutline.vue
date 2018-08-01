<template>
  <div class="sidebar-outline-explorer">
    <Tree :data="headers"></Tree>
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
      var i = null
      for (i in headerList) {
        preparedList.push({
          title: headerList[i].innerText,
          level: parseInt(headerList[i].tagName.substring(1))
        })
      }
      var resultList = []
      for (i in preparedList) {
        var start = null
        var stop = null
        if (i > 0) {
          start = preparedList[i - 1].level + 1
          stop = preparedList[i].level
        } else {
          start = 1
          stop = preparedList[i].level
        }
        for (var k = start; k < stop; k++) {
          resultList.push({
            title: '',
            level: k,
            expand: true,
            children: []
          })
        }
        resultList.push({
          title: preparedList[i].title,
          level: preparedList[i].level,
          expand: true,
          children: []
        })
      }
      var lastRoot = {
        '1': null,
        '2': null,
        '3': null,
        '4': null,
        '5': null,
        '6': null
      }
      for (i in resultList) {
        lastRoot[resultList[i].level] = i
        if (resultList[i].level > 1) {
          resultList[lastRoot[resultList[i].level - 1]].children.push(resultList[i])
        }
      }
      var tree = []
      for (i in resultList) {
        if (resultList[i].level === 1) {
          tree.push(resultList[i])
        }
      }
      return tree
    }
  },
  mounted () {
    setInterval(() => {
      this.headers = this.getHeaders()
    }, 5000)
  }
}
</script>

<style>
.sidebar-outline-explorer .ivu-tree-title {
  font-size: 14px !important;
}

.sidebar-outline-explorer .ivu-tree ul li {
  margin: 0px;
}

.sidebar-outline-explorer .ivu-card-body {
  overflow: scroll
}
</style>
