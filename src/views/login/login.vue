<template>
  <div class="login-container">
    <div class="login-background-color">
      <div class="login-form">
        <Form ref="loginForm" :model="loginForm" :rules="formRules">
          <div>
            <div>
              <img src="../../assets/image/logo.png" style="width: 136px"/>
            </div>
            <div>
              <strong>
                <h2 class="login-title">
                  悟空教育答题系统
                </h2>
              </strong>
            </div>
          </div>
          <FormItem prop="username">
            <Input v-model="loginForm.username" prefix="ios-person" placeholder="请输入用户名......"/>
          </FormItem>
          <FormItem prop="password">
            <Input prefix="ios-lock" type="password" v-model="loginForm.password" placeholder="请输入密码......"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="login('loginForm')" @keyup.native="handlerLogin" long :loading="loading">
              <span v-show="loading2">登陆</span>
              <span v-show="loading">正在登陆</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        uername: '',
        password: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名...', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码...', trigger: 'blur' },
          { type: 'string', min: 5, message: '密码最少为6位数字、英文字母和特殊符号的组合', trigger: 'blur' }
        ]
      },
      loading: false,
      loading2: true
    }
  },
  mounted () {
    let other = this
    document.onkeydown = function (event) {
      if (event.keyCode === 13) other.login('loginForm')
    }
  },
  destroyed () {
    document.onkeydown = function () {
    }
  },
  methods: {
    login (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          this.loading2 = false
          axios.post('/auth/login', this.loginForm)
            .then(response => {
              let data = response.data
              if (data.status === 200) {
                this.$Notice.success({
                  title: '温馨提示',
                  desc: '北京今日终于转雷阵雨，出门记得带伞，不要在树下避雨。',
                  duration: 10
                })
                window.sessionStorage.setItem('result', JSON.stringify(data.result))
                this.$router.push({
                  'name': 'question'
                })
              } else {
                this.$Message.error(data.message)
              }
              this.loading = false
              this.loading2 = true
            })
            .catch(reason => {
              this.$Message.error('服务器繁忙！')
              this.loading = false
              this.loading2 = true
            })
        }
      })
    },
    handlerLogin (event) {
      if (event.keyCode === 13) {
        this.login('loginForm')
      }
    }
  }
}
</script>

<style scoped>
  .login-container {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/image/login/login.jpg");
    background-size: cover;
  }
  .login-background-color {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: relative;
  }
  .login-form {
    padding: 30px 40px 25px 40px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 1px 1px 2px #eee;
    width: 350px;
    height: 350px;
    position: absolute;
    right: 100px;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
  }
  .login-title {
    margin: 0 0 10px;
    text-align: center;
    color: #515a6e;
    letter-spacing: 3px;
    font-family: 'Hiragino Sans GB';
    display: inline-block;
  }
</style>
