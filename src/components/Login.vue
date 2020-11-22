<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" label-width="0px"
                class="login_form" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
          // { min: 11, max: 11, message: '手机号码必须为11位', trigger: 'blur' },
          // { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        // 验证秘法是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登陆表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            this.$message.error('请输入正确的用户名和密码！')
            return
          }
          this.$message.success('登陆成功')
          // 1. 将登陆之后的 token，保存到客户端的 sessionStorage 中
          //  1.1 项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
          //  1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
          window.sessionStorage.setItem('token', res.data.token)
          // 登陆成功后，保存管理者用户名，也就是唯一的电话号码
          window.sessionStorage.setItem('mmngctUserName', this.loginForm.username)
          // 2. 通过编程式导航跳转到后台主页， 路由地址是 /home
          this.$router.push('/static/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box{
            height: 130px;
            width: 130px;
            border: solid 1px #eeeeee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #dddddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eeeeee;
            }
        }
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>
