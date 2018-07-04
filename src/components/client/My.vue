<template>
  <div class="my">
    <div class="player">
      当前用户: {{ player.name }}
    </div>
    <div class="button" v-if="isManager">
      <entryMatchComponent></entryMatchComponent>
    </div>
    <div class="button">
      <van-button type="danger" size="large" @click="loginOut()">退出</van-button>
    </div>

    <div class="version">
      <p>Mobile version: 1.0.2</p>
      <p v-if="version.api">Api version: {{ version.api.current }}</p>
    </div>
  </div>
</template>

<script>
import tokenService from '@/assets/js/tokenService'
import versionService from '@/assets/js/versionService'
import EntryMatchComponent from './EntryMatchComponent'
export default {
  name: 'My',
  components: {
    'entryMatchComponent': EntryMatchComponent
  },
  data () {
    return {
      version: {},
      matchTypes: [],
      matchTeams: [],
      player: tokenService.decodeToken(),
      isShowDialog: false,
      isManager: tokenService.isManager()
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
  }
}
</script>

<style>
.my {
  position: relative;
  padding: 2rem;
  height: calc(100vh - 50px);
}
.player {
  font-size: 16px;
}
.button {
  margin: 1rem 0;
}
.version {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
</style>
