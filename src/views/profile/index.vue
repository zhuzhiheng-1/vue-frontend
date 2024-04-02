<template>
  <div class="personal-center">
    <h1>个人中心</h1>
    <!-- 上传头像 -->
    <el-form label-width="100px">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="`/info/updateavatar`"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="handleUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <el-button type="primary" @click="handleUploadClick">选择并上传头像</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 更换密码 -->
    <el-form label-width="100px">
      <el-form-item label="旧密码">
        <el-input v-model="oldPwd" type="password" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="newPwd" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePassword">确认更改密码</el-button>
      </el-form-item>
    </el-form>

    <!-- 填写个人信息 -->
    <el-form label-width="100px">
      <el-form-item label="昵称">
        <el-input v-model="nickName" />
      </el-form-item>
      <el-form-item label="学号" prop="student_id">
        <el-input v-model="studentId" placeholder="教师学号命名为100000000n" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="className" placeholder="专业XX级-X班" />
        <span class="tips">格式示例:计算机科学与技术20级-1班</span>
      </el-form-item>
      <el-form-item label="专业">
        <el-select v-model="Major" placeholder="请选择专业">
          <el-option label="计算机科学与技术" value="计算机科学与技术" />
          <el-option label="人工智能" value="人工智能" />
          <el-option label="数据科学与大数据技术" value="数据科学与大数据技术" />
          <el-option label="软件工程" value="软件工程" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveInfo">保存个人信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { updatePassword, updateInfo, updateAvatar } from '@/api/userinfo'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      oldPwd: '', // 旧密码
      newPwd: '', // 新密码
      nickName: '',
      className: '',
      studentId: '',
      Major: '',
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'id', 'nickname', 'major', 'classname', 'student_id', 'avatar'
    ])
  },
  mounted() {
    // 在 mounted 钩子中给数据赋初值
    this.imageUrl = this.avatar || ''
    this.nickName = this.nickname || ''
    this.studentId = this.student_id || ''
    this.className = this.classname || ''
    this.Major = this.major || ''
  },
  methods: {
    // 点击按钮触发上传
    handleUploadClick() {
    // 通过 $refs 获取 el-upload 组件的实例
      const uploader = this.$refs.upload.$refs.input

      // 触发 el-upload 的上传事件
      uploader.click()
    },
    async handleUpload(file) {
      const url = URL.createObjectURL(file)
      // 在这里手动触发上传，并传递用户 id 和头像数据
      const data = {
        id: this.id,
        avatar: url
      }
      try {
        // 调用更新头像的接口函数，并传递数据对象
        const response = await updateAvatar(data)
        this.imageUrl = response.data.avatar // 更新头像图片地址
        this.$message.success('上传成功')
      } catch (error) {
        this.$message.error('上传失败: ' + error.message)
      }
    },

    handleSuccess(response, file) {
      // 处理上传成功的逻辑
      this.imageUrl = response.data.imageUrl
    },
    handleError(error) {
      // 处理上传失败的逻辑
      this.$message.error('上传失败: ' + error.message)
    },
    async updatePassword() {
      // 处理更新密码逻辑
      if (this.oldPwd === this.newPwd) {
        this.$message.error('新密码不能和旧密码相同！')
      } else {
        try {
          // 调用后端接口更新密码
          await updatePassword({
            id: this.id, // 用户ID，从 Vuex 中获取
            oldPwd: this.oldPwd, // 旧密码
            newPwd: this.newPwd // 新密码
          })
          this.$message.success('密码更新成功！')
        } catch (error) {
          console.error('更新密码失败:', error)
          this.$message.error('更新密码失败，请稍后重试！')
        }
      }
    },
    async saveInfo() {
      const data = {
        id: this.id,
        student_id: this.studentId,
        classname: this.className,
        nickname: this.nickName,
        major: this.Major
      }
      try {
        await updateInfo(data)
        this.$message.success('保存成功！')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败，请稍后重试！')
      }
    }
  }
}
</script>
<style>
/* 样式可以根据实际需要进行调整 */
.personal-center {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.tips {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
