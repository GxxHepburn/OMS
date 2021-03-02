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
            <el-table :data='PSSFormList'
              :border='true'
              :stripe="true"
              :show-summary="true"
              :summary-method="getSummaries"
              :span-method="pssObjectSpanMethod">
              <el-table-column label="分类" prop="ftname"></el-table-column>
              <el-table-column label="名称" prop="fname"></el-table-column>
              <el-table-column label="单价" prop="odrealprice">
                <template slot-scope="scope">
                  {{scope.row.odrealprice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="出售数量" prop="odnum"></el-table-column>
              <el-table-column label="出售金额" prop="totalPrice">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="真实数量" prop="odrealnum"></el-table-column>
              <el-table-column label="真实金额" prop="realTotalPrice">
                <template slot-scope="scope">
                  {{scope.row.realTotalPrice.toFixed(2)}}
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
      goodsValue: 'productSalesStatistics',

      PSSStartString: '',
      PSSEndString: '',
      PSSStartPicker: '',
      PSSEndPicker: '',
      PSSFormList: [],
      PSSCascaderModel: [],
      PSSGoodsAndGoodstypeOptions: [],
      PSSGoodID: '',
      PSSGoodtypeID: '',
      PSSSpanOneArr: [],
      PSSSpanTwoArr: []
    }
  },
  created () {
    this.initPSSStartTime(new Date(), 0)
    this.initPSSEndTime(new Date(), 0)
    this.getPSSGoodsAndGoodstypeOptions()
  },
  methods: {
    // 获取第一列跨行数据
    getPSSSpanOneArr (data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.PSSSpanOneArr.push(1)
          this.pos = 0
        } else {
          if (data[i].ftname === data[i - 1].ftname) {
            this.PSSSpanOneArr[this.pos] += 1
            this.PSSSpanOneArr.push(0)
          } else {
            this.PSSSpanOneArr.push(1)
            this.pos = i
          }
        }
      }
    },
    // 获取第二列跨行数据
    getPSSSpanTwoArr (data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.PSSSpanTwoArr.push(1)
          this.pos = 0
        } else {
          if (data[i].fname === data[i - 1].fname) {
            this.PSSSpanTwoArr[this.pos] += 1
            this.PSSSpanTwoArr.push(0)
          } else {
            this.PSSSpanTwoArr.push(1)
            this.pos = i
          }
        }
      }
    },
    // 合并行
    pssObjectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.PSSSpanOneArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.PSSSpanTwoArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 获取searchPSSFormList
    async searchPSSFormList () {
      this.PSSSpanOneArr = []
      this.PSSSpanTwoArr = []
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
      this.getPSSSpanOneArr(this.PSSFormList)
      this.getPSSSpanTwoArr(this.PSSFormList)
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === 2) {
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

      if (sums[3] !== 0) {
        sums[2] = '平均价格：' + (sums[4] / sums[3]).toFixed(2)
      }

      sums[4] = parseFloat(sums[4]).toFixed(2)
      sums[6] = parseFloat(sums[6]).toFixed(2)
      return sums
    },
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
