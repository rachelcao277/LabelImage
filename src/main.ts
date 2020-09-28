import Vue from 'vue';
import 'core-js/stable';
import '@/common/styles/global.less';
import 'regenerator-runtime/runtime';
import layout from './layout/index.vue';
import router from './router';
import store from './store';
// import { _get, _post } from './common/utils/request';
import request from '@/common/utils/request';
import eventLib from '@/common/utils/document-event';
window.$_EventLib = eventLib;
Vue.config.productionTip = false;

Vue.prototype.$post = request;
Vue.prototype.$get = request;

new Vue({
  router,
  store,
  render: h => h(layout)
}).$mount('#app');
