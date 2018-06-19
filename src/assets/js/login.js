import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL = 'http://api.fifa2018.suancloud.cn/'

const BASE_API_URL = 'api.fifa2018.suancloud.cn'

function login () {
  const host = window.location.host
  const redirectUrl = 'http://' + BASE_API_URL + '/qywxOAuthRedirect/' + host

  let params = new URLSearchParams()
  // console.log(params)
  params['redirectUrl'] = encodeURI(redirectUrl)
  // params.append('redirectUrl', redirectUrl)

  return Vue.http.get('http://api.fifa2018.suancloud.cn/generateQywxOAuthUrl', {params: params}).then(res => {
    return res.text()
  })

  // return axios.get('generateQywxOAuthUrl', {params: params, responseType: 'text'}).then(res => {
  //   return res.data
  // })
}

export default { login }
