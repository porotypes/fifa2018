<template>
  <div class="client">
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <van-tabbar @change="changeTab($event)" v-model="active">
        <van-tabbar-item icon="points" to="bets">竞猜中</van-tabbar-item>
        <van-tabbar-item icon="password-view" to="startingMatch">已开赛</van-tabbar-item>
        <van-tabbar-item icon="pending-orders" to="ranking">排名</van-tabbar-item>
        <van-tabbar-item icon="pending-evaluate" to="rule">规则</van-tabbar-item>
        <!-- <van-tabbar-item icon="pending-orders" to="course">赛程</van-tabbar-item> -->
        <van-tabbar-item icon="contact" to="my">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Client',
  data () {
    return {
      active: 0,
      routePaths: ['bets', 'startingMatch', 'ranking', 'rule', 'my']
    }
  },
  methods: {
    changeTab (event) {
      this.active = event
    }
  },
  created () {
    for (let i = 0; i < this.routePaths.length; i++) {
      if (this.$route.path.indexOf(this.routePaths[i]) > 0) {
        this.active = i
      }
    }
  }
}
</script>

<style>
.client {
  position: relative;
  padding-bottom: 50px;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100%;
}
</style>
