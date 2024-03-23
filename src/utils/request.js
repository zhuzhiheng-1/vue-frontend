import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求的基础 URL，这里使用了环境变量
  timeout: 5000 // 请求超时时间为 5 秒
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    if (store.getters.token) {
      // 如果用户已登录，将 token 添加到请求头中
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 打印错误日志，供调试使用
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 判断响应状态码是否为 200，如果不是则判断为错误
    if (response.status !== 200) {
      // 显示错误消息
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 处理特定的错误状态码
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        // 重新登录逻辑，这里可能需要修改，因为 location.reload() 会重新加载整个页面
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // location.reload() 重新加载整个页面，可能不符合需求，需要修改
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error')) // 返回 Promise.reject 以传递错误给调用方
    } else {
      // 显示成功消息
      Message({
        message: res.message || 'Success',
        type: 'success',
        duration: 3 * 1000
      })
      return res // 返回响应数据
    }
  },
  error => {
    console.log('err' + error) // 打印错误日志，供调试使用
    // 显示错误消息
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error) // 返回 Promise.reject 以传递错误给调用方
  }
)

export default service
