import request from '@/utils/request'

// 获取全部成绩
export function getAllUserGrades() {
  return request({
    url: '/grade/all',
    method: 'get'
  })
}

// 新增成绩
export function addUserGrade(data) {
  return request({
    url: '/grade/add',
    method: 'post',
    data
  })
}

// 删除成绩
export function deleteUserGrade(student_id) {
  return request({
    url: `/grade/delete/${student_id}`,
    method: 'delete'
  })
}

// 修改成绩
export function updateUserGrade(data) {
  const { student_id } = data
  return request({
    url: `/grade/update/${student_id}`,
    method: 'put',
    data
  })
}

// 查询成绩
export function getUserGrade(student_id) {
  return request({
    url: `/grade/get/${student_id}`,
    method: 'get'
  })
}
