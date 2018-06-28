import axios from 'axios'
import { Toast } from 'vant'

let USER_TOKEN = localStorage.getItem('USER_TOKEN')

axios.defaults.baseURL = 'http://api.fifa2018.suancloud.cn/'
// axios.defaults.baseURL = 'http://api.test.fifa2018.suancloud.cn/'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + USER_TOKEN

// methods
function getAll (url, queryParams = {}) {
  return axios.get(url, {params: queryParams})
    .then(response => response.data)
    .catch(error => handleError(error))
}

function get (url, id) {
  let URL = `${url}/${id}`
  return axios.get(URL)
    .then(response => response.data)
    .catch(error => handleError(error))
}

function post (url, data) {
  return axios.post(url, data)
    .then(response => response.data)
    .catch(error => handleError(error))
}

function update (url, queryParams) {
  let URL = queryParams.id ? `${url}/${queryParams.id}` : `${url}`
  return axios({
    method: 'put',
    url: URL,
    data: queryParams
  })
    .then(response => response.data)
    .catch(error => handleError(error))
}

function patch (url, data, queryParams = undefined) {
  let URL = url + (data.id ? '/' + data.id : '')
  if (!queryParams) {
    return axios({
      method: 'patch',
      url: URL,
      data: data
    })
      .then(response => response.data)
      .catch(error => handleError(error))
  }
  return axios({
    method: 'patch',
    url: URL,
    data: queryParams
  })
    .then(response => response.data)
    .catch(error => handleError(error))
}

function del (url, id) {
  let URL = `${url}/${id}`
  return axios.delete(URL)
    .then(response => response.data)
    .catch(error => handleError(error))
}

function handleError (error) {
  Toast.fail(error.response.data.message)
}

export { getAll, get, post, update, patch, del }
