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
            <el-col :span="4">
              <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
          </el-row>
          <!-- 用户列表区 -->
          <el-table :data='userlist' :border="true" :stripe="true">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column width="180px" label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
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
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVidsible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
              <el-form-item label="用户名">
                <el-input v-model="editForm.username" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop='email'>
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop='mobile'>
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
           <!-- 底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVidsible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
           <!-- 底部区 -->
           <div>
             <p>当前的用户: {{userInfo.username}}</p>
             <p>当前的用户: {{userInfo.role_name}}</p>
             <p>分配新角色:
               <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
             </p>
           </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
          </span>
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
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~15字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址类型', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVidsible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址类型', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    returnhome () {
      this.bus.$emit('rehome')
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取用户列表失败')
        return
      }
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
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('更新用户状态失败')
        return
      }
      this.$message.success('更新用户状态成功')
    },
    // 获取搜索框-先重置到首页
    getSearchUserList () {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 可以发起添加用户的网路请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
          return
        }
        this.$message.success('添加用户成功!')
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getSearchUserList()
        this.$message.success('添加用户成功!')
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败!')
        return
      }
      this.editForm = res.data
      this.editDialogVidsible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败')
          return
        }
        // 关闭对话框
        this.editDialogVidsible = false
        // 刷新数据列表
        this.getSearchUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功!')
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById (id) {
      // 弹框询问是否删除用户
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除,则返回值为字符串 confirm
      // 如果用户取消了删除,则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除!')
        return
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败!')
        return
      }
      this.$message.success('删除用户成功!')
      this.getSearchUserList()
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前,获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
        return
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮,分配角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择要分配的角色!')
        return
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        this.$message.error('分配角色失败!')
        return
      }
      this.$message.success('分配角色成功!')
      this.getSearchUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
