<template>
  <div>
    <template>
      <el-table
        v-loading="listLoading"
        :data="studentGrade"
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

        <!-- 基础实验成绩列 -->
        <el-table-column label="拓展实验成绩">
          <template slot-scope="scope">
            {{ scope.row.extension_score }}
          </template>
        </el-table-column>

        <!-- 时间列 -->
        <el-table-column label="时间">
          <template slot-scope="scope">
            {{ formatDateTime(scope.row.exam_date) }}
          </template>
        </el-table-column>
      </el-table>
    </template>

  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getUserGrade } from '@/api/grade'
export default {
  data() {
    return {
      studentGrade: [], // 学生成绩数据
      listLoading: false // 是否加载中
    }
  },
  computed: {
    ...mapGetters([
      'student_id'
    ])
  },
  created() {
    this.fetchUserGrade(this.student_id)
  },
  methods: {
    // 获取用户成绩
    fetchUserGrade(student_id) {
      this.listLoading = true // 设置加载状态为 true
      getUserGrade(student_id)
        .then(response => {
          this.studentGrade = response.data // 将获取到的数据赋值给 studentGrade
        })
        .catch(error => {
          console.error('Error fetching user grade:', error)
        })
        .finally(() => {
          this.listLoading = false // 加载完成后设置加载状态为 false
        })
    },
    // 使用 Moment.js 格式化日期时间
    formatDateTime(dateTimeString) {
      return moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
