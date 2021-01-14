function voicePrompt (text) {
  var audioVar = new Audio('http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&per=4&text=' + text)
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
