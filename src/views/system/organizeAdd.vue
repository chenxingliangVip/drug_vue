<template>
  <el-dialog :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
             width="40%"
             title="编辑·部门">
    <el-form ref="dataForm"
             label-position="left"
             size="mini"
             label-width="0px">
      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span style="letter-spacing:15px">部门：</span></label>
        <el-input clearable size="mini"  v-model="deptDetail.deptName"
                  style="width: 140px"/>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span>部门类型 ：</span></label>
        <template>
          <el-radio v-model="deptDetail.deptType" label="1">送样部门</el-radio>
          <el-radio v-model="deptDetail.deptType" label="2">送检部门</el-radio>
        </template>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span>所属科室 ：</span></label>
        <template>
          <el-checkbox v-model="deptDetail.office">是</el-checkbox>
        </template>
      </div>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"   @click="updateDept"
                 size="mini"
                 style="width: 80px;">
        编辑
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { getToken } from '@/utils/auth' // 验权
  export default {
    name: "organizeAdd",
    props: ['editData'],
    data() {
      return {
        centerDialogVisible: false,
        clickModalHide: false,
        count: 0,
        deptDetail: {id:"",deptName:"",office:false,deptType:"1"}
      }
    },

    mounted(){
      let self = this;
      self.$eventBus.$on("openOrganizeAdd",function (val) {
        self.deptDetail.deptName = val.deptName;
        self.deptDetail.id = val.id;
        self.deptDetail.deptType = val.deptType;
        self.deptDetail.office = val.office == '1'?true:false;
        self.count = 0;
        self.centerDialogVisible = true;
      })
    },

    methods: {
      closeDialog() {
        this.centerDialogVisible = false;
      },
      updateDept(){
        let self = this;
        if(!self.deptDetail.deptName){
          self.$notify({
            title: '提示',
            message: "部门名字不能为空",
            type: 'warning'
          });
          return;
        }
        self.deptDetail.office = self.deptDetail.office?"1":"0";
        if (this.count == 0) {
          self.$http({
            url: "/drug/dept/updateDeptDetail",
            method: "post",
            params:self.deptDetail
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("getDeptList");
              self.$notify({
                title: '提示',
                message: "修改部门成功！",
                type: 'success'
              });
              self.centerDialogVisible = false;
              return
            }
            self.$notify({
              title: '提示',
              message: "出现异常，请联系管理员",
              type: 'error'
            });
            this.count--;
          });
          this.count++;
        }
      }
    }
  }
</script>
<style scoped>
  .el-checkbox{
    width: auto !important;
  }

  .el-dialog .el-dialog__body {
    padding: 10px 10px !important;
  }
</style>
