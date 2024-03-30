const getters = {
  sidebar: state => state.app.sidebar,

  device: state => state.app.device,

  token: state => state.user.token,

  avatar: state => state.user.avatar,

  name: state => state.user.name,

  student_id: state => state.user.student_id,
  // 获取用户角色信息
  roles: state => state.user.roles,

  // 筛选过的路由
  permission_routes: state => state.permission.routes,

  // 获取理论实验列表
  experimentsTheoretical: state => state.experiments.experimentsTheoretical,

  // 获取基础实验列表
  experimentsBasic: state => state.experiments.experimentsBasic,

  // 获取扩展实验列表
  experimentsExtension: state => state.experiments.experimentsExtension,

  // 获取markedLines
  markedLines: state => state.markedList.markedLines,

  // 获取动画的actions
  actions: state => state.animation.actions,

  // 获取填空题的code
  fillincode: state => state.code.fillincode,

  // 获取仿真code
  simulationcode: state => state.code.simulationcode,

  // 获取填空题的答案
  fillinanswer: state => state.code.fillinanswer,

  // 获取填空题的解释
  fillinexplanation: state => state.code.fillinexplanation

}
export default getters
