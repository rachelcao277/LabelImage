<template>
  <div id="app">
    <Navs></Navs>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getCustomerList } from '@/api/examples.ts';
import Navs from './components/Navs.vue';
export default Vue.extend({
  components: {
    Navs
  },
  async created() {
    const res = await getCustomerList({}, true);
    console.log(res.result.data);
  }
});
</script>
<style lang="less">
@import '~@/common/styles/base.less';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
