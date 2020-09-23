<template>
  <div class="header">
    <div class="header-logo">
      <h2>Header Logo</h2>
    </div>
    <div class="right-head">
      <div class="head-user">
        <span class="username">Hello</span>
        <a-icon type="down" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Header',
});
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: #ffffff;
  display: flex;
  border-bottom: 1px solid #ededed;
  box-sizing: border-box;
  .header-logo{
    width: 200px;
    height: 48px;
    font-size: 22px;
    padding-left: 20px;
    .icon-logo {
      height: 22px;
      width: 140px;
    }
  }
  .right-head{
    flex: auto;
    width: 0;
    text-align: right;
    padding-right: 16px;
    .head-user{
      display: inline-block;
      vertical-align: top;
      margin-right: 24px;
      font-size: 14px;
      cursor: pointer;
      i{
        margin-left: 5px;
      }
    }
    .head-message{
      font-size: 24px;
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
    }
  }
}
</style>

