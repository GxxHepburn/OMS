<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box" v-if="!checkDialogVisible">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" label-width="0px"
                class="login_form" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button class="changePWBtn" type="info" @click="changePW">忘记密码</el-button>
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog  :visible.sync="checkDialogVisible" :show-close="false" class="checkDialog" :center="true">
          <p class="checkDialogTips">您的账号已经绑定手机{{mmngct.MMA_Phone}},您需要通过短信验证码登陆账号</p>
          <el-form ref="checkFormRef" :model="checkForm" :rules="checkFormRules" class="checkDialogForm">
            <el-form-item label="手 机 号:">
              <span class="checkDialogPhoneSpan">{{mmngct.MMA_Phone}}</span>
            </el-form-item>
            <el-form-item prop="checkNum" label="验证码:">
              <el-input v-model="checkForm.checkNum"></el-input>
              <el-button class="getCheckNumButton" :disabled="checkDialogButtonDisalbe" type="primary" plain @click="getCheckNumButtonClick">{{checkNumButtonText}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="checkDialogConfirmButton" @click="realCheckNumButtonClick">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog :visible.sync="changePWDialogVisible" :show-close="false" class="changePWDialog" :center="true">
          <p class="changePWDialogTips">修改密码</p>
          <el-form ref="changePWFormRef" :model="changePWForm" :rules="changePWFormRules" class="changePWDialogForm">
            <el-form-item prop="newPasswordOne" label="新 密 码：">
              <el-input type="password" v-model="changePWForm.newPasswordOne"></el-input>
            </el-form-item>
            <el-form-item prop="newPasswordTwo" label="确认密码 :">
              <el-input type="password" v-model="changePWForm.newPasswordTwo"></el-input>
            </el-form-item>
            <el-form-item prop="checkNum" label="验 证 码：">
              <el-input class="changePWCheckNumInput" v-model="changePWForm.checkNum"></el-input>
              <el-button class="getchangePWCheckNumButton" :disabled="changePWCheckButtonDisalbe" type="primary" plain @click="getChangePWCheckNumButtonClick">{{changePWCheckNumButtonText}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="changePWDialogConfirmButton" @click="realChangePWButtonClick">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      checkNumButtonText: '获取验证码',
      checkDialogButtonDisalbe: false,
      jwtString: '',
      mmngct: '',
      // 验证码弹窗控制
      checkDialogVisible: false,
      // 验证码
      checkForm: {
        checkNum: ''
      },
      // 验证码规则
      checkFormRules: {
        checkNum: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码' }
        ]
      },
      // 这是登陆表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码必须为11位', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        // 验证秘法是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      changePWDialogVisible: false,
      changePWForm: {
        newPasswordOne: '',
        newPasswordTwo: '',
        checkNum: ''
      },
      changePWFormRules: {
        newPasswordOne: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度 6 到 15 个字符', trigger: 'blur' }
        ],
        newPasswordTwo: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度 6 到 15 个字符', trigger: 'blur' }
        ],
        checkNum: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码' }
        ]
      },
      changePWCheckButtonDisalbe: false,
      changePWCheckNumButtonText: '获取验证码'
    }
  },
  methods: {
    // 真正修改密码
    async realChangePWButtonClick () {
      // 先验证valid，然后两次密码要相同
      this.$refs.changePWFormRef.validate(async valid => {
        if (valid) {
          this.changePWForm.username = this.loginForm.username
          const { data: res } = await this.$http.post('realChangePWCheck', this.changePWForm)
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            return
          }
          this.$message.success('修改密码成功')
          this.changePWDialogVisible = false
          // 返回登陆页面，填充登陆密码
          this.loginForm.password = this.changePWForm.newPasswordOne
        }
      })
    },
    // 获取修改密码验证码
    async getChangePWCheckNumButtonClick () {
      // 发送验证码之前，要先检查formrule，以及两次输入是否相同
      var isValid = true
      this.$refs.changePWFormRef.validateField('newPasswordOne', async errMsg => {
        if (errMsg) {
          isValid = false
        }
      })
      this.$refs.changePWFormRef.validateField('newPasswordTwo', async errMsg => {
        if (errMsg) {
          isValid = false
        }
      })
      // 不达标 就不做相同检测
      if (!isValid) {
        return
      }
      if (this.changePWForm.newPasswordOne !== this.changePWForm.newPasswordTwo) {
        this.$message.error('两次输入密码应该相同!')
        isValid = false
        return
      }
      if (isValid) {
        // 发送验证码
        // 发送获取验证码逻辑,没有token
        this.changePWForm.username = this.loginForm.username
        const { data: res } = await this.$http.post('sendChangePWCheck', this.changePWForm)
        if (res.meta.status !== 200) {
          // 根据阿里云返回的情况，要分别提示
          this.$message.error(res.meta.msg)
          return
        }

        // 计时器计时
        this.changePWCheckButtonDisalbe = true
        const TIME_COUNT = 60
        this.changePWCheckNumButtonText = TIME_COUNT
        var timer = setInterval(() => {
          if (this.changePWCheckNumButtonText > 0) {
            this.changePWCheckNumButtonText--
          } else {
            this.changePWCheckButtonDisalbe = false
            this.changePWCheckNumButtonText = '获取验证码'
            clearInterval(timer)
          }
        }, 1000)
        this.$message.success(res.meta.msg)
      }
    },
    // 修改密码
    changePW () {
      // 检查用户名
      this.$refs.loginFormRef.validateField('username', async errMsg => {
        if (!errMsg) {
          // 在这里进行修改密码操作
          this.changePWDialogVisible = true
        }
      })
    },
    async realCheckNumButtonClick () {
      // valid验证
      this.$refs.checkFormRef.validate(async valid => {
        // 验证验证规则
        if (!valid) {
          return
        }
        this.mmngct.checkNum = this.checkForm.checkNum
        const { data: res } = await this.$http.post('realCheck', this.mmngct, {
          headers: {
            Authorization: this.jwtString
          }
        })
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
          return
        }
        // 登陆成功，设置token
        this.$message.success('登陆成功')
        // 1. 将登陆之后的 token，保存到客户端的 sessionStorage 中
        //  1.1 项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', this.jwtString)
        // 登陆成功后，保存管理者用户名，也就是唯一的电话号码
        window.sessionStorage.setItem('mmngctUserName', this.loginForm.username)
        // 2. 通过编程式导航跳转到后台主页， 路由地址是 /home
        this.$router.push('/static/home')
      })
    },
    // 获取验证码
    async getCheckNumButtonClick () {
      // 发送获取验证码逻辑,需要携带token（在heaers中)
      const { data: res } = await this.$http.post('sendCheck', this.mmngct, {
        headers: {
          Authorization: this.jwtString
        }
      })
      if (res.meta.status !== 200) {
        // 根据阿里云返回的情况，要分别提示
        this.$message.error(res.meta.msg)
        return
      }

      // 计时器计时
      this.checkDialogButtonDisalbe = true
      const TIME_COUNT = 60
      this.checkNumButtonText = TIME_COUNT
      var timer = setInterval(() => {
        if (this.checkNumButtonText > 0) {
          this.checkNumButtonText--
        } else {
          this.checkDialogButtonDisalbe = false
          this.checkNumButtonText = '获取验证码'
          clearInterval(timer)
        }
      }, 1000)
      this.$message.success(res.meta.msg)
    },
    // 点击重置按钮，重置登陆表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            // 判断商家是否被ban
            if (res.meta.status === 402) {
              this.$message.error('餐厅已下架,请联系管理员!')
              return
            }
            if (res.meta.status === 401) {
              this.$message.error('请输入正确的用户名和密码！')
              return
            } else if (res.meta.status === 500) {
              this.$message.error('发生未知错误，请重试或联系管理员')
              return
            } else if (res.meta.status === 201) {
              // 弹出验证码框
              this.checkDialogVisible = true
              this.mmngct = res.data.mmngct
              this.jwtString = res.data.token
              return
            }
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
.checkDialog {
  /deep/ .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    width: 450px;
    height: 300px;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);

    .el-form-item {
      display: flex;
      margin-bottom: 10px;
      .el-input {
        width: 150px;
        margin-right: 20px;
      }
    }

    .el-dialog__header {
      height: 0;
      padding: 0;
    }
  }
}

.getCheckNumButton {
  width: 112px;
}
.checkDialogTips {
  font-size: 13px;
}
.changePWDialogTips {
  font-size: 13px;
  text-align: center;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 25px;
}
.checkDialogConfirmButton {
  width: 200px;
  margin-left: 68px;
  margin-top: 20px;
}
/deep/ .el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
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
            // background-color: #eeeeee;
            background-color: #fff;
            position: relative;
            left: 5%;
        }
    }
}

.btns{
    display: flex;
    justify-content: flex-end;
}
.changePWBtn {
  margin-right: 152px;
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
/deep/ .changePWDialog {
  .el-dialog__body {
    padding-bottom: 10px;
  }
}
.changePWDialogConfirmButton {
  width: 200px;
  margin-left: 68px;
  margin-top: 15px;
}
.changePWDialog {
  /deep/ .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    width: 450px;
    height: 340px;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);

    .el-form-item {
      display: flex;
      .el-input {
        width: 150px;
        margin-right: 20px;
      }
    }

    .el-dialog__header {
      height: 0;
      padding: 0;
    }
  }
}
</style>
