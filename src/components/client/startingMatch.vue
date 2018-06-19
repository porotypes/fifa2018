<template>
  <div>
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
      myBetList: []
    }
  },
  methods: {
    getStartingMatches () {
      matchService.getStartingMatches().then(matches => {
        this.allMatches = matches
      })
    },
    getMyListBets () {
      matchbetService.getMyListBets().then(bets => {
        this.myBetList = bets
      })
    }
  },
  mounted () {
    this.getStartingMatches()
  },
  created () {
    this.getMyListBets()
  }
}
</script>

<style>

</style>
