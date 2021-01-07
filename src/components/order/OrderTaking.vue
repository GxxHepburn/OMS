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
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      wbss: {
      }
    }
  },
  computed: {
  },
  created () {
    // this.openWebSocket()
  },
  methods: {
    openWebSocket () {
      var name = window.sessionStorage.getItem('mmngctUserName')
      var token = window.sessionStorage.getItem('token')

      // 对这两个值加密，然后在服务器端解密-没这个必要，因为请求要先验证token，所以拿到这两个值也没用。再其次，加密之后解密，等于做了无用功！

      this.wbss = new WebSocket('wss://www.donghuastar.com/websocketOrdering?name=' + name + '&token=' + token)
      console.log(this.wbss)

      this.wbss.addEventListener('open', function (event) {
        console.log('websocket connected.')
        heartCheck.reset().start()
      })

      this.wbss.addEventListener('message', function (event) {
        console.log('message: ', event.data)
        heartCheck.reset().start()
      })

      this.wbss.addEventListener('close', function () {
        console.log('websocket closed.')
      })

      this.wbss.addEventListener('error', function () {
        console.log('websocket error.')
      })

      var heartCheck = {
        // 50s发一次
        timeout: 50000,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj)
          clearTimeout(this.serverTimeoutObj)
          return this
        },
        start: function () {
          var self = this
          this.timeoutObj = setTimeout(function () {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            this.wbss.send('发送维持连接消息')
            console.log('发送维持连接消息！')
            // 如果超过一定时间还没重置，说明后端主动断开了
            self.serverTimeoutObj = setTimeout(function () {
              // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              this.wbss.close()
            }, self.timeout)
          }, this.timeout)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
