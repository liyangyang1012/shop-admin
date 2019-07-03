import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 1. 引入elementUI库
import ElementUI from 'element-ui'
import axios from 'axios'

// 2. 引入css文件
import 'element-ui/lib/theme-chalk/index.css'

// 3. 引入index页面css文件
import './assets/css/index.css'

// 3. 安装elementUi
Vue.use(ElementUI)

// 通过defaults给axios设置一个默认的baseURL, 可以在所有请求中都能用到这个地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置axios的请求拦截器
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = localStorage.getItem('token')
  return config
})

// 把axios加到Vue原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
