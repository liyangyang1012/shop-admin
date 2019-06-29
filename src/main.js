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

// 注册一个导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
    return
  }

  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
  // console.log('导航守卫工作啦')
  // next这里提供的方法，是用来进行页面的跳转的
  // 如果不调用这个方法，那么页面就不会进入
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
