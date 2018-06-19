<template>
  <div>
    <el-table
      :data="rankingList"
      border
      style="width: 100%"
      height="600"
      :row-class-name="tableRowClassName">
      <el-table-column
        type="index"
        label="排名"
        width="50">
      </el-table-column>
      <el-table-column
        prop="player.name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="winnerCount"
        label="Winner">
        <template slot-scope="scope">
          <span>{{scope.row.winnerCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bingoCount"
        label="Bingo">
        <template slot-scope="scope">
          <span>{{scope.row.bingoCount || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
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
import rankingService from '@/assets/js/rankingService'
import matchbetStatisticeService from '@/assets/js/matchbetStatisticeService'
import statisticsService from '@/assets/js/statisticsService'
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
    getAllRankingList () {
      rankingService.getRankingList().then(res => {
        this.rankingList = res
      })
    },
    tableRowClassName (row) {
      if (row.rowIndex === 0) {
        return 'golden-row'
      } else if (row.rowIndex === 1) {
        return 'silver-row'
      } else if (row.rowIndex === 2) {
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
