<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>接单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-button @click="openWs">打开websocket</el-button>
          <el-button @click="closeWs">关闭websocket</el-button>
          <el-button @click="voicePro">语音播报</el-button>
          <el-button @click="sendMsg">发送信息</el-button>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    sendMsg () {
      window.wbss.send('主动发送信息')
    },
    voicePro () {
      this.$voicePromptFun.voicePrompt('欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
      this.$voicePromptFun.voicePrompt('1111欢迎下次光临')
    },
    openWs () {
      this.$connectWebSocket.openWebSocket()
      window.sessionStorage.setItem('isNeedToConnectWebSocket', 1)
    },
    closeWs () {
      if (window.wbss === undefined) {
        this.$message.error('websocket不能存在')
        return
      }
      if (window.wbss.readyState !== 1) {
        this.$message.error('websocket未连接')
        return
      }
      window.wbss.close()
      this.$message.success('websocket关闭成功')
      window.sessionStorage.setItem('isNeedToConnectWebSocket', 0)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
