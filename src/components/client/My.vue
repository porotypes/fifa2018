<template>
  <div class="my">
    <van-button type="primary" size="large" @click="loginOut()">退出</van-button>

    <div class="version">
      <p>Mobile version: 0.0.3</p>
      <p v-if="version.api">Api version: {{ version.api.current }}</p>
    </div>
  </div>
</template>

<script>
import tokenService from '@/assets/js/tokenService'
import versionService from '@/assets/js/versionService'
export default {
  name: 'My',
  data () {
    return {
      version: {}
    }
  },
  methods: {
    loginOut () {
      window.localStorage.removeItem('USER_TOKEN')
      this.$router.push('/login')
    },
    getVersion () {
      versionService.getVersion().then(res => {
        this.version = res
      })
    }
  },
  created () {
    this.getVersion()
    console.log(tokenService.decodeToken())
  }
}
</script>

<style>
.my {
  position: relative;
  padding: 2rem;
  height: calc(100vh - 50px);
}
.version {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
</style>
