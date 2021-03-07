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
      UDSFormList: []
    }
  },
  created () {
    this.initUDSStartTime(new Date(), 0)
    this.initUDSEndTime(new Date(), 0)
  },
  methods: {
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
