<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#nprogress .bar {
  background: red !important;
}
.titleDiv {
  background-color: #D9EDF7;
  border-radius: 2px;
  height: 50px;
  line-height: 50px;
  color: #32718F;
  font-size: 14px;
  font-weight: bold;
  padding-left: 20px;
}
.dividerDiv {
  margin-top: 30px;
}
.el-input__inner {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
