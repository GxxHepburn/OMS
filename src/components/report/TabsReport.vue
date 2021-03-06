<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>桌台分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="tabsValue" :before-leave="changeTabs">
          <el-tab-pane label="台号用量" name="consumptionOfStationNumber">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{COSNStartString}} ~ {{COSNEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="COSNStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;margin-right:20px;"
                v-model="COSNEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchCOSNFormList">搜索</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tabsValue: 'consumptionOfStationNumber',

      COSNStartString: '',
      COSNEndString: '',
      COSNStartPicker: '',
      COSNEndPicker: '',
      COSNFormList: []
    }
  },
  created () {
    this.initCOSNStartTime(new Date(), 0)
    this.initCOSNEndTime(new Date(), 0)
  },
  methods: {
    // 查询COSN数据
    async searchCOSNFormList () {
      if (this.COSNStartPicker !== '') {
        this.initCOSNStartTime(this.COSNStartPicker, 1)
      }
      if (this.COSNEndPicker !== '') {
        this.initCOSNEndTime(this.COSNEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchCOSNFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        COSNStartString: this.COSNStartString,
        COSNEndString: this.COSNEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取台号用量数据失败!')
        return
      }
      this.COSNFormList = res.data.COSNFormList
    },
    // 初始化COSNStartString
    initCOSNStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.COSNStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.COSNStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    initCOSNEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.COSNEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.COSNEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 切换tab
    changeTabs () {}
  }
}
</script>

<style lang="less" scoped>
.statistics_time {
  font-weight: lighter;
  font-size: 13px;
}
/deep/ th {
  text-align: center;
  background-color: #FFEEFF;
  border-color: #CCCCCC;
}
/deep/ .el-table__footer {
  td {
    background-color: #FCF8E3;
    border-color: #CCCCCC;
  }
}
</style>
