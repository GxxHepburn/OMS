<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <div class="titleDiv">
            <span>1、非自动检索，需点击搜索按钮检索！-- 2、其他条件可以组合,订单号不能参与组合,若订单号参与组合，则订单号成为唯一条件</span>
          </div>
          <div class="dividerDiv"></div>

          <el-row :gutter="20" type="flex">
              <el-col :span="5">
                <el-input placeholder="订单号" v-model="queryInfo.O_UniqSearchID" :clearable="true">
                </el-input>
              </el-col>
              <el-col :span="7">
                  <el-input placeholder="用户号" v-model="queryInfo.U_OpenId" :clearable="true">
                  </el-input>
              </el-col>
              <el-col :span="3.5">
                <el-cascader v-model="cascaderModel" :options="tabAndTabTypeOptions"
                  :props="{ checkStrictly: true }" clearable placeholder="请选择餐桌分类或餐桌"
                  @change="tabAndTabtypeCascaderChange"></el-cascader>
              </el-col>
              <el-col :span="3.5">
                <el-date-picker
                  v-model="queryInfo.OrderStartTime"
                  type="datetime"
                  placeholder="选择下单开始日期时间">
                </el-date-picker>
              </el-col>
              <el-col :span="3.5">
                <el-date-picker
                  v-model="queryInfo.OrderEndTime"
                  type="datetime"
                  placeholder="选择下单结束日期时间">
                </el-date-picker>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.PayStartTime"
                type="datetime"
                placeholder="选择支付开始日期时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.PayEndTime"
                type="datetime"
                placeholder="选择支付结束日期时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-select v-model="queryInfo.PayStatus" clearable placeholder="请选择订单状态">
                <el-option
                  v-for="item in payStatuesList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3.5">
              <el-button type="primary" @click="search(1)">搜索</el-button>
            </el-col>
          </el-row>

          <div class="dividerDiv"></div>
          <div class="titleDiv">
            <span>1、根据支付信息查询订单 -- 2、自动检索 -- 3、商户单号、支付单号、退款单号、商户退款单号各自独立检索！ (Tips：既各自独立检索，也与上方检索条件无关.)</span>
          </div>
          <div class="dividerDiv"></div>

          <!-- 搜索区域 -->
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="请输入商户单号" v-model="queryInfo.OutTradeNo" :clearable="true" @clear="search(2)" @keyup.enter.native="search(2)">
                <el-button slot="append" icon="el-icon-search" @click="search(2)"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入支付单号" v-model="queryInfo.TransactionId" :clearable="true" @clear="search(3)" @keyup.enter.native="search(3)">
                <el-button slot="append" icon="el-icon-search" @click="search(3)"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入商户退款单号" v-model="queryInfo.RefundOutTradeNo" :clearable="true" @clear="search(4)" @keyup.enter.native="search(4)">
                <el-button slot="append" icon="el-icon-search" @click="search(4)"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="请输入退款单号" v-model="queryInfo.RefundId" :clearable="true" @clear="search(5)" @keyup.enter.native="search(5)">
                <el-button slot="append" icon="el-icon-search" @click="search(5)"></el-button>
              </el-input>
            </el-col>
          </el-row>

          <el-table :data='orderFormList'
             :border="true"
             :stripe="true"
              @expand-change="orderDetailExpand"
              :row-key="getRowKeys"
              :expand-row-keys="expands"
              :row-class-name="tableRowClassName">
              <el-table-column type="expand">
                   <template slot-scope="scope">
                    <el-form label-position="left" class="orderDetail-table-expand">
                      <el-form-item v-if="scope.row.O_PayStatue === 2" label="实际收入金额:">
                        <span class="remarksSpan">{{scope.row.O_TotlePrice}} 元</span>
                      </el-form-item>
                      <el-form-item v-if="scope.row.O_PayStatue === 2" label="退款金额:">
                        <span class="remarksSpan">{{returnTotalPrice(scope.row)}} 元</span>
                      </el-form-item>
                      <el-form-item>
                        <el-table :data="scope.row.orderDetail" :border="false" :stripe="false">
                          <el-table-column type="index"></el-table-column>
                          <el-table-column label="菜品名称" prop="name"></el-table-column>
                          <el-table-column label="价格（元）" prop="price"></el-table-column>
                          <el-table-column label="规格">
                            <template slot-scope="specs">
                              <el-tag type="warning" size="mini" v-if="specs.row.specs">{{specs.row.specs}}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="属性">
                            <template slot-scope="property"  v-if="property.row.property[0] != ''">
                              <span v-for="item in property.row.property" :key="item" class="propertySpan">
                                <el-tag type="success" size="mini" v-if="item != ''">{{item}}</el-tag>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label="数量 (份)" prop="num"></el-table-column>
                          <el-table-column v-if="scope.row.O_PayStatue === 2" label="退款数量 (份)">
                            <template slot-scope="OD_Item">
                              {{OD_Item.row.num - OD_Item.row.OD_RealNum}}
                            </template>
                          </el-table-column>
                          <el-table-column v-if="scope.row.O_PayStatue === 0 || scope.row.O_PayStatue === 3" label="退点数量 (份)">
                            <template slot-scope="OD_Item">
                              {{OD_Item.row.num - OD_Item.row.OD_RealNum}}
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                      <el-form-item label="顾客备注 :">
                        <span class="remarksSpan">{{scope.row.O_Remarks === '' ? '客人没有特殊要求！' : scope.row.O_Remarks}}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                 </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="检索 ID" prop="O_UniqSearchID" width="210"></el-table-column>
              <el-table-column label="餐桌" prop="T_Name"></el-table-column>
              <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
              <el-table-column label="用餐人数" prop="O_NumberOfDiners"></el-table-column>
              <el-table-column label="金额 (元)" prop="O_TotlePrice"></el-table-column>
              <el-table-column label="支付状态"  width="100">
                <!-- 修改成tag -->
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.O_PayStatue == 0" type="danger">未支付</el-tag>
                  <el-tag v-if="scope.row.O_PayStatue == 1" type="primary">已完成</el-tag>
                  <el-tag v-if="scope.row.O_PayStatue == 2 && scope.row.O_TotlePrice == 0" type="warning">全额退款</el-tag>
                  <el-tag v-if="scope.row.O_PayStatue == 2 && scope.row.O_TotlePrice != 0" type="warning">部分退款</el-tag>
                  <el-tag v-if="scope.row.O_PayStatue == 3" type="info">未完成</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="下单时间" prop="O_OrderingTime" width="140"></el-table-column>
              <el-table-column label="支付时间" prop="O_PayTime" width="140"></el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    title="客人备注"
                    width="200"
                    trigger="click"
                    :content="scope.row.O_Remarks==''?'客人没有特殊要求':scope.row.O_Remarks">
                    <el-button size="mini" type="info" slot="reference" plain>备注</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="订单详情" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-setting" size="mini" @click="orderSettingButtonClick(scope.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="用户信息" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-user-solid" size="mini" @click="userInfoButtonClick(scope.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        touchButton: 1,
        O_UniqSearchID: '',
        U_OpenId: '',
        TabId: '',
        TabTypeId: '',
        PayStatus: '',
        OrderStartTime: '',
        OrderEndTime: '',
        PayStartTime: '',
        PayEndTime: '',

        OutTradeNo: '',
        TransactionId: '',
        RefundId: '',
        RefundOutTradeNo: '',

        pagenum: 1,
        pagesize: 10,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      // options初始化时，对value值进行tab，tabtype区分，发送搜索请求前先判断是tabid还是tabtypeid
      tabAndTabTypeOptions: [],
      payStatuesList: [
        { value: 0, label: '未支付' },
        { value: 1, label: '已完成' },
        { value: 2, label: '退款' },
        { value: 3, label: '未完成' }
      ],
      cascaderModel: [],
      orderFormList: [],
      total: 0,
      // 确保唯一expand
      expands: [],
      orderDetailParams: {
        O_ID: 0
      }
    }
  },
  computed: {
    returnTotalPrice: function () {
      return function (item) {
        var returnTotalPriceInner = 0.0
        for (var index in item.orderDetail) {
          var foodItem = item.orderDetail[index]
          returnTotalPriceInner += (foodItem.num - foodItem.OD_RealNum) * foodItem.price
        }
        return returnTotalPriceInner
      }
    }
  },
  created () {
    this.getParamsFromRefund()
    this.getParamsFromPay()
    this.getParamsFromUsers()
    this.getTabAndTabTypeOptions()
    this.getOrderFormList()
  },
  methods: {
    // 用户信息按钮
    userInfoButtonClick (row) {
      // 带参数跳转到用户列表页面
      this.$router.push({
        path: '/static/users',
        name: 'Users',
        params: {
          O_UniqSearchID: row.O_UniqSearchID
        }
      })
    },
    // 订单操作按钮
    orderSettingButtonClick (row) {
      this.$router.push({
        path: '/static/orderItemSetting',
        query: {
          O_ID: row.O_ID
        }
      })
    },
    // 从退款列表页面跳转
    getParamsFromRefund () {
      // 取到路由带过来的参数
      const routerParams = this.$route.params
      this.queryInfo.O_UniqSearchID = routerParams.O_UniqSearchID
      // 避免刷新后由于params消失，导致U_OpenId undefined
      if (this.queryInfo.O_UniqSearchID === undefined) {
        this.queryInfo.O_UniqSearchID = ''
      } else {
        this.queryInfo.touchButton = 1
      }
    },
    // 从支付列表页面跳转
    getParamsFromPay () {
      // 取到路由带过来的参数
      const routerParams = this.$route.params
      this.queryInfo.O_UniqSearchID = routerParams.O_UniqSearchID
      // 避免刷新后由于params消失，导致U_OpenId undefined
      if (this.queryInfo.O_UniqSearchID === undefined) {
        this.queryInfo.O_UniqSearchID = ''
      } else {
        this.queryInfo.touchButton = 1
      }
    },
    // 从用户列表页面跳转，获取用户检索id参数
    getParamsFromUsers () {
      // 取到路由带过来的参数
      const routerParams = this.$route.params
      this.queryInfo.U_OpenId = routerParams.U_OpenId
      // 避免刷新后由于params消失，导致U_OpenId undefined
      if (this.queryInfo.U_OpenId === undefined) {
        this.queryInfo.U_OpenId = ''
      }
    },
    // 餐桌选择框变化函数
    tabAndTabtypeCascaderChange () {
      if (this.cascaderModel.length === 0) {
        this.queryInfo.TabTypeId = ''
        this.queryInfo.TabId = ''
      }
      if (this.cascaderModel.length === 1) {
        this.queryInfo.TabTypeId = this.cascaderModel[0]
        this.queryInfo.TabId = ''
      }
      if (this.cascaderModel.length === 2) {
        this.queryInfo.TabId = this.cascaderModel[1]
        this.queryInfo.TabTypeId = ''
      }
    },
    // 监听pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewOrderFormList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderFormList()
    },
    tableRowClassName ({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    getRowKeys (row) {
      return row.O_ID
    },
    orderDetailExpand (row, expandedRows) {
      var that = this
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.O_ID)
          // 请求订单详细信息
          that.orderDetailParams.O_ID = row.O_ID
          that.getOrderDetail(row.row_index)
        }
      } else {
        that.expands = []
      }
    },
    async getOrderDetail (index) {
      const { data: res } = await this.$http.post('orderDetails', this.orderDetailParams)
      if (res.meta.status !== 200) {
        this.$message.error('获取订单信息失败')
        return
      }
      this.$set(this.orderFormList[index], 'orderDetail', res.data)
    },
    async getTabAndTabTypeOptions () {
      const { data: res } = await this.$http.post('ordersTabAndTabTypeOptions', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌数据失败!')
        return
      }
      this.tabAndTabTypeOptions = res.data.ordersTabAndTabTypeOptions
    },
    async getOrderFormList () {
      const { data: res } = await this.$http.post('getOrderFormList', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数据失败!')
        return
      }
      this.orderFormList = res.data.orderFormList
      this.total = res.data.total
    },
    getNewOrderFormList () {
      this.queryInfo.pagenum = 1
      this.getOrderFormList()
    },
    search (touchIndex) {
      this.queryInfo.touchButton = touchIndex
      this.getNewOrderFormList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.propertySpan {
  display: inline-block;
  padding-right: 10px;
}
.orderDetail-table-expand {
  /deep/ .el-form-item__label {
    color: #99a9bf;
    font-size: 17px;
    font-weight: bold;
  }
  /deep/ .remarksSpan {
    color: #F56C6C;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
