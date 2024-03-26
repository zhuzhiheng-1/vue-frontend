import request from '@/utils/request'
// 获取学生列表
export function getStudentList(data) {
  return request({
    url: '/info/studentlist',
    method: 'get',
    data
  })
}
// 删除某id用户
export function deleteUser(id) {
  return request({
    url: `/info/deleteuser/${id}`,
    method: 'delete'
  })
}
// 编辑某id用户
export function editUser(data) {
  const { id } = data
  return request({
    url: `/info/edituser/${id}`,
    method: 'put',
    data
  })
}
