<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>订单分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="tabsValue">
          <el-tab-pane label="订单数(时)" name="ordersPHour">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{today}} 00:00:00 ~ {{today}} 23:59:59</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                  v-model="todayPicker"
                  type="date"
                  :editable="false"
                  :clearable="false"
                  placeholder="选择日期"
                  @change="initToday(todayPicker)">
                </el-date-picker>
                <el-button style="margin-left:30px;" type="primary">搜索</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="订单数(日)" name="ordersPDay">
          </el-tab-pane>
          <el-tab-pane label="订单数(月)" name="ordersPMonth">
          </el-tab-pane>
          <el-tab-pane label="退款订单" name="refundOrders">
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tabsValue: 'ordersPHour',
      today: '',
      todayPicker: ''

    }
  },
  created () {
    this.initToday(new Date())
  },
  methods: {
    initToday (todayDate) {
      var day = todayDate.getDate() <= 9 ? '0' + todayDate.getDate() : todayDate.getDate()
      var month = todayDate.getMonth() <= 9 ? '0' + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1
      var year = todayDate.getFullYear()
      this.today = year + '-' + month + '-' + day
    }
  }
}
</script>

<style lang="less" scoped>
.statistics_time {
  font-weight: lighter;
  font-size: 13px;
}
</style>
