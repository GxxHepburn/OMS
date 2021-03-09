<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>营业分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="tabsValue" :before-leave="changeTabs">
          <el-tab-pane label="结算明细" name="settlementDetails">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{SDStartString}} ~ {{SDEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-input
                placeholder="请输入订单号"
                v-model="SDO_UniqSearchID"
                :clearable="true"
                style="width:300px;"></el-input>
              <el-date-picker style="margin-left:20px;"
                v-model="SDStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="SDEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchSDFormList">搜索</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tabsValue: 'settlementDetails',

      SDStartString: '',
      SDEndString: '',
      SDStartPicker: '',
      SDEndPicker: '',
      SDFormList: [],
      SDO_UniqSearchID: ''
    }
  },
  created () {
    this.initSDStartTime(new Date(), 0)
    this.initSDEndTime(new Date(), 0)
  },
  methods: {
    // 获取SDFormList数据
    async searchSDFormList () {
      if (this.SDStartPicker !== '') {
        this.initSDStartTime(this.SDStartPicker, 1)
      }
      if (this.SDEndPicker !== '') {
        this.initSDEndTime(this.SDEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchSDFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        SDStartString: this.SDStartString,
        SDEndString: this.SDEndString,
        SDO_UniqSearchID: this.SDO_UniqSearchID
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取结算明细数据失败!')
        return
      }
      this.SDFormList = res.data.SDFormList
    },
    // 初始化SDStartString
    initSDStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.SDStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.SDStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化SDEndString
    initSDEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.SDEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.SDEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 切换tabs
    changeTabs (activeName, oldActiveName) {
      // 清空所有TabItem数据

      // 初始化所有tabitem数据
    }
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
