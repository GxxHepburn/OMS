<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>财务管理</el-breadcrumb-item>
          <el-breadcrumb-item>退款记录</el-breadcrumb-item>
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
                <el-input placeholder="商户退款单号" v-model="queryInfo.RefundOutTradeNo" :clearable="true">
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-input placeholder="退款单号" v-model="queryInfo.RefundTransactionId" :clearable="true">
                </el-input>
              </el-col>
          </el-row>
          <el-row :gutter="20" class="refundRecordElRow">
            <el-col :span="3">
              <el-cascader v-model="cascaderModel" :options="tabAndTabTypeOptions"
                  :props="{ checkStrictly: true }" clearable placeholder="请选择餐桌分类或餐桌"
                  @change="tabAndTabtypeCascaderChange"></el-cascader>
            </el-col>
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.RefundSubmitStartTime"
                type="datetime"
                placeholder="选择退款提交起始时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.RefundSubmitEndTime"
                type="datetime"
                placeholder="选择退款提交结束时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.RefundSuccessStartTime"
                type="datetime"
                placeholder="选择退款到账起始时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-date-picker
                v-model="queryInfo.RefundSuccessEndTime"
                type="datetime"
                placeholder="选择退款到账结束时间">
              </el-date-picker>
            </el-col>
            <el-col :span="3.5">
              <el-button type="primary" @click="searchPayFormList">搜索</el-button>
            </el-col>
          </el-row>

          <el-table :data='refundFormList'
             :border="true"
             :stripe="true">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="退款方式" width="70px">
                <template slot-scope="scope">
                  <span v-if="scope.row.r_Is_OfLine === 1">系统退款</span>
                  <span v-if="scope.row.r_Is_OfLine === 0">人工退款</span>
                </template>
              </el-table-column>
              <el-table-column label="退款单号" prop="r_Refund_Id" width="230px"></el-table-column>
              <el-table-column label="商户退款单号" prop="r_Out_Refund_No" width="245px"></el-table-column>
              <el-table-column label="退款金额">
                <template slot-scope="scope">
                  <span v-if="scope.row.r_Refund_Fee">{{scope.row.r_Refund_Fee/100}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" prop="r_Submit_Time" width="140px"></el-table-column>
              <el-table-column label="提交退款业务结果" width="120px">
                <template slot-scope="scope">
                  <span v-if="scope.row.r_Result_Code === 'SUCCESS'">退款申请接收成功</span>
                  <span v-if="scope.row.r_Result_Code === 'FAIL'">提交退款失败</span>
                </template>
              </el-table-column>
              <el-table-column label="退款到账时间" prop="r_Success_Time" width="140px"></el-table-column>
              <el-table-column label="退款结果" width="130px">
                <template slot-scope="scope">
                  <span v-if="scope.row.r_Refund_Status === 'SUCCESS'">退款成功(到账)</span>
                  <span v-if="scope.row.r_Refund_Status === 'CHANGE'">退款异常,转人工退款</span>
                  <span v-if="scope.row.r_Refund_Status === 'REFUNDCLOSE'">退款关闭</span>
                </template>
              </el-table-column>
              <el-table-column label="退款账户" prop="r_Refund_Recv_Account" width="110px"></el-table-column>
              <el-table-column label="餐桌" prop="t_Name"></el-table-column>
              <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
              <el-table-column label="用餐人数" prop="o_NumberOfDiners" width="70px"></el-table-column>
              <el-table-column label="操作" width="70px">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="订单信息" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-s-order" size="mini" @click="ordersInfoButtonClick(scope.row)"></el-button>
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
        O_UniqSearchID: '',
        U_OpenId: '',
        TabId: '',
        TabTypeId: '',
        RefundTransactionId: '',
        RefundOutTradeNo: '',
        RefundSubmitStartTime: '',
        RefundSubmitEndTime: '',
        RefundSuccessStartTime: '',
        RefundSuccessEndTime: '',

        pagenum: 1,
        pagesize: 10,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      tabAndTabTypeOptions: [],
      cascaderModel: [],
      refundFormList: [],
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
    // 跳转订单
    ordersInfoButtonClick (row) {
      // 带参数跳转到订单列表页面
      this.$router.push({
        path: '/static/orders',
        name: 'Order',
        params: {
          R_Refund_Id: row.r_Refund_Id
        }
      })
    },
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
      const { data: res } = await this.$http.post('getRefundRecordFormList', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取支付记录数据失败!')
        return
      }
      this.refundFormList = res.data.refundFormList
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
.refundRecordElRow {
  min-width: 1200px;
}
</style>
