<template>

  <div class='app-container' :style="backgroundStyle">
    <div class="login-container">

      <img src="@/assets/logo.png" class="app-login-logo" />
			<p class="title_txt">威尔分析测试平台</p>
      <el-form ref="loginForm"
               :rules="loginRules"
               :model="loginForm"
               class="login-form"
               autocomplete="on"
               label-position="left">

        <el-form-item prop="username">
          <el-input  ref="username"
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input  :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin" />
        </el-form-item>

        <el-checkbox v-model="checked">记住账号</el-checkbox>

        <el-button class="el-btn-login"
                   round
                   type="primary"
                   style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">登录</el-button>

      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import { Loading } from 'element-ui';
import { setToken } from '@/utils/auth' // 验权

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      checked: false,

      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      backgroundStyle:{ backgroundImage: 'url(' + require('../../assets/img/bg_login.jpg') + ')',}
    }
  },

  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getLoginPicture();
  },

  methods: {

    getLoginPicture() {
      let self = this;
      self.$http({
        url: "/drug/images/queryImagesList",
        method: "post",
        params:{fileType:"0",fileCheck:"1"}
      }).then(resp => {
        if (resp.success) {
          if(resp.result.length > 0){
            self.backgroundStyle.backgroundImage = "url("+resp.result[0].fileBlob+")"
          }
        }
      });
    },

    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      let self = this;
      self.$refs.loginForm.validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          let param = {userAccount:self.loginForm.username,password:self.loginForm.password};
          self.$http({
            url: "/drug/login",
            method: "post",
            params:param
          }).then(resp => {
            if (resp.success) {
              self.$store.dispatch('user/setLoginUserDetail', resp.result).then(res => {
                setToken(resp.result);
                self.$router.push({ path: "/home/index"});
                if(self.checked){
                  window.sessionStorage.setItem("login",JSON.stringify(param));
                }else{
                  window.sessionStorage.removeItem("login");
                }
              });
              loadingInstance.close();
              return
            }
            loadingInstance.close();
            self.$notify({
              title: '提示',
              message: "用户名或密码错误！",
              type: 'error'
            });
            this.$refs['loginForm'].clearValidate();
          });
        }
      })
    },
  }
}
</script>

 <style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}
.title_txt {
	color: #fff;
	text-align: center;
	margin-top: 10px;
	font-size: 14px;
}
.login-container {
  .el-input {
    width: 80%;
    input {
      color: #fff;
      background: transparent;
      -webkit-appearance: none;
      border: 0px;
      caret-color: #fff;
      padding: 0px;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      transition-delay: 99999s;
      transition: color 99999s ease-out, background-color 99999s ease-out;
    }
    input::-webkit-input-placeholder {
      color: #fff;
    }
    input::-moz-input-placeholder {
      color: #fff;
    }
    input::-ms-input-placeholder {
      color: #fff;
    }
  }
}
</style>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    background:no-repeat center;
    /*background: url('../../assets/img/bg_login.jpg') no-repeat center;*/
    background-size: cover;
    background-position: 50% 50%;
    /*&:before {*/
    	/*content: '';*/
    	/*position: absolute;*/
    	/*background: url('../../assets/img/bg_login.jpg') no-repeat center;*/
	    /*background-size: cover;*/
	    /*background-position: 50% 50%;*/
	    /*width: 100%;*/
	    /*height: 100%;*/
	    /*!*opacity: 0.8;*!*/
	    /*-webkit-filter: blur(3px);*/
	    /*-moz-filter: blur(3px);*/
	    /*-o-filter: blur(3px);*/
	    /*-ms-filter: blur(3px);*/
	    /*filter: blur(3px);*/
    /*}*/
  }

  .login-container {
    width: 360px;
    height: 460px;
    position: relative;
    margin-right: 100px;
    display: flex;
    padding: 40px 60px 60px 60px;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(37, 103, 145, 0.7);
    overflow: hidden;

    .app-login-logo {
      height: 50px;
    }

    .login-form {
      position: relative;
      overflow: hidden;
      margin-top: 20px;
    }

    .el-form-item {
      height: 36px;
      border-bottom: 1px solid #fff;
      margin-right: 20px;
    }

    .svg-container {
      color: #fff;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .el-checkbox {
      color: #fff;
    }

    .el-btn-login {
      margin-top: 20px;
      background-color: #2a96d4;
      border-color: #2a96d4;
    }
  }
</style>
