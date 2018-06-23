import * as axiosService from './axiosService.js'

const url = 'api/matchtypes'

function getMatchTypes () {
  return axiosService.getAll(url).then(res => {
    return res.data
  })
}

export default {
  getMatchTypes
}
