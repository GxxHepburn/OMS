import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 导入 NProgress 包对应JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Loading } from 'element-ui'

// 引入bus总线
import bus from './assets/js/bus'

// 引入判断两对象是否相等
import isEqual from './assets/js/isEqual'

// 引入创建webSocket
import connectWebSocket from './assets/js/connectWebSocket'

// 引入语音播报
import * as voicePromptFun from './assets/js/voicePrompt'

// 引入mathjs
import * as math from 'mathjs'

// 引入qrcodejs2
import QRCode from 'qrcodejs2'
// 引入打印插件
import Print from 'vue-print-nb'

import axios from 'axios'

let loadingInstance
const options = {
  text: '加载中...',
  background: 'rgba(0,0,0,0.1)',
  spinner: 'el-icon-loading',
  fullscreen: true
}

// 配置请求的根路径
axios.defaults.baseURL = 'https://www.donghuastar.com/OSM'
// 在 request 拦截器中，展示进度条 NProgress.start ()
axios.interceptors.request.use(config => {
  NProgress.start()
  loadingInstance = Loading.service(options)
  if (config.headers.Authorization !== undefined && config.headers.Authorization !== '') {
    return config
  }

  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  if (loadingInstance) {
    window.VueThat.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
      loadingInstance.close()
    })
  }
  return config
}, err => {
  NProgress.done()
  if (err.response.status === 400) {
    window.VueThat.$message.error('登陆过期，请重新登陆')
  } else if (err.response.status === 401) {
    window.VueThat.$message.error('非法请求')
  } else {
    window.VueThat.$message.error('未知错误，请联系管理员！')
  }
})
Vue.prototype.$http = axios

Vue.prototype.bus = bus

Vue.prototype.$isEqual = isEqual

Vue.prototype.$connectWebSocket = connectWebSocket

Vue.prototype.$voicePromptFun = voicePromptFun

Vue.prototype.$math = math

Vue.config.productionTip = false

Vue.prototype.QRCode = QRCode

// 语音播放列表
Vue.prototype.$voiceList = []

Vue.use(Print)

Vue.prototype.$print = Print

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

var VueThat = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export default VueThat
window.VueThat = VueThat
