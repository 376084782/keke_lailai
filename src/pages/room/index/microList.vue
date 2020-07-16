<template>
  <div class="queue-list">
    <div class="host item" @click="clickHostMicro">
      <div :class="{'closeTime':closeTime}">
        <div class="ani-speaking" v-if="showHostSpeaking"></div>
        <p v-if="closeTime">{{closeTime}}</p>
        <avatar
          v-else-if="hostInfo.avatar||(hostInfo.images&&hostInfo.images[0])"
          :url="hostInfo.avatar||(hostInfo.images&&hostInfo.images[0])"
        ></avatar>
        <i v-else class="iconfont icon-shafa bgIcon"></i>
        <span v-if="hostInfo.volume==false" class="close">
          <i class="iconfont icon-yuyinjin"></i>
        </span>
      </div>
      <p :class="{'closeTime':closeTime}">{{ hostInfo.user_id ? hostInfo.nickname : '派对即将关闭'}}</p>
    </div>
    <div class="item" v-for="(i, y) in aMicroList" :key="y" @click="clickNormalSeat(i,y)">
      <div :class="{'boss':i.boss}">
        <div class="ani-speaking" v-if="i.user&&i.user.speakingLev>1"></div>
        <i v-if="i.lock" class="iconfont icon-suo bgIcon icon-white"></i>
        <template v-else-if="i&&i.user">
          <avatar v-if="getAvatar(i.user.images)" :url="getAvatar(i.user.images)"></avatar>
          <div v-else class="imgPlaceholder"></div>
          <!-- <span v-if="i.open" class="voice">
            <i class="iconfont icon-yuyin"></i>
          </span>-->
          <span v-if="i.volume_self==false" class="close">
            <i class="iconfont icon-yuyinjin"></i>
          </span>
          <!-- <span class="tag">7.7k</span> -->
        </template>
        <i v-else class="iconfont icon-shafa bgIcon"></i>
      </div>
      <p :class="{
        'active':i.user && i.user.nickname,
        'boss':i.boss
      }">
        {{ (i.user && i.user.nickname) ?
        i.user.nickname :
        i.boss ?
        '老板位' :
        (y+1) + '号麦'}}
      </p>
    </div>
  </div>
</template>
<script>
import RoomServerApi from "utils/RoomServerApi";
import Agora from "utils/Agora";
import { mapGetters } from "vuex";
import avatar from "@/components/avatar.vue";
export default {
  data() {
    return {
      timer: null,
      time: 180,
      closeTime: null,
      showHostSpeaking: false
    };
  },
  components: { avatar },
  computed: {
    ...mapGetters({
      userInfo: "BASE_userinfo",
      roomInfo: "ROOM_roomInfo",
      hostInfo: "ROOM_oHostInfo",
      aMicroList: "ROOM_aMicroList"
    })
  },
  watch: {
    aMicroList: {
      handler(v) {
        // console.log(888, v);
      },
      deep: true
    },
    hostInfo(val, old) {
      let self = this;
      if (val.user_id) {
        this.showHostSpeaking = val.speakingLev > 0;
      } else {
        this.showHostSpeaking = false;
      }
      console.log(val);
      if (val.user_id) {
        clearInterval(self.timer);
        self.time = 180;
        self.closeTime = null;
      } else if ( !val.user_id) {
        self.closeTime = self.time;
        clearInterval(self.timer)
        self.timer = setInterval(() => {
          if (self.time > 0) {
            self.time--;
            self.closeTime = self.time;
          } else {
            clearInterval(self.timer);
            self.time = 180;
            self.closeTime = null;
            // 关闭房间
            self.$router.push("/");
          }
        }, 1000);
      }
    }
  },
  methods: {
    getAvatar(imageList) {
      let i = imageList && imageList[0];
      return i;
    },
    clickHostMicro() {
      // 点击主持麦克风
      console.log(this.hostInfo);
      if (!this.hostInfo.user_id) {
        // 如果主持麦没有人，可以上麦
        RoomServerApi.askServerMicroStatusChange(
          1,
          1,
          this.roomInfo.free_micro,
          this.roomId,
          1
        ).then(e => {
          // 执行agora身份切换
          Agora.changeRole(status > 0).then(e => {
            // 通知服务器声网身份切换完成
            RoomServerApi.tellServerMicroStatusChanged(
              status,
              this.roomId,
              microId
            );
          });
        });
      } else {
        // 打开主持麦的用户信息弹窗
        this.$emit("toUserCard", this.hostInfo.user_id);
      }
    },
    clickNormalSeat(data, microId) {
      let flagOnSeat = !!this.aMicroList.find(
        item => item.user && item.user.user_id == this.userInfo.user_id
      );
      console.log(1243, data, microId, flagOnSeat);
      if (!data.user) {
        // 空位置
        if (flagOnSeat) {
          // 自己在麦上，跳麦
          this.jumpMicro(data, microId);
        } else {
          // 请求上麦或者排麦
          this.goNormalSeat(data, microId);
        }
      } else {
        this.$emit("toUserCard", data.user.user_id);
      }
    },
    jumpMicro(data, microId) {
      RoomServerApi.askServerJumpMicro(this.roomInfo.room_id, microId);
    },
    goNormalSeat(data, microId) {
      console.log(data, microId, "=======");
      RoomServerApi.askServerMicroStatusChange(
        1,
        2,
        this.roomInfo.free_micro,
        this.roomInfo.room_id,
        microId,
        data.guard
      ).then(e => {
        if (this.roomInfo.free_micro == 0) {
          // this.bShowLineUp = true;
          this.$emit("showLineUp");
        }
      });
    }
  }
};
</script>