import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 常规路由（无权限要求）
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  }
]
// 动态路由（需要权限）
export const asyncRoutes = [
  {
    path: '/profile',
    component: Layout,
    meta: { icon: 'el-icon-user', roles: ['student', 'teacher', 'admin'] },
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index'),
        meta: { title: '个人中心', icon: 'el-icon-user', roles: ['student', 'teacher', 'admin'] }
      }
    ]
  },
  {
    path: '/experiment',
    component: Layout,
    redirect: '/experiment/theoretical',
    name: 'Experiment',
    meta: { title: '实验内容', icon: 'el-icon-s-help', roles: ['student'] },
    children: [
      {
        path: 'theoretical',
        name: 'Theoretical',
        component: () => import('@/views/experiment/theoretical/index'),
        meta: { title: '理论实验', icon: 'el-icon-s-flag', roles: ['student'] }
      },
      {
        path: 'basic',
        name: 'Basic',
        component: () => import('@/views/experiment/basic/index'),
        meta: { title: '基础实验', icon: 'el-icon-s-flag', roles: ['student'] }
      },
      {
        path: 'extension',
        name: 'Extension',
        component: () => import('@/views/experiment/extension/index'),
        meta: { title: '拓展实验', icon: 'el-icon-s-flag', roles: ['student'] }
      }
    ]
  },

  {
    path: '/scores',
    component: Layout,
    redirect: '/scores/theoretical',
    name: 'Scores',
    meta: { title: '实验成绩', icon: 'el-icon-s-marketing', roles: ['student'] },
    children: [
      {
        path: 'theoretical',
        name: 'TheoreticalScores',
        component: () => import('@/views/scores/theoretical/index'),
        meta: { title: '理论实验成绩', icon: 'el-icon-s-flag', roles: ['student'] }
      },
      {
        path: 'basic',
        name: 'BasicScores',
        component: () => import('@/views/scores/basic/index'),
        meta: { title: '基础实验成绩', icon: 'el-icon-s-flag', roles: ['student'] }
      },
      {
        path: 'extension',
        name: 'ExtensionScores',
        component: () => import('@/views/scores/extension/index'),
        meta: { title: '拓展实验成绩', icon: 'el-icon-s-flag', roles: ['student'] }
      },
      {
        path: 'total',
        name: 'TotalScores',
        component: () => import('@/views/scores/total/index'),
        meta: { title: '总分', icon: 'el-icon-s-flag', roles: ['student'] }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: { icon: 'el-icon-user', roles: ['teacher'] },
    children: [
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/user/index'),
        meta: { title: '学生列表', icon: 'el-icon-user', roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/alluser',
    component: Layout,
    name: 'AllUser',
    meta: { icon: 'el-icon-user', roles: ['admin'] },
    children: [
      {
        path: 'alluser',
        name: 'AllUserList',
        component: () => import('@/views/alluser/index'),
        meta: { title: '用户列表', icon: 'el-icon-user', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/grades',
    component: Layout,
    meta: { icon: 'el-icon-s-marketing', roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'index',
        name: 'Grades',
        component: () => import('@/views/grades/index'),
        meta: { title: '成绩查询', icon: 'el-icon-s-flag', roles: ['admin', 'teacher'] }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    meta: { roles: ['admin', 'teacher'] },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form', roles: ['admin', 'teacher'] }
      }
    ]
  },
  // 404 页面必须放在最后
  { path: '*', redirect: '/404', hidden: true },
  {
    path: 'tutorial-link',
    component: Layout,
    children: [
      {
        path: 'https://www.runoob.com/cplusplus/cpp-classes-objects.html',
        meta: { title: 'C++ 类与对象-教程', icon: 'link', roles: ['admin', 'student', 'teacher'] }
      }
    ]
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
