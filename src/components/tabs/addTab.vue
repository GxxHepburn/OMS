<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加餐桌</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <!-- 内容主体区 -->
          <el-form :model="tabForm" :rules="tabFormRules" ref="tabFormRef" label-width="200px">
            <el-form-item label="分类名称" prop='t_Name'>
              <el-input placeholder="请输入餐桌名称" v-model="tabForm.t_Name" @blur="tabForm.t_Name = tabForm.t_Name.trim()"></el-input>
            </el-form-item>
            <el-form-item label="用餐人数" prop='t_PeopleOfDiners'>
              <el-input placeholder="请输入餐桌分类名称" v-model="tabForm.t_PeopleOfDiners"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="t_TTID">
              <el-select v-model="tabForm.t_TTID" placeholder="请选择">
                <el-option
                  v-for="item in tabtypesList"
                  :key="item.TT_ID"
                  :label="item.TT_Name"
                  :value="item.TT_ID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="addTabButton" type="primary" @click="addTab">添 加</el-button>
              <el-button class="resetTabButton" type="info" @click="resetTab">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        mmngctUserName: window.sessionStorage.mmngctUserName
      },
      tabForm: {
        t_Name: '',
        t_PeopleOfDiners: '',
        t_TTID: ''
      },
      tabFormRules: {
        t_Name: [
          { required: true, message: '请输入商品名' },
          { min: 1, max: 10, message: '餐桌名长度在1~10个字符之间' }
        ],
        t_PeopleOfDiners: [
          { required: true, message: '请输入用餐人数' },
          { pattern: /^[1-9]$|(^[1-2][0-9]$)/, message: '请输入正确的用餐人数' }
        ],
        t_TTID: [
          { required: true, message: '请选择餐桌分类' }
        ]
      },
      tabtypesList: []
    }
  },
  created () {
    this.getTabType()
  },
  methods: {
    addTab () {
      this.$refs.tabFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.tabForm.mmngctUserName = window.sessionStorage.mmngctUserName
        this.realAddTab()
      })
    },
    // 真正的数据请求
    async realAddTab () {
      const { data: res } = await this.$http.post('addTab', this.tabForm)
      if (res.meta.status !== 200) {
        this.$message.error('添加餐桌失败')
        // 清空对话相关数据
        this.resetTab()
        return
      }
      // 修改成功，关闭对话框，刷数据列表
      this.$message.success('添餐桌成功')
      this.resetTab()
    },
    resetTab () {
      this.$refs.tabFormRef.resetFields()
    },
    // 获取餐桌分类列表
    async getTabType () {
      const { data: res } = await this.$http.post('tabtypes', this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取餐桌分类失败!')
        return
      }
      this.tabtypesList = res.data.tabtypes
    }
  }
}
</script>

<style lang="less" scoped>
.addTabButton, .resetTabButton {
  width: 150px;
}
</style>
