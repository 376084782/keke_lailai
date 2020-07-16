<template>
  <div>
    <van-popup v-model="show" id="loginPop" position="left">
      <div @click="toSelf" class="userBox" v-if="userInfo.user_id&&userInfo.is_visitor==0">
        <avatar :url="userInfo.images ?userInfo.images[0] :''"></avatar>
        <p class="nickname">{{ userInfo.nickname }}</p>
        <p class="id">
          ID {{ userInfo.user_uid }}
          <van-icon name="arrow" class="pull-right" />
        </p>
        <p class="sign">{{ userInfo.sign }}</p>
      </div>
      <div class="userBox" v-else>
        <img class="wrap-avatar" @click="bShowLoginModal=true" src="~@/assets/icon/user.png" />
        <p class="nickname">登录</p>
      </div>
      <div class="balance">
        <p>钻石余额</p>
        <p>{{ userInfo.diamond_balance || 0 }}</p>
      </div>
      <van-button round type="default" size="small"  class="color1" @click="onRecharge">充值</van-button>
      <div class="bottom">
        <img class="wrap-avatar" src="~@/assets/icon/logo.png" />
        <div>
          <p>遇见声音 发现快乐</p>
          <van-button  class="color1" type="default" size="small" @click="goDownload">立即下载</van-button>
        </div>
      </div>
    </van-popup>
    <recharge-modal v-model="bRecharge"></recharge-modal>
    <info-modal v-model="bInfo"></info-modal>
    <login-modal v-model="bShowLoginModal"></login-modal>
  </div>
</template>
<script>
import rechargeModal from "./recharge.vue";
import infoModal from "./info.vue";
import loginModal from "./login.vue";
import { mapGetters } from "vuex";
import avatar from "@/components/avatar.vue";

export default {
  props: {
    value: Boolean
  },
  components: {
    rechargeModal,
    infoModal,
    avatar,
    loginModal
  },
  data() {
    return {
      show: this.value,
      bRecharge: false,
      bInfo: false
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "BASE_userinfo"
    }),
    bShowLoginModal: {
      get() {
        return this.$store.getters.BASE_bShowLoginModal;
      },
      set(val) {
        this.$store.dispatch("base/showLoginModal", val);
      }
    }
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    goDownload() {
      location.href = "https://ztaudio-res.qianyancm.com/share/index.html";
    },
    onRecharge() {
      console.log(
        this,
        this.userInfo,
        "this.userInfo && this.userInfo.user_id"
      );
      if (this.userInfo && this.userInfo.user_id && !this.userInfo.is_visitor) {
        // 已登录提示弹窗
        if (window.self === window.top) {
          this.bShowLoginModal = false;
          this.$store.dispatch("base/updateShowCharge", true);
        } else {
          this.bRecharge = true;
        }
      } else {
        // 未登录打开登录弹窗
        this.bShowLoginModal = true;
      }
    },
    toSelf() {
      this.show = false;
      this.$router.push("/self-card");
    }
  }
};
</script>
<style scoped lang="scss">
@import "~@/styles/theme.scss";
#loginPop {
  width: 260px;
  height: 100%;
  padding: 96px 15px 0;
  .userBox {
    border-top: 1px solid #f2f8fb;
    padding-top: 50px;
    font-size: 12px;
    margin-bottom: 30px;
    height: 142px;
    .wrap-avatar {
      display: block;
      width: 68px;
      height: 68px;
      margin: 0 auto 10px;
      border-radius: 50px;
    }
    p {
      margin-bottom: 5px;
    }
    .nickname {
      font-size: 14px;
    }
    .id {
      color: $color_info;
    }
    .sign {
      color: #4a4a4a;
    }
  }
  .balance {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding: 0 10px;
    margin-bottom: 20px;
    p:nth-child(2) {
      padding-right: 25px;
      background-image: url(~@/assets/icon/diamond.png);
      background-size: 20px 20px;
      background-position: right center;
      background-repeat: no-repeat;
    }
  }
  .bottom {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 100px;
    left: 0;
    width: 100%;
    border-top: 5px solid #f9f9f9;
    padding-top: 40px;
    font-size: 15px;
    .wrap-avatar {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    div {
      text-align: left;
    }
    .van-button {
      width: auto;
      padding: 0 10px;
      border-radius: 4px;
    }
  }
}
</style>