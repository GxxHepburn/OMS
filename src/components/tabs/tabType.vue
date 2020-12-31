<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-row :gutter="20">
              <el-col :span="8">
                  <el-input placeholder="请输餐桌分类名称（支持模糊查询)" v-model="queryInfo.query" :clearable="true"
                  @clear="getNewTabTypesList" @keyup.enter.native="getNewTabTypesList">
                      <el-button slot="append" icon="el-icon-search" @click="getNewTabTypesList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="goAddpage">添加分类</el-button>
              </el-col>
          </el-row>

          <!-- table 表格区域 -->
          <el-table :data="tabTypesList" :border="true" :stripe="true" @cell-dblclick="changeTTName">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="分类名称 （双击修改)" prop="TT_Name">
              <template slot-scope="scope">
                  <el-input v-if="scope.row.inputVisible"
                    v-model="TT_Name"
                    :placeholder="scope.row.TT_Name"
                    @keyup.enter.native="$event.target.blur"
                    @blur="handleTTNameInput(scope.row)"
                    ref="changeTTNameInputRef"></el-input>
                  <span v-else>{{scope.row.TT_Name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="分类是否为空" prop="IsTabTypeNull">
              <template slot-scope="scope">
                <el-tag type="success" size="mini" v-if="scope.row.IsTabTypeNull">空</el-tag>
                <el-tag type="danger" v-else>不为空</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90px">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row)"></el-button>
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
        query: '',
        pagenum: 1,
        pagesize: 10,
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      tabTypesList: [],
      total: 0,
      TT_Name: ''
    }
  },
  created () {
    this.getTabTypesList()
  },
  methods: {
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewTabTypesList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getTabTypesList()
    },
    async removeById (tabTypeItem) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类及该分类下餐桌,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除!')
        return
      }
      const { data: res } = await this.$http.post('deleteTabType', tabTypeItem)
      if (res.meta.status !== 200) {
        this.$message.error('删除餐桌分类失败!')
        return
      }
      this.$message.success('删除成功!')
      this.getNewTabTypesList()
    },
    async handleTTNameInput (item) {
      // 判断是否需要发送网络请求
      if (this.TT_Name !== '') {
        // 发送请求，修改FTName
        var copyItem = JSON.parse(JSON.stringify(item))
        copyItem.copyTTName = this.TT_Name
        const { data: res } = await this.$http.post('changeTTName', copyItem)
        if (res.meta.status !== 200) {
          this.$message.error('修改分类名称失败!')
          item.inputVisible = false
          this.TT_Name = ''
          return
        }
        item.TT_Name = this.TT_Name
        this.$message.success('修改分类名称成功!')
      }

      item.inputVisible = false
      this.TT_Name = ''
    },
    changeTTName (row, colunm, cell, event) {
      if (colunm.property === 'TT_Name' && !row.inputVisible) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.changeTTNameInputRef.focus()
        })
      }
    },
    getNewTabTypesList () {
      this.queryInfo.pagenum = 1
      this.getTabTypesList()
    },
    async getTabTypesList () {
      const { data: res } = await this.$http.post('searchTabTypes', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌分类数据失败!')
        return
      }
      this.tabTypesList = res.data.tabtypes
      this.total = res.data.total
      for (var i in this.tabTypesList) {
        this.$set(this.tabTypesList[i], 'inputVisible', false)
      }
    },
    goAddpage () {
      this.$router.push('/static/addTabType')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
