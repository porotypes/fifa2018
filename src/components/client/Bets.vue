<template>
  <div class="bets">
    <div class="banner">
      <img src="../../assets/img/banner.jpg">
    </div>

    <van-notice-bar background="#A72B22" color="#fff">
      2018年俄罗斯世界杯足球比赛竞猜活动现火热进行中!
    </van-notice-bar>

    <betComponent
      v-for="match of allMatches"
      :key="match.id"
      :match="match"
      :myBetList="myBetList"
      v-on:save="getMyListBets()"
      ></betComponent>
  </div>
</template>

<script>
import { Toast } from 'vant'
import matchService from '@/assets/js/matchService'
import matchbetService from '@/assets/js/matchbetService'
import BetComponent from '@/components/client/BetComponent'
export default {
  name: 'Bets',
  components: {
    betComponent: BetComponent
  },
  data () {
    return {
      allMatches: [],
      selectMatch: {},
      myBetList: []
    }
  },
  methods: {
    getMatches () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      matchService.getMatches().then(res => {
        this.allMatches = res
      })
    },
    getMyListBets () {
      matchbetService.getMyListBets().then(bets => {
        this.myBetList = bets
        Toast.clear()
      })
    }
  },
  mounted () {
    this.getMatches()
  },
  created () {
    this.getMyListBets()
  }
}
</script>

<style>
.banner {
  width: 100%;
  height: 18.7rem;
}
.banner img {
  width: 100%;
  height: 18.7rem;
}
</style>
