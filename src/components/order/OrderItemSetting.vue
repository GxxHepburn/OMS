<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/static/orders' }">订单列表</el-breadcrumb-item>
          <el-breadcrumb-item>订单操作</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-divider content-position="left">订单操作区域</el-divider>

          <el-row :gutter="20">
            <el-col :span="2">
              <el-button type="primary">打印小票</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="warning">订单支付完成</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="warning">订单未完成</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="danger">退 款</el-button>
            </el-col>
          </el-row>

          <el-divider content-position="right">订单详情</el-divider>

        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
