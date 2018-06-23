import axios from 'axios'

const URL = 'api/statistics/countmatchbetstats'

function updateRanking () {
  return axios.patch(URL).then(res => {
    return res
  })
}

export default {
  updateRanking
}
