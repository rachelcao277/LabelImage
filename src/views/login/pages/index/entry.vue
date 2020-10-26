<template>

  <!-- <div id="applogin">
    <div class="main"> -->
       <div class="login-container">
          <a-form ref="form"   laba-width="80px" class="login-form">
            <h2 class="login-title">管理系统</h2>
            <a-form-item label="用户名" prop="username">
              <a-input  ></a-input>
            </a-form-item>
            <a-form-item label="密码" prop="password">
              <a-input ></a-input>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="submitForm('form')">登录</a-button>
            </a-form-item>
          </a-form>
        </div>
    <!-- </div>
  </div> -->
</template>
<script>
import Vue from 'vue';
import 'core-js/stable';
import '@/common/styles/global.less';
import 'regenerator-runtime/runtime';
// import layout from './layout/index.vue';
// import router from './router';
// import store from './store';
// import { _get, _post } from './common/utils/request';
import request from '@/common/utils/request';
import eventLib from '@/common/utils/document-event';
window.$_EventLib = eventLib;


Vue.config.productionTip = false;
Vue.prototype.$post = request;
Vue.prototype.$get = request;

export default new Vue({
  data() {
    alert('login');
    return {
      name: 'Login',
      formModel: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名3-5位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '密码3-5位', trigger: 'blur' }
        ]
      }
    };
  },
  // moment() {
  //   alert('moment');
  //   this.$mount('#applogin');
  // },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid) 验证通过为true，有一个不通过就是false
        if (valid) {
          // 通过的逻辑
        } else {
          console.log('验证失败');
          return false;
        }
      });
    }
  }
  // router,
  // store,
  // el: '#applogin'
  // render: h => h(layout)
});
</script>
<style acoped>
.login-form {
  width: 350px;
  margin: 160px auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 30px;
  border-radius: 20px; /* 圆角 */
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("./bj6.jpg");
}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}
</style>
