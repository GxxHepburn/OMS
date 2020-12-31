<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
          <el-row :gutter="20">
              <el-col :span="8">
                  <el-input placeholder="请输商品分类名称（支持模糊查询)" v-model="queryInfo.query" :clearable="true"
                  @clear="getNewCatesList" @keyup.enter.native="getNewCatesList">
                      <el-button slot="append" icon="el-icon-search" @click="getNewCatesList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="goAddpage">添加分类</el-button>
              </el-col>
          </el-row>

          <!-- table 表格区域 -->
          <el-table :data="catesList" :border="true" :stripe="true" @cell-dblclick="changeFTName">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="分类名称 （双击修改)" prop="FT_Name">
              <template slot-scope="scope">
                  <el-input v-if="scope.row.inputVisible"
                    v-model="FT_Name"
                    :placeholder="scope.row.FT_Name"
                    @keyup.enter.native="$event.target.blur"
                    @blur="handleFTNameInput(scope.row)"
                    ref="changeFTNameInputRef"></el-input>
                  <span v-else>{{scope.row.FT_Name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="分类是否为空" prop="IsCateNull">
              <template slot-scope="scope">
                <el-tag type="success" size="mini" v-if="scope.row.IsCateNull">空</el-tag>
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
      catesList: [],
      total: 0,
      FT_Name: ''
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    async handleFTNameInput (item) {
      // 判断是否需要发送网络请求
      if (this.FT_Name !== '') {
        // 发送请求，修改FTName
        var copyItem = JSON.parse(JSON.stringify(item))
        copyItem.copyFTName = this.FT_Name
        const { data: res } = await this.$http.post('changeFTName', copyItem)
        if (res.meta.status !== 200) {
          this.$message.error('修改分类名称失败!')
          item.inputVisible = false
          this.FT_Name = ''
          return
        }
        item.FT_Name = this.FT_Name
        // 没有必要刷新一次网络请求
        // this.getNewCatesList()
        this.$message.success('修改分类名称成功!')
      }
      item.inputVisible = false
      this.FT_Name = ''
    },
    // 双击修改FTName
    changeFTName (row, colunm, cell, event) {
      if (colunm.property === 'FT_Name' && !row.inputVisible) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.changeFTNameInputRef.focus()
        })
      }
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewCatesList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatesList()
    },
    async removeById (cateItem) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类及该分类下商品,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除!')
        return
      }
      const { data: res } = await this.$http.post('deleteCate', cateItem)
      if (res.meta.status !== 200) {
        this.$message.error('删除商品分类失败!')
        return
      }
      this.$message.success('删除成功!')
      this.getNewCatesList()
    },
    getNewCatesList () {
      this.queryInfo.pagenum = 1
      this.getCatesList()
    },
    async getCatesList () {
      const { data: res } = await this.$http.post('searchCates', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取分类数据失败!')
        return
      }
      this.catesList = res.data.cates
      this.total = res.data.total
      for (var i in this.catesList) {
        this.$set(this.catesList[i], 'inputVisible', false)
      }
    },
    goAddpage () {
      this.$router.push('/static/addCategories')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
