<template>
  <div>
    <el-table
      :data="rankingList"
      border
      style="width: 100%"
      height="600"
      highlight-current-row: false
      :row-class-name="tableRowClassName"
      @cell-click="showBetList">
      <el-table-column
        label="排名"
        fixed
        prop="naturalRank"
        width="40">
      </el-table-column>
      <el-table-column
        prop="player.name"
        fixed
        width="70"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="bingoCount"
        width="65"
        label="Bingo">
        <template slot-scope="scope">
          <span>{{scope.row.bingoCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="winnerCount"
        width="60"
        label="Win">
        <template slot-scope="scope">
          <span>{{scope.row.winnerCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="betCount"
        width="60"
        label="场次">
      </el-table-column>
      <el-table-column
        label="Bingo率">
        <template slot-scope="scope">
          <span>{{formatRate(scope.row.bingoRate * 100) || 0}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Win率">
        <template slot-scope="scope">
          <span>{{formatRate(scope.row.winnerRate * 100) || 0}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="胜率">
        <template slot-scope="scope">
          <span>{{formatRate((scope.row.winnerRate * 100 || 0) + (scope.row.bingoRate * 100 || 0))}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="totalPoints"
        width="40"
        label="得分">
        <template slot-scope="scope">
          <span>{{scope.row.totalPoints || 0}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="common">
      <small>tip1: Win栏为猜中输赢场数, Bingo栏为猜中比分场数</small>
      <br>
      <small>tip2: 点击某个人的bingo数、win数和积分可以查看历史竞猜记录</small>
    </div>
    <p>排名最后更新时间: {{ getDateTimeString(rankingListUpdateDat) }}</p>

    <van-popup v-model="show" position="left" :overlay="false">
      <section class="history-wrap">
        <section class="history-header">
          <span>{{ player.name }}</span>
          <button @click="show = false">关闭</button>
        </section>
        <section class="history-main">
          <template v-if="betList.length > 0">
            <historyBetComponent v-for="bet of betList" :key="bet.id" :bet="bet"></historyBetComponent>
          </template>
        </section>
        <section class="history-footer">
          <van-tabbar @change="changeTab($event)" v-model="active">
            <van-tabbar-item>Bingo</van-tabbar-item>
            <van-tabbar-item>Win</van-tabbar-item>
            <van-tabbar-item>得分场</van-tabbar-item>
          </van-tabbar>
        </section>
      </section>
    </van-popup>
  </div>
</template>

<script>
import matchbetStatisticeService from '@/assets/js/matchbetStatisticeService'
import statisticsService from '@/assets/js/statisticsService'
import matchbetService from '@/assets/js/matchbetService'
import dateTimeUtil from '@/assets/js/dateTimeUtil'
import HistoryBetComponent from './HistoryBetComponent'
export default {
  name: 'Ranking',
  components: {
    'historyBetComponent': HistoryBetComponent
  },
  data () {
    return {
      rankingList: [],
      rankingListUpdateDat: '',
      active: 0,
      show: false,
      player: {},
      betList: [],
      historyBingoBetList: [],
      historyWinnerBetList: [],
      historyBetList: []
    }
  },
  methods: {
    formatRate (rate) {
      return +rate.toFixed(2)
    },
    tableRowClassName (row) {
      if (row.row.naturalRank === 1) {
        return 'golden-row'
      } else if (row.row.naturalRank === 2) {
        return 'silver-row'
      } else if (row.row.naturalRank === 3) {
        return 'copper-row'
      }
      return ''
    },
    getRankingListUpdateDat () {
      matchbetStatisticeService.getMatchbetstatsupdatedat().then(res => {
        this.rankingListUpdateDat = res
      })
    },
    getDateTimeString (date) {
      return dateTimeUtil.getDateTimeString(date)
    },
    getRankingListStatistics () {
      statisticsService.getRankingListStatistics().then(res => {
        this.rankingList = res
      })
    },
    getBetList (playerId) {
      matchbetService.getBingoBetList(playerId).then(res => {
        this.historyBingoBetList = res
        this.betList = res
        window.localStorage.setItem('historyBingoBetList', this.player)
      })
      matchbetService.getWinnerBetList(playerId).then(res => {
        this.historyWinnerBetList = res
        window.localStorage.setItem('historyWinnerBetList', this.player)
      })
      matchbetService.getHistoryBetList(playerId).then(res => {
        this.historyBetList = res
        window.localStorage.setItem('historyBetList', this.player)
      })
    },
    showBetList (row, event, column) {
      this.show = true
      if (this.checkoutSelectedPlayer(row.player)) {
        return
      }
      this.player = row.player
      this.getBetList(this.player.id)
    },
    checkoutSelectedPlayer (player) {
      return player.id === this.player.id
    },
    changeTab (event) {
      this.active = event
      switch (this.active) {
        case 0:
          this.betList = this.historyBingoBetList
          break
        case 1:
          this.betList = this.historyWinnerBetList
          break
        case 2:
          this.betList = this.historyBetList
          break
      }
    }
  },
  created () {
    this.getRankingListUpdateDat()
    this.getRankingListStatistics()
  },
  destroyed () {
    window.localStorage.removeItem('historyBingoBetList')
    window.localStorage.removeItem('historyWinnerBetList')
    window.localStorage.removeItem('historyBetList')
  }
}
</script>

<style>
.cell {
  text-align: center;
}
.golden-row {
  background: rgb(255, 215, 0) !important;
}
.silver-row {
  background: rgb(220, 220, 220) !important;
}
.copper-row {
  background: rgb(245, 151, 92) !important;
}
.common {
  margin: 0 0 0.5rem;
  width: 100%;
  text-align: left;
  color: red;
}
.history-wrap {
  position: relative;
  padding: 30px 0 50px;
  width: 100vw;
  height: 100vh;
  background: #fff;
}
.history-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  font-size: 14px;
  box-shadow: 0 3px 5px #e8e8e8;
}
.history-header span {
  float: left;
  width: 5rem;
  height: 30px;
  line-height: 30px;
}
.history-header button {
  float: right;
  width: 5rem;
  height: 30px;
  border: none;
  color: #4b0;
  background: transparent;
}
.history-main {
  height: calc(100vh - 30px - 50px);
  overflow: scroll;
}
.history-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  box-shadow: 0 -3px 5px #e8e8e8;
}
</style>
