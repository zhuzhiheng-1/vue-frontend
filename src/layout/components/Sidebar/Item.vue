<script>
export default {
  // 组件的名称
  name: 'MenuItem',
  // 函数式组件，无状态，性能更好
  functional: true,
  // 组件的属性定义
  props: {
    // 图标的类名
    icon: {
      type: String,
      default: ''
    },
    // 菜单项的标题
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染函数，使用 h 函数创建虚拟节点
  render(h, context) {
    // 从上下文中获取传入的属性值
    const { icon, title } = context.props
    // 存储虚拟节点的数组
    const vnodes = []

    // 如果存在图标，则根据不同类型进行处理
    if (icon) {
      if (icon.includes('el-icon')) {
        // 如果是 Element UI 的图标类名，使用 i 标签渲染
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 否则使用自定义的 svg-icon 组件渲染
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    // 如果存在标题，则使用 span 标签渲染，并插入到指定插槽中
    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    // 返回虚拟节点数组
    return vnodes
  }
}
</script>

<style scoped>
/* 使用 scoped 属性，使样式仅在当前组件生效 */

/* 自定义图标的样式 */
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
