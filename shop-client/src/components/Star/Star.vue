<template>
  <div>
    <div class="star" :class="'star-'+size">
      <span class="star-item" v-for="(starClass, index) in StarClassArr" :class="starClass" :key="index"></span>
    </div>
  </div>
</template>

<script>
  const STAR_ON = 'on'       // 满星
  const STAR_HALF = 'half'      // 半星
  const STAR_OFF = 'off'      // 灰星
  export default {
    props:{
      score:Number,
      size:Number
    },
    computed:{
      StarClassArr(){
        //算法   当大于0.5的时候有半星
        const {score} = this
        const scoreNewArr=[]
        let scoreON=Math.floor(score)  //向下取整拿到满星数
        for (let i=0;i<scoreON;i++){
          scoreNewArr.push(STAR_ON)    //添加满星数
        }
        if (score*10-scoreON*10>=5){
          scoreNewArr.push(STAR_HALF)  //添加大于0.5的半星
        }
        // console.log(scoreNewArr)
        while (scoreNewArr.length<5){
          scoreNewArr.push(STAR_OFF)   //添加满5个星星   灰星
        }
        return scoreNewArr
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/stars/star48_on')
        &.half
          bg-image('./images/stars/star48_half')
        &.off
          bg-image('./images/stars/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star36_on')
        &.half
          bg-image('./images/stars/star36_half')
        &.off
          bg-image('./images/stars/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star24_on')
        &.half
          bg-image('./images/stars/star24_half')
        &.off
          bg-image('./images/stars/star24_off')
</style>
