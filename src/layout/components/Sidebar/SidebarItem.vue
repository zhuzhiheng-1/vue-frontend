<template>
  <!-- 只有当菜单项不隐藏时才渲染 -->
  <div v-if="!item.hidden">
    <!-- 如果只有一个子菜单项需要显示，且当前菜单项不是始终显示的，则渲染链接 -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!-- 渲染 el-menu-item 组件 -->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown': !isNest}">
          <!-- 渲染菜单项内容 -->
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 否则渲染 el-submenu 组件 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- 设置子菜单的标题 -->
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 递归渲染子菜单项 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // 路由对象
    item: {
      type: Object,
      required: true
    },
    // 是否嵌套子菜单
    isNest: {
      type: Boolean,
      default: false
    },
    // 基础路径
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // 用于修复 https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: 使用 render 函数进行重构
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 判断是否只有一个子菜单项需要显示
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // 临时设置（只有一个显示的子菜单项时将被使用）
          this.onlyOneChild = item
          return true
        }
      })

      // 当只有一个子路由时，默认显示该子路由
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由需要显示，则显示父路由
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    // 解析路径，处理外部链接
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
