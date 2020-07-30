<template>
  <van-dialog
    id="roomUserCard"
    width="81.6%"
    v-model="show"
    :showConfirmButton="showConfirmBtn"
    :showCancelButton="!bSelf"
    :confirmButtonText="bSelf?'下麦旁听':'聊TA'"
    cancelButtonText="送礼"
    :close-on-click-overlay="true"
    :before-close="onHandle"
  >
    <div class="top">
      <img :src="getAvatar(info.images)" />
      <div class="shape"></div>
      <div class="info">
        <h4>{{ info.nickname || '--' }}</h4>
        <p>
          <span>ID:{{ info.user_uid || '--' }}</span>
          <span>{{ info.gender == 1 ? '男' : '女' }}</span>
          <span>{{ getAge(info.birthday) }}</span>
          <span>{{ info.constellation }}</span>
        </p>
      </div>
    </div>
    <p class="sign">
      <span>个性签名：</span>
      {{ info.sign }}
    </p>
  </van-dialog>
</template>
<script>
import RoomServerApi from "../../../utils/RoomServerApi";
import RongIM from "../../../utils/RongIM";
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    value: Boolean,
    userId: Number
  },
  data() {
    return {
      info: {},
      show: this.value,
      bSelf: false
    };
  },
  computed: {
    showConfirmBtn() {
      if (this.bSelf) {
        console.log(this.aQueue, "aQueueaQueueaQueue");
        return !!this.aQueue.find(
          item => item.user && item.user.user_id == this.userId
        );
      } else {
        return true;
      }
    },
    ...mapGetters({
      aQueue: "ROOM_aMicroList",
      baseinfo: "BASE_userinfo",
      roomInfo: "ROOM_roomInfo"
    })
  },
  watch: {
    value(val) {
      if (val) {
        if (this.userId == this.baseinfo.user_id) {
          this.bSelf = true;
        } else {
          this.bSelf = false;
        }
        this.updateInfo();
      }
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getAvatar(imageList) {
      return imageList && imageList[0];
    },
    updateInfo() {
      if (!this.userId) {
        return;
      }
      Util.doAjax({
        url: Util.URLConfig("getUserinfo"),
        type: "get",
        params: { user_id: this.userId }
      }).then(msg => {
        this.info = msg.data;
      });
    },
    getAge(t) {
      if (!t) return "--";
      let c = new Date().format("yyyy");
      let a = new Date(t * 1000).format("yyyy");
      return c - a;
    },
    goOffMicro() {
      console.log(23232);
      RoomServerApi.askServerMicroStatusChange(
        -1,
        2,
        this.roomInfo.free_micro,
        this.roomInfo.room_id,
        0,
        0
      ).then(e => {
        this.$emit("input", false);
      });
    },
    onHandle(action, done) {
      let self = this;
      if (action == "confirm") {
        if (self.bSelf) {
          // 下麦旁听
          this.goOffMicro();
        } else {
          // 聊TA
          location.href = this.$store.getters.appConfig.urlDownload;
        }
        done(false);
      } else if (action == "cancel") {
        // 送礼
        self.$emit("send", this.userId);
        console.log(this.userId);
        done();
      } else {
        done();
      }
    }
  }
};
</script>
<style lang="scss">
#roomUserCard {
  .van-dialog__content {
    padding: 0;
    background-color: #f6f6f6;
  }
  img {
    display: block;
    width: 100%;
  }
  .top {
    position: relative;
    height: 300px;
    overflow: hidden;
    .shape {
      width: 100%;
      height: 20%;
      position: absolute;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        #000000 100%
      );
    }
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .info {
    position: absolute;
    bottom: 5px;
    left: 10px;
    text-align: left;
    h4 {
      font-size: 24px;
      color: #fff;
    }
    p {
      font-size: 13px;
      span {
        color: #fff;
        margin-right: 10px;
      }
    }
  }
  .sign {
    position: relative;
    color: #646464;
    font-size: 14px;
    margin-left: 70px;
    padding: 10px;
    text-align: left;
    min-height: 20px;
    span {
      position: absolute;
      color: #646464;
      font-size: 14px;
      top: 10px;
      left: -60px;
    }
  }
}
</style>