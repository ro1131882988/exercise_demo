<template>
    <div id="app">
      <router-view></router-view>
      <footerguide v-show="$route.meta.show"></footerguide>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import footerguide from './components/FooterGuide/FooterGuide.vue'
export default {
    mounted(){
      // this.$store.dispatch('getAddress')
      this.getAddress()
      this.getUserInfo()
    },
    methods:{
      ...mapActions(['getAddress','getUserInfo'])
    },
    components:{
      footerguide
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.app
  width 100%
  height 100%
  background #f5f5f5
  position relative
</style>
