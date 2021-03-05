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
              :summary-method="getPSSSummaries"
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
          <el-tab-pane label="分类销售统计" name="classifiedSalesStatistics">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{CSSStartString}} ~ {{CSSEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="CSSStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;margin-right:20px;"
                v-model="CSSEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-select v-model="CSSGoodtypeID" placeholder="请选择菜品分类" :clearable="true">
                <el-option
                    v-for="item in CSSGoodstypeOptions"
                    :key="item.FT_ID"
                    :label="item.FT_Name"
                    :value="item.FT_ID">
                </el-option>
              </el-select>
              <el-button style="margin-left:30px;" type="primary" @click="searchCSSFormList">搜索</el-button>
            </div>
            <el-table :data='CSSFormList'
              :border='true'
              :stripe="true"
              :summary-method="getCSSSummaries"
              :show-summary="true">
              <el-table-column label="分类" prop="ftname"></el-table-column>
              <el-table-column label="销售数量" prop="odnum"></el-table-column>
              <el-table-column label="销售金额" prop="totalPrice">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="数量占比" prop="numPercentage">
                <template slot-scope="scope">
                  {{(scope.row.numPercentage*100).toFixed(2)}}%
                </template>
              </el-table-column>
              <el-table-column label="金额占比" prop="pricePercentage">
                <template slot-scope="scope">
                  {{(scope.row.pricePercentage*100).toFixed(2)}}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="菜品销售对比表" name="productSalesComparison">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{PSCStartString}} ~ {{PSCEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-date-picker
                v-model="PSCStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-left:20px;margin-right:20px;"
                v-model="PSCEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-cascader v-model="PSCCascaderModel" :options="PSCGoodsAndGoodstypeOptions"
                  :props="{ checkStrictly: true }" clearable placeholder="请选择菜品分类或菜品"
                  @change="PSCGoodsAndGoodstypeCascaderChange"></el-cascader>
              <el-button style="margin-left:30px;" type="primary" @click="searchPSCFormList">搜索</el-button>
            </div>
            <el-table :data='PSCFormList'
              :border='true'
              :stripe="true"
              :show-summary="true"
              :summary-method="getPSCSummaries"
              :span-method="pssObjectSpanMethod">
              <el-table-column label="分类" prop="ftname"></el-table-column>
              <el-table-column label="名称" prop="fname"></el-table-column>
              <el-table-column label="SKU">
                <template slot-scope="scope">
                  {{scope.row.spec + ' ' + scope.row.propOne + ' ' + scope.row.propTwo}}
                </template>
              </el-table-column>
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
          <el-tab-pane label="退菜记录" name="returnRecord">
            <div class="titleDiv">
              <span>统计周期 </span>
              <span class="statistics_time">{{RCStartString}} ~ {{RCEndString}}</span>
            </div>
            <div class="dividerDiv"></div>
            <div>
              <el-input
                placeholder="请输入订单号"
                v-model="RCO_UniqSearchID"
                :clearable="true"
                style="width:300px;"></el-input>
              <el-date-picker style="margin-left:20px;margin-right:20px;"
                v-model="RCStartPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="开始时间">
              </el-date-picker>
              <el-date-picker style="margin-right:20px;"
                v-model="RCEndPicker"
                type="datetime"
                :editable="false"
                :clearable="false"
                placeholder="结束时间">
              </el-date-picker>
              <el-button style="margin-left:30px;" type="primary" @click="searchRCFormList">搜索</el-button>
            </div>
            <el-table :data='RCFormList'
              :border='true'
              :stripe="true"
              :show-summary="true"
              :summary-method="getRCSummaries">
              <el-table-column label="单号" prop="ousid" width="200"></el-table-column>
              <el-table-column label="桌台">
                <template slot-scope="scope">
                  {{scope.row.ttname + '-' + scope.row.tname}}
                </template>
              </el-table-column>
              <el-table-column label="产品编号 (sku)" width="200">
                <template slot-scope="scope">
                  {{scope.row.ftname + ' ' + scope.row.fname + ' ' + scope.row.spec + ' ' + scope.row.propOne + ' ' + scope.row.propTwo}}
                </template>
              </el-table-column>
              <el-table-column label="分类" prop="ftname"></el-table-column>
              <el-table-column label="名称" prop="fname"></el-table-column>
              <el-table-column label="单价" prop="price">
                <template slot-scope="scope">
                  {{scope.row.price.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="退菜数量" prop="num"></el-table-column>
              <el-table-column label="退菜金额" prop="totalPrice">
                <template slot-scope="scope">
                  {{scope.row.totalPrice.toFixed(2)}}
                </template>
              </el-table-column>
              <el-table-column label="点菜时间" prop="orderTime"></el-table-column>
              <el-table-column label="退菜时间" prop="returnTime"></el-table-column>
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
      PSSSpanTwoArr: [],

      CSSStartString: '',
      CSSEndString: '',
      CSSStartPicker: '',
      CSSEndPicker: '',
      CSSFormList: [],
      CSSCascaderModel: [],
      CSSGoodstypeOptions: [],
      CSSGoodtypeID: '',

      PSCStartString: '',
      PSCEndString: '',
      PSCStartPicker: '',
      PSCEndPicker: '',
      PSCFormList: [],
      PSCCascaderModel: [],
      PSCGoodsAndGoodstypeOptions: [],
      PSCGoodID: '',
      PSCGoodtypeID: '',

      RCStartString: '',
      RCEndString: '',
      RCStartPicker: '',
      RCEndPicker: '',
      RCFormList: [],
      RCO_UniqSearchID: ''
    }
  },
  created () {
    this.initPSSStartTime(new Date(), 0)
    this.initPSSEndTime(new Date(), 0)
    // 页面只初始化一次
    this.getPSSGoodsAndGoodstypeOptions()
    this.getCSSGoodstypeOptions()
  },
  methods: {
    // RC合计
    getRCSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === 2 || index === 3 || index === 4 || index === 8 || index === 9) {
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

      if (sums[6] !== 0) {
        sums[5] = '平均价格：' + (sums[7] / sums[6]).toFixed(2)
      }
      sums[7] = parseFloat(sums[7]).toFixed(2)
      return sums
    },
    // 获取RC数据
    async searchRCFormList () {
      if (this.RCStartPicker !== '') {
        this.initRCStartTime(this.RCStartPicker, 1)
      }
      if (this.RCEndPicker !== '') {
        this.initRCEndTime(this.RCEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchRCFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        RCStartString: this.RCStartString,
        RCEndString: this.RCEndString,
        RCO_UniqSearchID: this.RCO_UniqSearchID
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取退菜记录数据失败!')
        return
      }
      this.RCFormList = res.data.RCFormList
    },
    // 初始化RCStartTime
    initRCStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.RCStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.RCStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化RCEndTime
    initRCEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.RCEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.RCEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // PSC合计方法
    getPSCSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === 2 || index === 3) {
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

      if (sums[4] !== 0) {
        sums[3] = '平均价格：' + (sums[5] / sums[4]).toFixed(2)
      }

      sums[5] = parseFloat(sums[5]).toFixed(2)
      sums[7] = parseFloat(sums[7]).toFixed(2)
      return sums
    },
    // 获取PSC数据
    async searchPSCFormList () {
      this.PSSSpanOneArr = []
      this.PSSSpanTwoArr = []
      if (this.PSCStartPicker !== '') {
        this.initPSCStartTime(this.PSCStartPicker, 1)
      }
      if (this.PSCEndPicker !== '') {
        this.initPSCEndTime(this.PSCEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchPSCFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        PSCStartString: this.PSCStartString,
        PSCEndString: this.PSCEndString,
        PSCGoodID: this.PSCGoodID,
        PSCGoodtypeID: this.PSCGoodtypeID
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取菜品销售对比数据失败!')
        return
      }
      this.PSCFormList = res.data.PSCFormList
      this.getPSSSpanOneArr(this.PSCFormList)
      this.getPSSSpanTwoArr(this.PSCFormList)
    },
    // PSC 级联选择器变化
    PSCGoodsAndGoodstypeCascaderChange () {
      if (this.PSCCascaderModel.length === 0) {
        this.PSCGoodID = ''
        this.PSCGoodtypeID = ''
      }
      if (this.PSCCascaderModel.length === 1) {
        this.PSCGoodtypeID = this.PSCCascaderModel[0]
        this.PSCGoodID = ''
      }
      if (this.PSCCascaderModel.length === 2) {
        this.PSCGoodID = this.PSCCascaderModel[1]
        this.PSCGoodtypeID = ''
      }
    },
    // 初始化PSCStartTime
    initPSCStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.PSCStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.PSCStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化PSCEndTime
    initPSCEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.PSCEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.PSCEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // CSS合计
    getCSSSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
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

      sums[3] = '100%'
      sums[4] = '100%'
      return sums
    },
    // 获取CSS数据
    async searchCSSFormList () {
      if (this.CSSStartPicker !== '') {
        this.initCSSStartTime(this.CSSStartPicker, 1)
      }
      if (this.CSSEndPicker !== '') {
        this.initCSSEndTime(this.CSSEndPicker, 1)
      }
      const { data: res } = await this.$http.post('searchCSSFormList', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName'),
        CSSStartString: this.CSSStartString,
        CSSEndString: this.CSSEndString,
        CSSGoodtypeID: this.CSSGoodtypeID
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取分类销售统计数据失败!')
        return
      }
      this.CSSFormList = res.data.CSSFormList
    },
    // 初始化CSSStartTime
    initCSSStartTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CSSStartString = year + '-' + month + '-' + day + ' 00:00:00'
      } else {
        this.CSSStartString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 初始化CSSEndTime
    initCSSEndTime (date, index) {
      var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate()
      var month = date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var year = date.getFullYear()
      var hour = date.getHours() <= 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() <= 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() <= 10 ? '0' + date.getSeconds() : date.getSeconds()
      if (index === 0) {
        this.CSSEndString = year + '-' + month + '-' + day + ' 23:59:59'
      } else {
        this.CSSEndString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      }
    },
    // 获取CSS选择器中的Goodstype
    async getCSSGoodstypeOptions () {
      const { data: res } = await this.$http.post('cates', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName')
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取Select菜品分类数据失败!')
        return
      }
      this.CSSGoodstypeOptions = res.data.cates
    },
    // 获取第一列跨行数据 PSS、PSC
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
    // 获取第二列跨行数据 PSS、PSC
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
    // 合并行 PSS、PSC
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
    // 获取PSC级联选择器中GoodsAndGoodstype
    async getPSSGoodsAndGoodstypeOptions () {
      const { data: res } = await this.$http.post('pSSGoodsAndGoodstypeOptions', {
        mmngctUserName: window.sessionStorage.getItem('mmngctUserName')
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取Cascader餐品数据失败!')
        return
      }
      this.PSSGoodsAndGoodstypeOptions = res.data.PSSGoodsAndGoodstypeOptions
      this.PSCGoodsAndGoodstypeOptions = res.data.PSSGoodsAndGoodstypeOptions
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
    getPSSSummaries (param) {
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
    changeTabs (activeName, oldActiveName) {
      // 清空所有TabItem数据
      // 清空PSS
      this.PSSStartString = ''
      this.PSSEndString = ''
      this.PSSStartPicker = ''
      this.PSSEndPicker = ''
      this.PSSFormList = []
      this.PSSCascaderModel = ''
      this.PSSGoodID = ''
      this.PSSGoodtypeID = ''
      this.PSSSpanOneArr = []
      this.PSSSpanTwoArr = []

      // 清空CSS
      this.CSSStartString = ''
      this.CSSEndString = ''
      this.CSSStartPicker = ''
      this.CSSEndPicker = ''
      this.CSSFormList = []
      this.CSSCascaderModel = ''
      this.CSSGoodtypeID = ''

      // 清空PSC
      this.PSCStartString = ''
      this.PSCEndString = ''
      this.PSCStartPicker = ''
      this.PSCEndPicker = ''
      this.PSCFormList = []
      this.PSCCascaderModel = ''
      this.PSCGoodID = ''
      this.PSCGoodtypeID = ''
      // 清空RC
      this.RCStartString = ''
      this.RCEndString = ''
      this.RCStartPicker = ''
      this.RCEndPicker = ''
      this.RCFormList = []
      this.RCO_UniqSearchID = ''
      // 初始化所有TabItem数据
      this.initPSSStartTime(new Date(), 0)
      this.initPSSEndTime(new Date(), 0)

      this.initCSSStartTime(new Date(), 0)
      this.initCSSEndTime(new Date(), 0)

      this.initPSCStartTime(new Date(), 0)
      this.initPSCEndTime(new Date(), 0)

      this.initRCStartTime(new Date(), 0)
      this.initRCEndTime(new Date(), 0)
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
