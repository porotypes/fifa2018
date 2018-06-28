import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL = 'http://api.fifa2018.suancloud.cn/'
// axios.defaults.baseURL = 'http://api.test.fifa2018.suancloud.cn/'

const BASE_API_URL = 'api.fifa2018.suancloud.cn'
// const BASE_API_URL = 'api.test.fifa2018.suancloud.cn'

function login () {
  const host = window.location.host
  const redirectUrl = 'http://' + BASE_API_URL + '/qywxOAuthRedirect/' + host
  let params = {}
  params['redirectUrl'] = encodeURI(redirectUrl)
  return Vue.http.get('http://api.fifa2018.suancloud.cn/generateQywxOAuthUrl', {params: params}).then(res => {
    return res.text()
  })
  // return Vue.http.get('http://api.test.fifa2018.suancloud.cn/generateQywxOAuthUrl', {params: params}).then(res => {
  //   return res.text()
  // })
}

export default { login }
