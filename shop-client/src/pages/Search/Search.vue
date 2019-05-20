<template>
  <div>
    <section class="search">
      <headertop MSiteTitle="搜索"></headertop>
      <form class="search_form" @submit.prevent="search">
        <input type="search" placeholder="请输入商家名称" class="search_input" v-model="keyword">
        <input type="submit" class="search_submit" >
      </form>
      <section class="list" v-if="searchShow">
        <ul class="list_container">
          <li class="list_li">
            <section class="item_left"><img src="http://fuss10.elemecdn.com/8/a6/453f65f16b1391942af11511b7a90jpeg.jpeg?imageView2/1/w/750/h/750" class="restaurant_img">
            </section>
            <section class="item_right">
              <div class="item_right_text"><p><span>aaa我是样式</span></p>
                <p>月售 671 单</p>
                <p>20 元起送 / 距离 1058.2 公里</p></div>
            </section>
          </li>
        </ul>
      </section>

      <div class="search_none" v-if="noSearchShops">很抱歉！无搜索结果</div>
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import headertop from '../../components/HeaderTop/HeaderTop.vue'

  export default {
    data(){
      return{
        keyword:'',
        noSearchShops:false,
        searchShow:false
      }
    },
    computed:{
      ...mapState(['shopsName'])
    },
    methods:{
      search(){
        if (!this.noSearchShops){
          this.searchShow=true
        }else {
          this.searchShow=false
        }
        //得到关键字
        const keyword=this.keyword.trim()
        //进行搜索
        if (keyword){
          this.$store.dispatch('getShopName',keyword)
        }
      }
    },
    watch:{
      shopsName(value){
        if (value.status===0){
          this.noSearchShops=true
        } else {
          this.noSearchShops=false
        }
      }
    },
    components: {
      headertop
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    height 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
</style>
