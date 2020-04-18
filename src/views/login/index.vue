<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <!--<lang-select class="set-language"/>-->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="'请输入' + $t('login.username')"
          name="username"
          type="text"
          auto-complete="off"
          autofocus
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="'请输入' + $t('login.password')"
          name="password"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
      <a class="to_add_user" @click="handleCreate">没有账号？去注册</a>
      <div style="position:relative">
          <div class="tips">
            <span>{{ $t('login.username') }} : admin</span>
            <span>{{ $t('login.password') }} : 123456</span>
          </div>
          <div class="tips">
            <span style="margin-right:18px;">{{ $t('login.username') }} : test</span>
            <span>{{ $t('login.password') }} : 123456</span>
          </div>
      </div>
    </el-form>

    <el-dialog title="注册账号" :visible.sync="dialogVisible" width="50%" @close="handleDialogClose">
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="90px" class="demo-ruleForm">
          <el-form-item label="账号:" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码:" prop="pwd">
            <el-input v-model="form.pwd"></el-input>
          </el-form-item>
          <el-form-item label="昵称:" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-select v-model="form.sex" class="filter-item" placeholder='请选择' style="width: 100%;">
              <el-option v-for="item in sexList" :key="item.key" :label="item.display_name"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码:" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="submitForm"> 确认 </el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>

import { validUsername } from '@/utils/validate'
import {  saveSysUser } from '@/api/system/user'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      timer: null,  // 定时器名称
      dialogVisible:false,
      form: {
        id: undefined, //主键ID
        username: undefined, //账号
        pwd: undefined, //登录密码
        nickName: undefined, //昵称
        sex: undefined, //性别 0:男 1:女
        phone: undefined, //手机号码
        email: undefined, //邮箱
        avatar: undefined, //头像
        groupId:2
      },
      sexList: [{ key: '0', display_name: '男' }, { key: '1', display_name: '女' }],
      rules: {
          username: [
              {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          pwd: [
              { required: true,pattern: /^(\w){6,16}$/, message: '请设置6-16位字母、数字组合'}
          ],
          nickName: [
              {required: true, message: '请输入你昵称', trigger: 'blur'},
          ]
          // flag: [
          //     {required: true, message: '请选择状态', trigger: 'blur'},
          // ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    //   this.qqLogin();
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
      // 通过$once来监听定时器
      // 在beforeDestroy钩子触发时清除定时器
      // this.$once('hook:beforeDestroy', () => {
      //     clearInterval(this.timer);
      // })
  },
  mounted() {
      // 定时器
      // this.timer = setInterval(this.qqLogin, 3000);
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false;
              // 清除定时器
              // clearInterval(this.timer);
              this.timer = null;
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // QQ第三方登录
    qqLogin(){
        var that = this; // 先将vue这个对象保存在_self对象中
        //检查是否登录
        if (QC.Login.check()) {
            //该处的openId，accessToken就是后台需要的参数了，后台通过这些参数拿取临时登录凭证，然后就是自己的逻辑了
            QC.Login.getMe(function (openId, accessToken) {
                if (  openId != undefined ){
                    that.loading = true;
                    // 传参给后台进行登录验证
                    that.$store.dispatch('LoginByUsername', {
                        username: '',
                        openId: openId,
                        accessToken: accessToken
                    }).then(() => {
                        that.loading = false;
                        // that.$router.push({ path: that.redirect || '/' })
                        that.$router.push({ path: '/' })
                    }).catch(() => {
                        that.loading = false
                    })
                }
            });
            console.log('已登录!')
            // 清除定时器
            clearInterval(this.timer);
            this.timer = null;
        } else {
            console.log('未登录!')
        }
    },
    handleCreate() {
      this.dialogVisible = true
    },
     // 监听dialog关闭时的处理事件
    handleDialogClose() {
    },
    submitForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          saveSysUser(this.form).then(response => {
            if (response.code == 200) {
              this.submitOk('恭喜您注册成功')
              this.dialogVisible = false;
              this.loginForm.username = this.form.username;
              this.loginForm.password = this.form.pwd;
              this.handleLogin();//去登陆
            } else {
              this.submitFail(response.message)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-form .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-form {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .to_add_user{
    display: block;
    margin: 20px 0 30px;
    color: #fff;
    text-align: right;
    text-decoration: underline;;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
</style>
