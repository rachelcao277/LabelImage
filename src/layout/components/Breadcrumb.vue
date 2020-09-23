<template>
  <div class="breadcrumb">
    <a-breadcrumb separator=">" v-if="breadList.length > 1">
      <span>您的位置：</span>
      <a-breadcrumb-item v-for="bread in breadList" :href="bread.path" :key="bread.path">{{ bread.title }}</a-breadcrumb-item>
    </a-breadcrumb>
    <h3 v-else>{{ breadList.length > 0 ? breadList[0].title : "" }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data(): {[key: string]: any} {
    return {
      breadList: []
    };
  },
  watch: {
    // 监听route路由变化，改变相应的面包屑及标题
    $route(to) {
      this.breadList = this.breadcrumbConvert(to.path, to.meta);
    }
  },
  created() {
    this.breadList = this.breadcrumbConvert(this.$route.path, this.$route.meta);
  },
  mounted() {

  },
  methods: {
    breadcrumbConvert(path: string, meta: any) {
      const $router: any = this.$router;
      const breadList: Array<any> = [{ path, title: meta.title }];
      if (meta.parentPath) {
        breadList.unshift({ path: meta.parentPath, title: $router.options.routes.find((x: any) => x.path === meta.parentPath).meta.title });
      }
      return breadList;
    }
  }
});
</script>

<style lang="less" scoped>
.breadcrumb {
  width: 100%;
  height: 50px;
  font-size: 14px;
  text-align: left;
  h3 {
    margin: 0;
    font-size: 20px;
    line-height: 50px;
  }
  span {
    float: left;
  }
  .ant-breadcrumb {
    line-height: 50px;
  }
}

</style>

