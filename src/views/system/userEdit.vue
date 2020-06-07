<template>
  <el-dialog :visible.sync="dialogAddVisible"
             append-to-body
             :close-on-click-modal="false"
             width="24%"
             :before-close="closeDialog"
             :title="type == 'add'?'新增·用户':'编辑·用户'">
    <el-form ref="dataForm"
             :rules="rules"
             :model="loginData"
             label-position="left"
             size="mini"
             >
      <div class="dialog-title">
		  	<span v-if="type=='add'">新增用户</span>
		  	<span v-else style='color:#cb0000'>编辑用户</span>
      </div>
      <el-divider></el-divider>
      <el-form-item prop="deptId" style="margin-bottom: 10px">
      	<span class="span_colon">部    门 <i class="i_colon">：</i></span>
        <el-select v-model="loginData.deptId"
                   size="mini"
                   clearable
                   style="width: 120px">
          <el-option v-for="item in deptList"
                     :key="item.id"
                     :label="item.deptName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="roleId"  style="margin-bottom: 10px">
      	<span class="span_colon">职  务 <i class="i_colon">：</i></span>
        <el-select v-model="loginData.roleId" @change="changeRole"
                   size="mini"
                   clearable
                   style="width: 120px">
          <el-option v-for="item in roleList"
                     :key="item.id"
                     :label="item.roleName"
                     :value="item.id" />
        </el-select>
      </el-form-item>
        <el-form-item prop="workNum"  style="margin-bottom: 10px">
      	<span class="span_colon">工  号  <i class="i_colon">：</i></span>
          <el-input clearable  v-model="loginData.workNum"
                    size="mini"
                    style="width: 120px" />
        </el-form-item>
      <el-form-item prop="userName"  style="margin-bottom: 10px">
      	<span class="span_colon">姓  名  <i class="i_colon">：</i></span>
        <el-input clearable  v-model="loginData.userName"
                  size="mini"
                  style="width: 120px" />
      </el-form-item>
      <el-form-item prop="userAccount"  style="margin-bottom: 10px">
      	<span class="span_colon">用户名<i class="i_colon"> : </i></span>
        <el-input clearable  v-model="loginData.userAccount"
                  size="mini"
                  style="width: 120px" />
      </el-form-item>

      <el-form-item prop="password"  style="margin-bottom: 10px" >
      	<span class="span_colon">密 码 <i class="i_colon">：</i></span>
        <el-input clearable  v-model="loginData.password" type="password"
                  size="mini"
                  style="width: 120px" />
        <img style="cursor: pointer;margin-left: 5px" src="../../assets/img/refresh.png"   @click="resetPassword" v-show="loginData.accountStatus !=1">
      </el-form-item>
      <el-form-item prop="checkPass"  style="margin-bottom: 10px"  v-if="type !='edit'">
      	<span class="span_colon">确 认  <i class="i_colon">：</i></span>
        <el-input clearable  v-model="loginData.checkPass" type="password"
                  size="mini"
                  style="width: 120px" />
      </el-form-item>
      <div class="el-dialog-item"
      	<span class="span_colon">停 用 <i class="i_colon">：</i></span>
        <el-checkbox v-model="checked"
                     class="el-checkbot-disable"></el-checkbox>
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"
                 size="mini"
                 @click="submitForm"
                 style="width: 80px;">
       提 交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"userEdit",
    props:["editData","type","existLogin"],
    components:{},
    data(){
      var notEmpty = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        } else {
          callback();
        }
      };
      var userNameValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        } else if(value && value.length > 4){
          return callback(new Error('长度不能超过4'));
        }else {
          callback();
        }
      };
      var validateWorkNum= (rule, value, callback) => {
        let workNums = [];
        if(this.existLogin && this.existLogin.length > 0){
          for(let data of this.existLogin){
            workNums.push(data.workNum);
          }
        }
        if (value === '') {
          callback(new Error('请输入工号'));
        } else if (workNums.includes(this.editData.workNum) && value != this.copyData.workNum) {
          callback(new Error('工号已存在!'));
        } else {
          callback();
        }
      };
      var validateLogin= (rule, value, callback) => {
        let logins = [];
        if(this.existLogin && this.existLogin.length > 0){
          for(let data of this.existLogin){
            logins.push(data.userAccount);
          }
        }
        if (value === '') {
          callback(new Error('请输入账号'));
        } else if (logins.includes(this.editData.userAccount) && value != this.copyData.userAccount) {
          callback(new Error('账号已存在!'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return{
        dialogAddVisible:false,
        loginData:{deptId:"",roleId:"",workNum:"",userName:"",userAccount:"",password:"",accountStatus:"0"},
        rules: {
          deptId: [
            {validator: notEmpty, trigger: 'blur'}
          ],
          roleId: [
            {validator: notEmpty, trigger: 'blur'}
          ],
          workNum: [
            {validator: validateWorkNum, trigger: 'blur'}
          ],
          userName: [
            {validator: userNameValidator, trigger: 'blur'}
          ],
          userAccount: [
            {validator: validateLogin, trigger: 'blur'}
          ],
          password: [
            {validator: notEmpty, trigger: 'blur'}
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]

        },
        count: 0,
        deptList:[],
        roleList:[],
        copyData:{},
        checked:false
      }
    },
    mounted(){
      this.getDeptList();
      this.getRoleList();
    },

    methods:{
      resetPassword(){
        this.loginData.password = "123456";
      },
      changeRole(val){
        for(let role of this.roleList){
          if(role.id == val){
            this.loginData.type = role.roleType;
          }
        }
      },
      getDeptList() {
        let self = this;
        self.$http({
          url: "/drug/dept/queryDeptChooseList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            if(resp.result.length > 0){
              self.deptList = resp.result;
            }
          }
        });
      },
      getRoleList() {
        let self = this;
        self.$http({
          url: "/drug/role/queryRoleList",
          method: "post",
        }).then(resp => {
          if (resp.success) {
            self.roleList = resp.result;
          }
        });
      },
      resetForm() {
        this.$refs["dataForm"].clearValidate();
        this.closeDialog();
      },
      submitForm() {
        let self = this;
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            self.operateUser();
          } else {
            return false;
          }
        });
      },
      operateUser() {
        let self = this;
        let url = this.type == 'add' ? "/drug/addUser" : "/drug/updateUser";
        delete self.loginData.createTime;
        delete self.loginData.updateTime;
        self.loginData.accountStatus = self.checked?"1":"0";
        if (this.count == 0) {
          self.$http({
            url: url,
            method: "post",
            params: self.loginData,
          }).then(resp => {
            if (resp.success) {
              self.$eventBus.$emit("updateLoginList");
              self.$notify({
                title: '提示',
                message: "操作成功！",
                type: 'success'
              });
              self.resetForm('dataForm');
              return
            }
            self.$notify({
              title: '提示',
              message: "出现异常！请重试",
              type: 'error'
            });
            this.count--;
          });
          this.count++;
        }
      },
      //关闭弹窗
      closeDialog() {
        this.$refs['dataForm'].clearValidate();
        this.dialogAddVisible = false;
      },
    },
    watch:{
      editData(val){
        this.dialogAddVisible = true;
        this.loginData = val;
        this.copyData = Object.assign({},val);
        if(this.loginData.accountStatus == 1){
          this.checked = true;
        }
        this.count = 0;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-form-no {
    text-align: right;
    font-size: 18px;
    color: #cb0000;
  }

  .el-button {
    .svg-icon {
      width: 16px;
      height: 16px;
      color: #2995de;
      vertical-align: middle;
      margin-bottom: 2px;
    }
  }

  .el-dialog-item .el-button--mini {
    padding: 0px;
  }

  .el-dialog {
    .el-button .svg-icon {
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin-bottom: 2px;
    }
  }
</style>
