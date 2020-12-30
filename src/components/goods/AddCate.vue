<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 内容主体区 -->
      <el-form :model="cateForm" :rules="cateFormRules" ref="cateFormRef" label-width="200px">
        <el-form-item label="分类名称" prop='FT_Name'>
          <el-input placeholder="请输入分类名称" v-model="cateForm.FT_Name" @blur="cateForm.FT_Name = cateForm.FT_Name.trim()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="addFTButton" type="primary" @click="addFT">添 加</el-button>
          <el-button class="resetFTButton" type="info" @click="resetFT">重 置</el-button>
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
      cateForm: {
        FT_Name: ''
      },
      cateFormRules: {
        FT_Name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '分类名长度在1~10个字符之间' }
        ]
      }
    }
  },
  methods: {
    resetFT () {
      this.$refs.cateFormRef.resetFields()
    },
    addFT () {
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.cateForm.mmngctUserName = window.sessionStorage.mmngctUserName
        this.realAddFT()
      })
    },
    // 真正的数据请求
    async realAddFT () {
      const { data: res } = await this.$http.post('addFT', this.cateForm)

      if (res.meta.status !== 200) {
        this.$message.error('添加分类失败')
        // 清空对话相关数据
        this.resetFT()
        return
      }
      // 修改成功，关闭对话框，刷数据列表
      this.$message.success('添加分类成功')
      this.resetFT()
    }
  }
}
</script>

<style lang="less" scoped>
.addFTButton, .resetFTButton {
  width: 150px;
}
.el-form {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
