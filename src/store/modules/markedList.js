const state = {
  markedLines: [
    { stepInfo: '执行main函数', whichLine: 73 },
    { stepInfo: '创建对象，传入动态分配内存的数据', whichLine: 75 },
    { stepInfo: '执行构造函数', whichLine: 16 },
    { stepInfo: '在堆区动态分配内存，并将 dynamicData 指向这块内存', whichLine: 22 },
    { stepInfo: '直接访问对象的属性', whichLine: 78 },
    { stepInfo: '调用公有方法，用于获取私有属性', whichLine: 68 },
    { stepInfo: '创建对象指针', whichLine: 80 },
    { stepInfo: '执行构造函数', whichLine: 16 },
    { stepInfo: '在堆区动态分配内存，并将 dynamicData 指向这块内存', whichLine: 22 },
    { stepInfo: '使用对象指针访问对象的属性', whichLine: 83 },
    { stepInfo: '浅拷贝', whichLine: 86 },
    { stepInfo: '拷贝构造函数 - 浅拷贝', whichLine: 39 },
    { stepInfo: '深拷贝', whichLine: 89 },
    { stepInfo: '拷贝构造函数 - 深拷贝', whichLine: 55 },
    { stepInfo: '深拷贝 dynamicData,分配新的内存并复制数据', whichLine: 61 },
    { stepInfo: '释放动态分配的内存', whichLine: 92 },
    { stepInfo: 'return 0', whichLine: 94 }
  ]
}
export default {
  namespaced: true,
  state
}
