import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import {Button} from 'mint-ui'
//注册全局标签组件
Vue.component(Button.name, Button)  //mt-button

import './mock/mockServer' // 加载mockServer

new Vue({
  el: '#app',
  render: c => c(App),
  router,    //使用vue-router
  store,     //使用vuex
})
