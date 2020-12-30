<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }" @click.native="returnhome">首页</el-breadcrumb-item>
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
                      <div id="qrcode" ref="qr"></div>
                      <el-button type="primary" size="mini" @click="downloadQrcode(scope.row)">下 载</el-button>
                  </div>
                  <el-button slot="reference" type="primary" size="mini" @click="qrCode(scope.row)">查 看</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
                <template slot-scope="">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
      tabslist: [],
      total: 0,
      m_ID: '',
      code: null,
      qrCodeImgSrc: null
    }
  },
  created () {
    this.getTabsList()
  },
  methods: {
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
        if (this.code != null) {
          this.code.clear()
        }
        document.getElementById('qrcode').innerHTML = ''
        var qrcode = new this.QRCode('qrcode', {
          width: 150,
          height: 150,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
        qrcode.makeCode('https://www.donghuastar.com/wechat/scan?res=' + this.m_ID + '&table=' + item.t_ID)
        this.code = qrcode
        this.qrCodeImgSrc = document.getElementById('qrcode').getElementsByTagName('canvas')[0].toDataURL('image/png')
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
#qrcode {
  /deep/ img {
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>
