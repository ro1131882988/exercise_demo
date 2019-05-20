/*
直接更新state对象的多个方法对象
 */
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART,
  RECEIVE_SEARCH_SHOPS
} from './mutation-types'

export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },

  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },

  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  },

  [RECEIVE_USER_INFO] (state, {userInfo}) {
    state.userInfo = userInfo
  },

  [RESET_USER_INFO] (state) {
    state.userInfo = {}
  },

  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },

  [INCREMENT_FOOD_COUNT] (state, {food}) {
    if (food.count){
      food.count++
      // state.cartFoods.push(food)
    } else {
      Vue.set(food,'count',1)     //新增属性绑定属性
      //将food添加到购物车信息中
      state.cartFoods.push(food)
    }
  },
  [DECREMENT_FOOD_COUNT] (state, {food}) {
    if (food.count){
      food.count--
      //当为0时
      if (food.count===0){
       //将 cartFoods删除   splice 根据索引值删除  1为删除1项   indexOF为根据相同的food寻找到对应的索引值
        state.cartFoods.splice(state.cartFoods.indexOf(food),1)
      }
    }
  },

  [CLEAR_CART](state,cartFoods){
    //清除cartFoods中每一个food的count
    state.cartFoods.forEach(food => food.count=0)
    //指向一个新的数组
    state.cartFoods=[]
  },

  [RECEIVE_SEARCH_SHOPS](state,{shopsName}){
    state.shopsName=shopsName
  }
}
