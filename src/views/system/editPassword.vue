<template>
  <el-dialog :visible.sync="dialogModifyVisible"
             append-to-body
             :close-on-click-modal="false"
             width="20%"
             title="修改密码">
    <div class="dialog-title"><span>修改密码</span></div>
    <el-divider></el-divider>
    <el-form ref="dataForm"
             :rules="rules"
             :model="loginData"
             label-position="left"
             size="mini"
            >
      <el-form-item label="旧 密 码：" prop="oldPassword">
        <el-input clearable  v-model="loginData.oldPassword" size="mini"
                  style="width: 120px" type="password" ></el-input>
      </el-form-item>
      <el-form-item label="新 密 码：" prop="password">
        <el-input clearable  v-model="loginData.password" size="mini"
                  style="width: 120px" type="password" ></el-input>
      </el-form-item>
      <el-form-item label="确认密码 :" prop="checkPassword">
        <el-input clearable  v-model="loginData.checkPassword" size="mini"
                  style="width: 120px" type="password" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="green"
                 size="mini" @click="submitForm"
                 style="width: 80px;">
        完成
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"editPassword",
    props:[],
    data(){
      var notEmpty = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.loginData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return{
        dialogModifyVisible: false,
        loginData: {oldPassword:"",password:"",checkPassword:""},
        rules: {
          oldPassword: [
            {validator: notEmpty, trigger: 'blur'}
          ],
          password: [
            {validator: notEmpty, trigger: 'blur'}
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
      }
    },
    mounted(){
      let self = this;
      self.$eventBus.$on("openEditPw",function () {
        self.loginData =  {oldPassword:"",password:"",checkPassword:""};
        self.dialogModifyVisible = true;
      })
    },
    methods:{
      operateLogin(){
        let self = this;
        self.loginData.id = self.$store.getters.userId;
        self.$http({
          url: "/drug/updateUserPassword",
          method: "post",
          params:self.loginData
        }).then(resp => {
          if (resp.success) {
            self.$notify({
              title: '提示',
              message: "修改成功！",
              type: 'success'
            });
            self.loginOut();
            return
          }
          self.$notify({
            title: '提示',
            message: "密码错误！",
            type: 'error'
          });
        });
      },
      submitForm() {
        let self = this;
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            self.operateLogin();
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs["dataForm"].clearValidate();
        this.closeDialog();
      },
      async loginOut(){
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
    }
  }
</script>
