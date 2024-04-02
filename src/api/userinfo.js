import request from '@/utils/request'
// 用户
// 更新密码
export function updatePassword(data) {
  const { id, oldPwd, newPwd } = data // 解构获取参数对象中的 id、oldPwd 和 newPwd
  return request({
    url: `/info/updatepwd/${id}`,
    method: 'post',
    data: { oldPwd, newPwd } // 将旧密码和新密码作为请求体数据传递
  })
}
// 更新个人信息
export function updateInfo(data) {
  const { id, student_id, classname, nickname, major } = data
  return request({
    url: `/info/updateinfo/${id}`,
    method: 'post',
    data: { student_id, classname, nickname, major } // 将个人信息作为请求体数据传递
  })
}
// 更新用户头像
export function updateAvatar(data) {
  console.log('data:', data)
  const { id, avatar } = data
  return request({
    url: `/info/updateavatar`,
    method: 'post',
    data: { id, avatar } // 将头像作为请求体数据传递
  })
}

// admin
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
