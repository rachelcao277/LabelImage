<template>
  <div class="nav">
    <a-menu
      :defaultSelectedKeys="[`${activeRoutePath}`]"
      :defaultOpenKeys="[`${activeRoutePath}`]"
      :selectedKeys="[`${activeRoutePath}`]"
      mode="inline"
      theme="dark"
      :inline-collapsed="false"
      @click="handleClick"
    >
      <a-menu-item key="/">
        <a-icon type="pie-chart" />
        <span>首页</span>
      </a-menu-item>

      <a-sub-menu key="dataset">
        <span slot="title">
          <a-icon type="mail" /><span>数据集管理</span>
        </span>
        <a-menu-item key="/dataset">
          数据集管理
        </a-menu-item>
        <!-- <a-menu-item key="/dataset/test">
          数据集管理test
        </a-menu-item> -->
        <a-menu-item key="/dataset/autograb">
          自动抓取管理
        </a-menu-item>
      </a-sub-menu>

       <a-sub-menu key="label">
        <span slot="title">
          <a-icon type="mail" /><span>标注管理</span>
        </span>
        <a-menu-item key="/dolabel/index">
          标注数据集
        </a-menu-item>

        <!-- <a-menu-item key="/dolabel/Index">
          标注数据集真
        </a-menu-item> -->

      </a-sub-menu>

       <a-sub-menu key="train">
        <span slot="title">
          <a-icon type="mail" /><span>训练管理</span>
        </span>
        <a-menu-item key="/trainAI">
          训练AI
        </a-menu-item>

        <a-menu-item key="/testAI">
          测试AI
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="about">
        <span slot="title">
          <a-icon type="mail" /><span>关于我们</span>
        </span>
        <a-menu-item key="/about">
          关于我们
        </a-menu-item>
        <a-menu-item key="/about/test">
          关于测试
        </a-menu-item>
      </a-sub-menu>


      <!-- <a-menu-item key="3">
        <a-icon type="inbox" />
        <span>Option 3</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="mail" />
          <span>Navigation One</span>
        </span>
        <a-menu-item key="5">
          Option 5
        </a-menu-item>
        <a-menu-item key="6">
          Option 6
        </a-menu-item>
      </a-sub-menu> -->
    </a-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data(): {[key: string]: any} {
    return {
      activeRoutePath: '',
    };
  },
  watch: {
    $route(to) {
      console.log(to.path);
      this.activeRoutePath = to.path.split('-')[0];
    }
  },
  methods: {
    handleClick(e: any): void {
      this.$router.push(e.key);
    }
  }
});
</script>

<style lang="less" scoped>
.nav {
  width: 240px;
  height: 100%;
  .ant-menu {
    height: 100%;
  }
}
</style>
