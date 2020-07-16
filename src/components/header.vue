<template>
  <div class="bar-top">
    <div class="btn" @click="onLogin"></div>
    <h1>来来语音聊天室</h1>
    <div class="right-btns">
      <router-link to="/rank"><div class="btn goal"></div></router-link>
      <!-- <router-link to="/"><div class="btn home"></div></router-link> -->
      <router-link to="/search"><div class="btn search"></div></router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  methods:{
    onLogin(){
      this.$store.dispatch('base/showLogin', true)
    }
  }
}
</script>
<style scoped lang="scss">
  .bar-top {
    display: flex;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: white;
    top: 0;
    height: 48px;
    z-index: 2000;
    width: 100%;
    box-sizing: border-box;
    h1 {
      font-size: 20px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
    }

    .right-btns {
      display: flex;
      align-items: center;

      a {
        margin-left: 15px;
      }
    }

    .btn {
      width: 20px;
      height: 20px;
      background: url(~@/assets/icon/more.png) no-repeat;
      background-size: 100%;
      background-position: center;

      &.goal {
        background-image: url(~@/assets/icon/rank.png)
      }

      &.home {
        background-image: url(~@/assets/icon/hone.png)
      }

      &.search {
        background-image: url(~@/assets/icon/sousuoxian.png)
      }
    }
  }
</style>

