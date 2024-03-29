<template>
  <div>
    <!-- 横向导航 -->
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">实验基础</el-menu-item>
      <el-menu-item index="2">实验原理</el-menu-item>
      <el-menu-item index="3">实验步骤</el-menu-item>
      <el-menu-item index="4">思考问题</el-menu-item>
      <el-button type="primary" style="margin-top: 10px;" @click="choiceHandle">
        进入实验
      </el-button>
      <el-button v-if="showCodeSimulationButton" type="primary" style="margin-top: 10px;" @click="codesimu">
        代码仿真
      </el-button>
      <!-- 其他导航项 -->
    </el-menu>
    <div class="content-wrapper">
      <!-- 内容承接处 -->
      <experiment-content
        v-if="selectedExperiment && !showSelectQuestionPage && !showFillInTheBlankPage && !showCodeSimulationPage && !showCodeDragPage"
        :title="selectedExperiment.title"
        :content="selectedExperiment.content"
      />
      <!-- 选择题 -->
      <select-question v-if="showSelectQuestionPage" />
      <!-- 填空题 -->
      <fill-in-the-blank v-if="showFillInTheBlankPage" />
      <!-- 代码仿真 -->
      <code-simulation v-if="showCodeSimulationPage" />
      <!-- 代码拖拽 -->
      <code-drag v-if="showCodeDragPage" />
    </div>
  </div>
</template>

<script>
import ExperimentContent from '@/components/ExperimentContent'
import SelectQuestion from '@/components/SelectQuestion'
import FillInTheBlank from '@/components/FillInTheBlank'
import CodeSimulation from '@/components/CodeSimulation'
import CodeDrag from '@/components/CodeDrag'
import { mapGetters } from 'vuex'
export default {
  components: {
    ExperimentContent,
    SelectQuestion,
    FillInTheBlank,
    CodeSimulation,
    CodeDrag
  },
  data() {
    return {
      activeIndex: '1',
      selectedExperiment: null,
      showSelectQuestionPage: false,
      showFillInTheBlankPage: false,
      showCodeSimulationPage: false,
      showCodeDragPage: false,
      showCodeSimulationButton: false
    }
  },
  computed: {
    ...mapGetters([
      'experimentsTheoretical',
      'experimentsBasic',
      'experimentsExtension'
    ]),
    currentGetter() {
      // 根据当前路由动态选择使用哪个 getter
      const path = this.$route.path
      if (path.includes('/experiment/theoretical')) {
        return 'experimentsTheoretical'
      } else if (path.includes('/experiment/basic')) {
        return 'experimentsBasic'
      } else if (path.includes('/experiment/extension')) {
        return 'experimentsExtension'
      }
      // 默认返回一个合适的值
      return 'experimentsTheoretical'
    }
  },
  created() {
  // 默认选择第一个实验基础
    this.selectExperimentByIndex('1')
    // 检查当前路由，如果是'/experiment/basic'，则显示代码仿真按钮
    this.showCodeSimulationButton = this.$route.path.includes('/experiment/basic')
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index
      this.selectExperimentByIndex(index)
      this.showSelectQuestionPage = false // 重置为false
      this.showCodeSimulationPage = false
      this.showFillInTheBlankPage = false
      this.showCodeDragPage = false
    },
    choiceHandle() {
      console.log('choiceHandle')
      const getterResult = this.currentGetter
      console.log('Getter Result:', getterResult)
      if (getterResult === 'experimentsTheoretical') {
        this.showSelectQuestionPage = true
        this.showFillInTheBlankPage = false // 隐藏填空题页面
        this.showCodeSimulationPage = false
        this.showCodeDragPage = false
      } else if (getterResult === 'experimentsBasic') {
        this.showSelectQuestionPage = false
        this.showFillInTheBlankPage = true // 显示填空题页面
        this.showCodeSimulationPage = false
        this.showCodeDragPage = false
      } else if (getterResult === 'experimentsExtension') {
        this.showSelectQuestionPage = false
        this.showFillInTheBlankPage = false
        this.showCodeSimulationPage = false
        this.showCodeDragPage = true // 显示代码拖拽页面
      }
      this.activeIndex = null // 重置为null，取消所有导航项的激活状态
    },
    codesimu() {
      this.showSelectQuestionPage = false
      this.showFillInTheBlankPage = false
      this.showCodeSimulationPage = true // 显示代码仿真页面
      this.showCodeDragPage = false
      this.activeIndex = null // 取消所有导航项的激活状态
    },
    selectExperimentByIndex(index) {
      // eg. this['experimentsTheoretical'] 就是获取到这个函数。
      const experiments = this[this.currentGetter]
      this.selectedExperiment = experiments.find(exp => exp.index === index)
    }
  }
}
</script>

<style scoped>
.content-wrapper {
  padding: 20px;
}
</style>
