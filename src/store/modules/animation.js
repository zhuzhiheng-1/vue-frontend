const state = {
  actions: [
    // main函数入栈
    [{ type: 'pushElement', data: 'stack' }],
    // 准备创建对象personObject
    [],
    // 1: personObject的构造函数入栈，2:对象区对象的创建 3:成功创建对象后构造函数出栈
    [
      { type: 'pushElement', data: 'stack' },
      { type: 'pushElement', data: 'object' },
      { type: 'popElement', data: 'stack' }
    ],
    // 在堆区动态分配内存,并将dynamicData指针指向这块内存
    [
      { type: 'pushElement', data: 'heap' },
      { type: 'createPointer', data: '1' }
    ],
    // 输出
    [],
    // 调用公有方法,用于获取私有属性
    [],
    // 创建对象指针
    [],
    // 1:调用构造函数入堆 2：创建对象指针 3:对象区对象的创建, 4:构造函数出堆
    [
      { type: 'pushElement', data: 'heap' },
      { type: 'createPointer', data: '2' },
      { type: 'pushElement', data: 'object' }
      // { type: 'popElement', data: 'heap' }
    ],
    // 在堆区动态分配内存,并将 dynamicData 指向这块内存
    [
      // { type: 'pushElement', data: 'heap' },
      // { type: 'createPointer', data: '3' }
    ],
    // 输出
    [],
    // 浅拷贝
    [],
    [],
    // 深拷贝
    [],
    // 1拷贝构造函数 - 深拷贝,只是创建了一个新对象
    [
      { type: 'pushElement', data: 'object' }
    ],
    // 1dynamicData分配一个新的堆区内存复制数据
    // 2并将 dynamicData 指向这块内存
    // 3将 personObject 的内容拷贝给了 personCopy，然后 personObject 就超出了作用域范围，会调用一次析构函数释放内存
    [
      { type: 'pushElement', data: 'heap' },
      { type: 'createPointer', data: '3' }
    ],
    // 释放动态分配的内存
    [{ type: 'releaseElement' }],
    // return 0
    []
  ]
}

export default {
  namespaced: true,
  state
}
