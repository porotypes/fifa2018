import * as axiosService from './axiosService.js'

const url = 'api/teams'

function getMatchTeams () {
  return axiosService.getAll(url).then(res => {
    return res.data
  })
}

export default {
  getMatchTeams
}
