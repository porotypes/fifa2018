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

export default {
  getRankingListStatistics
}
