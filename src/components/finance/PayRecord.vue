<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>财务管理</el-breadcrumb-item>
          <el-breadcrumb-item>支付记录</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 卡片视图 -->
        <el-card class="topElCard">
          <div class="titleDiv">
            <span>1、非自动检索 -- 2、条件组合检索</span>
          </div>
          <div class="dividerDiv"></div>

          <el-row :gutter="20" type="flex" class="PayRecordElRow">
              <el-col :span="7">
                <el-input placeholder="用户号" v-model="queryInfo.U_OpenId" :clearable="true">
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="订单号" v-model="queryInfo.O_UniqSearchID" :clearable="true">
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-input placeholder="商户单号" v-model="queryInfo.OutTradeNo" :clearable="true">
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-input placeholder="支付单号" v-model="queryInfo.TransactionId" :clearable="true">
                </el-input>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3.5">
              <el-cascader v-model="cascaderModel" :options="tabAndTabTypeOptions"
                  :props="{ checkStrictly: true }" clearable placeholder="请选择餐桌分类或餐桌"
                  @change="tabAndTabtypeCascaderChange"></el-cascader>
            </el-col>
            <el-col :span="3.5">
                <el-date-picker
                  v-model="queryInfo.PayStartTime"
                  type="datetime"
                  placeholder="选择支付起始时间">
                </el-date-picker>
              </el-col>
              <el-col :span="3.5">
                <el-date-picker
                  v-model="queryInfo.PayEndTime"
                  type="datetime"
                  placeholder="选择支付结束时间">
                </el-date-picker>
              </el-col>
              <el-col :span="3.5">
              <el-button type="primary" @click="searchPayFormList">搜索</el-button>
            </el-col>
          </el-row>

          <el-table :data='payFormList'
             :border="true"
             :stripe="true">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="支付单号" prop="p_Transaction_Id" width="220"></el-table-column>
              <el-table-column label="商户单号" prop="p_Out_Trade_No" width="250"></el-table-column>
              <el-table-column label="支付金额(元)" width="100">
                <template slot-scope="scope">
                  {{scope.row.p_Totle_Fee/100}}
                </template>
              </el-table-column>
              <el-table-column label="支付类型" prop="p_Trade_Type" width="80"></el-table-column>
              <el-table-column label="银行类型" prop="p_Bank_Type" width="150"></el-table-column>
              <el-table-column label="币种" prop="p_Fee_Type"></el-table-column>
              <el-table-column label="支付时间" prop="p_Time_End" width="150"></el-table-column>
              <el-table-column label="是否退款" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.o_TotlePrice !== 0" type="warning">部分退款</el-tag>
                  <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.o_TotlePrice === 0" type="danger">全额退款</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="餐桌" prop="t_Name"></el-table-column>
              <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
              <el-table-column label="用餐人数" prop="o_NumberOfDiners" width="70"></el-table-column>
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
        O_UniqSearchID: '',
        U_OpenId: '',
        TabId: '',
        TabTypeId: '',
        TransactionId: '',
        OutTradeNo: '',
        PayStartTime: '',
        PatEndTime: '',

        pagenum: 1,
        pagesize: 10,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      tabAndTabTypeOptions: [],
      cascaderModel: [],
      payFormList: [],
      total: 0
    }
  },
  computed: {
  },
  created () {
    this.getTabAndTabTypeOptions()
    this.getPayFormList()
  },
  mounted () {
  },
  methods: {
    // 监听pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewPayFormList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getPayFormList()
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
    async getTabAndTabTypeOptions () {
      const { data: res } = await this.$http.post('ordersTabAndTabTypeOptions', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌数据失败!')
        return
      }
      this.tabAndTabTypeOptions = res.data.ordersTabAndTabTypeOptions
    },
    searchPayFormList () {
      this.getNewPayFormList()
    },
    async getPayFormList () {
      const { data: res } = await this.$http.post('getPayFormList', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取支付记录数据失败!')
        return
      }
      this.payFormList = res.data.payFormList
      this.total = res.data.total
    },
    getNewPayFormList () {
      this.queryInfo.pagenum = 1
      this.getPayFormList()
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
.PayRecordElRow {
  /deep/ .el-input__inner {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
