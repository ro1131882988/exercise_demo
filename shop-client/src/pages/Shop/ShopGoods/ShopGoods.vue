<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" v-for="(good, index) in goods" :key="index" :class="{current:index===currentIndex}" @click="clickMenu(index)">
          <span class="text bottom-border-1px" >
            <img class="icon" :src="good.icon" v-if="good.icon">
            {{good.name}}
          </span>
        </li>
      </ul>
    </div>

    <div class="foods-wrapper" ref="foodsWrapper">
      <ul ref="foodsUL">
        <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
          <h1 class="title">{{good.name}}</h1>
          <ul>
            <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index" @click="clickFood(food)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售 {{food.sellCount}} 份</span>
                  <span>好评率 {{food.rating}}%</span></div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <ShopCart></ShopCart>
  </div>
  <Food :food="food" ref="food"></Food>
</div>
</template>

<script>
  import Bscroll from 'better-scroll'
  import {mapState} from 'vuex'
  import CartControl from '../../../components/CartControl/CartControl.vue'
  import Food from '../../../components/Food/Food.vue'
  import ShopCart from '../../../components/ShopCart/ShopCart.vue'

  export default {
    data(){
      return{
        scrollY:0,
        tops:[],
        food:{},
      }
    },
    mounted () {
      this.$store.dispatch('getShopGoods',()=>{
        this.$nextTick(()=>{
          this.initScroll()
          this.initTops()
        })
      })
    },
    computed:{
      ...mapState(['goods']),
      currentIndex(){     //拿到对应的索引值显示 类名
        const {scrollY,tops} = this
        //循环遍历tops  寻找tops中符合条件的索引值  findIndex返回true和false
        const index=tops.findIndex((top,index)=>{  //top为tops的每一项  index为每一项top的索引值
          //当符合条件时  返回return  true
          return scrollY>=top && scrollY<tops[index+1]
          //大于当前top项的值    小于下一项的值
        })
        return index
      }
    },
    methods:{
      initScroll(){     //初始化右边滚动
        new Bscroll('.menu-wrapper',{
          click:true
        })
        this.foodScroll=new Bscroll('.foods-wrapper',{
          probeType:2,    //滑动方式选择
          click:true
        })
        //绑定滑动事件
        this.foodScroll.on('scroll',({x,y})=>{   //给右边滑动添加监听
          // console.log(x,y)
          this.scrollY=Math.abs(y)     //拿到滑动距离原来位置的  值
        })
        //绑定结束滚动事件
        this.foodScroll.on('scrollEnd',({x,y})=>{
          this.scrollY=Math.abs(y)
        })
      },
      initTops(){
        const tops=[]
        let top=0
        tops.push(top)
        const liArr=this.$refs.foodsUL.children
        Array.prototype.slice.call(liArr).forEach((li)=>{   //循环每一个li
          top=top+li.clientHeight     //拿到每一个li自己可以看到的区域的高
          tops.push(top)
        })
        this.tops=tops
        // console.log(this.tops)
      },
      //左侧列表绑定点击事件
      clickMenu(index){
        // console.log(index)
        const y= this.tops[index]
        //点击后  立马发生改变    反正到达的位置还是y  只是先动起来
        this.scrollY=y
        this.foodScroll.scrollTo(0,-y,500)
      },
      //
      clickFood(food){
        this.food = food
        //显示food    调用子组件方法
        this.$refs.food.isIsShow()
      }
    },
    components:{
      CartControl,
      Food,
      ShopCart
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
