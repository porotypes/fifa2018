<template>
  <div>
    <el-table
      :data="rankingList"
      border
      style="width: 100%"
      height="600"
      highlight-current-row: false
      :row-class-name="tableRowClassName"
      @cell-click="showBingoList">
      <el-table-column
        label="排名"
        prop="naturalRank"
        width="50">
      </el-table-column>
      <el-table-column
        prop="player.name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="bingoCount"
        label="Bingo">
        <template slot-scope="scope">
          <span>{{scope.row.bingoCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="winnerCount"
        label="Winner">
        <template slot-scope="scope">
          <span>{{scope.row.winnerCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="betCount"
        label="场次">
      </el-table-column>
      <el-table-column
        label="Bingo率">
        <template slot-scope="scope">
          <span>{{formatRate(scope.row.bingoRate * 100) || 0}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Winner率">
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
        label="得分">
        <template slot-scope="scope">
          <span>{{scope.row.totalPoints || 0}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="common">
      <small>注: Winner栏为猜中输赢场数, Bingo栏为猜中比分场数</small>
    </div>
    <p>排名最后更新时间: {{ getDateTimeString(rankingListUpdateDat) }}</p>
  </div>
</template>

<script>
import matchbetStatisticeService from '@/assets/js/matchbetStatisticeService'
import statisticsService from '@/assets/js/statisticsService'
import matchbetService from '@/assets/js/matchbetService'
import dateTimeUtil from '@/assets/js/dateTimeUtil'
export default {
  name: 'Ranking',
  data () {
    return {
      rankingList: [],
      rankingListUpdateDat: ''
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
    getBingoBetList (playerId) {
      matchbetService.getBingoBetList(playerId).then(res => {
        // console.log(res)
      })
    },
    showBingoList (row, event, column) {
      this.getBingoBetList(row.player.id)
    }
  },
  created () {
    this.getRankingListUpdateDat()
    this.getRankingListStatistics()
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
</style>
