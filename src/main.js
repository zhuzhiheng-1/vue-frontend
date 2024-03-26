import Vue from 'vue'

import 'normalize.css/normalize.css' // 一种现代的 CSS 重置方案

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // 语言国际化

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // 图标
import '@/permission' // 权限控制

/**
 * 如果你不想使用 mock-server
 * 想要使用 MockJs 进行模拟 API
 * 你可以执行: mockXHR()
 *
 * 当前 MockJs 将用于生产环境，请在上线前移除它！！！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 设置 ElementUI 的语言为英文
// Vue.use(ElementUI, { locale })
// 如果想要中文版 ElementUI，请按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
