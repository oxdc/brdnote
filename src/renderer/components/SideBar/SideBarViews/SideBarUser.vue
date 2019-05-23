<template>
  <div>
    <sidebar-group>
      <sidebar-item
       title="Login"
       icon="md-contact"
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
           class="login-form-item"
           :class="'login-form-item-ok'">
            <Form slot="extra">
              <FormItem>
                <Input
                 placeholder="Username"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title=""
           icon="md-lock"
           class="login-form-item"
           :class="'login-form-item-ok'">
            <Form slot="extra">
              <FormItem>
                <Input
                 type="password"
                 placeholder="Password"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title=""
           icon="md-lock"
           class="login-form-item"
           :class="'login-form-item-ok'"
           v-show="task === 'Sign Up'">
            <Form slot="extra">
              <FormItem>
                <Input
                 type="password"
                 placeholder="Comfirm password"/>
              </FormItem>
            </Form>
          </sidebar-item>
          <sidebar-item
           title="Submit"
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
  </div>
</template>

<script>
import SideBarGroupHeader from '@/components/SideBar/SideBarBase/SideBarGroupHeader'
import SideBarGroup from '@/components/SideBar/SideBarBase/SideBarGroup'
import SideBarItem from '@/components/SideBar/SideBarBase/SideBarItem'

export default {
  name: 'SideBarHelp',
  data: () => {
    return {
      task: 'none'
    }
  },
  components: {
    'sidebar-group-header': SideBarGroupHeader,
    'sidebar-group': SideBarGroup,
    'sidebar-item': SideBarItem
  },
  methods: {
    onLogin (event) {
      this.task = 'Login'
    },
    onSignUp (event) {
      this.task = 'Sign Up'
    },
    onSubmit (event) {
      this.task = 'none'
    },
    onBack (event) {
      this.task = 'none'
    }
  }
}
</script>

<style>
.login-form-item .ivu-cell-footer {
  left: 50px !important;
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
</style>
