import * as axiosService from './axiosService.js'

const url = 'api/statistics'

function getRankingListStatistics () {
  const queryParams = {
    type: 'ranking-list'
  }
  return axiosService.getAll(url, queryParams).then(res => {
    return res.data
  })
}

function getMatchStatistics (startTime, endTime) {
  const queryParams = {
    type: 'match-bet-result-trend-list',
    params: {
      statsAfter: startTime,
      statsBefore: endTime
    }
  }
  return axiosService.getAll(url, queryParams).then(res => {
    return res.data
  })
}

export default {
  getRankingListStatistics,
  getMatchStatistics
}
