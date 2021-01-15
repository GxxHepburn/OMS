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
          <p style="font-family:Helvetica Neue;font-weight:bold;font-size:18px;">操作</p>
          <el-row :gutter="0" type="flex">
            <el-col :xl="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="danger" @click="openWs">上线接单</el-button>
            </el-col>
            <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="warning" @click="closeWs">下线休息</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="voicePro" type="info" size="mini" plain>语音测试</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="sendMsg" type="info" size="mini" plain>连接测试</el-button>
            </el-col>
          </el-row>
        </el-card>

        <!-- 卡片视图 -->
        <el-card>
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
  mounted () {
  },
  methods: {
    sendMsg () {
      var testMsg = {
        type: 3
      }
      if (window.wbss !== undefined && window.wbss.readyState === 1) {
        window.wbss.send(JSON.stringify(testMsg))
        this.$message.info('测试: 已发送数据')
      } else {
        this.$message.error('测试: 服务器未连接')
      }
    },
    voicePro () {
      this.$voicePromptFun.voicePrompt('正在测试')
      this.$voicePromptFun.voicePrompt('串行播放,正常')
    },
    openWs () {
      if (window.wbss !== undefined && window.wbss.readyState !== 1) {
        this.$message.info('正在连接服务器')
      }
      this.$connectWebSocket.openWebSocket()
      window.sessionStorage.setItem('isNeedToConnectWebSocket', 1)
    },
    closeWs () {
      if (window.wbss === undefined) {
        this.$message.error('websocket不能存在')
        return
      }
      if (window.wbss.readyState !== 1) {
        this.$message.error('websocket未连接,请不要重复关闭')
        return
      }
      window.sessionStorage.setItem('isNeedToConnectWebSocket', 0)
      window.wbss.close()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
