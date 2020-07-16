<template>
  <div class="userCard">
    <van-icon class="goback" name="arrow-left" @click="goBack" />
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(i,y) in oInfo.images" :key="y">
        <img :src="i" />
      </van-swipe-item>
    </van-swipe>
    <div class="infoBox">
      <div>
        <h4>{{ oInfo.nickname || '--' }}</h4>
        <p>
          ID:{{ oInfo.user_uid }}
          <span class="certify" v-if="oInfo.active_certify">实名认证</span>
        </p>
        <p>
          <span>{{ oInfo.gender == 1 ? '男' : '女' }}</span>
          <span>{{ getAge(oInfo.birthday) }}</span>
          <span>{{ oInfo.constellation }}</span>
        </p>
      </div>
      <van-button
        @click="goGuanZhu"
        round
        type="default"
        size="mini"
        :icon="`${is_mutual_follow?'':'plus'}`"
      >关注</van-button>
    </div>
    <p class="sign">个性签名：{{ oInfo.sign || '--' }}</p>
    <div class="opBox">
      <van-row>
        <!-- <van-col span="12">
          <p><van-icon class="gift" name="point-gift-o" />送礼</p>
        </van-col>-->
        <van-col span="24">
          <p>
            <van-icon @click="goApp" class="chat" name="chat-o" />聊TA
          </p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
import * as Util from "utils";

import "./index.scss";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      is_mutual_follow: false
    };
  },
  computed: {
    ...mapGetters({
      oInfo: "USER_userCardInfo"
    })
  },
  methods: {
    goApp() {
      location.href = "https://ztaudio-res.qianyancm.com/share/index.html";
    },
    goGuanZhu() {
      console.log(this.oInfo.user_id);
      Util.doAjax({
        url: Util.URLConfig(`/friends/follow`),
        params: {
          user_id: this.oInfo.user_id,
          action: this.is_mutual_follow ? 0 : 1
        }
      }).then(msg => {
        console.log(msg.data.is_mutual_follow);
      });
    },
    getAge(t) {
      let c = new Date().format("yyyy");
      let a = new Date(t * 1000).format("yyyy");
      return c - a;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>