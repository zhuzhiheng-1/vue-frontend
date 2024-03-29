const state = {
  experimentsTheoretical: [
    { index: '1', title: '理论的实验基础', content: '理论的实验内容1' },
    { index: '2', title: '理论的实验原理', content: '理论的实验内容2' },
    { index: '3', title: '理论的实验步骤', content: '理论的实验内容3' },
    { index: '4', title: '理论的思考问题', content: '理论的实验内容4' }
  ],
  experimentsBasic: [
    { index: '1', title: '基础的实验基础', content: '基础的实验内容1' },
    { index: '2', title: '基础的实验原理', content: '基础的实验内容2' },
    { index: '3', title: '基础的实验步骤', content: '基础的实验内容3' },
    { index: '4', title: '基础的思考问题', content: '基础的实验内容4' }
  ],
  experimentsExtension: [
    { index: '1', title: '拓展的实验基础', content: '拓展的实验内容1' },
    { index: '2', title: '拓展的实验原理', content: '拓展的实验内容2' },
    { index: '3', title: '拓展的实验步骤', content: '拓展的实验内容3' },
    { index: '4', title: '拓展的思考问题', content: '拓展的实验内容4' }
  ]
}

export default {
  namespaced: true,
  state
}
