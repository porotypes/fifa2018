import * as axiosService from './axiosService.js'

const URL = '/api/matchbets'

function createMatchScore (data) {
  return axiosService.post(URL, data).then(res => {
    return res.data
  })
}

function updateMatchScore (data) {
  let url = URL + '/' + data.id
  return axiosService.patch(url, data, {guestScore: data.guestScore, hostScore: data.hostScore}).then(res => {
    return res.data
  })
}

function getMyListBets () {
  let query = {
    type: 'list-my-own-bets'
  }
  return axiosService.getAll(URL, query).then(res => {
    return res.data
  })
}

function getListMatchBets (matchId) {
  let query = {
    type: 'list-match-bets',
    params: {
      matchId: matchId
    }
  }
  return axiosService.getAll(URL, query).then(res => {
    return res.data
  })
}

function getBingoBetList (playerId) {
  const queryParams = {
    type: 'list-player-history-bingo-bets',
    params: {
      playerId: playerId
    }
  }
  return axiosService.getAll(URL, queryParams).then(res => {
    return res.data
  })
}

function getWinnerBetsList (playerId) {
  const queryParams = {
    type: 'list-player-history-winner-bets',
    params: {
      playerId: playerId
    }
  }
  return axiosService.getAll(URL, queryParams).then(res => {
    return res.data
  })
}

export default {
  createMatchScore,
  updateMatchScore,
  getListMatchBets,
  getMyListBets,
  getBingoBetList,
  getWinnerBetsList
}
