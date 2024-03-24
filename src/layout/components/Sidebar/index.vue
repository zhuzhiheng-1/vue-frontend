<template>
  <!-- 根据是否显示 Logo 动态设置外层容器的 class -->
  <div :class="{'has-logo': showLogo}">
    <!-- Logo 组件，根据是否显示 Logo 控制其显示与否 -->
    <logo v-if="showLogo" :collapse="isCollapse" />

    <!-- el-scrollbar 组件用于添加滚动条，wrap-class 设置滚动条外层容器的 class -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- el-menu 组件，用于展示菜单 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 遍历路由数组，渲染 SidebarItem 组件 -->
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    // 使用 mapGetters 导入 'sidebar' 模块的 getter
    ...mapGetters([
      'sidebar',
      'permission_routes'
    ]),
    // 获取路由数组
    routes() {
      return this.$router.options.routes
    },
    // 获取当前激活的菜单项
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // 如果设置了 activeMenu，则侧边栏会高亮显示设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // 是否显示 Logo 的计算属性
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // 获取样式变量
    variables() {
      return variables
    },
    // 判断侧边栏是否折叠的计算属性
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
