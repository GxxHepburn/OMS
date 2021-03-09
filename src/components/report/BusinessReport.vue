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
            <el-table :data='SDFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="订单" prop="ouid" width="200"></el-table-column>
              <el-table-column label="桌台类型" prop="ttname"></el-table-column>
              <el-table-column label="桌台" prop="tname"></el-table-column>
              <el-table-column label="下单时间" prop="orderingTime" width="140"></el-table-column>
              <el-table-column label="支付时间" prop="payTime" width="140"></el-table-column>
              <el-table-column label="持续时间" prop="continuedTime" width="150"></el-table-column>
              <el-table-column label="支付方式" prop="payMethod"></el-table-column>
              <el-table-column label="支付金额" prop="payPrice">
                <template slot-scope="scope">
                  {{scope.row.payPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="人数" prop="numberOfDiners"></el-table-column>
              <el-table-column label="人均" prop="averageNumberOfDiners">
                <template slot-scope="scope">
                  {{scope.row.averageNumberOfDiners.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="营收统计" name="revenueStatistics">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{RS2StartString}} ~ {{RS2EndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="RS2StartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="RS2EndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchRS2FormList">搜索</el-button>
            </div>
            <el-table :data='RS2FormList'
              :border='true'
              :stripe="true">
              <el-table-column label="营业金额" prop="totalPrice">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="实收金额" prop="getPrice">
                <template slot-scope="scope">
                  {{scope.row.getPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="退款金额" prop="refundPrice">
                <template slot-scope="scope">
                  {{scope.row.refundPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="用户数" prop="userNum"></el-table-column>
              <el-table-column label="消费人数" prop="numberOfDiners"></el-table-column>
              <el-table-column label="订单数" prop="orderingCount"></el-table-column>
              <el-table-column label="单均" prop="averagePOrderingCount">
                <template slot-scope="scope">
                  {{scope.row.averagePOrderingCount.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="人均" prop="averagePNumberOfDiners">
                <template slot-scope="scope">
                  {{scope.row.averagePNumberOfDiners.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
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
      SDO_UniqSearchID: '',

      RS2StartString: '',
      RS2EndString: '',
      RS2StartPicker: '',
      RS2EndPicker: '',
      RS2FormList: []
    }
  },
  created () {
    this.initSDStartTime(new Date(), 0)
    this.initSDEndTime(new Date(), 0)
  },
  methods: {
    // 获取RS2FormList数据
    async searchRS2FormList () {
      if (this.RS2StartPicker !== '') {
        this.initRS2StartTime(this.RS2StartPicker, 1)
      }
      if (this.RS2EndPicker !== '') {
        this.initRS2EndTime(this.RS2EndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchRS2FormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        RS2StartString: this.RS2StartString,
        RS2EndString: this.RS2EndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取营收统计数据失败!')
        return
      }
      this.RS2FormList = res.data.RS2FormList
    },
    // 初始化RS2StartString
    initRS2StartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.RS2StartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.RS2StartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化RS2EndString
    initRS2EndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.RS2EndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.RS2EndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
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
      // 清空SD
      this.SDStartString = ''
      this.SDEndString = ''
      this.SDStartPicker = ''
      this.SDEndPicker = ''
      this.SDFormList = []
      this.SDO_UniqSearchID = ''

      // 清空RS
      this.RS2StartString = ''
      this.RS2EndString = ''
      this.RS2StartPicker = ''
      this.RS2EndPicker = ''
      this.RS2FormList = []

      // 初始化所有tabitem数据
      // 初始化SD
      this.initSDStartTime(new Date(), 0)
      this.initSDEndTime(new Date(), 0)

      // 初始化RS
      this.initRS2StartTime(new Date(), 0)
      this.initRS2EndTime(new Date(), 0)
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
