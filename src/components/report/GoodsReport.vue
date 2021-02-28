<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>菜品分析</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-tabs type="border-card" v-model="goodsValue" :before-leave="changeTabs">
          <el-tab-pane label="产品销售统计" name="productSalesStatistics">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{PSSStartString}} ~ {{PSSEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="PSSStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;margin-right:20px;"
                v-model="PSSEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-cascader v-model="PSSCascaderModel" :options="PSSGoodsAndGoodstypeOptions"
                  :props="{ checkStrictly: true }" clearable placeholder="请选择菜品分类或菜品"
                  @change="PSSGoodsAndGoodstypeCascaderChange"></el-cascader>
              <el-button style="margin-left:30px;" type="primary" @click="searchPSSFormList">搜索</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  data () {
    return {
      goodsValue: 'productSalesStatistics',

      PSSStartString: '',
      PSSEndString: '',
      PSSStartPicker: '',
      PSSEndPicker: '',
      PSSFormList: [],
      PSSCascaderModel: [],
      PSSGoodsAndGoodstypeOptions: [],
      PSSGoodID: '',
      PSSGoodtypeID: ''
    }
  },
  created () {
    this.initPSSStartTime(new Date(), 0)
    this.initPSSEndTime(new Date(), 0)
    this.getPSSGoodsAndGoodstypeOptions()
  },
  methods: {
    // 获取searchPSSFormList
    async searchPSSFormList () {
      if (this.PSSStartPicker !== '') {
        this.initPSSStartTime(this.PSSStartPicker, 1)
      }
      if (this.PSSEndPicker !== '') {
        this.initPSSEndTime(this.PSSEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchPSSFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        PSSStartString: this.PSSStartString,
        PSSEndString: this.PSSEndString,
        PSSGoodID: this.PSSGoodID,
        PSSGoodtypeID: this.PSSGoodtypeID
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取产品销售统计数据失败!')
        return
      }
      this.PSSFormList = res.data.PSSFormList
    },
    // 获取PSS级联选择器中GoodsAndGoodstype
    async getPSSGoodsAndGoodstypeOptions () {
      const { data: res } = await this.$http.post('pSSGoodsAndGoodstypeOptions', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName')
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取Cascader餐品数据失败!')
        return
      }
      this.PSSGoodsAndGoodstypeOptions = res.data.PSSGoodsAndGoodstypeOptions
    },
    // PSS 级联选择器变化
    PSSGoodsAndGoodstypeCascaderChange () {
      if (this.PSSCascaderModel.length === 0) {
        this.PSSGoodID = ''
        this.PSSGoodtypeID = ''
      }
      if (this.PSSCascaderModel.length === 1) {
        this.PSSGoodtypeID = this.PSSCascaderModel[0]
        this.PSSGoodID = ''
      }
      if (this.PSSCascaderModel.length === 2) {
        this.PSSGoodID = this.PSSCascaderModel[1]
        this.PSSGoodtypeID = ''
      }
    },
    // 初始化PSS时间
    initPSSStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.PSSStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.PSSStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    initPSSEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.PSSEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.PSSEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 合计方法
    getSummaries (param) {},
    // 切换tabs
    changeTabs (activeName, oldActiveName) {}
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
