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
      <div class="filter-button">
        <van-button
          v-for="button of buttonTxts"
          :key="button.id"
          :type="button.active ? 'primary' : 'default'"
          size="small"
          @click="selectedDataRangeButton(button)">
          {{ button.text }}
        </van-button>
        <div class="annotation">
          <small>趋势统计以莫斯科时间为准，即北京时间凌晨5点以前开始的赛事的结果属于前一天的统计范围。</small>
        </div>
      </div>
      <div class="chart">
        <chart ref="totalPointChart" :options="totalPointChartOptions" :updateCount="updateCount"></chart>
        <chart ref="bingoCountChart" :options="bingoCountChartOptions" :updateCount="updateCount"></chart>
        <chart ref="winnerCountChart" :options="winnerCountChartOptions" :updateCount="updateCount"></chart>
      </div>

      <van-dialog
        v-model="isShowDateTiemDialog"
        @confirm="searchChartDataForDate()"
        show-cancel-button>
        <van-field
          v-model="selectChartStartTime"
          disabled
          label="由"
          placeholder="请选择时间">
          <van-button @click="showStartTimePicker" slot="button" size="small" type="primary">选择时间</van-button>
        </van-field>
        <van-field
          v-model="selectChartEndTime"
          disabled
          label="到"
          placeholder="请选择时间">
          <van-button @click="showEndTimePicker" slot="button" size="small" type="primary">选择时间</van-button>
        </van-field>
      </van-dialog>

      <van-popup v-model="isShowStartTimePicker" position="bottom">
        <van-datetime-picker
          @confirm="onSelectedStartTime($event)"
          @cancel="isShowStartTimePicker = false"
          v-model="selectedChartStartTime"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"/>
      </van-popup>
      <van-popup v-model="isShowEndTimePicker" position="bottom">
        <van-datetime-picker
          v-model="selectedChartEndTime"
          @confirm="onSelectedEndTime($event)"
          @cancel="isShowEndTimePicker = false"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"/>
      </van-popup>
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
  plotOptions: {
    series: {
      events: {
        legendItemClick: function (e) {
          var index = this.index
          var series = this.chart.series
          if (index === series.length - 1) {
            for (var i = 0; i < series.length; i++) {
              series[i].hide()
            }
          }
        }
      }
    }
  },
  credits: {
    enabled: false
  },
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

let bingoCountChartOptions = {
  plotOptions: {
    series: {
      events: {
        legendItemClick: function (e) {
          var index = this.index
          var series = this.chart.series
          if (index === series.length - 1) {
            for (var i = 0; i < series.length; i++) {
              series[i].hide()
            }
          }
        }
      }
    }
  },
  credits: {
    enabled: false
  },
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
  plotOptions: {
    series: {
      events: {
        legendItemClick: function (e) {
          var index = this.index
          var series = this.chart.series
          if (index === series.length - 1) {
            for (var i = 0; i < series.length; i++) {
              series[i].hide()
            }
          }
        }
      }
    }
  },
  credits: {
    enabled: false
  },
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

const buttonTxts = [
  { id: 1, text: '全部', active: true },
  { id: 2, text: '最近7天', active: false },
  { id: 3, text: '自定义', active: false }
]

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
      buttonTxts,
      chartStartTime: null,
      chartEndTime: null,
      selectedChartStartTime: null,
      selectedChartEndTime: null,
      selectChartStartTime: null,
      selectChartEndTime: null,
      updateCount: 0,
      isShowDateTiemDialog: false,
      isShowStartTimePicker: false,
      isShowEndTimePicker: false,
      minDate: new Date(2018, 5, 1),
      maxDate: new Date(2018, 6, 31)
    }
  },
  watch: {
    tabActive (val) {
      if (val === 1) {
        this.getAccumulatedMatchStatistics()
      }
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
    getAccumulatedMatchStatistics (startTime, endTime) {
      statisticsService.getAccumulatedMatchStatistics(startTime, endTime).then(res => {
        this.totalPointChartOptions.series = chartDataUtil.handleTotalPointData(res)
        this.bingoCountChartOptions.series = chartDataUtil.handleBingoCountData(res)
        this.winnerCountChartOptions.series = chartDataUtil.handleWinnerCountData(res)
        this.updateCount++
      })
    },
    selectedDataRangeButton (button) {
      this.buttonTxts.forEach(item => {
        item.active = false
      })
      this.buttonTxts.forEach(item => {
        if (button.id === item.id) {
          item.active = true
        }
      })
      this.selectedDataRange(button)
    },
    selectedDataRange (button) {
      switch (button.id) {
        case 1:
          this.chartStartTime = null
          this.chartEndTime = null
          this.getAccumulatedMatchStatistics()
          break
        case 2:
          let date = dateTimeUtil.getBeginningOfDay(-7)
          this.chartStartTime = dateTimeUtil.getMoscowStartDateString(date)
          this.getAccumulatedMatchStatistics(this.chartStartTime, null)
          break
        default:
          this.isShowDateTiemDialog = true
      }
    },
    showStartTimePicker () {
      this.isShowStartTimePicker = true
    },
    showEndTimePicker () {
      this.isShowEndTimePicker = true
    },
    onSelectedStartTime (date) {
      this.selectChartStartTime = dateTimeUtil.getDateString(date)
      this.isShowStartTimePicker = false
    },
    onSelectedEndTime (date) {
      this.selectChartEndTime = dateTimeUtil.getDateString(date)
      this.isShowEndTimePicker = false
    },
    searchChartDataForDate () {
      let startTime = dateTimeUtil.getMoscowStartDateString(this.selectedChartStartTime)
      let endTime = dateTimeUtil.getMoscowEndDateString(this.selectedChartEndTime) || null
      this.getAccumulatedMatchStatistics(startTime, endTime)
    }
  },
  created () {
    this.getRankingListUpdateDat()
    this.getRankingListStatistics()
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
.filter-button {
  margin: 1rem 0;
}
.filter-button button {
  margin: 0 2rem;
}
.filter-button .annotation {
  padding: 1rem;
  text-align: left;
  text-indent: 2em;
  font-size: 14px;
}
</style>
