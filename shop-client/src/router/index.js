/*
路由对象模块
* */

import Vue from 'vue'
import VueRouter from 'vue-router'

import MSite from '../pages/MSite/MSite.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Search from '../pages/Search/Search.vue'
import Login from '../pages/Login/Login.vue'

import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue'
// 声明路由插件
Vue.use(VueRouter)
export default new VueRouter({
  routes:[
    {path:'/msite',component: MSite,meta:{show:true}},
    {path:'/order',component: Order,meta:{show:true}},
    {path:'/profile',component: Profile,meta:{show:true}},
    {path:'/search',component: Search,meta:{show:true}},
    {path:'/',redirect: '/msite'},
    {path:'/login',component: Login},
    {path:'/shop',component: Shop,
      children:[
        {path:'',redirect: '/shop/goods'},
        {path:'/shop/goods',component: ShopGoods},
        {path:'/shop/ratings',component: ShopRatings},
        {path:'/shop/info',component: ShopInfo},
      ]}
  ]
})

