import * as axiosService from './axiosService'

const url = 'api/statistics/matchbetstatsupdatedat'

function getMatchbetstatsupdatedat () {
  return axiosService.getAll(url).then(res => {
    return res.data
  })
}

export default { getMatchbetstatsupdatedat }
