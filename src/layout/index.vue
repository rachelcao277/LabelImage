<template>
  <div id="app">
    <Header></Header>
    <div class="main">
      <Navs></Navs>
      <div class="container" style="padding-left: 5px; padding-right: 0px;">
        <!-- <Breadcrumb></Breadcrumb> -->
        <div class="view" style="margion:0px; padding:0px;overflow:auto;">
          <transition name="router-fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Navs from './components/Navs.vue';
import Header from './components/Header.vue';
// import Breadcrumb from './components/Breadcrumb.vue';
export default {
  components: {
    Navs,
    Header,
    // Breadcrumb
  }
};
</script>
<style lang="less">
@import '~@/common/styles/common.less';
</style>
<style lang="less" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow:hidden;
  background-color: #f5f5f5;
  .main {
    flex: auto;
    height: 0;
    display: flex;
  }
  .container {
    height: 100%;
    flex: auto;
    width: 0;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    flex-direction: column;
    .view {
      flex: auto;
      background-color: #fff;
      padding: 20px;
      overflow:scroll;
    }
  }
}
/* transition/transition-group  global  router-fade*/
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.1s;
}
.router-fade-enter,
.router-fade-leave-to {
  opacity: 0;
}

</style>
