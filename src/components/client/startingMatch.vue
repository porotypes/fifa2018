<template>
  <div>
    <div class="progress">
      <p>比赛进行总进度</p>
      <van-progress
        color="#f3594b"
        :pivot-text="progresstxt"
        :percentage="progressNum"
      />
    </div>
    <startedMatchComponent
      v-for="match of allMatches"
      :key="match.id"
      :match="match"
      :myBetList="myBetList"
      v-on:save="getStartingMatches()"
      ></startedMatchComponent>
  </div>
</template>

<script>
import { Toast } from 'vant'
import matchService from '@/assets/js/matchService'
import matchbetService from '@/assets/js/matchbetService'
import StartedMatchComponent from '@/components/client/StartedMatchComponent'
export default {
  name: 'StartingMatch',
  components: {
    startedMatchComponent: StartedMatchComponent
  },
  data () {
    return {
      allMatches: [],
      myBetList: [],
      progressNum: 0,
      progresstxt: '0'
    }
  },
  methods: {
    getStartingMatches () {
      Toast.loading({
        mask: true,
        message: '加载中...'
      })
      matchService.getStartingMatches().then(matches => {
        this.progressNum = +(matches.length / 64 * 100).toFixed(0)
        this.progresstxt = (matches.length / 64 * 100).toFixed(0) + '%'
        this.allMatches = matches
        this.getMyListBets()
      })
    },
    getMyListBets () {
      matchbetService.getMyListBets().then(bets => {
        this.myBetList = bets
        Toast.clear()
      })
    }
  },
  created () {
    this.getStartingMatches()
  }
}
</script>

<style>
.progress {
  padding: 2rem .5rem;
}
.progress p {
  margin-bottom: 1rem;
}
</style>
