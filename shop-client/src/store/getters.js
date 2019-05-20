/*
基于state的getter计算属性的对象
 */
export default {
  //购物车总数
  totalCount(state){
    return state.cartFoods.reduce((preTotal,food)=>preTotal + food.count,0)    //0从第一个开始 preTotal上一次返回值  food当前被处理的元素
  },
  //购物车总价格
  totalPrice(state){
    return state.cartFoods.reduce((preTotal,food)=>preTotal + food.count*food.price,0)  //food的个数*单价
  },
  ratingNumber(state){
    return state.ratings.reduce((preTotal,rating)=>preTotal+(rating.rateType===0?1:0),0)
  }
}
