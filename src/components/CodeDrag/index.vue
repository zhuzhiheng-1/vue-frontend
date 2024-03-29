<template>
  <div class="draggable-container">
    <draggable v-model="list" class="draggable-list" @end="checkOrder">
      <div v-for="(item, index) in list" :key="index" class="draggable-item">
        <pre>{{ item }}</pre>
      </div>
    </draggable>
    <div class="button-container">
      <button
        :disabled="isAbandoned || submitted"
        :class="{ 'disabled': isAbandoned || submitted }"
        @click="checkBeforeSubmit"
      >
        提交
      </button>
      <button @click="resetOrder">放弃</button>
    </div>

    <!-- 打分弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="打分结果" width="50%" top="5vh">
      <div class="score-container">
        <div class="column">
          <p>你的顺序</p>
          <div v-for="(item, index) in list" :key="index" class="draggable-item">
            <pre>{{ item }}</pre>
          </div>
        </div>
        <div class="column">
          <p>正确顺序</p>
          <div v-for="(item, index) in correctOrder" :key="index" class="draggable-item">
            <pre>{{ item }}</pre>
          </div>
        </div>
      </div>
      <p v-if="submitted" class="score">总得分: {{ totalScore }} 分</p>
      <el-button type="primary" @click="closeDialog">关闭</el-button>
    </el-dialog>

    <!-- 显示总得分 -->
    <p v-if="submitted || isAbandoned" class="score">总得分: {{ totalScore }} 分</p>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      list: [5, 2, 1, 4, 3],
      originalOrder: null,
      correctOrder: [1, 2, 3, 4, 5],
      dialogVisible: false,
      isAbandoned: false,
      submitted: false // 新增 submitted 状态
    }
  },
  computed: {
    totalScore() {
      // eslint-disable-next-line max-len
      return this.isAbandoned ? 0 : this.list.reduce((score, item, index) => (item === this.correctOrder[index] ? score + 2 : score), 0)
    }
  },
  methods: {
    checkOrder() {
      this.originalOrder = [...this.list]
    },
    checkBeforeSubmit() {
      this.$confirm('机会只有一次，要检查一下吗？', '提示', {
        confirmButtonText: '检查',
        cancelButtonText: '提交',
        type: 'info'
      })
        .then(() => {
          // 用户选择检查，可以继续排序
        })
        .catch(() => {
          // 用户选择提交，弹出打分弹窗
          this.submit()
        })
    },
    submit() {
      if (!this.submitted) {
        this.dialogVisible = true
        this.submitted = true // 用户提交后将 submitted 设置为 true
      }
    },
    resetOrder() {
      this.$confirm('你真的要放弃吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list = [...this.correctOrder]
          this.$message.success('已放弃，已重置为正确排序！')
          this.isAbandoned = true
          this.submitted = true // 用户放弃也将 submitted 设置为 true
        })
        .catch(() => {
          // 用户点击取消，不进行任何操作
        })
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

  <!-- <style lang="less" scoped>
    .draggable-container {
      border: 1px solid #ccc;
      padding: 10px;
      width: 70%;
      height: 100vh;
      margin: auto;
      background-color: #f5f5f5;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .draggable-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .draggable-item {
      border: 1px solid #ccc;
      width: 100%;
      margin: 5px 0;
      padding: 10px;
      cursor: move;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      font-family: 'Courier New', Courier, monospace;
    }
    .button-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    button {
      margin-top: 10px;
      padding: 8px 16px;
      font-size: 14px;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button + button {
      margin-left: 30px;
      background-color: #ff5555;
    }
    .score-container {
      display: flex;
      justify-content: space-between;
    }
    .column {
      flex: 1;
    }
    .score {
      text-align: center;
      margin-top: 20px;
      font-size: 18px;
    }
    .button-container button.disabled {
      cursor: not-allowed;
    }
  </style>
 -->
 <style lang="scss" scoped>
 .draggable-container {
   border: 1px solid #ccc;
   padding: 10px;
   width: 70%;
   height: 100vh;
   margin: auto;
   background-color: #f5f5f5;
   border-radius: 8px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   display: flex;
   flex-direction: column;
   align-items: center;

   .draggable-list {
     width: 100%;
     display: flex;
     flex-direction: column;
     align-items: center;

     .draggable-item {
       border: 1px solid #ccc;
       width: 100%;
       margin: 5px 0;
       padding: 10px;
       cursor: move;
       background-color: #fff;
       border-radius: 4px;
       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
       display: flex;
       align-items: center;
     }
   }

   pre {
     margin: 0;
     white-space: pre-wrap;
     font-family: 'Courier New', Courier, monospace;
   }

   .button-container {
     width: 100%;
     display: flex;
     justify-content: center;

     button {
       margin-top: 10px;
       padding: 8px 16px;
       font-size: 14px;
       background-color: #409eff;
       color: #fff;
       border: none;
       border-radius: 4px;
       cursor: pointer;

       & + button {
         margin-left: 30px;
         background-color: #ff5555;
       }
     }
   }

   .score-container {
     display: flex;
     justify-content: space-between;

     .column {
       flex: 1;
     }

     .score {
       text-align: center;
       margin-top: 20px;
       font-size: 18px;
     }

     .button-container button.disabled {
       cursor: not-allowed;
     }
   }
 }
</style>
