<template>
  <div id="app">
    <keep-alive include="Main">
      <router-view />
    </keep-alive>
    <l-login-pop v-model="bShowLogin" style="z-index:10000;position: relative;"></l-login-pop>
    <lock-modal></lock-modal>
    <van-overlay :show="showOverlay">
      <div class="hint-wrap" @click.stop>
        <div class="block" />
      </div>
    </van-overlay>
    <charge v-model="showCharge"></charge>
  </div>
</template>
<script>
import lockModal from "./pages/main/lock";
import charge from "./pages/charge";
import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    lockModal,
    charge
  },
  data() {
    return {
      showOverlay: false,
      hiddenTime: null
    };
  },
  methods: {
    checkBackToGame() {
      document.addEventListener("visibilitychange", () => {
        console.log("隐藏切换");
        if (document.visibilityState == "hidden") {
          this.hiddenTime = new Date().getTime(); //记录页面隐藏时间
        } else {
          this.$store.dispatch("base/updateFinance");
          let visibleTime = new Date().getTime();
          if ((visibleTime - this.hiddenTime) / 1000 > 10) {
          } else {
            console.log("还没有到断开的时间,刷新一下页面显示");
          }
        }
      });
    },
    is_Weixn() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters({
      bShowUserCard: "USER_bShowUserCard",
      bShowRoom: "ROOM_bShowRoom",
      showCharge: "showCharge"
    }),
    bShowLogin: {
      get() {
        return this.$store.getters.BASE_bShowLogin;
      },
      set(val) {
        this.$store.dispatch("base/showLogin", val);
      }
    }
  },
  watch: {
    bShowUserCard(val) {
      if (val) {
        this.$router.push("/user-card");
      }
    },
    // bShowRoom(val) {
    //   if (val) {
    //     this.$router.push("/room");
    //   }
    // },
    $route(val) {
      if (val.name != "UserCard" && this.bShowUserCard) {
        this.$store.dispatch("show-user-card", null);
      }
      if (val.name != "Room" && val.name != "RoomRank" && this.bShowRoom) {
        this.$store.dispatch("enter-room", null);
      }
    }
  },
  mounted() {
    this.showOverlay = this.is_Weixn();
    localStorage.setItem("overlayShowed", "1");
    window["$toast"] = this.$toast;
    this.checkBackToGame();
  }
};
</script>

<style lang="scss" scoped>
.hint-wrap {
  .block {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 244px;
    height: 108px;
    background: url(~@/assets/icon/hint.png);
    background-size: contain;
  }
}
</style>