// 公共 store 参数存放
import Vue from 'vue';
import Vuex from 'vuex';
import common from './common';// 公共store

Vue.use(Vuex);

const pageList: any = process.env.PAGE_LIST;
const storeMap: {[p: string]: any} = {};
if (pageList && pageList.length) {
  pageList.forEach((page: any) => {
    const relativePath = page.relativePath.split('/pages/');
    const currentStoreConfig = require(`../views/${relativePath[0]}/store/index.ts`).default;
    storeMap[relativePath[0]] = currentStoreConfig;
  });
}

export default new Vuex.Store({
  modules: {
    common,
    ...storeMap
  }
});
