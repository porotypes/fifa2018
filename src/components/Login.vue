<template>
  <!-- <van-button type="primary" @click="login()">企业微信登陆</van-button> -->
  <div class="login-button" @click="login()">
    <div class="login-bg"></div>
    <span>点击开启你的大力神杯</span>
  </div>
</template>

<script>
import loginService from '@/assets/js/login'
export default {
  name: 'Login',
  data () {
    return {
      res: ''
    }
  },
  methods: {
    login () {
      loginService.login().then(url => {
        window.location.href = url
      })
    },
    setToken (url) {
      let token = url.split(';')[1]
      window.localStorage.setItem('USER_TOKEN', token.split('=')[1])
    },
    toLink () {
      this.$router.push('/client')
    }
  }
}
</script>

<style>
.login {
  padding: 2rem;
}
.login-button {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-7.5rem, -8.5rem);
  width: 15rem;
  height: 15.5rem;
}
.login-button .login-bg {
  margin-bottom: 1rem;
  width: 15rem;
  height: 15rem;
  background-image: url(../assets/img/cup.png);
  background-size: 15rem 15rem;
}
</style>
