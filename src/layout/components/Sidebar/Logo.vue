<template>
  <!-- 渲染侧边栏 Logo 区域，根据是否折叠动态设置外层容器的 class -->
  <div class="sidebar-logo-container" :class="{'collapse': collapse}">
    <!-- 使用过渡效果，name 为 'sidebarLogoFade'，设置渐变动画 -->
    <transition name="sidebarLogoFade">
      <!-- 根据折叠状态动态渲染 router-link -->
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- 如果有 logo 图片，则渲染图片，否则渲染标题 -->
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <!-- 非折叠状态时渲染的 router-link -->
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    // 折叠状态的 prop
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    // 组件的数据
    return {
      title: 'Vue Admin Template',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
/* 使用 Sass 编写样式 */

/* 定义渐变动画效果 */
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

/* 定义侧边栏 Logo 区域的样式 */
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  /* 定义嵌套的样式，& 为父选择器的引用 */
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    /* 定义 Logo 图片的样式 */
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    /* 定义标题的样式 */
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  /* 在折叠状态下调整 Logo 图片的右边距 */
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
