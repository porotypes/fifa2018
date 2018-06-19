import * as axiosService from './axiosService'

const URL = '/api/players'

function getRankingList () {
  let queryParams = {
    type: 'ranking-list'
  }
  return axiosService.getAll(URL, queryParams).then(res => {
    return res.data
  })
}

export default {
  getRankingList
}
