import * as axiosService from './axiosService'

const url = 'api/version'

function getVersion () {
  return axiosService.getAll(url).then(res => {
    return res.data
  })
}

export default { getVersion }
