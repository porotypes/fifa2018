import Vue from 'vue'
import Router from 'vue-router'

import tokenService from '@/assets/js/tokenService'

import Login from '@/components/Login'

// client
import Client from '@/components/client/Client'
import Bets from '@/components/client/Bets'
import StartingMatch from '@/components/client/StartingMatch'
import Course from '@/components/client/Course'
import Rule from '@/components/client/Rule'
import Ranking from '@/components/client/Ranking'
import My from '@/components/client/My'

// admin
import Admin from '@/components/admin/Admin'
import Team from '@/components/admin/Team'
import EditTeam from '@/components/admin/EditTeam'

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
    },
    {
      path: '/admin',
      component: Admin,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: 'team' },
        { path: 'team', name: 'Team', component: Team },
        { path: 'editTeam', name: 'EditTeam', component: EditTeam }
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
