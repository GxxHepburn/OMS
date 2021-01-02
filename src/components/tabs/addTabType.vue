<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <!-- 内容主体区 -->
          <el-form :model="tabTypeForm" :rules="tabtypeFormRules" ref="tabtypeFormRef" label-width="200px">
            <el-form-item label="分类名称" prop='TT_Name'>
              <el-input placeholder="请输入分类名称" v-model="tabTypeForm.TT_Name" @blur="tabTypeForm.TT_Name = tabTypeForm.TT_Name.trim()"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="addTTButton" type="primary" @click="addTT">添 加</el-button>
              <el-button class="resetTTButton" type="info" @click="resetTT">重 置</el-button>
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
      tabTypeForm: {
        TT_Name: ''
      },
      tabtypeFormRules: {
        TT_Name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '分类名长度在1~10个字符之间' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    addTT () {
      this.$refs.tabtypeFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        this.tabTypeForm.mmngctUserName = window.sessionStorage.mmngctUserName
        this.realAddTT()
      })
    },
    // 真正的数据请求
    async realAddTT () {
      const { data: res } = await this.$http.post('addTT', this.tabTypeForm)

      if (res.meta.status !== 200) {
        this.$message.error('添加分类失败')
        // 清空对话相关数据
        this.resetTT()
        return
      }
      // 修改成功，关闭对话框，刷数据列表
      this.$message.success('添加分类成功')
      this.resetTT()
    },
    resetTT () {
      this.$refs.tabtypeFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.addTTButton, .resetTTButton {
  width: 150px;
}
.el-form {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>
