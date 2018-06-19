<template>
  <div>
    <div class="match">
      <h4 class="title">{{ transferTime(match.startTime) }}</h4>
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
          <span class="number">{{ score1 }}</span>
          <span>:</span>
          <span class="number">{{ score2 }}</span>
        </div>
        <div class="button">
          <van-button type="primary" size="large" @click="showPopup()">
            <span v-if="!bet">竞猜</span>
            <span v-else-if="bet">修改比分</span>
          </van-button>
        </div>
      </div>
    </div>

    <van-popup v-model="show" position="bottom">
      <div class="select-score van-hairline--bottom">
        <button @click="submit()" :disabled="isSaving">确认</button>
      </div>
      <div class="picker">
        <div class="picker-item">
          <van-picker :columns="scores" @change="changeScore1" />
        </div>
        <div>:</div>
        <div class="picker-item">
          <van-picker :columns="scores" @change="changeScore2" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dateTimeUtil from '@/assets/js/dateTimeUtil'
import matchbetService from '@/assets/js/matchbetService'
import { Toast } from 'vant'
export default {
  name: 'BetComponent',
  props: ['myBetList', 'match'],
  data () {
    return {
      bet: null,
      score1: '-',
      score2: '-',
      selectedScore1: 0,
      selectedScore2: 0,
      show: false,
      scores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      isSaving: false
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
    },
    changeScore1 (picker, value, index) {
      this.selectedScore1 = value || 0
    },
    changeScore2 (picker, value, index) {
      this.selectedScore2 = value || 0
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
    submit () {
      this.isSaving = true
      Toast.loading({
        mask: true,
        message: '保存中...'
      })
      if (this.bet && this.bet.id > 0) {
        this.updateScore()
      } else {
        this.postScore()
      }
    },
    postScore () {
      let data = {
        match: this.match.id,
        hostScore: this.selectedScore1 === '-' ? 0 : this.selectedScore1,
        guestScore: this.selectedScore2 === '-' ? 0 : this.selectedScore2
      }
      matchbetService.createMatchScore(data).then(res => {
        this.bet = res
        Toast.clear()
        Toast.success('竞猜成功')
        this.show = false
        this.isSaving = false
        this.$emit('save')
      })
    },
    updateScore () {
      let data = {
        id: this.bet.id,
        hostScore: this.selectedScore1,
        guestScore: this.selectedScore2
      }
      matchbetService.updateMatchScore(data).then(res => {
        this.bet = res
        Toast.clear()
        Toast.success('修改比分成功')
        this.show = false
        this.isSaving = false
        this.$emit('save')
      })
    }
  },
  mounted () {
    this.matchScore(this.match)
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
.match .button {
  margin-top: 2rem;
}
.picker {
  width: 100%;
  overflow: hidden;
}
.picker > div {
  float: left;
  width: 20%;
  font-size: 20px;
  min-height: 200px;
  line-height: 220px;
}
.picker > div.picker-item {
  width: 40%;
}
.select-score {
  width: 100%;
  height: 30px;
  text-align: right;
}
.select-score button {
  width: 5rem;
  height: 30px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #4b0;
  user-select: none;
}
</style>
