<template>
  <!-- 整体布局容器 -->
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端侧边栏背景 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 侧边栏组件 -->
    <sidebar class="sidebar-container" />
    <!-- 主体内容容器 -->
    <div class="main-container">
      <!-- 固定头部导航栏 -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!-- 主体内容区域 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    // 从 Vuex 中获取侧边栏状态
    sidebar() {
      return this.$store.state.app.sidebar
    },
    // 从 Vuex 中获取设备类型
    device() {
      return this.$store.state.app.device
    },
    // 从 Vuex 中获取固定头部状态
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    // 动态计算样式类对象
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // 处理在移动端点击侧边栏外部的事件
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  // 移动端打开侧边栏时，将布局设置为固定定位，防止页面滚动
  &.mobile.openSidebar{
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

// 隐藏侧边栏时，头部宽度变窄
.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

// 移动端情况下，头部宽度占满整个屏幕
.mobile .fixed-header {
  width: 100%;
}
</style>
