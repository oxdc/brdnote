<template>
  <div>
    <Divider>Details</Divider>
    <CellGroup>
      <Cell title="Name" label="Untitled" />
      <Cell title="Size" extra="17kb" />
      <Cell title="Words" extra="1120" />
      <Cell title="Symbols" extra="4529" />
      <Cell title="Total editing time" label="3 hours 34 minutes 34 seconds" />
      <Cell title="File path" label="/root" />
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
        <Input placeholder="Password" type="password">
          <Button slot="append" icon="md-lock"></Button>
        </Input>
      </div>
      <Cell to="/">
        <div @click="onImport">Import</div>
        <Icon :type="importMenu ? 'ios-arrow-down' : 'ios-arrow-forward'" slot="arrow" @click="onImport"/>
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
      <Cell to="/">
        <div @click="onExport">Export</div>
        <Icon :type="exportMenu ? 'ios-arrow-down' : 'ios-arrow-forward'" slot="arrow" @click="onExport"/>
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
      ]
    }
  },
  methods: {
    onImport (e) {
      this.importMenu = !this.importMenu
    },
    onExport (e) {
      this.exportMenu = !this.exportMenu
    }
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
