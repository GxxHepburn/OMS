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
            <el-table :data='COSNFormList'
              :border='true'
              :stripe="true"
              :show-summary="true"
              :summary-method="getCOSNSummaries">
              <el-table-column label="桌台分类" prop="ttname"></el-table-column>
              <el-table-column label="桌台名称" prop="tname"></el-table-column>
              <el-table-column label="订单数" prop="orderNum"></el-table-column>
              <el-table-column label="消费人数" prop="numberOfDiners"></el-table-column>
              <el-table-column label="订单总价" prop="totalOrderPrice">
                <template slot-scope="scope">
                  {{scope.row.totalOrderPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="单均消费" prop="totalPricePOrder">
                <template slot-scope="scope">
                  {{scope.row.totalPricePOrder.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="人均消费" prop="totalPricePPerson">
                <template slot-scope="scope">
                  {{scope.row.totalPricePPerson.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="翻台率" name="turnoverRate">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{TRDayString}} 00:00:00 ~ {{TRDayString}} 23:59:59</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="TRDayPicker"
                type="date"
                :editable="false"
                :clearable="false"
                placeholder="选择日期">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchTRFormList">搜索</el-button>
            </div>
            <el-table :data='TRFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="桌台数" prop="tabnum"></el-table-column>
              <el-table-column label="餐位数" prop="tabPersonNum"></el-table-column>
              <el-table-column label="交易数" prop="tradeNum"></el-table-column>
              <el-table-column label="开台数" prop="openingNum"></el-table-column>
              <el-table-column label="客人数" prop="numberOfDiners"></el-table-column>
              <el-table-column label="上座率" prop="attendance">
                <template slot-scope="scope">
                  {{(scope.row.attendance*100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
              <el-table-column label="开台率" prop="openingRate">
                <template slot-scope="scope">
                  {{(scope.row.openingRate*100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
              <el-table-column label="翻台率" prop="turnoverRate">
                <template slot-scope="scope">
                  {{(scope.row.turnoverRate*100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="翻台率(周平均)" name="turnoverRateWeek">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{TRWStartString}} ~ {{TRWEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="TRWTimePicker"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchTRWFormList">搜索</el-button>
            </div>
            <el-table :data='TRWFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="桌台数" prop="tabnum"></el-table-column>
              <el-table-column label="餐位数" prop="tabPersonNum"></el-table-column>
              <el-table-column label="交易数" prop="tradeNum"></el-table-column>
              <el-table-column label="开台数" prop="openingNum"></el-table-column>
              <el-table-column label="客人数" prop="numberOfDiners"></el-table-column>
              <el-table-column label="上座率" prop="attendance">
                <template slot-scope="scope">
                  {{(scope.row.attendance*100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
              <el-table-column label="开台率" prop="openingRate">
                <template slot-scope="scope">
                  {{(scope.row.openingRate*100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
              <el-table-column label="翻台率" prop="turnoverRate">
                <template slot-scope="scope">
                  {{(scope.row.turnoverRate*100).toFixed(2) + '%'}}
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
      tabsValue: 'consumptionOfStationNumber',

      COSNStartString: '',
      COSNEndString: '',
      COSNStartPicker: '',
      COSNEndPicker: '',
      COSNFormList: [],

      TRDayString: '',
      TRDayPicker: '',
      TRFormList: [],

      TRWTimePicker: '',
      TRWStartString: '',
      TRWEndString: '',
      TRWFormList: []
    }
  },
  created () {
    this.initCOSNStartTime(new Date(), 0)
    this.initCOSNEndTime(new Date(), 0)
  },
  methods: {
    // 获取TRWFormList数据
    async searchTRWFormList () {
      if (this.TRWTimePicker !== '') {
        this.initTRWStartStringAndTRWEndString(this.TRWTimePicker)
      }
      const { data: res } = await this.$http.post('searchTRWFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        TRWStartString: this.TRWStartString,
        TRWEndString: this.TRWEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取翻台率(周平均)数据失败!')
        return
      }
      this.TRWFormList = res.data.TRWFormList
    },
    // 初始化TRWStartString 和 TRWEndString
    initTRWStartStringAndTRWEndString (date) {
      var firstDate = new Date(date.setDate(date.getDate() - date.getDay()))
      var lastDate = new Date(date.setDate(date.getDate() - date.getDay() + 6))

      var firstDay = firstDate.getDate() <= 9 ? '0' + firstDate.getDate() : firstDate.getDate()
      var firstMonth = firstDate.getMonth() <= 9 ? '0' + (firstDate.getMonth() + 1) : firstDate.getMonth() + 1
      var firstYear = firstDate.getFullYear()
      this.TRWStartString = firstYear + '-' + firstMonth + '-' + firstDay + ' 00:00:00'

      var lastDay = lastDate.getDate() <= 9 ? '0' + lastDate.getDate() : lastDate.getDate()
      var lastMonth = lastDate.getMonth() <= 9 ? '0' + (lastDate.getMonth() + 1) : lastDate.getMonth() + 1
      var lastYear = lastDate.getFullYear()

      this.TRWEndString = lastYear + '-' + lastMonth + '-' + lastDay + ' 23:59:59'
    },
    // 搜索TRFormList
    async searchTRFormList () {
      if (this.TRDayPicker !== '') {
        this.initTRDayTime(this.TRDayPicker)
      }
      const { data: res } = await this.$http.post('searchTRFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        TRDayString: this.TRDayString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取翻台率数据失败!')
        return
      }
      this.TRFormList = res.data.TRFormList
    },
    // 初始化TRDayString
    initTRDayTime (date) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      this.TRDayString = year + '-' + month + '-' + day
    },
    // COSN合计
    getCOSNSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === 5 || index === 6) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
      })

      if (sums[2] !== 0) {
        sums[5] = (sums[4] / sums[2]).toFixed(2)
      }
      if (sums[3] !== 0) {
        sums[6] = (sums[4] / sums[3]).toFixed(2)
      }
      return sums
    },
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
    changeTabs () {
      // 清空所有TabItem数据
      // 清空COSN
      this.COSNStartString = ''
      this.COSNEndString = ''
      this.COSNStartPicker = ''
      this.COSNEndPicker = ''
      this.COSNFormList = []

      // 清空TR
      this.TRDayString = ''
      this.TRDayPicker = ''
      this.TRFormList = []

      // 清空TRW
      this.TRWTimePicker = ''
      this.TRWStartString = ''
      this.TRWEndString = ''
      this.TRWFormList = []

      // 初始化所有TabItem数据
      this.initCOSNStartTime(new Date(), 0)
      this.initCOSNEndTime(new Date(), 0)

      this.initTRDayTime(new Date())

      this.initTRWStartStringAndTRWEndString(new Date())
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
