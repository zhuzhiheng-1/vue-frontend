<template>
  <div class="choice-page">
    <!-- 题目介绍和得分情况 -->
    <div class="choice-introduce">
      <p>理论实验为10道单选题,如下:(占20分,每题2分)</p>
    </div>

    <!-- 渲染每个题目的选择 -->
    <div
      v-for="(question, index) in questions"
      :key="question.id"
      class="choice-list"
    >
      <p>{{ index + 1 }}. {{ question.title }} ({{ userAnswers[index] }})</p>
      <!-- 使用 el-radio-group 渲染题目 -->
      <!-- 每个题目双向绑定到 userAnswers[index] -->
      <el-radio-group v-model="userAnswers[index]" style="display: flex; flex-direction: column;">
        <!-- 使用 el-radio 渲染每个选项 -->
        <el-radio
          v-for="(optionContent, optionKey) in question.options"
          :key="optionKey"
          :label="optionKey"
          style="margin-bottom: 10px;"
        >
          {{ optionKey }}: {{ optionContent }}
        </el-radio>
      </el-radio-group>
      <el-divider />
    </div>

    <!-- 提交和重置按钮 -->
    <div class="button-container">
      <el-button class="submit-button" type="primary" @click="submitAnswers">提交</el-button>
      <el-button class="reset-button" type="danger" @click="resetAnswers">重置</el-button>
    </div>
    <!-- 弹窗显示答题结果 -->
    <el-dialog :visible.sync="dialogVisible" title="答题结果" width="50%" top="5vh">
      <div v-for="(result, resultIndex) in results" :key="resultIndex">
        <!-- 显示每题的答案和是否正确 -->
        <p>{{ resultIndex + 1 }}. 你的答案:{{ result.userAnswer }}</p>
        <p>标准答案:{{ result.correctAnswer }}</p>
        <p :style="{ color: result.isCorrect ? 'green' : 'red' }">
          {{ result.isCorrect ? '正确' : '错误' }}
        </p>
        <el-divider />
      </div>
      <!-- 显示总得分 -->
      <p>得分:{{ totalScore }} 分</p>
      <!-- 关闭弹窗按钮 -->
      <el-button type="primary" @click="closeDialog">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 题目数据
      questions: [
        {
          id: 1,
          title: '下列哪个不是 JavaScript 数据类型？',
          options: {
            A: '字符串',
            B: '数字',
            C: '数组',
            D: '布尔'
          },
          correctAnswer: 'C'
        },
        {
          id: 2,
          title: '以下哪个 HTML 标签用于创建超链接？',
          options: {
            A: '<a>',
            B: '<h1>',
            C: '<p>',
            D: '<div>'
          },
          correctAnswer: 'A'
        },
        {
          id: 3,
          title: '在 CSS 中，哪个属性用于改变文本颜色？',
          options: {
            A: 'font-size',
            B: 'background-color',
            C: 'color',
            D: 'margin'
          },
          correctAnswer: 'C'
        },
        {
          id: 4,
          title: '以下哪个关键字用于声明变量？',
          options: {
            A: 'let',
            B: 'function',
            C: 'if',
            D: 'return'
          },
          correctAnswer: 'A'
        },
        {
          id: 5,
          title: 'JavaScript 中的闭包是什么？',
          options: {
            A: '一个函数',
            B: '一个对象',
            C: '一个数组',
            D: '一个包含自由变量的函数'
          },
          correctAnswer: 'D'
        },
        {
          id: 6,
          title: '在 Vue.js 中，双向绑定是通过哪个指令实现的？',
          options: {
            A: 'v-bind',
            B: 'v-model',
            C: 'v-value',
            D: 'v-data'
          },
          correctAnswer: 'B'
        },
        {
          id: 7,
          title: '以下哪个 HTTP 方法用于向服务器发送数据？',
          options: {
            A: 'GET',
            B: 'POST',
            C: 'PUT',
            D: 'DELETE'
          },
          correctAnswer: 'B'
        },
        {
          id: 8,
          title: 'React 中的 JSX 是什么？',
          options: {
            A: 'JavaScript Syntax Extension',
            B: 'JavaScript XML',
            C: 'JavaScript Extra',
            D: 'JavaScript Xtra'
          },
          correctAnswer: 'B'
        },
        {
          id: 9,
          title: '下列哪个事件在用户点击 HTML 元素时触发？',
          options: {
            A: 'mousemove',
            B: 'change',
            C: 'click',
            D: 'keydown'
          },
          correctAnswer: 'C'
        },
        {
          id: 10,
          title: 'CSS 中的盒子模型包含哪些部分？',
          options: {
            A: 'margin, padding, border, content',
            B: 'padding, border, content',
            C: 'border, content',
            D: 'content'
          },
          correctAnswer: 'A'
        }
      ],
      // 用户选择的答案
      userAnswers: Array.from({ length: 10 }, () => ''),
      // 弹窗可见状态
      dialogVisible: false,
      // 答题结果
      results: [],
      totalScore: 0
    }
  },
  computed: {
    // // 计算总得分
    // totalScore() {
    //   return this.results.filter((result) => result.isCorrect).length * 2
    // }
  },
  methods: {
    // 提交答案
    submitAnswers() {
    // 检查是否所有题目都已经回答
      const isAllAnswered = this.userAnswers.every((answer) => answer !== '')

      // 如果所有题目都已回答
      if (isAllAnswered) {
        this.$confirm('做完啦，你确定要提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
          // 执行提交逻辑
            this.results = this.questions.map((question, index) => ({
              userAnswer: this.userAnswers[index],
              correctAnswer: question.correctAnswer,
              isCorrect: this.userAnswers[index] === question.correctAnswer
            }))
            this.dialogVisible = true
            // 计算总得分
            this.totalScore = this.results.filter((result) => result.isCorrect).length * 2

            // 将总分存储在本地
            localStorage.setItem('theoryScores', this.totalScore.toString())
          })
          .catch(() => {
          // 用户点击取消，不进行任何操作
          })
      } else {
      // 如果还有题目未回答，显示提示
        this.$message.warning('题目还没做完哦！')
      }
    },
    // 重置答案
    resetAnswers() {
      this.userAnswers = Array.from({ length: 5 }, () => '')
      this.results = []
      this.totalScore = 0
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      this.resetAnswers()
    }
  }
}
</script>

<style scoped>
.choice-page {
    background-color: #eee;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.choice-list{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin-left: 100px;
    margin-bottom: 20px; /* 增加底部间距 */
}
.choice-introduce{
    margin-left: 100px;
}
.choice-item{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.submit-button, .reset-button{
    width: 150px;
    height: 40px;
    border-radius: 5px;
    margin: 0 10px;
}
.button-container{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
