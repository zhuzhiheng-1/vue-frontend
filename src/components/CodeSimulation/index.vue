<template>
  <div class="code-editor">

    <div class="code-animation">
      <codemirror ref="myCodeMirror" v-model="simulationcode" class="my-code-mirror" :options="editorOptions" />
      <div class="animation-container">
        <div class="animation-step">
          <p>{{ getCurrentStepInfo() }}</p>
        </div>
        <div class="animation-place">
          <animation ref="animationRef" :current-frame="currentFrame" :actions="actions" @prev-frame="prevFrame" @next-frame="nextFrame" />
        </div>
      </div>
    </div>

    <div class="button-container">
      <!-- <el-button type="text" :disabled="currentMarkedIndex === 0" class="step-button" @click="markPrevLine">
        上一步
      </el-button> -->

      <el-steps :active="currentMarkedIndex" finish-status="success" class="custom-steps">
        <el-step
          v-for="(line, index) in markedLines"
          :key="index"
          :title="getTitle(index)"
          class="custom-step"
          :class="{ 'active-step': index === currentMarkedIndex }"
        />
      </el-steps>

      <el-button
        type="text"
        :disabled="currentMarkedIndex === markedLines.length - 1"
        class="step-button"
        @click="markNextLine"
      >
        执行
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 导入 CodeMirror 组件
import { codemirror } from 'vue-codemirror'
// 导入动画组件
import Animation from '@/components/Animation/index.vue'
// 导入样式、主题、代码风格等配置或样式文件
import '@/utils/cm-setting'

// 导出组件定义
export default {
  // 注册使用的组件
  components: {
    codemirror,
    Animation
  },
  // 数据对象，返回默认数据
  data() {
    return {
      // 是否显示步骤容器
      showStepContainer: false,
      // CodeMirror 的配置项
      editorOptions: {
        mode: 'text/x-c++src',
        lineNumbers: true,
        readOnly: true,
        theme: 'monokai',
        lineWrapping: true, // 自动换行配置
        gutters: ['my-gutter'] // gutter 配置
      },
      // 当前标记的行号索引
      currentMarkedIndex: 0,
      currentFrame: -1 // 初始化或具体值
    }
  },
  computed: {
    ...mapGetters([
      'actions',
      'markedLines',
      'simulationcode'
    ])
  },
  watch: {
    currentFrame(newFrame) {
      // Update the current frame in the child component
      this.$refs.animationRef.executeActionWithParams(newFrame)
    }
  },
  // 组件挂载后调用
  mounted() {
    this.$nextTick(() => {
      // 在组件挂载后，调用标记行的方法
      this.markLine(this.markedLines[0].whichLine)
      this.scrollToCurrentLine()
    })
  },
  methods: {
    prevFrame() {
      if (this.currentFrame > 0) {
        this.currentFrame--
      }
    },
    nextFrame() {
      if (this.currentFrame < this.actions.length - 1) {
        this.currentFrame++
      }
    },
    // 标记指定行
    markLine(whichLine) {
      const cm = this.$refs.myCodeMirror.codemirror
      const line = cm.getLineHandle(whichLine - 1)

      if (line) {
        cm.setGutterMarker(line, 'my-gutter', this.createMarkerElement())
      }
    },
    // 创建标记元素
    createMarkerElement() {
      const marker = document.createElement('div')
      marker.className = 'marked-gutter'
      return marker
    },
    // 标记上一行
    markPrevLine() {
      if (this.currentMarkedIndex > 0) {
        this.removeGutterMarker(this.currentMarkedIndex)
        // eslint-disable-next-line no-plusplus
        this.currentMarkedIndex--
        this.updateGutterMarker()
        this.scrollToCurrentLine()
        this.prevFrame()
      }
    },
    // 标记下一行
    markNextLine() {
      if (this.currentMarkedIndex < this.markedLines.length - 1) {
        this.removeGutterMarker(this.currentMarkedIndex)
        // eslint-disable-next-line no-plusplus
        this.currentMarkedIndex++
        this.updateGutterMarker()
        this.scrollToCurrentLine()
        this.nextFrame()
      }
    },
    // 移除标记
    removeGutterMarker(lineNumber) {
      const cm = this.$refs.myCodeMirror.codemirror
      const line = cm.getLineHandle(this.markedLines[lineNumber].whichLine - 1)

      if (line) {
        cm.setGutterMarker(line, 'my-gutter', null)
      }
    },
    // 更新标记
    updateGutterMarker() {
      const cm = this.$refs.myCodeMirror.codemirror
      const currentMarkedLine = this.markedLines[this.currentMarkedIndex]

      // 根据完成状态切换 showStepContainer
      this.showStepContainer = this.currentMarkedIndex < this.markedLines.length

      if (currentMarkedLine) {
        const line = cm.getLineHandle(currentMarkedLine.whichLine - 1)
        if (line) {
          cm.setGutterMarker(line, 'my-gutter', this.createMarkerElement())
        }
      }
    },
    // 滚动到当前标记的行
    scrollToCurrentLine() {
      const cm = this.$refs.myCodeMirror.codemirror
      const currentMarkedLine = this.markedLines[this.currentMarkedIndex]

      if (currentMarkedLine) {
        const lineNum = currentMarkedLine.whichLine - 1
        cm.scrollIntoView({ line: lineNum, ch: 0 }, 100) // 100 是动画时间，可以根据需要调整
      }
    },
    // 根据当前步骤索引返回标题
    getTitle(index) {
      // 根据当前步骤索引返回标题
      return `第${String(this.markedLines[index].whichLine)}行`
    },
    // 获取当前步骤的描述信息
    getCurrentStepInfo() {
      if (this.currentMarkedIndex < this.markedLines.length) {
        return this.markedLines[this.currentMarkedIndex].stepInfo
      }
      return '' // 或者返回一些默认值
    }
  }

}
</script>

