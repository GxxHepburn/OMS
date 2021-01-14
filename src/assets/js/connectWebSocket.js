function reconnect () {
  if (reconnect.lockReconnect) {
    console.log('重连触发锁')
    return
  }
  console.log('重连----------未触发锁')
  if (window.reConNum < 10) {
    // 播报语音，弹出窗口
    window.VueThat.$voicePromptFun.voicePrompt('与服务器断开连接，正在尝试重新连接')
    console.log('重连----' + window.reConNum + '------未触发锁')
    window.reConNum = window.reConNum + 1
    reconnect.lockReconnect = true
    setTimeout(function () {
      openWebSocket()
      reconnect.lockReconnect = false
    }, 2000)
  } else {
    console.log('超过重连最大数，请尝试刷新页面或者联系技术供应商')
  }
}
function openWebSocket () {
  var name = window.sessionStorage.getItem('mmngctUserName')
  var token = window.sessionStorage.getItem('token')

  // 对这两个值加密，然后在服务器端解密-没这个必要，因为请求要先验证token，所以拿到这两个值也没用。再其次，加密之后解密，等于做了无用功！
  if (window.wbss !== undefined && window.wbss.readyState === 1) {
    window.VueThat.$message.error('websocket已连接')
    return
  }
  window.wbss = new WebSocket('wss://www.donghuastar.com/websocketOrdering?name=' + name + '&token=' + token)

  window.wbss.addEventListener('open', function (event) {
    heartCheck.reset().start()
    window.VueThat.$message.success('websocket连接成功')
    console.log('websocket connected.')
    console.log(new Date())
    window.$bus.$emit('isWebSocketing', 1)
    // 重置重连次数
    window.reConNum = 0
  })

  window.wbss.addEventListener('message', function (event) {
    heartCheck.reset().start()
    console.log('message: ', event.data)
    var data = JSON.parse(event.data)
    if (data.type === '1') {
      window.VueThat.$voicePromptFun.voicePrompt(data.voiceText)
      // 判断是不是再订单详情界面路由，如果是，并且OID相同则刷新该页面
      if (window.VueThat.$route.path === '/static/orderItemSetting' && window.VueThat.$route.query.O_ID === '' + data.O_ID) {
        window.$bus.$emit('updateOrderItemSetting', 'updateOrderItemSetting')
      }
    }
  })

  window.wbss.addEventListener('close', function (e) {
    window.$bus.$emit('isWebSocketing', 0)
    console.log('websocket closed: ' + e.code + ', ' + e.reason + ', ' + e.wasClean)
    if (window.sessionStorage.getItem('isNeedToConnectWebSocket') === '1') {
      reconnect()
      window.VueThat.$message.error('websocket未知原因关闭，正在重启')
      console.log('websocket未知原因关闭，正在重启')
    } else {
      window.VueThat.$message.success('websocket关闭成功')
      heartCheck.reset()
      console.log('websocket关闭成功')
    }
  })

  window.wbss.addEventListener('error', function (e) {
    window.$bus.$emit('isWebSocketing', 0)
    console.log('websocket error closed: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    if (window.sessionStorage.getItem('isNeedToConnectWebSocket') === '1') {
      reconnect()
      window.VueThat.$message.error('websocket出错了，正在重启')
      console.log('websocket出错了，正在重启')
    }
  })

  var heartCheck = {
    // 50s发一次
    timeout: 50000,
    closeTimeout: 58000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    start: function () {
      console.log('开启了发送定时器')
      var self = this
      this.timeoutObj = setTimeout(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage拿到返回的心跳就说明连接正常
        window.wbss.send('发送维持连接消息')
        console.log('发送维持连接消息！')
        // 如果超过一定时间还没重置，说明后端主动断开了
        self.serverTimeoutObj = setTimeout(function () {
          // 语音报告后端断开了
          window.wbss.close()
          console.log('定时器,未接收到消息，主动关闭')
          console.log(new Date())
        }, self.closeTimeout)
      }, this.timeout)
    }
  }
}
export default {
  openWebSocket
}
