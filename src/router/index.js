import Vue from 'vue'
import Router from 'vue-router'

import tokenService from '@/assets/js/tokenService'

import Login from '@/components/Login'
// client
import Client from '@/components/client/Client'
const Bets = () => import('@/components/client/Bets')
const StartingMatch = () => import('@/components/client/StartingMatch')
const Course = () => import('@/components/client/Course')
const Rule = () => import('@/components/client/Rule')
const Ranking = () => import('@/components/client/Ranking')
const My = () => import('@/components/client/My')

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '', redirect: 'login' },
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/client',
      component: Client,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: 'bets' },
        { path: 'bets', name: 'Bets', component: Bets },
        { path: 'startingMatch', name: 'StartingMatch', component: StartingMatch },
        { path: 'course', name: 'Course', component: Course },
        { path: 'ranking', name: 'Ranking', component: Ranking },
        { path: 'rule', name: 'Rule', component: Rule },
        { path: 'my', name: 'My', component: My }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = tokenService.decodeToken()
  if (to.path === '/login') {
    if (token && !tokenService.isOverdue()) {
      next({path: '/client'})
    } else {
      next()
    }
  } else {
    if (token && !tokenService.isOverdue()) {
      if (window.location.href.indexOf('token') > 0) {
        let token = window.location.href.split(';')[1]
        window.localStorage.setItem('USER_TOKEN', token.split('=')[1])
        window.location.href = window.location.href.split(';')[0]
      }
      next()
    } else {
      if (window.location.href.indexOf('token') > 0) {
        let token = window.location.href.split(';')[1]
        window.localStorage.setItem('USER_TOKEN', token.split('=')[1])
        window.location.href = window.location.href.split(';')[0]
      }
      next({path: '/login'})
    }
  }
})

export default router
