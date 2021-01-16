const APIKey = 'Itot35F5zewR22fKchlKmkq0'
const SecretKey = 'vXgFcgFVuE9fwrWkMs37GZ8QTriKXfsK'
// const AppID = '23551417'
async function voicePrompt (text) {
  var token = ''
  var getTokenUrl = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + APIKey + '&client_secret=' + SecretKey
  // 在本方法中，根据这个时间戳去计算token是否有效，如果无效，就获取一个新的token，并更新sessionStorage中时间戳和token
  var timeInstant = window.sessionStorage.getItem('baiduTokenUsefulTime')
  if (timeInstant != null && timeInstant > Date.parse(new Date())) {
    // 如果有效，则从sessionStorage中获取token
    token = window.sessionStorage.getItem('baiduToken')
  } else {
    const { data: res } = await window.VueThat.$http.post(getTokenUrl)
    token = res.access_token
    timeInstant = Date.parse(new Date()) + res.expires_in
    window.sessionStorage.setItem('baiduTokenUsefulTime', timeInstant)
    window.sessionStorage.setItem('baiduToken', token)
  }
  var audioUrl = 'https://tsn.baidu.com/text2audio?tok=' + token + '&cuid=1&ctp=1&lan=zh&per=0&tex=' + text

  var audioVar = new Audio(audioUrl)

  window.VueThat.$voiceList.push(audioVar)
  audioVar.addEventListener('ended', function () {
    window.VueThat.$voiceList.splice(window.VueThat.$voiceList.indexOf(audioVar), 1)
    if (window.VueThat.$voiceList.length !== 0) {
      window.VueThat.$voiceList[0].play()
    }
  })
  if (window.VueThat.$voiceList.length === 1) {
    window.VueThat.$voiceList[0].play()
  }
}

export {
  voicePrompt
}
