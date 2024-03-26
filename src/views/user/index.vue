<template>
  <div class="app-container">
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="筛选条件">
        <el-select v-model="filterForm.filterKey" placeholder="请选择">
          <el-option label="学号" value="student_id" />
          <el-option label="姓名" value="nickname" />
          <el-option label="班级" value="classname" />
          <el-option label="专业" value="major" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="filterForm.keyword" placeholder="请输入关键词" @keydown.enter="handleFilter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">筛选</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="filteredList"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="学号" width="120">
        <template slot-scope="scope">
          {{ scope.row.student_id }} <!-- 显示学号 -->
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.nickname }} <!-- 显示姓名 -->
        </template>
      </el-table-column>
      <el-table-column label="班级">
        <template slot-scope="scope">
          {{ scope.row.classname }} <!-- 显示班级 -->
        </template>
      </el-table-column>
      <el-table-column label="专业">
        <template slot-scope="scope">
          {{ scope.row.major }} <!-- 显示专业 -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 自定义编辑弹窗 -->
    <!-- .sync 修饰符是 Vue.js 中的一种简化语法，
        它的作用是将父组件中对子组件属性的修改同步到父组件中，实现父子组件之间的双向绑定。 -->
    <el-dialog
      title="编辑学生信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="resetEditForm"
      @keydown.enter.native="saveEditOnEnter"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="学号">
          <el-input v-model="editForm.student_id" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="editForm.classname" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="editForm.major" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStudentList, deleteUser, editUser } from '@/api/userinfo.js'
import { Message } from 'element-ui' // 导入 Element UI 的 Message 组件

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      editDialogVisible: false,
      editForm: {
        id: '',
        student_id: '',
        nickname: '',
        classname: '',
        major: ''
      },
      filterForm: {
        filterKey: '', // 筛选条件
        keyword: '' // 关键词
      },
      filteredList: [] // 经过搜索和筛选后的列表
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取用户列表数据
    fetchData() {
      this.listLoading = true
      // 获取用户列表数据
      getStudentList()
        .then(response => {
          // 更新列表数据
          this.list = response.data
          this.listLoading = false
          // 初始化筛选列表
          this.filteredList = this.list
        })
        .catch(error => {
          console.error('获取用户列表失败', error)
        })
    },
    // 编辑按钮点击事件
    handleEdit(row) {
      // 填充编辑表单数据
      this.editForm.id = row.id
      this.editForm.student_id = row.student_id
      this.editForm.nickname = row.nickname
      this.editForm.classname = row.classname
      this.editForm.major = row.major

      // 打开编辑弹窗
      this.editDialogVisible = true
    },
    // 保存编辑
    saveEdit() {
      editUser(this.editForm)
        .then(response => {
          Message.success('保存成功')
          this.editDialogVisible = false
          this.fetchData() // 重新获取用户列表数据
        })
        .catch(error => {
          console.error('保存编辑失败', error)
          Message.error('保存失败')
        })
    },
    // 关闭编辑弹窗时重置编辑表单
    resetEditForm() {
      this.editForm = {
        id: '',
        student_id: '',
        nickname: '',
        classname: '',
        major: ''
      }
    },
    // 删除按钮点击事件
    handleDelete(row) {
      // 弹出确认框
      const confirmMsg = `确定要删除学生 ${row.nickname} 吗？`
      this.$confirm(confirmMsg, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 用户点击了确认按钮，执行删除操作
          const userId = row.id
          deleteUser(userId)
            .then(response => {
              // 重新获取用户列表数据
              this.fetchData()
            })
            .catch(error => {
              // 处理删除失败的逻辑
              console.error('删除用户失败', error)
            })
        })
        .catch(() => {
          // 用户点击了取消按钮，不执行任何操作
          Message.info('已取消删除操作')
        })
    },
    // 处理搜索事件
    handleFilter() {
      if (!this.filterForm.keyword.trim()) {
        this.filteredList = this.list
        return
      }
      this.filteredList = this.list.filter(item => {
        return item[this.filterForm.filterKey].toLowerCase().includes(this.filterForm.keyword.trim().toLowerCase())
      })
      // 显示筛选成功提示
      this.$message({
        message: '筛选成功',
        type: 'success',
        duration: 2000 // 显示时长为2秒
      })
    }
  }
}
</script>
