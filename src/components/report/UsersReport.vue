<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>用户分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="tabsValue" :before-leave="changeTabs">
          <el-tab-pane label="用户数据统计" name="userDataStatistics">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{UDSStartString}} ~ {{UDSEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="UDSStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="UDSEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchUDSFormList">搜索</el-button>
            </div>
            <el-table :data='UDSFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="用户人数" prop="userNum"></el-table-column>
              <el-table-column label="新用户人数" prop="newUserNum"></el-table-column>
              <el-table-column label="消费人数" prop="consumeNum"></el-table-column>
              <el-table-column label="消费次数" prop="consumeCount"></el-table-column>
              <el-table-column label="平均消费" prop="averageConsumption">
                <template slot-scope="scope">
                  {{scope.row.averageConsumption.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="新增用户统计" name="newUserStatistics">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{NUSStartString}} ~ {{NUSEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="NUSStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="NUSEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchNUSFormList">搜索</el-button>
            </div>
            <el-table :data='NUSFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="新用户数" prop="newUserNum"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="消费分布" name="consumptionDistribution">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{CDStartString}} ~ {{CDEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="CDStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="CDEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchCDFormList">搜索</el-button>
            </div>
            <el-table :data='CDFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="用户检索ID" prop="searchID" width="400px"></el-table-column>
              <el-table-column label="消费金额" prop="totalPrice">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="最近消费时间" prop="lastOrderingTime"></el-table-column>
              <el-table-column label="消费次数" prop="orderingNum"></el-table-column>
              <el-table-column label="平均消费" prop="averagePrice">
                <template slot-scope="scope">
                  {{scope.row.averagePrice.toFixed(2)}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="消费统计" name="consumptionSummary">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{CSStartString}} ~ {{CSEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="CSStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;"
                v-model="CSEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchCSFormList">搜索</el-button>
            </div>
            <el-table :data='CSFormList'
              :border='true'
              :stripe="true">
              <el-table-column label="消费次数" prop="orderingNum"></el-table-column>
              <el-table-column label="消费金额" prop="orderingTotalPrice">
                <template slot-scope="scope">
                  {{scope.row.orderingTotalPrice.toFixed(2)}}
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
      tabsValue: 'userDataStatistics',

      UDSStartString: '',
      UDSEndString: '',
      UDSStartPicker: '',
      UDSEndPicker: '',
      UDSFormList: [],

      NUSStartString: '',
      NUSEndString: '',
      NUSStartPicker: '',
      NUSEndPicker: '',
      NUSFormList: [],

      CDStartString: '',
      CDEndString: '',
      CDStartPicker: '',
      CDEndPicker: '',
      CDFormList: [],

      CSStartString: '',
      CSEndString: '',
      CSStartPicker: '',
      CSEndPicker: '',
      CSFormList: []
    }
  },
  created () {
    this.initUDSStartTime(new Date(), 0)
    this.initUDSEndTime(new Date(), 0)
  },
  methods: {
    // 获取CSFormList数据
    async searchCSFormList () {
      if (this.CSStartPicker !== '') {
        this.initCSStartTime(this.CSStartPicker, 1)
      }
      if (this.CSEndPicker !== '') {
        this.initCSEndTime(this.CSEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchCSFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        CSStartString: this.CSStartString,
        CSEndString: this.CSEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取消费统计数据失败!')
        return
      }
      this.CSFormList = res.data.CSFormList
    },
    // 初始化CSStartString
    initCSStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CSStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.CSStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化CSEndString
    initCSEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CSEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.CSEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 获取CDFormList数据
    async searchCDFormList () {
      if (this.CDStartPicker !== '') {
        this.initCDStartTime(this.CDStartPicker, 1)
      }
      if (this.CDEndPicker !== '') {
        this.initCDEndTime(this.CDEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchCDFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        CDStartString: this.CDStartString,
        CDEndString: this.CDEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取消费分布数据失败!')
        return
      }
      this.CDFormList = res.data.CDFormList
    },
    // 初始化CDStartString
    initCDStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CDStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.CDStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化CDEndString
    initCDEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CDEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.CDEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 获取NUSFormList数据
    async searchNUSFormList () {
      if (this.NUSStartPicker !== '') {
        this.initNUSStartTime(this.NUSStartPicker, 1)
      }
      if (this.NUSEndPicker !== '') {
        this.initNUSEndTime(this.NUSEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchNUSFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        NUSStartString: this.NUSStartString,
        NUSEndString: this.NUSEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取新增用户统计数据失败!')
        return
      }
      this.NUSFormList = res.data.NUSFormList
    },
    // 初始化NUSStartString
    initNUSStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.NUSStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.NUSStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化NUSEndString
    initNUSEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.NUSEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.NUSEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 获取UDSFormList数据
    async searchUDSFormList () {
      if (this.UDSStartPicker !== '') {
        this.initUDSStartTime(this.UDSStartPicker, 1)
      }
      if (this.UDSEndPicker !== '') {
        this.initUDSEndTime(this.UDSEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchUDSFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        UDSStartString: this.UDSStartString,
        UDSEndString: this.UDSEndString
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户统计数据失败!')
        return
      }
      this.UDSFormList = res.data.UDSFormList
    },
    // 初始化UDSStartString
    initUDSStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.UDSStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.UDSStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    initUDSEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.UDSEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.UDSEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 切换tabs
    changeTabs (activeName, oldActiveName) {
      // 清空所有TabItem数据
      // 清空UDS
      this.UDSStartString = ''
      this.UDSEndString = ''
      this.UDSStartPicker = ''
      this.UDSEndString = ''
      this.UDSFormList = []

      // 清空NUS
      this.NUSStartString = ''
      this.NUSEndString = ''
      this.NUSStartPicker = ''
      this.NUSEndPicker = ''
      this.NUSFormList = []

      // 清空CD
      this.CDStartString = ''
      this.CDEndString = ''
      this.CDStartPicker = ''
      this.CDEndPicker = ''
      this.CDFormList = []

      // 清空CS
      this.CSStartString = ''
      this.CSEndString = ''
      this.CSStartPicker = ''
      this.CSEndPicker = ''
      this.CSFormList = []

      // 初始化所有tabitem数据
      // 初始化UDS
      this.initUDSStartTime(new Date(), 0)
      this.initUDSEndTime(new Date(), 0)

      // 初始化NUS
      this.initNUSStartTime(new Date(), 0)
      this.initNUSEndTime(new Date(), 0)

      // 初始化CD
      this.initCDStartTime(new Date(), 0)
      this.initCDEndTime(new Date(), 0)

      // 初始化CS
      this.initCSStartTime(new Date(), 0)
      this.initCSEndTime(new Date(), 0)
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
