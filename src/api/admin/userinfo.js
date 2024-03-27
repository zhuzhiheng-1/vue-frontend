import request from '@/utils/request'
// 获取学生列表
export function adminGetUserlist(data) {
  return request({
    url: '/info/admingetuserlist',
    method: 'get',
    data
  })
}
// 删除某id用户
export function adminDeleteUser(id) {
  return request({
    url: `/info/admindeleteuser/${id}`,
    method: 'delete'
  })
}
// 编辑某id用户
export function adminEditUser(data) {
  const { id } = data
  return request({
    url: `/info/adminedituser/${id}`,
    method: 'put',
    data
  })
}
