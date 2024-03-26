<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="筛选条件">
        <el-select v-model="filterForm.filterKey" placeholder="请选择">
          <el-option label="学号" value="student_id" />
          <el-option label="姓名" value="nickname" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="filterForm.keyword" placeholder="请输入关键词" />
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
      <!-- 学号列 -->
      <el-table-column align="center" label="学号" width="120">
        <template slot-scope="scope">
          {{ scope.row.student_id }}
        </template>
      </el-table-column>

      <!-- 姓名列 -->
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <!-- 理论实验成绩列 -->
      <el-table-column label="理论实验成绩">
        <template slot-scope="scope">
          {{ scope.row.theory_score }}
        </template>
      </el-table-column>

      <!-- 基础实验成绩列 -->
      <el-table-column label="基础实验成绩">
        <template slot-scope="scope">
          {{ scope.row.basic_score }}
        </template>
      </el-table-column>

      <!-- 拓展实验成绩列 -->
      <el-table-column label="拓展实验成绩">
        <template slot-scope="scope">
          {{ scope.row.extension_score }}
        </template>
      </el-table-column>

      <!-- 总分列 -->
      <el-table-column label="总分">
        <template slot-scope="scope">
          {{ scope.row.total_score }}
        </template>
      </el-table-column>

      <!-- 编辑操作列 -->
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 自定义编辑弹窗 -->
    <el-dialog
      title="编辑成绩"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetEditForm"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="学号">
          <el-input v-model="editForm.student_id" disabled />
        </el-form-item>
        <el-form-item label="理论实验成绩">
          <el-input v-model="editForm.theory_score" />
        </el-form-item>
        <el-form-item label="基础实验成绩">
          <el-input v-model="editForm.basic_score" />
        </el-form-item>
        <el-form-item label="拓展实验成绩">
          <el-input v-model="editForm.extension_score" />
        </el-form-item>
        <el-form-item label="总分">
          <el-input v-model="editForm.total_score" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUserGrades, deleteUserGrade, updateUserGrade } from '@/api/grade.js'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false, // 对话框显示状态
      editForm: {
        id: '',
        student_id: '',
        basic_score: '',
        theory_score: '',
        extension_score: '',
        total_score: ''
      }, // 编辑表单数据
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
    fetchData() {
      this.listLoading = true
      getAllUserGrades().then(response => {
        this.list = response.data
        this.listLoading = false
        // 初始化筛选列表
        this.filteredList = this.list
      }).catch(error => {
        console.error('获取用户列表失败', error)
      })
    },
    handleEdit(row) {
      this.editForm = {
        id: row.id,
        student_id: row.student_id,
        basic_score: row.basic_score,
        theory_score: row.theory_score,
        extension_score: row.extension_score,
        total_score: row.total_score
      }
      // 打开编辑对话框，并传递当前行的信息
      this.dialogVisible = true
    },

    // 保存编辑后的数据
    saveEdit() {
      // 调用后端接口更新数据
      updateUserGrade(this.editForm).then(() => {
        // 更新成功后关闭对话框，并重新获取数据刷新页面
        this.dialogVisible = false
        this.fetchData()
        this.$message({
          type: 'success',
          message: '编辑成功！'
        })
      }).catch(err => {
        // 更新失败时给出提示
        console.error(err)
        this.$message.error('编辑失败，请稍后重试！')
      })
    },
    // 关闭编辑弹窗时重置编辑表单
    resetEditForm() {
      this.editForm = {
        id: '',
        student_id: '',
        basic_score: '',
        theory_score: '',
        extension_score: '',
        total_score: ''
      }
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
    },
    // 删除按钮点击事件
    handleDelete(row) {
      // 弹出确认框，让用户确认是否要删除
      this.$confirm(`确认删除学号为 ${row.student_id} 的成绩吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击了确定按钮
        deleteUserGrade(row.student_id).then(() => {
          // 删除成功后重新获取数据刷新页面
          this.fetchData()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        }).catch(err => {
          // 删除失败时给出提示
          console.error(err)
          this.$message.error('删除失败，请稍后重试！')
        })
      }).catch(() => {
        // 用户点击了取消按钮，不做任何操作
        this.$message.info('已取消删除操作')
      })
    }

  }
}
</script>
