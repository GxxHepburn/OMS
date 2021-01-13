function voicePrompt (text) {
  new Audio('http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' + text).play()
}

export {
  voicePrompt
}
