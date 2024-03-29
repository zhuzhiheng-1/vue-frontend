<template>
  <div>
    <!-- Canvas 用于绘制栈、堆、对象 -->
    <canvas ref="stackCanvas" width="600" height="500" />

    <!-- <button @click="pushElement('stack')">压入栈</button>
    <button @click="popElement('stack')">弹出栈</button>
    <button @click="peekElement('stack')">查看栈顶</button>
    <br>
    <button @click="pushElement('heap')">压入堆</button>
    <button @click="popElement('heap')">弹出堆</button>
    <button @click="peekElement('heap')">查看堆顶</button>
    <br>
    <button @click="modifyObject()">修改对象</button>
    <button @click="createObject()">创建对象</button>
    <br>
    <button @click="createPointer()">创建指针</button>
    <button @click="movePointerToStack()">移动指针至栈</button>
    <button @click="movePointerToHeap()">移动指针至堆</button>
    <button @click="movePointerToObject()">移动指针至对象</button> -->
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    currentFrame: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null,

      stack: [],
      stackSize: 5,
      stackWidth: 100,
      stackHeight: 80,
      stackGap: 10,
      baseX: 50,
      baseY: 500,

      heap: [],
      heapSize: 5,
      heapWidth: 100,
      heapHeight: 80,
      heapGap: 10,
      heapBaseX: 180,
      heapBaseY: 500,

      object: [],
      objectSize: 5,
      objectWidth: 100,
      objectHeight: 80,
      objectX: 300,
      objectY: 500,
      objectGap: 10,
      objectData: {
        name: '',
        age: '',
        gender: ''
      },

      pointer: null
    }
  },
  mounted() {
    // 在组件挂载后获取 canvas 上下文
    this.canvas = this.$refs.stackCanvas
    this.ctx = this.canvas.getContext('2d')
    // 初始绘制
    this.drawStack()
  },
  methods: {
    // 在子组件中执行当前帧对应的操作
    executeActionWithParams(newFrame) {
      console.log('Executing actions:', newFrame)
      const action = this.actions[newFrame]
      console.log('Action:', action)
      if (!action) {
        return
      }
      action.forEach(action => {
        // 根据操作类型执行对应的方法，传递参数
        switch (action.type) {
          case 'pushElement':
            this.pushElement(action.data)
            break
          case 'popElement':
            this.popElement(action.data)
            break
          case 'peekElement':
            this.peekElement(action.data)
            break
          case 'modifyObject':
            this.modifyObject()
            break
          case 'createObject':
            this.createObject()
            break
          case 'createPointer':
            this.createPointer()
            break
          case 'movePointerToStack':
            this.movePointerToStack()
            break
          case 'movePointerToHeap':
            this.movePointerToHeap()
            break
          case 'movePointerToObject':
            this.movePointerToObject()
            break
          case 'releaseElement':
            this.releaseElement()
            break
          default:
            break
        }
      })
    },

    // 绘制指针箭头
    drawPointer() {
      this.ctx.beginPath()
      this.ctx.moveTo(this.pointer.x, this.pointer.y)
      this.ctx.lineTo(this.pointer.x - 20, this.pointer.y - 10)
      this.ctx.lineTo(this.pointer.x - 20, this.pointer.y + 10)
      this.ctx.fillStyle = this.pointer.color
      this.ctx.fill()

      // 绘制指针名称
      this.ctx.font = '16px Arial'
      this.ctx.fillStyle = '#fff'
      this.ctx.fillText(this.pointer.name, this.pointer.x - 20, this.pointer.y - 20)
    },
    // 绘制整体内容
    drawStack() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // 绘制栈
      if (this.stack.length > 0) {
        this.ctx.fillStyle = '#ccc'
        this.ctx.fillRect(this.baseX, this.baseY - this.stackHeight * this.stackSize, this.stackWidth, this.stackHeight * this.stackSize)

        this.ctx.strokeStyle = '#000'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(this.baseX, this.baseY - this.stackHeight * this.stackSize, this.stackWidth, this.stackHeight * this.stackSize)

        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = '#000'
        this.ctx.fillText('Stack', this.baseX + 10, this.baseY - this.stackHeight * this.stackSize + 30)

        for (let i = 0; i < this.stack.length; i++) {
          this.ctx.fillStyle = '#ff0000'
          this.ctx.fillRect(this.baseX + this.stackGap, this.baseY - this.stackHeight * (i + 1) + this.stackGap, this.stackWidth - 2 * this.stackGap, this.stackHeight - 2 * this.stackGap)

          this.ctx.font = '16px Arial'
          this.ctx.fillStyle = '#fff'
          this.ctx.fillText(this.stack[i], this.baseX + this.stackWidth / 2 - 10, this.baseY - this.stackHeight * (i + 1) + this.stackHeight / 2)
        }
      }

      // 仅在堆有数据时绘制堆
      if (this.heap.length > 0) {
        this.ctx.fillStyle = '#ccc'
        this.ctx.fillRect(this.heapBaseX, this.heapBaseY - this.heapHeight * this.heapSize, this.heapWidth, this.heapHeight * this.heapSize)

        this.ctx.strokeStyle = '#000'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(this.heapBaseX, this.heapBaseY - this.heapHeight * this.heapSize, this.heapWidth, this.heapHeight * this.heapSize)

        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = '#000'
        this.ctx.fillText('Heap', this.heapBaseX + 10, this.heapBaseY - this.heapHeight * this.heapSize + 30)

        for (let i = 0; i < this.heap.length; i++) {
          this.ctx.fillStyle = '#00ff00'
          this.ctx.fillRect(this.heapBaseX + this.heapGap, this.heapBaseY - this.heapHeight * (i + 1) + this.heapGap, this.heapWidth - 2 * this.heapGap, this.heapHeight - 2 * this.heapGap)

          this.ctx.font = '16px Arial'
          this.ctx.fillStyle = '#000'
          this.ctx.fillText(this.heap[i], this.heapBaseX + this.heapWidth / 2 - 10, this.heapBaseY - this.heapHeight * (i + 1) + this.heapHeight / 2)
        }
      }

      // 绘制对象
      if (this.object.length > 0) {
        this.ctx.fillStyle = '#ccc'
        this.ctx.fillRect(this.objectX, this.objectY - this.objectHeight * this.objectSize, this.objectWidth, this.objectHeight * this.objectSize)

        this.ctx.strokeStyle = '#000'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(this.objectX, this.objectY - this.objectHeight * this.objectSize, this.objectWidth, this.objectHeight * this.objectSize)

        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = '#000'
        this.ctx.fillText('Object', this.objectX + 10, this.objectY - this.objectHeight * this.objectSize + 30)

        for (let i = 0; i < this.object.length; i++) {
          this.ctx.fillStyle = '#0000ff'
          this.ctx.fillRect(this.objectX + this.objectGap, this.objectY - this.objectHeight * (i + 1) + this.objectGap, this.objectWidth - 2 * this.objectGap, this.objectHeight - 2 * this.objectGap)

          this.ctx.font = '16px Arial'
          this.ctx.fillStyle = '#fff'
          // 根据实际对象数据来填充文本信息
          const object = this.object[i]
          this.ctx.fillText(`Name: ${object.name}`, this.objectX + 10, this.objectY - this.objectHeight * (i + 1) + this.objectGap * 3)
          this.ctx.fillText(`Age: ${object.age}`, this.objectX + 10, this.objectY - this.objectHeight * (i + 1) + this.objectGap * 4)
          this.ctx.fillText(`Gender: ${object.gender}`, this.objectX + 10, this.objectY - this.objectHeight * (i + 1) + this.objectGap * 5)
        }
      }
      if (this.pointer) {
        this.drawPointer() // 如果指针存在，则绘制指针
      }
    },

    // 入栈或入堆操作
    pushElement(type) {
      if (type === 'stack') {
        if (this.stack.length < this.stackSize) {
          const element = prompt('Enter element to push:')
          this.stack.push(element)
          this.drawStack()
        } else {
          alert('Stack is full!')
        }
      } else if (type === 'heap') {
        if (this.heap.length < this.heapSize) {
          const element = prompt('Enter element to push to heap:')
          this.heap.push(element)
          this.drawStack() // 重新绘制栈和堆
        } else {
          alert('Heap is full!')
        }
      } else if (type === 'object') {
        if (this.object.length < this.objectSize) {
          this.createObject()
        } else {
          alert('Object is full!')
        }
      }
    },

    // 出栈或出堆操作
    popElement(type) {
      if (type === 'stack') {
        if (this.stack.length > 0) {
          this.stack.pop()
          alert('Pop from stack!')
          this.drawStack()
        } else {
          alert('Stack is empty!')
        }
      } else if (type === 'heap') {
        if (this.heap.length > 0) {
          this.heap.pop()
          this.drawStack()
        } else {
          alert('Heap is empty!')
        }
      } else if (type === 'object') {
        if (this.object.length > 0) {
          this.object.pop()
          this.drawStack() // 重新绘制栈和堆和对象区
        } else {
          alert('Object is empty!')
        }
      }
    },

    // 查看栈顶或堆顶元素
    peekElement(type) {
      if (type === 'stack') {
        if (this.stack.length > 0) {
          const topElement = this.stack[this.stack.length - 1]
          alert('Top element of stack: ' + topElement)
        } else {
          alert('Stack is empty!')
        }
      } else if (type === 'heap') {
        if (this.heap.length > 0) {
          const topElement = this.heap[this.heap.length - 1]
          alert('Top element of heap: ' + topElement)
        } else {
          alert('Heap is empty!')
        }
      } else if (type === 'object') {
        if (this.object.length > 0) {
          const topElement = this.object[this.object.length - 1]
          alert('Top element of object: ' + topElement)
        } else {
          alert('Object is empty!')
        }
      }
    },

    // 修改对象属性
    modifyObject() {
      const newName = prompt('Enter new name:')
      const newAge = prompt('Enter new age:')
      const newGender = prompt('Enter new gender:')
      this.objectData.name = newName
      this.objectData.age = newAge
      this.objectData.gender = newGender
      this.drawStack() // 重新绘制对象信息
    },

    // 创建对象
    createObject() {
      const name = prompt('Enter object name:')
      const age = prompt('Enter object age:')
      const gender = prompt('Enter object gender:')

      // 创建新对象并添加到对象数组
      const newObject = {
        name: name,
        age: age,
        gender: gender
      }
      this.object.push(newObject)

      this.drawStack() // 重新绘制整体内容，包括对象区
    },

    // 创建指针
    createPointer(height) {
      // 创建指针...
      this.pointer = {
        x: this.baseX, // 初始指向栈区
        y: this.baseY, // 初始指向栈顶
        size: 10,
        color: '#0000ff',
        name: ''
      }
      const pointerName = prompt('Enter pointer name:')
      const targetArea = prompt('Enter target area (stack, heap, object):')

      // 根据目标区域确定指针的位置
      switch (targetArea) {
        case 'stack':
          this.pointer = {
            x: this.baseX, // 指向栈区左侧
            y: this.baseY - this.stackHeight * this.stackSize + 50, // 初始指向栈顶
            size: 10,
            color: '#0000ff',
            name: pointerName // 指针名称
          }
          break
        case 'heap':
          this.pointer = {
            x: 180, // 指向堆区左侧
            y: this.heapBaseY - 50 * height, // 初始指向堆底部
            size: 10,
            color: '#0000ff',
            name: pointerName // 指针名称
          }
          break
        case 'object':
          this.pointer = {
            x: this.objectX, // 指向对象区左侧
            y: this.objectY - this.objectHeight - 50, // 指向对象区中部
            size: 10,
            color: '#0000ff',
            name: pointerName // 指针名称
          }
          break
        default:
          alert('Invalid target area!')
          return
      }

      this.drawStack() // 重新绘制指针
    },

    // 移动指针到栈区
    movePointerToStack() {
      this.pointer.x = this.baseX
      this.pointer.y = this.baseY - this.stackHeight * this.stackSize + 50
      this.drawStack() // 重新绘制指针位置
    },

    // 移动指针到堆区
    movePointerToHeap() {
      this.pointer.x = 180
      this.pointer.y = this.heapBaseY - this.heapHeight * this.heapSize + 50
      this.drawStack() // 重新绘制指针位置
    },

    // 移动指针到对象区
    movePointerToObject() {
      this.pointer.x = this.objectX
      this.pointer.y = this.objectY - this.objectHeight + 50
      this.drawStack() // 重新绘制指针位置
    },
    // 释放分配的内存
    releaseElement() {
      // 清空栈
      this.stack = []

      // 清空堆
      this.heap = []

      // 清空对象区
      this.object = []

      // 清空指针
      this.pointer = null

      // 重新绘制画布
      this.drawStack()
    }
  }
}
</script>
