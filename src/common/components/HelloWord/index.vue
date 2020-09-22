<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a
href="https://cli.vuejs.org"
target="_blank"
rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
          target="_blank"
          rel="noopener"
          >typescript</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          >router</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
          target="_blank"
          rel="noopener"
          >vuex</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a
href="https://forum.vuejs.org"
target="_blank"
rel="noopener"
          >Forum</a
        >
      </li>
      <li>
        <a
href="https://chat.vuejs.org"
target="_blank"
rel="noopener"
          >Community Chat</a
        >
      </li>
      <li>
        <a
href="https://twitter.com/vuejs"
target="_blank"
rel="noopener"
          >Twitter</a
        >
      </li>
      <li>
        <a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a
href="https://router.vuejs.org"
target="_blank"
rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a
href="https://vue-loader.vuejs.org"
target="_blank"
rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$get('inner/demands/additionalInfo/555', { id: 555 }).then((res: any) => {
        console.log('>>>>', res);
      }, (err: any) => {
        console.log(111, err.message);
        console.log(111, err.code);
      });
    }
  }
});
// 允许使用常规的 vue.extends
// 更推荐使用下面的装饰器 ts 模板，可以学习成长
// import { Component, Prop, Vue } from "vue-property-decorator";

// @Component
// export default class HelloWorld extends Vue {
//   @Prop() private msg!: string;
//   created(){
//       this.$get('inner/demands/additionalInfo/555',{id:555}).then((res:any)=>{
//         console.log('>>>>',res)
//       },(err:any) => {
//         console.log(111, err.message)
//         console.log(111, err.code)
//       })
//   }
// }
</script>
<style scoped lang="less">
body{
  flex:1
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: @theme-primary-color;
}
</style>
