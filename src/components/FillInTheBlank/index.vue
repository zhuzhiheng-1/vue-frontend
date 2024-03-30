<template>
  <div class="fill-in-the-blank-container">

    <div class="left-side">
      <!-- 问题描述 -->
      <div class="question">
        <p>给定以下的C++代码，填写下划线处的空白，使得代码能够正确运行。</p>
        <!-- CodeMirror 展示代码题目 -->
        <codemirror v-model="fillincode" :options="editorOptions" />
      </div>
    </div>

    <div class="right-side">
      <!-- 答案输入框 -->
      <div class="answer-input">
        <div v-for="(answer, index) in userAnswers" :key="index" class="answer-input-item">
          <label :for="'blank' + index" class="label">({{ index + 1 }})：</label>
          <input :id="'blank' + index" :key="index" v-model="userAnswers[index]" type="text" class="answer-input-field">
        </div>
      </div>

      <!-- 提交按钮 -->
      <button :disabled="isSubmitted" @click="checkAnswers">提交答案</button>

    </div>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="答题结果" width="50%" top="5vh" @close="updateUserAnswers">
      <h3>得分：{{ totalScore }}</h3>
      <div class="answers">
        <div class="answer-item1">
          <h4>我的答案：</h4>
          <div v-for="(userAnswer, index) in userAnswers" :key="index" class="answer-item">
            <p>{{ userAnswer }}</p>
          </div>
        </div>
        <div class="answer-item2">
          <h4>正确答案：</h4>
          <div v-for="(fillinanswer, index) in fillinanswer" :key="index" class="answer-item">
            <p>{{ fillinanswer }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 导入 CodeMirror 组件
import { codemirror } from 'vue-codemirror'
// 导入样式、主题、代码风格等配置或样式文件
import '@/utils/cm-setting'
export default {
  components: {
    codemirror
  },
  data() {
    return {
      userAnswers: new Array(8).fill(''), // 初始化答案数组
      totalScore: 0,
      // CodeMirror 的配置项
      editorOptions: {
        mode: 'text/x-c++src',
        lineNumbers: true,
        readOnly: true,
        theme: 'rubyblue',
        lineWrapping: true, // 自动换行配置
        gutters: ['my-gutter'] // gutter 配置
      },
      dialogVisible: false,
      // 是否提交过答案
      isSubmitted: false
    }
  },
  computed: {
    ...mapGetters([
      'fillincode',
      'fillinanswer',
      'fillinexplanation'
    ])
  },
  methods: {
    // 提交答案
    checkAnswers() {
      const isAllAnswered = this.userAnswers.every(answer => answer !== '')
      if (isAllAnswered) {
        this.$confirm('做完啦，你确定要提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.results = this.fillinanswer.map((answer, index) => ({
              userAnswer: this.userAnswers[index],
              correctAnswer: answer,
              isCorrect: this.userAnswers[index] === answer
            }))
            this.calculateTotalScore()
            this.dialogVisible = true
            // 将总分存储在本地
            localStorage.setItem('basicScores', this.totalScore.toString())
            this.isSubmitted = true
          })
          .catch(() => {
            // 用户点击取消，不进行任何操作
          })
      } else {
        this.$message.warning('题目还没做完哦！')
      }
    },
    // 计算总得分
    calculateTotalScore() {
      const correctCount = this.results.filter(result => result.isCorrect).length
      this.totalScore = (correctCount / this.results.length) * 100
    },
    // 更新用户答案为正确答案
    // 更新用户答案为正确答案
    updateUserAnswers() {
      this.userAnswers = this.fillinanswer.map((answer, index) => `${answer} (${this.fillinexplanation[index]})`)
    }

  }
}
</script>

<style scoped>
.fill-in-the-blank-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
}

.left-side {
  flex: 1;
  padding-right: 20px;
}
.right-side {
  flex: 1;
  padding-left: 20px;
}
.question {
  margin-bottom: 20px;
}
.question ::v-deep .CodeMirror-wrap {
  height: 550px;
}
.answer-input {
  margin-bottom: 20px;
}

.answer-input-item {
  display: flex;
  align-items: center;
  margin-bottom: 23px;
}

.answer-input-field {
  flex: 1;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

label {
  margin-right: 10px;
}

input {
  width: 100px; /* 设置输入框宽度，根据实际需要调整 */
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.feedback {
  margin-top: 20px;
  color: #333;
  font-weight: bold;
}

.popup {
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.answers {
  display: flex;
  flex-direction: row;
}

.answer-item1,
.answer-item2 {
  flex: 1;
  padding: 10px;

}

.answer-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.answer-item p {
  margin: 0;
}
</style>
