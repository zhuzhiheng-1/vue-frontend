// 导入路由、状态管理器、消息提示组件、进度条插件、工具函数等
import router from './router'
import store from './store'
import { Message } from 'element-ui' // Element UI 提供的消息提示组件
import NProgress from 'nprogress' // 进度条插件，用于展示页面加载进度
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 cookie 中获取用户 token
import getPageTitle from '@/utils/get-page-title' // 获取页面标题的工具函数

// NProgress.configure({ showSpinner: false }) // 配置进度条，不显示加载中动画

const whiteList = ['/login', '/404'] // 定义一个白名单，包含不需要权限验证的页面路径

// 路由导航守卫，当用户访问页面时会触发该函数
router.beforeEach(async(to, from, next) => {
  // 开始加载进度条
  NProgress.start()

  // 设置页面标题为当前页面的标题
  document.title = getPageTitle(to.meta.title)

  // 检查用户是否已经登录，通过检查 token 的存在与否来判断
  const hasToken = getToken()
  NProgress.done() // 完成加载进度条
  if (hasToken) { // 如果存在 token，表示用户已登录
    if (to.path === '/login') {
      // 如果已经登录且访问的是登录页面，则重定向到首页
      next({ path: '/' })
      NProgress.done() // 完成加载进度条
    } else {
      // 检查用户是否已获取权限信息，通常在登录成功后会获取用户信息及权限信息
      const hasUsername = store.getters.name
      if (hasUsername) {
        next()
      } else {
        try {
          // 获取用户信息，通常是通过接口请求获取用户信息并保存到状态管理器中
          const data = await store.dispatch('user/getInfo')
          // console.log(data.role)
          const accessRoutes = await store.dispatch('permission/generateRoutes', data.role)
          router.options.routes = store.getters.permission_routes
          router.addRoutes(accessRoutes)
          NProgress.done() // 完成加载进度条
          /*
          当你调用 router.addRoutes(routes) 动态添加路由时，Vue Router 会进行异步操作来加载和解析这些路由配置。
          这个过程可能需要一些时间，特别是当路由配置较复杂或包含异步组件时。当你访问一个路由时，Vue Router
          会执行一系列的导航守卫（beforeEach, beforeResolve, afterEach 等）。
          这些导航守卫控制着路由导航的流程，允许或中断导航。如果在动态添加路由的过程中，导航守卫执行得太早，
          可能会导致新添加的路由还没有完全加载，出现刷新白屏的问题：
          1.如果 addRoutes 并未完成，路由守卫会一层一层的执行执行，直到 addRoutes 完成，找到对应的路由
          2.不然在addRoutes()之后第一次访问被添加的路由会白屏，这是因为刚刚addRoutes()就立刻访问被添加的路由，
            然而此时addRoutes()没有执行结束，因而找不到刚刚被添加的路由导致白屏。因此需要从新访问一次路由才行。
          3.如果参数to不能找到对应的路由的话，就再执行一次beforeEach((to, from, next)直到其中的next({ ...to})
            能找到对应的路由为止。
          4.replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由。
          5.所以使用next({ ...to, replace: true })来确保addRoutes()时动态添加的路由已经被完全加载上去。
          6.确保添加的路由完全加载后再进行导航是为了保证应用的稳定性
          */
          /*
          其实在路由守卫中，只有next()是放行，其他的诸如：
          // next('/logon') 、 next(to) 或者 next({ ...to, replace: true })都不是放行，而是：
                “中断当前导航，执行新的导航！！！！”
          举例：beforeEach((to, from, next) => {
                  next('/logon')
                }
                其实不会直接跳转到/logon路由，而是：
                beforeEach((to, from, next) => {
                  beforeEach(('/logon', from, next) => {
                    beforeEach(('/logon', from, next) => {
                      beforeEach(('/logon', from, next) => {
                        beforeEac...  // 一直循环下去...... , 因为我们没有使用 next() 放行
                      }
                    }
                  }
                }
          */
          next(
            {
              ...to,
              replace: true
              // 确保 addRoutes() 时动态添加的路由已经被完全加载上去。
              // replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由。
              // 所以使用next({ ...to, replace: true })来确保addRoutes()时动态添加的路由已经被完全加载上去。
              // 确保添加的路由完全加载后再进行导航是为了保证应用的稳定性
            }
          ) // 获取信息成功后跳转到目标页面
        } catch (error) {
          // console.error('Error generating routes:', error)
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
      NProgress.done() // 完成加载进度条
    } else {
      // 如果访问的页面不在白名单中，需要跳转到登录页面，并记录之前的页面路径用于登录成功后的重定向
      next(`/login?redirect=${to.path}`)
      NProgress.done() // 完成加载进度条
    }
  }
})
