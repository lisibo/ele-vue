import Vue from "vue"
import app from "./App"
import router from "./router/index.js"
import moment from 'moment'

import axios from 'axios'
Vue.prototype.$axios = axios

import "./mock/mockServer"
import "./common/stylus/fonts.styl"

Vue.filter('data-string',function(value){
	return moment(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  el:'#app',
  render: h => h(app),
  router
})