<style lang="scss" scoped>
.code-editor {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.code-animation {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.my-code-mirror{
  flex: 1;
}

.code-editor ::v-deep .CodeMirror-wrap {
  margin-top: 10px;
  height: 80vh;
  overflow: hidden;
  border: #304156 2px solid;
}

.code-editor ::v-deep .marked-gutter::before {
  margin-top: 2px;
  content: '→';
  display: block;
  width: 15px;
  height: 10px;
  line-height: 10px;
  background-color: rgb(237, 237, 29);
  color: #ea420f;
  /* 箭头的颜色 */
}

.code-editor ::v-deep .CodeMirror-gutters {
  background-color: #304156
}

.button-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  height: 12vh;
}

.step-button {
  margin: 0 10px;
  color: #ffffff;
  background-color: #304156;
}

.step-button:hover {
  background-color: #304156;
  color: #ffffff;
}

.custom-steps {
  flex-grow: 1;
}

.custom-steps ::v-deep .active-step .el-step__title.is-process {
  color:#304156
}

/* 动画容器 */
.animation-container {
  margin: 10px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  // 说明区
  .animation-step {
    border-radius: 20px;
    background: #304156;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 10%;

    p {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  // 动画区
  .animation-place {
    margin-top: 10px;
    height: 90%;
    background-color: #304156;
    border-radius: 20px;
  }
}
</style>
<!-- /* 当你在组件的 <style> 标签中使用 scoped 属性时，Vue.js 会为样式添加一个唯一的标识符，确保这些样式只应用在当前组件内，以防止全局样式冲突。
需要在组件内部访问子组件的 DOM 元素或者样式，而 scoped 样式默认不会渗透到子组件中。这时，深度选择器 ::v-deep 或 >>>
需要在组件内部访问子组件的 DOM 元素或者样式，而 scoped 样式默认不会渗透到子组件中。这时，深度选择器 ::v-deep 或 >>> 就变得有用了。
在复杂的应用中，可能存在多个组件嵌套的情况，每个组件都有自己的 scoped 样式。为了避免样式冲突，需要在组件内穿透样式以确保正确的样式应用。
递归地为 ::v-deep 或 >>> 后面的每个选择器添加一个额外的属性，以确保样式规则能够穿透到子组件的 DOM 结构中。
确保了样式规则在局部是唯一的，同时穿透到了子组件的 DOM 结构中 */

/* ::v-deep .CodeMirror-gutter  {
background-color: rgb(0, 0, 0) !important;
} */
/* ::v-deep.CodeMirror-gutter.marked {
color: yellow !important;
}
::v-deep.marked-gutter {
background-color: yellow;
} */ -->
