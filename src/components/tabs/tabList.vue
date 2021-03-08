<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输餐桌名称（支持模糊查询)"
              v-model="queryInfo.query" :clearable="true"
              @clear="getNewTabsList" @keyup.enter.native="getNewTabsList">
                  <el-button slot="append" icon="el-icon-search" @click="getNewTabsList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="goAddpage">添加餐桌</el-button>
            </el-col>
          </el-row>

          <!-- table 表格区域 -->
          <el-table :data="tabslist" :border="true" :stripe="true">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="餐桌名称" prop="t_Name"></el-table-column>
            <el-table-column label="用餐人数" prop="t_PeopleOfDiners"></el-table-column>
            <el-table-column label="所属分类" prop="TT_Name"></el-table-column>
            <el-table-column label="餐桌二维码">
              <template slot-scope="scope">
                <el-popover placement="left" width="220">
                  <div style="text-align: center">
                      <div class='qrcode' :id="'qrcode' + scope.row.t_ID"></div>
                      <el-button type="primary" size="mini" @click="downloadQrcode(scope.row)">下 载</el-button>
                  </div>
                  <el-button slot="reference" type="primary" size="mini" @click="qrCode(scope.row)">查 看</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
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

          <!-- 修改商品对话框 -->
            <el-dialog title="修改餐桌信息" :visible.sync="editDialogVidsible" @close="editDialogClosed" class="editDialog">
              <!-- 内容主体区 -->
              <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="200px">
                <el-form-item label="餐桌名称" prop='t_Name'>
                  <el-input placeholder="请输入餐桌名称" v-model="editForm.t_Name" @blur="editForm.t_Name = editForm.t_Name.trim()"></el-input>
                </el-form-item>
                <el-form-item label="用餐人数" prop='t_PeopleOfDiners'>
                  <el-input placeholder="请输入用餐人数" v-model="editForm.t_PeopleOfDiners"></el-input>
                </el-form-item>
                <el-form-item label="所属分类">
                  <el-select v-model="editForm.t_TTID" placeholder="请选择">
                    <el-option
                      v-for="item in tabtypesList"
                      :key="item.TT_ID"
                      :label="item.TT_Name"
                      :value="item.TT_ID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <!-- 底部区 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVidsible = false">取 消</el-button>
                <el-button type="primary" @click="editTab">确 定</el-button>
              </span>
            </el-dialog>
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
      tabslist: [],
      total: 0,
      m_ID: '',
      code: '',
      qrCodeImgSrc: '',
      editDialogVidsible: false,
      editForm: {},
      editFormRules: {
        t_Name: [
          { required: true, message: '请输入商品名' },
          { min: 1, max: 10, message: '餐桌名长度在1~10个字符之间' }
        ],
        t_PeopleOfDiners: [
          { required: true, message: '请输入用餐人数' },
          { pattern: /^[1-9]$|(^[1-2][0-9]$)/, message: '请输入正确的用餐人数' }
        ]
      },
      tabtypesList: []
    }
  },
  created () {
    this.getTabsList()
  },
  methods: {
    // 修改餐桌信息并提交
    editTab () {
      this.$refs.editFormRef.validate(async valid => {
        // 验证验证规则
        if (!valid) {
          return
        }
        this.realEditTab()
      })
    },
    // 真正的数据请求
    async realEditTab () {
      const { data: res } = await this.$http.post('editTab', this.editForm)
      if (res.meta.status !== 200) {
        this.$message.error('修改餐桌信息失败')
        this.catesList = []
        // 重新请求food列表
        this.getTabsList()
        // 关闭对话框,返回food列表界面
        this.editDialogVidsible = false
        return
      }
      // 修改成功，关闭对话框，刷数据列表
      this.$message.success('修改餐桌信息成功')
      this.catesList = []
      this.getTabsList()
      this.editDialogVidsible = false
    },
    // 获取餐桌分类列表
    async getTabType () {
      const { data: res } = await this.$http.post('tabtypes', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌分类失败!')
        return
      }
      this.tabtypesList = res.data.tabtypes
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.tabtypesList = []
    },
    // 展示editDialog
    showEditDialog (tabItem) {
      // 深度拷贝
      this.editForm = JSON.parse(JSON.stringify(tabItem))
      this.getTabType()
      this.editDialogVidsible = true
    },
    // 删除餐桌
    async removeById (tabItem) {
      const confirmResult = await this.$confirm('此操作将永久删除该餐桌,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: ' 取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除!')
        return
      }
      const { data: res } = await this.$http.post('deleteTab', tabItem)
      if (res.meta.status !== 200) {
        this.$message.error('删除餐桌失败!')
        return
      }
      this.$message.success('删除成功!')
      this.getNewTabsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getTabsList()
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getNewTabsList()
    },
    // 下载二维码
    downloadQrcode (row) {
      var link = document.createElement('a')
      // 下载图名字
      link.download = 'TableType_' + row.TT_Name + '_Table_' + row.t_Name
      // url
      link.href = this.qrCodeImgSrc
      // 合成函数，执行下载
      link.click()
      this.qrCodeImgSrc = ''
    },
    // 生成二维码
    qrCode (item) {
      this.$nextTick(function () {
        if (this.code != null && this.code !== '') {
          this.code.clear()
        }
        document.getElementById('qrcode' + item.t_ID).innerHTML = ''
        var qrcode = new this.QRCode('qrcode' + item.t_ID, {
          width: 150,
          height: 150,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
        qrcode.makeCode('https://www.donghuastar.com/wechat/scan?res=' + this.m_ID + '&table=' + item.t_ID)
        this.code = qrcode
        this.qrCodeImgSrc = document.getElementById('qrcode' + item.t_ID).getElementsByTagName('canvas')[0].toDataURL('image/png')
      })
    },
    // 获取餐桌列表
    async getTabsList () {
      const { data: res } = await this.$http.post('tabs', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌数据失败!')
        return
      }
      this.tabslist = res.data.tabs
      this.total = res.data.total
      this.m_ID = res.data.m_ID
    },
    getNewTabsList () {
      this.queryInfo.pagenum = 1
      this.getTabsList()
    },
    goAddpage () {
      this.$router.push('/static/addTab')
    }
  }
}
</script>

<style lang="less" scoped>
.qrcode {
  /deep/ img {
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>
