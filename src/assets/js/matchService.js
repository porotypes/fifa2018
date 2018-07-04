import * as axiosService from './axiosService.js'
import axios from 'axios'

const URL = '/api/matches'

function getMatches () {
  let queryParams = {
    type: 'coming-matches'
  }
  return axiosService.getAll(URL, queryParams).then(res => {
    return res.data
  })
}

function getStartingMatches () {
  let queryParams = {
    type: 'started-matches'
  }
  return axiosService.getAll(URL, queryParams).then(res => {
    return res.data
  })
}

function getOneMatch (id) {
  return axiosService.get(URL, id).then(res => {
    return res.data
  })
}

function isbetalready (match) {
  let url = URL + '/' + match.id + '/isbetalready'
  return axios.patch(url, match).then(res => {
    return res.data.data
  })
}

function entryMatch (data) {
  return axiosService.post(URL, data).then(res => {
    return res.data
  })
}

function patchMatch (match, data) {
  return axiosService.patch(URL, match, data).then(res => {
    return res.data
  })
}

function saveMatchScore (matchId, data) {
  let url = URL + '/' + matchId
  return axios.patch(url, data).then(res => {
    return res
  })
}

export default {
  getMatches,
  getStartingMatches,
  getOneMatch,
  isbetalready,
  entryMatch,
  patchMatch,
  saveMatchScore
}
