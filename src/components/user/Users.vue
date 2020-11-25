<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
          <!-- 搜索与添加区域 -->
          <el-row :gutter="20">
            <el-col :span="7">
              <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getSearchUserList" @keyup.enter.native="getSearchUserList">
                <el-button slot="append" icon="el-icon-search" @click="getSearchUserList"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 用户列表区 -->
          <el-table :data='userlist' :border="true" :stripe="true">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Code" prop="U_ID"></el-table-column>
            <el-table-column label="检索ID" prop="U_OpenId"></el-table-column>
            <el-table-column label="注册时间" prop="U_RegisterTime"></el-table-column>
            <el-table-column label="最后登陆时间" prop="U_LoginTime"></el-table-column>
            <el-table-column label="最近下单时间" prop="O_OrderingTime"></el-table-column>
            <el-table-column width="180px" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看订单" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-s-order" size="mini" @click="getUserOrderList(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
        <!-- 分配角色对话框 -->
        <el-dialog title="用户订单" :visible.sync="userOrderListDialogVisible" width="50%" @close="userOrderListClosed">
           <!-- 底部区 -->
           <div>
             <el-card>
               <el-table :data='userOrdersList' :border="true" :stripe="true" height="500" @expand-change="orderDetailExpand" :row-key="getRowKeys" :expand-row-keys="expands" :row-class-name="tableRowClassName">
                 <el-table-column type="expand">
                   <template slot-scope="scope">
                    <el-form label-position="left" class="orderDetail-table-expand">
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
                 <el-table-column label="金额 (元)" prop="O_TotlePrice"></el-table-column>
                 <el-table-column label="支付状态">
                   <!-- 修改成tag -->
                   <template slot-scope="scope">
                     <el-tag :type="scope.row.O_PayStatue === 1 ? '' : 'danger'">{{scope.row.O_PayStatue === 1 ? '已支付' : '未支付'}}</el-tag>
                   </template>
                 </el-table-column>
                 <el-table-column label="下单时间" prop="O_OrderingTime" width="140"></el-table-column>
                 <el-table-column label="支付时间" prop="O_PayTime" width="140"></el-table-column>
               </el-table>
             </el-card>
           </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 2,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      userlist: [],
      total: 0,
      // 控制用户订单列表对话框的显示与隐藏
      userOrderListDialogVisible: false,
      // 需要查询订单的用户信息
      userInfo: {},
      // 用户的订单列表
      userOrdersList: [],
      // 请求参数
      orderDetailParams: {
        O_ID: 0
      },
      // 确保唯一expand
      expands: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
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
      this.$set(this.userOrdersList[index], 'orderDetail', res.data)
    },
    returnhome () {
      this.bus.$emit('rehome')
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户列表失败')
        return
      }
      // 处理时间
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getSearchUserList()
    },
    // 监听 页码 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 获取搜索框-先重置到首页
    getSearchUserList () {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 展示分配角色的对话框
    async getUserOrderList (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前,获取该用户所有订单的列表
      const { data: res } = await this.$http.post('userOrdersList', this.userInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取该用户订单列表失败')
        return
      }
      this.userOrdersList = res.data
      this.userOrderListDialogVisible = true
    },
    // 监听分配角色对话框的关闭事件
    userOrderListClosed () {
      this.userInfo = ''
      this.userOrdersList = []
      this.orderDetailParams.O_ID = 0
    }
  }
}
</script>

<style lang="less" scoped>
.propertySpan {
  display: inline-block;
  padding-right: 10px;
}
.orderDetail-table-expand {
  /deep/ .el-form-item__label {
    color: #F56C6C;
    font-size: 20px;
    font-weight: bold;
  }
  /deep/ .remarksSpan {
    color: #99a9bf;
  }
}
</style>
