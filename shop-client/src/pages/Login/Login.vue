<template>
<div>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">欢迎登陆</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginway}" @click="loginway=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginway}" @click="loginway=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginway}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!phoneBool" class="get_verification" :class="{right_phone: phoneBool}" @click.prevent="getCode">
                {{codeTime>0?`已发送，剩余${codeTime}s`:'获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginway}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="密码" v-if="passwordBool" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="passwordBool?'on':'off'" @click="passwordBool=!passwordBool">
                  <div class="switch_circle" :class="passwordBool?'key':''"></div>
                  <span class="switch_text">{{passwordBool?'abc':''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-xiazai6"></i>
      </a>
    </div>
    <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"></AlertTip>
  </section>
</div>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip.vue'
  import {reqPwdLogin,reqSendCode,reqSmsLogin} from '../../api'
  export default {
    data(){
      return{
        loginway:true,    //true代表短信方式登陆 false代表密码登陆
        phone:'',      //绑定手机号内容
        code:'',       //短信验证码
        codeTime:0,    //验证码
        passwordBool: false,    //密码显示
        name:'',
        pwd:'',    //密码内容
        captcha:'',    //登陆模块验证码
        alertText:'',   //提示文本内容
        showAlert:false  //是否显示警告提示
    }
    },
    computed:{
      phoneBool(){
        return /^1\d{10}$/.test(this.phone)      //test会返回一个bool值 前后相等就为true
      }
    },
    methods:{
      //获取验证码
      async getCode(){
        // alert('aaaaa')
        // if(!this.codeTime){ }
        // console.log(this.codeTime);
        if (this.codeTime>0&&this.codeTime<=30) return;     //不执行下面
        this.codeTime=30    //当点击验证码时 设置总时间为30s
        this.codeInterval=setInterval(()=>{
          this.codeTime--
          if(this.codeTime<=0){
            clearInterval(this.codeInterval)   //清除定时器
          }
        },1000)
        //发送ajax请求获取短信验证码
        const result= await reqSendCode(this.phone)
        //请求失败
        if (result.code===1){
          //显示提示
          this.showAlert=true
          this.alertText=result.msg
          //停止计时
          if (this.codeTime){
            this.codeTime=0
            clearInterval(this.codeInterval)
          }
        }
      },
      //登陆警告
      async login(){    //验证表单输入内容格式
        let result
        if (this.loginway){     //为true进入  为短信登陆
          const {phoneBool,phone,code}=this
          if (!this.phoneBool){
            //手机号不正确
            this.showAlert=true
            this.alertText='手机号不正确'
            return
          }else if (!/^\d{6}$/.test(code)){
            //验证码是6位
            this.showAlert=true
            this.alertText='验证码是6位'
            return
          }
          //短信登陆
          result=await reqSmsLogin(phone,code)
        } else {     // 账号登陆
          const {name,pwd,captcha}=this
          if (!this.name){
            //必须输入账号
            this.showAlert=true
            this.alertText='必须输入账号'
            return
          }else if (!this.pwd){
            //必须输入密码
            this.showAlert=true
            this.alertText='必须输入密码'
            return
          }else if (!this.captcha){
            //必须输入验证码
            this.showAlert=true
            this.alertText='必须输入验证码'
            return
          }
          //密码登陆
          result=await reqPwdLogin({name,pwd,captcha})
        }
        //根据结果处理数据
        if (result.code===0){
          const user = result.data
          //将user保存到xuex中的state中
          this.$store.dispatch('recordUser', user)
          // console.log(user)
          //跳转到个人中心
          this.$router.replace('/profile')
        }else {
          const msg=result.msg
          //显示提示
          this.showAlert=true
          this.alertText=msg
          //停止计时
          if (this.codeTime){
            this.codeTime=0
            clearInterval(this.codeInterval)
          }
          //刷新图片验证码
          this.getCaptcha()
        }
      },
      closeTip(){   //初始化警告
        this.showAlert=false
        this.alertText=''
      },
      //图像验证码
      getCaptcha(){
        this.$refs.captcha.src='http://localhost:4000/captcha?time='+Date.now()
      }
    },
    components:{
      AlertTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color:black;
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.key
                    transform translateX(26px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
