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
          <el-divider content-position="left">订单信息</el-divider>

          <el-table :data='[orderForm]'>
            <el-table-column label="检索 ID" prop="o_UniqSearchID" width="210"></el-table-column>
            <el-table-column label="餐桌" prop="t_Name"></el-table-column>
            <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
            <el-table-column label="用餐人数" prop="o_NumberOfDiners"></el-table-column>
            <el-table-column label="金额 (元)" prop="o_TotlePrice"></el-table-column>
            <el-table-column label="支付状态">
              <!-- 修改成tag -->
              <template slot-scope="scope">
                <el-tag v-if="scope.row.o_PayStatue == 0" type="danger">未支付</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 1" type="primary">已完成</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.O_TotlePrice == 0" type="warning">全额退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.O_TotlePrice != 0" type="warning">部分退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 3" type="info">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="o_OrderingTime" width="230"></el-table-column>
            <el-table-column label="支付时间" prop="o_PayTime" width="230"></el-table-column>
          </el-table>

          <el-divider content-position="left">订单操作区域</el-divider>

          <el-row :gutter="20">
            <el-col :span="3">
              <el-button type="primary" v-print="'#printST'">打印客人小票</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" v-print="'#printKT'">打印厨房餐票</el-button>
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
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">票据预览</el-divider>
          <div class="BillTicketWrapper">
            <div class="bill-preview">
              <h3>客人小票预览</h3>
              <div id="printST" class="detail">
                <p style="text-align:center;font-size:25px">客人小票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>****************商品****************</p>
                <div v-for="item in orderDetailForm" :key="item.id">
                  <p>
                    <label style="font-size:20px;">{{item.name}}</label><label style="font-size:17px;margin-left:10px;"><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em></label><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{item.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{item.price}}</label>
                  </p>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:100px;font-size:25px;">合计:</label><label style="font-size:25px;margin-left:20px;">￥{{orderForm.o_TotlePrice}}</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
              </div>
            </div>

            <div class="bill-preview">
              <h3>厨房餐票预览</h3>
              <div id="printKT" class="detail">
                <p style="text-align:center;font-size:25px">厨房餐票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <br/>
                <hr/><!-- 分割线 -->
                <p><label>单号:</label><label>100006032</label></p>
                <p><label>交易时间:</label><label>2021-01-09 13:29:23</label></p>
                <hr/><!-- 分割线 -->
                <div v-for="item in orderDetailForm" :key="item.id">
                  <p>
                    <label>{{item.name}}</label><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-right:30px;margin-left:120px">x{{item.OD_RealNum}}</label><label>￥{{item.price}}</label>
                  </p>
                </div>
                <hr/>
              </div>
            </div>
          </div>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      O_ID: '',
      orderForm: {},
      merForm: {},
      orderDetailForm: [],
      returnTotlePrice: '',
      O_PayStatue: '',
      OrderFiDisAble: true,
      OrderNotFiDisAble: true,
      OrderReturnDisAble: true,
      printObj: {
        id: 'printMe',
        popTitle: 'good print',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    }
  },
  computed: {
  },
  created () {
    this.initOrderDetailForm()
  },
  methods: {
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
        this.$message.error('获取订单详情失败')
        return
      }
      this.orderDetailForm = res.data

      const { data: res2 } = await this.$http.post('getOrderForm', { O_ID: this.O_ID })
      if (res2.meta.status !== 200) {
        this.$message.error('获取订单信息失败')
        return
      }
      this.orderForm = res2.data.orderForm
      this.merForm = res2.data.merForm
    }
  }
}
</script>

<style lang="less" scoped>
@page{
  size:  auto;   /* auto is the initial value */
  margin: 0;  /* this affects the margin in the printer settings */
}

html{
  background-color: #FFFFFF;
  margin: 0;  /* this affects the margin on the html before sending to printer */
}

body{
  border: solid 1px blue ;
  margin: 0 0 0 0; /* margin you want for the content */
}
.BillTicketWrapper {
  display: flex;
}
.detail {
  width: 270px;
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.ST_merName {
  text-align: center;
  font-size: 30px;
  font-weight: normal;
}
.bill-preview {
  h3 {
    margin-top: 0;
    margin-bottom: 0;

    height: 32px;
    line-height: 32px;
    background-color: #666;
    font-size: 14px;
    font-weight: normal;
    color: #fff;
    padding-left: 20px;
  }
  width:270px;
  margin-right: 100px;
}
.bottomElCard {
  margin-top: 30px;
}
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
