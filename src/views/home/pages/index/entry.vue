<template>
  <div class="home">
    <img class="logo" alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <a-button type="primary">Test Button</a-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/common/components/HelloWord/index.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    HelloWorld
  }
});
</script>

<style lang="less" scoped>
.logo {
  width: 50%;
}
</style>

