// 导入路由、状态管理器、消息提示组件、进度条插件、工具函数等
import router from './router'
import store from './store'
import { Message } from 'element-ui' // Element UI 提供的消息提示组件
import NProgress from 'nprogress' // 进度条插件，用于展示页面加载进度
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 cookie 中获取用户 token
import getPageTitle from '@/utils/get-page-title' // 获取页面标题的工具函数

NProgress.configure({ showSpinner: false }) // 配置进度条，不显示加载中动画

const whiteList = ['/login'] // 定义一个白名单，包含不需要权限验证的页面路径

// 路由导航守卫，当用户访问页面时会触发该函数
router.beforeEach(async(to, from, next) => {
  // 开始加载进度条
  NProgress.start()

  // 设置页面标题为当前页面的标题
  document.title = getPageTitle(to.meta.title)

  // 检查用户是否已经登录，通过检查 token 的存在与否来判断
  const hasToken = getToken()

  if (hasToken) { // 如果存在 token，表示用户已登录
    if (to.path === '/login') {
      // 如果已经登录且访问的是登录页面，则重定向到首页
      next({ path: '/' })
      NProgress.done() // 完成加载进度条
    } else {
      // 检查用户是否已获取权限信息，通常在登录成功后会获取用户信息及权限信息
      const hasGetUserInfo = store.getters.name

      if (hasGetUserInfo) {
        // 如果已获取权限信息，则直接跳转到目标页面
        next()
      } else {
        try {
          // 获取用户信息，通常是通过接口请求获取用户信息并保存到状态管理器中
          await store.dispatch('user/getInfo')

          next() // 获取信息成功后跳转到目标页面
        } catch (error) {
          // 获取用户信息失败，可能是 token 失效等原因，需要重新登录
          // console.log(error)
          await store.dispatch('user/resetToken') // 清除 token
          Message.error(error || '发生错误') // 显示错误消息
          next(`/login?redirect=${to.path}`) // 跳转到登录页面，并记录之前的页面路径用于登录成功后的重定向
          NProgress.done() // 完成加载进度条
        }
      }
    }
  } else {
    // 用户没有 token，即未登录状态

    if (whiteList.indexOf(to.path) !== -1) {
      // 如果访问的页面在白名单中（例如登录页面），直接跳转到目标页面
      next()
    } else {
      // 如果访问的页面不在白名单中，需要跳转到登录页面，并记录之前的页面路径用于登录成功后的重定向
      next(`/login?redirect=${to.path}`)
      NProgress.done() // 完成加载进度条
    }
  }
})

// 路由导航结束后触发的钩子函数
router.afterEach(() => {
  // 完成加载进度条
  NProgress.done()
})
