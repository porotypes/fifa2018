<template>
  <div>
    <div class="match">
      <h4 class="title">
        {{ transferTime(match.startTime) }}
        <el-tag size="mini" type="danger" v-if="bet && bet.points === 3">Bingo</el-tag>
        <el-tag size="mini" type="primary" v-if="bet && bet.points === 1">Winner</el-tag>
      </h4>
      <p class="match-type">{{ match.type.name }}</p>

      <div class="match-content">
        <div class="team">
          <span class="team-name">
            <img :src="'/static/flag/' + match.hostTeam.flag">
            {{ match.hostTeam.name }}({{ match.hostTeam.fifaGroup }})
          </span>
          <span style="float: left;width: 20%;text-align: center;">-</span>
          <span>
            {{ match.guestTeam.name }}({{ match.guestTeam.fifaGroup }})
            <img :src="'/static/flag/' + match.guestTeam.flag">
          </span>
        </div>
        <div class="score">
          <span class="number">
            {{ score1 }}
            <i v-if="bet && bet.match.hostScore > -1">({{ bet.match.hostScore }})</i>
          </span>
          <span>:</span>
          <span class="number">
            {{ score2 }}
            <i v-if="bet && bet.match.guestScore > -1">({{ bet.match.guestScore }})</i>
          </span>
        </div>
        <div class="button">
          <small style="color: red;text-align: left">括号中的比分为比赛最终得分</small>
          <van-row v-if="isManager">
            <van-col span="12">
              <van-button size="large" type="primary" @click="showPopup()">竞猜比分</van-button>
            </van-col>
            <van-col span="12">
              <van-button bottom-action @click="showMatchSroce()">录入比分</van-button>
            </van-col>
          </van-row>
          <van-button v-if="!isManager" type="primary" size="large" @click="showPopup()">竞猜比分</van-button>
        </div>
      </div>
    </div>

    <van-popup v-model="show" position="bottom">
      <div class="bet-wrapper">
        <p class="title">
          <span>姓名</span>
          <span>竞猜比分</span>
          <span>得分</span>
        </p>
        <div class="bet-content">
          <p class="bet-item" v-for="bet of betsList" :key="bet.id">
            <span class="content">
              {{ bet.player.name }}
              <el-tag size="mini" type="danger" v-if="bet.points === 3">Bingo</el-tag>
              <el-tag size="mini" type="primary" v-if="bet.points === 1">Winner</el-tag>
            </span>
            <span class="content">{{ bet.hostScore + ' - ' + bet.guestScore }}</span>
            <span class="content">{{ bet.points || '-' }}</span>
          </p>
        </div>
      </div>
    </van-popup>

    <van-dialog v-model="isShowMatchScore" @confirm="saveMatchScore()">
      <van-field label="主队比分" v-model="hostTeamScore"/>
      <van-field label="客队比分" v-model="guestTeamScore"/>
    </van-dialog>
  </div>
</template>

<script>
import dateTimeUtil from '@/assets/js/dateTimeUtil'
import matchService from '@/assets/js/matchService'
import matchbetService from '@/assets/js/matchbetService'
import updateRankingService from '@/assets/js/updateRankingService'
import tokenService from '@/assets/js/tokenService'
export default {
  name: 'startedMatchComponent',
  props: ['myBetList', 'match'],
  data () {
    return {
      bet: null,
      score1: '-',
      score2: '-',
      show: false,
      scores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      betsList: [],
      isManager: tokenService.isManager(),
      isShowMatchScore: false,
      hostTeamScore: null,
      guestTeamScore: null
    }
  },
  watch: {
    myBetList () {
      this.matchScore(this.match)
    }
  },
  methods: {
    showPopup () {
      this.show = true
      this.getListMatchBets(this.match.id)
    },
    getListMatchBets (matchId) {
      matchbetService.getListMatchBets(matchId).then(res => {
        this.betsList = res
      })
    },
    transferTime (date) {
      return dateTimeUtil.getDateTimeString(date)
    },
    matchScore (match) {
      this.myBetList.forEach(bet => {
        if (bet.match.id === match.id) {
          this.bet = bet
          this.score1 = bet.hostScore
          this.score2 = bet.guestScore
        }
      })
    },
    showMatchSroce (match) {
      this.isShowMatchScore = true
    },
    saveMatchScore () {
      let match = {
        hostScore: this.hostTeamScore,
        guestScore: this.guestTeamScore
      }
      matchService.saveMatchScore(this.match.id, match).then(res => {
        this.$emit('save')
        updateRankingService.updateRanking().then()
      })
    }
  }
}
</script>

<style>
.match {
  padding: 1rem;
  width: 100%;
}
.match .title {
  font-size: 25px;
}
.match .match-type {
  font-size: 14px;
}
.match .match-content {
  margin-top: 1rem;
  width: 100%;
  font-size: 17px;
  color: #444;
}
.match .match-content span.team-name {
  float: left;
  width: 40%;
  text-align: center;
}
.match .match-content span.team-name:last-child {
  float: right;
  text-align: right;
}
.match .match-content img {
  width: 2rem;
  height: 2rem;
  vertical-align: text-top;
}
.match .match-content .score {
  margin-top: 2rem;
  width: 100%;
  font-size: 34px;
  overflow: hidden;
}
.match .match-content .score span {
  float: left;
  width: 20%;
}
.match .match-content .score span.number {
  width: 40%;
}
.match .match-content .score span.number i {
  font-style: normal;
}
.match .button {
  margin-top: 2rem;
  text-align: left;
}
.bet-wrapper {
  position: relative;
  padding-top: 38px;
  height: 500px;
  overflow: auto;
}
.bet-wrapper .title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px 0;
  font-size: 0;
  border-bottom: 1px #eee solid;
}
.bet-wrapper .title span {
  display: inline-block;
  width: 30%;
  font-size: 16px;
  font-weight: bold;
}
.bet-wrapper .title span:first-child {
  width: 40%;
}
.bet-wrapper .bet-content {
  position: absolute;
  top: 38px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(500px - 38px);
  overflow-y: scroll;
}
.bet-wrapper .bet-item {
  padding: 8px 0;
  width: 100%;
  font-size: 0;
  border-bottom: 1px #eee solid;
}
.bet-wrapper .bet-item span.content {
  display: inline-block;
  width: 30%;
  font-size: 16px;
}
.bet-wrapper .bet-item span.content:first-child {
  width: 40%;
}
</style>
