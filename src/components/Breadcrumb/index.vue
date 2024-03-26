<template>
  <!-- 面包屑容器 -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 使用过渡效果的面包屑项容器 -->
    <transition-group name="breadcrumb">
      <!-- 遍历渲染每个面包屑项 -->
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 根据条件判断是否显示文本或链接 -->
        <span v-if="item.redirect==='noRedirect' || index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    // 监听路由变化，更新面包屑
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    // 在组件创建时初始化面包屑
    this.getBreadcrumb()
  },
  methods: {
    // 获取面包屑数据
    getBreadcrumb() {
      // 过滤出带有 meta.title 的路由项
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      // 如果第一个匹配项不是首页，则在数组开头添加默认的首页路由
      if (!this.isHome(first)) {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }

      // 过滤需要显示的面包屑项
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    // 判断是否为首页
    isHome(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
    },
    // 解决路由参数问题，将路径编译成实际路径
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    // 处理点击链接事件
    handleLink(item) {
      const { redirect, path } = item
      // 如果有重定向路径，则执行路由重定向
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      // 否则，执行路径编译并进行路由跳转
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  // 不可点击文本的样式
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
