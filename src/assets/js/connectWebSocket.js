export default {
  openWebSocket () {
    var name = window.sessionStorage.getItem('mmngctUserName')
    var token = window.sessionStorage.getItem('token')

    // 对这两个值加密，然后在服务器端解密-没这个必要，因为请求要先验证token，所以拿到这两个值也没用。再其次，加密之后解密，等于做了无用功！

    window.wbss = new WebSocket('wss://www.donghuastar.com/websocketOrdering?name=' + name + '&token=' + token)
    console.log(window.wbss)

    window.wbss.addEventListener('open', function (event) {
      console.log('websocket connected.')
      heartCheck.reset().start()
    })

    window.wbss.addEventListener('message', function (event) {
      console.log('message: ', event.data)
      var data = JSON.parse(event.data)
      if (data.type === '1') {
        window.VueThat.$voicePromptFun.voicePrompt(data.voiceText)
      }
      heartCheck.reset().start()
    })

    window.wbss.addEventListener('close', function () {
      console.log('websocket closed.')
    })

    window.wbss.addEventListener('error', function () {
      if (window.sessionStorage.getItem('isNeedToConnectWebSocket') === '1') {
        this.$connectWebSocket.openWebSocket()
      }
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
          window.wbss.send('发送维持连接消息')
          console.log('发送维持连接消息！')
          // 如果超过一定时间还没重置，说明后端主动断开了
          self.serverTimeoutObj = setTimeout(function () {
            // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            window.wbss.close()
          }, self.timeout)
        }, this.timeout)
      }
    }
  }
}
