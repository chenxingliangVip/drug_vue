<template>
  <el-dialog :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
             width="45%"
             title="编辑·部门">
    <el-form ref="dataForm"
             label-position="left"
             size="mini"
             label-width="0px">
      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span>所属部门 <i class="i_colon">：</i></span></label>
        <el-select v-model="deptDetail.pId"
                   size="mini"
                   clearable
                   style="width: 140px;margin-left: 15px;">
          <el-option v-for="item in deptList"
                     :key="item.id"
                     :label="item.deptName"
                     :value="item.id" />
        </el-select>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span style="letter-spacing:15px">部门<i class="i_colon">：</i></span></label>
        <el-input clearable size="mini"  v-model="deptDetail.deptName"
                  style="width: 140px"/>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span>部门类型 <i class="i_colon">：</i></span></label>
        <template>
          <el-checkbox-group v-model="deptTypes">
            <el-checkbox label="1">送检部门</el-checkbox>
            <el-checkbox label="2">检验部门</el-checkbox>
          </el-checkbox-group>
          <!--<el-radio v-model="deptDetail.deptType" label="1">送检部门</el-radio>-->
          <!--<el-radio v-model="deptDetail.deptType" label="2">检验部门</el-radio>-->
          <!--<el-radio v-model="deptDetail.deptType" label="3">全选</el-radio>-->
          <!--<el-radio v-model="deptDetail.deptType" label="0">全不选</el-radio>-->
        </template>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 20px">
        <label style=" margin-left: 10px;"><span>所属科室 <i class="i_colon">：</i></span></label>
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
        提 交
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
        deptTypes:[],
        deptList:[],
        deptDetail: {id:"",deptName:"",office:false,deptType:"1",pId:""}
      }
    },

    mounted(){
      let self = this;
      self.$eventBus.$on("openOrganizeAdd",function (val) {
        self.deptTypes = [];
        self.deptDetail.deptName = val.deptName;
        self.deptDetail.id = val.id;
        self.deptDetail.deptType = val.deptType;
        self.deptDetail.pId = val.pId;
        self.getDeptList(val.id);
        if(val.deptType =='1' ||val.deptType=='2'){
          self.deptTypes.push(val.deptType);
        }
        if(val.deptType =='3'){
          self.deptTypes.push('1');
          self.deptTypes.push('2');
        }
        self.deptDetail.office = val.office == '1'?true:false;
        self.count = 0;
        self.centerDialogVisible = true;
      })
    },

    methods: {
      getDeptList(id) {
        let self = this;
        self.$http({
          url: "/drug/dept/queryDeptChooseList",
          method: "post",
          params: {id:id}
        }).then(resp => {
          if (resp.success) {
            if(resp.result.length > 0){
              self.deptList = resp.result;
            }
          }
        });
      },
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
        if(self.deptTypes.length == 0){
          self.deptDetail.deptType = '0';
        }
        if(self.deptTypes.length == 1){
          self.deptDetail.deptType = self.deptTypes[0];
        }
        if(self.deptTypes.length == 2){
          self.deptDetail.deptType = '3';
        }
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
