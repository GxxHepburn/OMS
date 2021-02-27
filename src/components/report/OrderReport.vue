<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>订单分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="tabsValue" :before-leave="changeTabs">
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
                  placeholder="选择日期">
                </el-date-picker>
                <el-button style="margin-left:30px;" type="primary" @click="searchOrdersPHour">搜索</el-button>
            </div>
            <el-table :data='hourFormList'
              :border="true"
             :stripe="true" v-if="hourFormList.length > 0">
             <el-table-column label="时段" prop="times"></el-table-column>
             <el-table-column label="消费总额">
               <template slot-scope="scope">
                 {{scope.row.totalPrice.toFixed(2)}}
               </template>
             </el-table-column>
             <el-table-column label="订单数" prop="totalOrdersNumbers"></el-table-column>
             <el-table-column label="客人数" prop="numberOfDinners"></el-table-column>
             <el-table-column label="单均">
               <template slot-scope="scope">
                 {{scope.row.pricePOrder.toFixed(2)}}
               </template>
             </el-table-column>
             <el-table-column label="人均">
               <template slot-scope="scope">
                 {{scope.row.pricePPeople.toFixed(2)}}
               </template>
             </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="订单数(日)" name="ordersPDay">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{monthStart}} 00:00:00 ~ {{monthEnd}} 23:59:59</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="monthPicker"
                type="month"
                :editable="false"
                :clearable="false"
                placeholder="选择月份">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchOrdersPDay">搜索</el-button>
            </div>
            <el-table :data='dayFormList'
              :border="true"
              :stripe="true" v-if="dayFormList.length > 0">
              <el-table-column label="时段" prop="times"></el-table-column>
              <el-table-column label="消费总额">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="订单数" prop="totalOrdersNumbers"></el-table-column>
              <el-table-column label="客人数" prop="numberOfDinners"></el-table-column>
              <el-table-column label="单均">
                <template slot-scope="scope">
                  {{scope.row.pricePOrder.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="人均">
                <template slot-scope="scope">
                  {{scope.row.pricePPeople.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="订单数(月)" name="ordersPMonth">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{year}}-01-01 00:00:00 ~ {{year}}-12-31 23:59:59</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="yearPicker"
                type="year"
                :editable="false"
                :clearable="false"
                placeholder="选择年份">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchOrdersPMonth">搜索</el-button>
            </div>
            <el-table :data='monthFormList'
              :border="true"
              :stripe="true" v-if="monthFormList.length > 0">
              <el-table-column label="时段" prop="times"></el-table-column>
              <el-table-column label="消费总额">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="订单数" prop="totalOrdersNumbers"></el-table-column>
              <el-table-column label="客人数" prop="numberOfDinners"></el-table-column>
              <el-table-column label="单均">
                <template slot-scope="scope">
                  {{scope.row.pricePOrder.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="人均">
                <template slot-scope="scope">
                  {{scope.row.pricePPeople.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="退款订单" name="refundOrders">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{refundYear}}-01-01 00:00:00 ~ {{refundYear}}-12-31 23:59:59</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="refundYearPicker"
                type="year"
                :editable="false"
                :clearable="false"
                placeholder="选择年份">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchRefundPMonth">搜索</el-button>
            </div>
            <el-table :data='refundMonthFormList'
              :border="true"
              :stripe="true" v-if="refundMonthFormList.length > 0">
              <el-table-column label="时段" prop="times"></el-table-column>
            </el-table>
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
      todayPicker: '',
      hourFormList: [],

      monthStart: '',
      monthEnd: '',
      monthPicker: '',
      dayFormList: [],

      year: '',
      yearPicker: '',
      monthFormList: [],

      refundYear: '',
      refundYearPicker: '',
      refundMonthFormList: []
    }
  },
  created () {
    this.initToday(new Date())
  },
  methods: {
    // 退款订单(y)
    async searchRefundPMonth () {
      if (this.refundYearPicker !== '') {
        this.initRefundYear(this.refundYearPicker)
      }
      const { data: res } = await this.$http.post('searchRefundPMonth', { year: this.refundYear, mmngctUserName: window.sessionStorage.getItem('mmngctUserName') })
      if (res.meta.status !== 200) {
        this.$message.error('获取退款订单统计数据失败!')
        return
      }
      this.refundMonthFormList = res.data.refundMonthFormList
    },
    // 搜索订单数(y)
    async searchOrdersPMonth () {
      if (this.yearPicker !== '') {
        this.initYear(this.yearPicker)
      }
      const { data: res } = await this.$http.post('searchOrdersPMonth', { year: this.year, mmngctUserName: window.sessionStorage.getItem('mmngctUserName') })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数(月)统计数据失败!')
        return
      }
      this.monthFormList = res.data.monthFormList
    },
    // 搜索订单数(d)
    async searchOrdersPDay () {
      if (this.monthPicker !== '') {
        this.initMonth(this.monthPicker)
      }
      const { data: res } = await this.$http.post('searchOrdersPDay', { monthStart: this.monthStart, monthEnd: this.monthEnd, mmngctUserName: window.sessionStorage.getItem('mmngctUserName') })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数(日)统计数据失败!')
        return
      }
      this.dayFormList = res.data.dayFormList
    },
    // 搜索订单数(h)
    async searchOrdersPHour () {
      if (this.todayPicker !== '') {
        this.initToday(this.todayPicker)
      }
      const { data: res } = await this.$http.post('searchOrdersPHour', { today: this.today, mmngctUserName: window.sessionStorage.getItem('mmngctUserName') })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数(时)统计数据失败!')
        return
      }
      this.hourFormList = res.data.hourFormList
    },
    // 切换tabs
    changeTabs (activeName, oldActiveName) {
      if (oldActiveName === 'ordersPHour') {
        this.todayPicker = ''
        this.hourFormList = []
      }
      if (oldActiveName === 'ordersPDay') {
        this.monthPicker = ''
        this.dayFormList = []
      }
      if (oldActiveName === 'ordersPMonth') {
        this.yearPicker = ''
        this.monthFormList = []
      }
      if (oldActiveName === 'refundOrders') {
        this.refundYearPicker = ''
        this.refundMonthFormList = []
      }
      // 初始化所有TabItem
      this.initToday(new Date())
      this.initMonth(new Date())
      this.initYear(new Date())
      this.initRefundYear(new Date())
    },
    initToday (todayDate) {
      var day = todayDate.getDate() <= 9 ? '0' + todayDate.getDate() : todayDate.getDate()
      var month = todayDate.getMonth() <= 9 ? '0' + (todayDate.getMonth() + 1) : todayDate.getMonth() + 1
      var year = todayDate.getFullYear()
      this.today = year + '-' + month + '-' + day
    },
    initMonth (monthDate) {
      var nowMonth = monthDate.getMonth()
      var nowYear = monthDate.getFullYear()
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth + 1, 0)

      var dayStart = monthStartDate.getDate() <= 9 ? '0' + monthStartDate.getDate() : monthStartDate.getDate()
      var dayEnd = monthEndDate.getDate() <= 9 ? '0' + monthEndDate.getDate() : monthEndDate.getDate()
      var month = nowMonth <= 9 ? '0' + (nowMonth + 1) : nowMonth + 1

      this.monthStart = nowYear + '-' + month + '-' + dayStart
      this.monthEnd = nowYear + '-' + month + '-' + dayEnd
    },
    initYear (yearDate) {
      var nowYear = yearDate.getFullYear()
      this.year = nowYear
    },
    initRefundYear (refundYearDate) {
      var nowYear = refundYearDate.getFullYear()
      this.refundYear = nowYear
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
</style>
