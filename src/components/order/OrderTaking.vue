<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>接单列表</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 卡片视图 -->
        <el-card class="topElCard">
          <el-divider content-position="left">店铺操作</el-divider>
          <el-row :gutter="0" type="flex">
            <el-col :xl="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="danger" @click="openWs">上线接单</el-button>
            </el-col>
            <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="warning" @click="closeWs">下线休息</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="voicePro" type="info" size="mini" plain>语音测试</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="sendMsg" type="info" size="mini" plain>连接测试</el-button>
            </el-col>
          </el-row>
        </el-card>

        <!-- 卡片视图 -->
        <el-card class="bottomElCard">
          <!-- table 表格区域 -->
          <el-table :data="notTakingOrerAddFormList" :border="true" :stripe="true">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="检索 ID" prop="o_UniqSearchID" width="210"></el-table-column>
              <el-table-column label="餐桌" prop="t_Name"></el-table-column>
              <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
              <el-table-column label="用餐人数" prop="o_NumberOfDiners"></el-table-column>
              <el-table-column label="金额 (元)" prop="OA_TotlePrice"></el-table-column>
              <el-table-column label="支付状态"   width="100">
                <!-- 修改成tag -->
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.o_PayStatue == 0" type="danger">未支付</el-tag>
                  <el-tag v-if="scope.row.o_PayStatue == 1" type="primary">已完成</el-tag>
                  <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.OA_TotlePrice == 0" type="warning">全额退款</el-tag>
                  <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.OA_TotlePrice != 0" type="warning">部分退款</el-tag>
                  <el-tag v-if="scope.row.o_PayStatue == 3" type="info">未完成</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="下单时间" prop="OA_OrderingTime" width="140"></el-table-column>
              <el-table-column label="支付时间" prop="o_PayTime" width="140"></el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    title="客人备注"
                    width="200"
                    trigger="click"
                    :content="scope.row.o_Remarks==''?'客人没有特殊要求':scope.row.o_Remarks">
                    <el-button size="mini" type="info" slot="reference" plain>备注</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="订单类型" min-width="110">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.OA_Sort==1" type="warning" style="font-weight:bold;">初次下单</el-tag>
                  <el-tag v-if="scope.row.OA_Sort!=1" type="danger" style="font-weight:bold;">再次加菜</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="接单状态">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.OA_IsTaking"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                    :disabled="scope.row.OA_IsTaking==0?false:true"
                    @change="takingOrder($event, scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-setting" size="mini" @click="orderSettingButtonClick(scope.row)"></el-button>
                </template>
              </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" :background="true">
          </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      notTakingOrerAddFormList: [],
      total: 0
    }
  },
  computed: {
  },
  created () {
    this.getNotTakingOrderAddFormList()
  },
  mounted () {
    window.$bus.$on('updateOrderTaking', (val) => {
      this.getNewNotTakingOrderAddFormList()
    })
  },
  methods: {
    // 订单操作按钮
    orderSettingButtonClick (row) {
      this.$router.push({
        path: '/static/orderItemSetting',
        query: {
          O_ID: row.o_ID
        }
      })
    },
    // 接单
    async takingOrder (event, item) {
      const { data: res } = await this.$http.post('takingOrder', item)
      if (res.meta.status !== 200) {
        this.$message.error('接单失败!')
        this.getNotTakingOrderAddFormList()
        return
      }
      this.$message.success('接单成功!')
      this.getNotTakingOrderAddFormList()
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewNotTakingOrderAddFormList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getNotTakingOrderAddFormList()
    },
    // 获取新的未结单列表
    getNewNotTakingOrderAddFormList () {
      this.queryInfo.pagenum = 1
      this.getNotTakingOrderAddFormList()
    },
    // 获取未结单列表
    async getNotTakingOrderAddFormList () {
      const { data: res } = await this.$http.post('notTakingOrerAddFormList', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取新订单数据失败!')
        return
      }
      this.notTakingOrerAddFormList = res.data.notTakingOrerAddFormList
      this.total = res.data.totle
    },
    // 发送测试
    sendMsg () {
      var testMsg = {
        type: 3
      }
      if (window.wbss !== undefined && window.wbss.readyState === 1) {
        window.wbss.send(JSON.stringify(testMsg))
        this.$message.info('测试: 已发送数据')
      } else {
        this.$message.error('测试: 服务器未连接')
      }
    },
    // 语音测试
    voicePro () {
      this.$voicePromptFun.voicePrompt('正在测试')
      this.$voicePromptFun.voicePrompt('串行播放,正常')
    },
    // 上线接单
    openWs () {
      if (window.wbss !== undefined && window.wbss.readyState !== 1) {
        this.$message.info('正在连接服务器')
      }
      this.$connectWebSocket.openWebSocket()
      window.sessionStorage.setItem('isNeedToConnectWebSocket', 1)
    },
    // 下线休息
    closeWs () {
      if (window.wbss === undefined) {
        this.$message.error('websocket不存在')
        return
      }
      // if (window.wbss.readyState !== 1) {
      //   this.$message.error('websocket未连接,请不要重复关闭')
      //   return
      // }

      window.sessionStorage.setItem('isNeedToConnectWebSocket', 0)
      window.wbss.close()
    }
  }
}
</script>

<style lang="less" scoped>
.bottomElCard {
  margin-top: 30px;
}
.topElCard {
  padding-bottom: 20px;
}
</style>
