// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import App from './App'
import axios from 'axios'
import router from './router'
import Vant from 'vant'
import { Table, Tag, TableColumn } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import 'vant/lib/vant-css/index.css'

Vue.config.productionTip = false

Vue.use(Vant, axios)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(vueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
