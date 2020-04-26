<template>
  <el-dialog :close-on-click-modal="clickModalHide"
             :before-close="closeDialog"
             :visible.sync="centerDialogVisible"
             width="40%"
             title="新增·部门">
    <el-form ref="dataForm"
             :model="deptDetail"
             label-position="left"
             size="mini"
             label-width="0px">
      <div class="dialog-title"><span>新增部门</span></div>
      <el-divider></el-divider>
      <div class="el-dialog-item el-dialog-input" style="margin-top:10px;">
        <el-checkbox v-model="firstChecked"></el-checkbox>
        <label style=" margin-left: 10px;">一级：</label>
        <el-input clearable  size="mini" :disabled="!firstChecked" v-model="firstValue" v-show="!secondChecked"
                  style="width: 140px"/>
        <el-select v-model="firstValue" v-show="secondChecked" @change="changeFirstCheck"
                   size="mini"
                   clearable
                   style="width: 140px">
          <el-option v-for="item in allDept"
                     :key="item.id"
                     :label="item.deptName"
                     :value="item.id" />
        </el-select>
      </div>
      <div class="el-dialog-item  el-dialog-input">
        <el-checkbox v-model="secondChecked" :disabled="!firstChecked"></el-checkbox>
        <label style=" margin-left: 10px;">二级：</label>
        <el-input clearable   :disabled="!secondChecked" v-show="!thirdChecked"
          size="mini"  v-model="secondValue"
          style="width: 140px"/>
        <el-select v-model="secondValue" v-show="thirdChecked"
                   size="mini"
                   clearable
                   style="width: 140px">
          <el-option v-for="item in secondDept"
                     :key="item.id"
                     :label="item.deptName"
                     :value="item.id" />
        </el-select>
      </div>

      <div class="el-dialog-item  el-dialog-input">
        <el-checkbox v-model="thirdChecked" :disabled="!firstChecked||!secondChecked"></el-checkbox>
        <label style=" margin-left: 10px;">三级：</label>
        <el-input clearable   :disabled="!thirdChecked"
          size="mini"  v-model="thirdValue"
          style="width: 140px"/>
      </div>

      <div class="el-dialog-item  el-dialog-input" style="margin-top: 30px">
        <label ><span>部门类型 ：</span></label>
        <template>
          <el-radio v-model="deptDetail.deptType" label="1">送样部门</el-radio>
          <el-radio v-model="deptDetail.deptType" label="2">送检部门</el-radio>
        </template>
      </div>

      <div class="el-dialog-item  el-dialog-input">
        <label ><span>所属科室 ：</span></label>
        <template>
          <el-checkbox v-model="deptDetail.office">是</el-checkbox>
        </template>
      </div>

    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"   @click="saveDept"
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
    name: "organizeEdit",
    props: ['editData','deptList'],
    data() {
      return {
        centerDialogVisible: false,
        clickModalHide: false,
        count: 0,
        deptDetail: {id:"",deptName:"",deptLevel:"",pId:"",createUser:"",office:false,deptType:"1"},
        firstChecked: false,
        secondChecked: false,
        thirdChecked: false,
        firstValue: "",
        secondValue: "",
        thirdValue: "",
        allDept:[],
        secondDept:[],
      }
    },

    methods: {
      closeDialog() {
        this.centerDialogVisible = false;
      },
      changeFirstCheck(val){
        for(let data of this.allDept){
           if(data.id == val){
              this.secondDept = data.children;
           }
        }
      },

      saveDept(){
        let self = this;
        if(!self.firstValue ||(this.secondChecked && !this.secondValue)){
          this.$notify({
            title: '提示',
            message: '请选择一级部门！',
            type: 'error',
            duration: 2000
          })
          return;
        }
        if(this.secondChecked && !this.secondValue){
          this.$notify({
            title: '提示',
            message: '请选择二级部门！',
            type: 'error',
            duration: 2000
          })
          return;
        }
        if(this.thirdChecked && !this.thirdValue){
          this.$notify({
            title: '提示',
            message: '请填写三级部门！',
            type: 'error',
            duration: 2000
          })
          return;
        }
        if(!this.secondChecked){
          this.deptDetail.deptName = this.firstValue;
          this.deptDetail.deptLevel = "1";
        }
        if(this.secondChecked && !this.thirdChecked){
          this.deptDetail.deptName = this.secondValue;
          this.deptDetail.deptLevel = "2";
          this.deptDetail.pId = this.firstValue;
        }
        if(this.thirdChecked){
          this.deptDetail.deptName = this.thirdValue;
          this.deptDetail.deptLevel = "3";
          this.deptDetail.pId = this.secondValue;
        }
        self.deptDetail.office = self.deptDetail.office?"1":"0";
        if (this.count == 0) {
          self.$http({
            url: "/drug/dept/addDeptDetail",
            method: "post",
            params:self.deptDetail
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("getDeptList");
              self.$notify({
                title: '提示',
                message: "添加部门成功！",
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
    },
    watch: {
      deptList(val){
        this.allDept = val;
      },
      editData(val) {
        let user = JSON.parse(getToken());
        this.deptDetail = {id:"",deptName:"",deptLevel:"",pId:"",createUser:"",office:false,deptType:"1"};
        this.deptDetail.createUser = user.id;
        this.count = 0;
        this.centerDialogVisible = true;
      },
      firstChecked(val){
        this.firstValue="";
        this.secondValue="";
        this.thirdValue="";
        if(!val){
          this.secondChecked = false;
          this.thirdChecked = false;
        }
      },
      secondChecked(val){
        this.firstValue="";
        this.secondValue="";
        this.thirdValue="";
        if(!val){
          this.thirdChecked = false;
        }
      },
      thirdChecked(val){
        this.firstValue="";
        this.secondValue="";
        this.thirdValue="";
      },
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
