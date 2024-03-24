import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
     * 使用 meta.role 以确定当前用户是否具有权限
     * @param roles
     * @param route
     */
// 匹配权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
     * 通过递归过滤异步路由表
     * @param routes asyncRoutes
     * @param roles
     */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // console.log(routes)
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 将过滤后的路由和constantRoutes存起来
  }
}

// 筛选
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      console.log('Before filterAsyncRoutes, asyncRoutes:', asyncRoutes)
      let accessedRoutes
      if (roles.includes('admin') || roles.includes('teacher') || roles.includes('student')) {
        // 如果角色包含管理员、老师或学生，则根据角色设置相应的路由
        if (roles.includes('admin')) {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, ['admin']) // 管理员显示对应的路由
        } else if (roles.includes('teacher')) {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, ['teacher']) // 老师显示对应的路由
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, ['student']) // 学生显示对应的路由
        }
      } else {
        accessedRoutes = [] // 如果角色不在上述三种中，则没有权限访问任何路由
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

