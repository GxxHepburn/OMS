<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/static/orders' }">订单列表</el-breadcrumb-item>
          <el-breadcrumb-item>订单操作</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-divider content-position="left">当前订单状态</el-divider>

          <el-row :gutter="20">
            <el-col :span="2">
              <el-tag v-if="O_PayStatue == 0" type="danger" effect="dark">未 支 付</el-tag>
              <el-tag v-if="O_PayStatue == 1" type="primary" effect="dark">已 完 成</el-tag>
              <el-tag v-if="O_PayStatue == 2" type="warning" effect="dark">退 款</el-tag>
              <el-tag v-if="O_PayStatue == 3" type="info" effect="dark">未 完 成</el-tag>
            </el-col>
          </el-row>

          <el-divider content-position="left">订单操作区域</el-divider>

          <el-row :gutter="20">
            <el-col :span="2">
              <el-button type="primary" v-print="'#printTest'">打印小票</el-button>
            </el-col>
            <el-col :span="2.1">
              <el-button :disabled="OrderFiDisAble" type="warning">订单支付完成</el-button>
            </el-col>
            <el-col :span="2">
              <el-button :disabled="OrderNotFiDisAble" type="warning">订单未完成</el-button>
            </el-col>
            <el-col :span="3">
              <el-button :disabled="OrderReturnDisAble" type="danger">退 款</el-button>
            </el-col>
          </el-row>

          <el-divider content-position="left">订单详情</el-divider>

          <el-table :data="orderDetailForm" :border="false" :stripe="false">
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
            <el-table-column label="实际数量 (份)" prop="OD_RealNum"></el-table-column>
            <el-table-column label="下单数量 (份)" prop="num"></el-table-column>
            <el-table-column label="退点数量 (份)">
              <template slot-scope="OD_Item">
                <span v-if="OD_Item.row.num - OD_Item.row.OD_RealNum == 0">0</span>
                <el-tag v-else type="danger">{{OD_Item.row.num - OD_Item.row.OD_RealNum}}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div id="printTest" >
            <p>锄禾日当午</p>
            <p>汗滴禾下土 </p>
            <p>谁知盘中餐</p>
            <p>粒粒皆辛苦</p>
          </div>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      O_ID: '',
      orderDetailForm: [],
      returnTotlePrice: '',
      O_PayStatue: '',
      OrderFiDisAble: true,
      OrderNotFiDisAble: true,
      OrderReturnDisAble: true
    }
  },
  computed: {
  },
  created () {
    this.initOrderDetailForm()
  },
  methods: {
    // 打印小票
    printSmallTicket () {},
    // 初始化订单操作界面数据
    async initOrderDetailForm () {
      this.O_ID = this.$route.query.O_ID
      this.O_PayStatue = this.$route.query.O_PayStatue
      if (this.O_PayStatue === '0') {
        // 未完成
        this.OrderNotFiDisAble = false
        // 已完成
        this.OrderFiDisAble = false
      } else if (this.O_PayStatue === '1') {
        // 退款
        this.OrderReturnDisAble = false
      } else if (this.O_PayStatue === '2') {
        // 退款
        this.OrderReturnDisAble = false
      }

      const { data: res } = await this.$http.post('orderDetails', { O_ID: this.O_ID })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单信息失败')
        return
      }
      this.orderDetailForm = res.data
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
  .el-col {
    border-radius: 4px;
    margin-right: 30px;
  }
</style>
