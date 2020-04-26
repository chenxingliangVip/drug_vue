<template>
  <el-dialog class="el-table-notice"
             title="信息发布"
             :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
             width="50%"
             append-to-body>
    <el-row type="flex"
            justify="center">
      <div class="el-dialog-title">
        <h2 style="display: inline;color: #cb0000;">{{ messageData.title }}</h2><br>
        <span style="display: inline">{{ messageData.createTimeFt }}</span>
      </div>
    </el-row>
    <el-row>
      <div class="el-dialog-message" v-html="messageData.content"></div>
    </el-row>
    <el-row type="flex"
            justify="end">

    </el-row>
  </el-dialog>
</template>
<script>
  export default {
    name:"detail",
    props:['detailData'],
    data(){
      return{
        messageData:{},
        centerDialogVisible: false,
        clickModalHide: false,
      }
    },
    methods:{
      //关闭弹窗
      closeDialog() {
        this.centerDialogVisible = false;
      },
    },
    watch:{
      detailData(val){
        this.centerDialogVisible = true;
        this.messageData = val;
      }
    }
  }
</script>
<style>
  .ql-align-center{
    text-align: center !important;
  }
  .ql-align-right{
    text-align: right !important;
  }
</style>
<style lang="scss" scoped>
  .el-dialog-title {
    margin-top: 20px;
    text-align: center;
  }
  .el-dialog-message {
    margin: 30px 0;
  }
  .el-dialog-time {
    margin-bottom: 30px;
  }
  .svg-icon {
    margin: 0px 20px;
    vertical-align: middle;
    margin-bottom: 2px;
  }

</style>
