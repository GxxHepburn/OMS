import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 导入 NProgress 包对应JS和CSS
import NProgress from 'nprogress'

// 引入bus总线
import bus from './assets/js/bus'

// 引入判断两对象是否相等
import isEqual from './assets/js/isEqual'

// 引入mathjs
import * as math from 'mathjs'

// 引入qrcodejs2
import QRCode from 'qrcodejs2'
// 引入打印插件
import Print from 'vue-print-nb'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.donghuastar.com/OSM'
// 在 request 拦截器中，展示进度条 NProgress.start ()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.prototype.bus = bus

Vue.prototype.$isEqual = isEqual

Vue.prototype.$math = math

Vue.config.productionTip = false

Vue.prototype.QRCode = QRCode

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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
