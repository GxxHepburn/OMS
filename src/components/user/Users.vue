<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
          <!-- 搜索与添加区域 -->
          <el-row :gutter="20">
            <el-col :span="7">
              <el-input placeholder="请输入检索ID前几位" v-model="queryInfo.query" :clearable="true" @clear="getSearchUserList" @keyup.enter.native="getSearchUserList">
                <el-button slot="append" icon="el-icon-search" @click="getSearchUserList"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <!-- 用户列表区 -->
          <el-table :data='userlist' :border="true" :stripe="true">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Code" prop="U_ID"></el-table-column>
            <el-table-column label="检索ID" prop="U_OpenId" width="400px"></el-table-column>
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
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
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
    // 跳转到订单列表
    getUserOrderList (row) {
      // 带参数跳转到订单列表页面
      this.$router.push({
        path: '/static/orders',
        name: 'Order',
        params: {
          U_OpenId: row.U_OpenId
        }
      })
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
