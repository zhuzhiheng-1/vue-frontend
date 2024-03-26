<template>
  <!-- 根据传入的 type 属性渲染不同的组件 -->
  <component :is="type" v-bind="linkProps(to)">
    <!-- 渲染组件的插槽内容 -->
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    // 目标链接地址
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 判断目标链接是否为外部链接
    isExternal() {
      return isExternal(this.to)
    },
    // 根据 isExternal 计算属性确定渲染的组件类型
    type() {
      if (this.isExternal) {
        // 如果是外部链接，渲染 a 标签
        return 'a'
      }
      // 否则渲染 router-link
      return 'router-link'
    }
  },
  methods: {
    // 根据 isExternal 计算属性确定链接的属性
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
