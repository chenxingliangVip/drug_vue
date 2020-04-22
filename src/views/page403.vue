<template>
  <!-- 403 -->
  <div class="error-tip-info">
    <div class="error-tip">
      <p class="error-tip-text">没有权限</p>
      <p class="error-tip-describing">您暂时还没有权限访问该页面，请联系管理员！</p>
    </div>
    <el-button @click="backupLogin" type="info" icon='arrow-left' class="pan-back-btn">返回</el-button>
  </div>
</template>

<script>
  export default {
    name: "page403",
    methods: {
      backupLogin() {
        this.$router.push({path: '/login'})
      },
    }
  }
</script>

<style scoped>
  /*错误提示页面*/
  .error-tip-info { text-align: center; padding: 60px; }
  .error-flag { font-size: 100px; }
  .error-flag-pic { display: block; font-size: 120px; }
  .error-code { color: #666;display: block; line-height: 1;}
  .error-tip-text { font-size: 30px; color: #555; margin-bottom: 6px; }
  .error-tip-describing { font-size: 16px; color: #888; }
  .error-flag-pic .fa-question-circle-o { color: #d35400; }
  .error-flag-pic .fa-hand-stop-o { color: #f39c12; }
  .error-flag-pic .fa-exclamation-triangle { color: #e74c3c; }
</style>
