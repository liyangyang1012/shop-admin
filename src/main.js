import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 1. 引入elementUI库
import ElementUI from 'element-ui'

// 2. 引入css文件
import 'element-ui/lib/theme-chalk/index.css'

// 3. 引入index页面css文件
import './assets/css/index.css'

// 3. 安装elementUi
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
