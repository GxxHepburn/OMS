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
          <el-row :gutter="20">
              <el-col :span="5">
                  <el-input placeholder="订单号" v-model="queryInfo.O_UniqSearchID" :clearable="true">
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-input placeholder="用户号" v-model="queryInfo.U_OpenId" :clearable="true">
                  </el-input>
              </el-col>
              <el-col :span="3.5">
                <el-cascader v-model="cascaderModel" :options="tabAndTabTypeOptions" :props="{ checkStrictly: true }" clearable placeholder="请选择餐桌分类或餐桌"></el-cascader>
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
              <el-button type="primary" @click="searchOrderForm">搜索</el-button>
            </el-col>
          </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        O_UniqSearchID: '',
        U_OpenId: '',
        TabId: '',
        TabTypeId: '',
        PayStatus: '',
        OrderStartTime: '',
        OrderEndTime: '',
        PayStartTime: '',
        PayEndTime: '',

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
      total: ''
    }
  },
  created () {
    this.getTabAndTabTypeOptions()
    // this.getOrderFormList()
  },
  methods: {
    async getTabAndTabTypeOptions () {
      const { data: res } = await this.$http.post('ordersTabAndTabTypeOptions', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌数据数据失败!')
        return
      }
      this.tabAndTabTypeOptions = res.data.ordersTabAndTabTypeOptions
    },
    async getOrderFormList () {
      const { data: res } = await this.$http.post('getOrderFormList', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取订单数据数据失败!')
        return
      }
      this.orderFormList = res.data.orderFormList
    },
    getNewOrderFormList () {
      this.queryInfo.pagenum = 1
      if (this.cascaderModel.length === 1) {
        this.queryInfo.TabTypeId = this.cascaderModel[0]
      } if (this.cascaderModel.length === 2) {
        this.queryInfo.TabId = this.cascaderModel[1]
      }
      this.getOrderFormList()
    },
    searchOrderForm () {
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
</style>
