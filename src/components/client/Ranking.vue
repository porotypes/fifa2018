<template>
  <van-tabs v-model="tabActive">
    <van-tab :title="'表格'">
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
        <van-button v-if="isManager" type="primary" size="large" @click="updateRanking()">更新排名</van-button>
        <p>排名最后更新时间: {{ getDateTimeString(rankingListUpdateDat) }}</p>

        <van-popup v-model="show" position="left" :overlay="false">
          <section class="history-wrap">
            <section class="history-header">
              <span>{{ player.name }}的得分场次</span>
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
                <van-tabbar-item>竞猜场</van-tabbar-item>
              </van-tabbar>
            </section>
          </section>
        </van-popup>
      </div>
    </van-tab>
    <van-tab :title="'图表'">
      <div class="chart">
        <chart ref="simpleChart" :options="totalScoreChartOptions"></chart>
        <chart ref="simpleChart" :options="totalPointChartOptions"></chart>
        <chart ref="simpleChart" :options="bingoCountChartOptions"></chart>
        <chart ref="simpleChart" :options="winnerCountChartOptions"></chart>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
import matchbetStatisticeService from '@/assets/js/matchbetStatisticeService'
import statisticsService from '@/assets/js/statisticsService'
import matchbetService from '@/assets/js/matchbetService'
import dateTimeUtil from '@/assets/js/dateTimeUtil'
import HistoryBetComponent from './HistoryBetComponent'
import HighChartComponent from './HighChartComponent'
import tokenService from '@/assets/js/tokenService'
import updateRankingService from '@/assets/js/updateRankingService'
import chartDataUtil from '@/assets/js/chartDataUtil'

let totalPointChartOptions = {
  title: {
    text: '得分趋势图'
  },
  colors: [
    '#058DC7', '#50B432', '#ED561B', '#DDDF00',
    '#24CBE5', '#64E572', '#FF9655', '#FFF263',
    '#6AF9C4', '#191970', '#2F4F4F', '#4169E1',
    '#800000', '#8A2BE2', '#90EE90', '#EE82EE',
    '#FFD700', '#EEE8AA', '#F4A460', '#DDA0DD',
    '#B22222', '#000000', '#006400'
  ],
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: '分数'
    }
  },
  series: []
}

let bingoCountChartOptions = {
  title: {
    text: 'bingo趋势图'
  },
  colors: [
    '#058DC7', '#50B432', '#ED561B', '#DDDF00',
    '#24CBE5', '#64E572', '#FF9655', '#FFF263',
    '#6AF9C4', '#191970', '#2F4F4F', '#4169E1',
    '#800000', '#8A2BE2', '#90EE90', '#EE82EE',
    '#FFD700', '#EEE8AA', '#F4A460', '#DDA0DD',
    '#B22222', '#000000', '#006400'
  ],
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: '场次'
    }
  },
  series: []
}

let winnerCountChartOptions = {
  title: {
    text: 'winner趋势图'
  },
  colors: [
    '#058DC7', '#50B432', '#ED561B', '#DDDF00',
    '#24CBE5', '#64E572', '#FF9655', '#FFF263',
    '#6AF9C4', '#191970', '#2F4F4F', '#4169E1',
    '#800000', '#8A2BE2', '#90EE90', '#EE82EE',
    '#FFD700', '#EEE8AA', '#F4A460', '#DDA0DD',
    '#B22222', '#000000', '#006400'
  ],
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: '场次'
    }
  },
  series: []
}

let totalScoreChartOptions = {
  title: {
    text: '总得分趋势图'
  },
  colors: [
    '#058DC7', '#50B432', '#ED561B', '#DDDF00',
    '#24CBE5', '#64E572', '#FF9655', '#FFF263',
    '#6AF9C4', '#191970', '#2F4F4F', '#4169E1',
    '#800000', '#8A2BE2', '#90EE90', '#EE82EE',
    '#FFD700', '#EEE8AA', '#F4A460', '#DDA0DD',
    '#B22222', '#000000', '#006400'
  ],
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: '分数'
    }
  },
  series: []
}

export default {
  name: 'Ranking',
  components: {
    'historyBetComponent': HistoryBetComponent,
    'chart': HighChartComponent
  },
  data () {
    return {
      rankingList: [],
      rankingListUpdateDat: '',
      active: 0,
      tabActive: 0,
      show: false,
      player: {},
      betList: [],
      historyBingoBetList: [],
      historyWinnerBetList: [],
      historyBingoAndWinBetList: [],
      historyBetList: [],
      isManager: tokenService.isManager(),
      totalPointChartOptions,
      bingoCountChartOptions,
      winnerCountChartOptions,
      totalScoreChartOptions
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
        this.active = 0
        window.localStorage.setItem('historyBingoBetList', this.player)
      })
      matchbetService.getWinnerBetList(playerId).then(res => {
        this.historyWinnerBetList = res
        window.localStorage.setItem('historyWinnerBetList', this.player)
      })
      matchbetService.getHistoryBingoAndWinBetList(playerId).then(res => {
        this.historyBingoAndWinBetList = res
        window.localStorage.setItem('historyBingoAndWinBetList', this.player)
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
          this.betList = this.historyBingoAndWinBetList
          break
        case 3:
          this.betList = this.historyBetList
          break
      }
    },
    updateRanking () {
      updateRankingService.updateRanking().then(res => {
        this.getRankingListUpdateDat()
      })
    },
    getMatchStatistics () {
      statisticsService.getMatchStatistics().then(res => {
        this.totalPointChartOptions.series = chartDataUtil.handleTotalPointData(res)
        this.bingoCountChartOptions.series = chartDataUtil.handleBingoCountData(res)
        this.winnerCountChartOptions.series = chartDataUtil.handleWinnerCountData(res)
        this.totalScoreChartOptions.series = chartDataUtil.handleTotalScoreData(res)
        console.log(res)
        console.log(chartDataUtil.handleTotalScoreData(res))
      })
    }
  },
  created () {
    this.getRankingListUpdateDat()
    this.getRankingListStatistics()
    this.getMatchStatistics()
  },
  destroyed () {
    window.localStorage.removeItem('historyBingoBetList')
    window.localStorage.removeItem('historyWinnerBetList')
    window.localStorage.removeItem('historyBingoAndWinBetList')
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
  width: 15rem;
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
.chart {
  width: 100%;
}
</style>
