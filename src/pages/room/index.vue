<template>
  <div id="room">
    <div class="video-grid" id="video">
      <div class="video-view">
        <div id="local_stream" class="video-placeholder"></div>
        <div id="local_video_info" class="video-profile hide"></div>
        <div id="video_autoplay_local" class="autoplay-fallback hide"></div>
      </div>
    </div>
    <div class="room-header">
      <avatar
        :url="roomInfo.host&&roomInfo.host.images[0]"
        @click="toUserCard(roomInfo.host.user_id)"
      ></avatar>
      <!-- <img :src="roomInfo.image" /> -->
      <div>
        <p>
          <!-- <span v-if="roomInfo.liang" class="liang">靓</span>
          <span>{{ roomInfo.name }}</span>
          <i class="iconfont icon-microphone"></i>
          <i class="lock"></i>
          <span v-if="!roomInfo.is_collect" class="collect">收藏</span>-->
          {{roomInfo.name&&cutstr(roomInfo.name,17)}}
          <span class="tag">相亲</span>
        </p>
        <p>
          <span>ID:{{ roomInfo.room_uid }}</span>
          <van-icon class="fire" name="fire" />
          <span>{{ roomInfo.hot||2000 }}</span>
          <span class="signal">
            <i></i>
            {{downlinkNetworkQuality}}ms
          </span>
        </p>
      </div>
      <div class="btn" @click="bShowOnline=true">
        在线{{ roomInfo.online_count || 0 }}
        <van-icon name="arrow" />
      </div>
      <div class="btn" @click="showAction=true">
        <van-icon name="ellipsis" />
      </div>
    </div>
    <div class="room-header">
      <div class="btn" style="margin:0" @click="bShowBulletin=true">
        <i class="iconfont icon-post"></i>
        公告
      </div>
      <div class="avatars">
        <div @click="showRank=true" class="btn-rank">
          <span>排行榜</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <!-- 麦序部分 -->
    <micro-list @toUserCard="toUserCard" @showLineUp="bShowLineUp=true"></micro-list>
    <!-- 聊天部分 -->
    <chat-list :aChat="aChat" @toUserCard="toUserCard"></chat-list>
    <!-- 操作部分 -->
    <div id="op" class="op-list">
      <p style="width:200px;">
        <van-field
          ref="input"
          inline
          class="chatIcon"
          v-model="messageModel"
          @keyup.enter.native="messageSubmit"
          right-icon="chat-o"
        />
      </p>
      <p @click="toggleSound">
        <i :class="`iconfont icon-${flagSound?'boyin':'jingyin'}`"></i>
      </p>
      <p @click="toggleMicro" v-if="!!this.getSelMicroData()">
        <i :class="`iconfont icon-yuyin${!flagMicro?'jin':''}`"></i>
      </p>
      <p v-if="this.roomInfo.free_micro==0" @click="bShowLineUp=true">
        <i :class="`iconfont icon-shafa`"></i>
      </p>
      <!-- <p>
        <van-icon name="smile-o" />
      </p>-->
      <!-- <p>
        <i class="iconfont icon-mail"></i>
      </p>-->
      <p @click="onSend(-1, 'multi')">
        <van-icon name="gift-o" />
      </p>
      <p @click="showActionBtm=true">
        <i class="iconfont icon-more_"></i>
      </p>
    </div>
    <!-- 公告 -->
    <bulletin-modal v-model="bShowBulletin" :content="roomInfo.notice"></bulletin-modal>
    <!-- 个人资料卡 -->
    <card-modal v-model="bShowCard" :user-id="curUserId" @send="onSend" :show-off-micro="isOnMicro"></card-modal>
    <!-- 在线用户 -->
    <online-pop v-model="bShowOnline"></online-pop>
    <!-- 队列位置 -->
    <queue-pop v-model="bShowQueue"></queue-pop>
    <!-- 当前排队人数，排队 -->
    <line-up-pop v-model="bShowLineUp" ref="lineUpModal"></line-up-pop>
    <!-- 全部礼物 -->
    <gift-record-pop v-model="bShowGiftRecord"></gift-record-pop>
    <!-- 送礼物 -->
    <send-pop
      v-model="bShowSend"
      :single="bSendSingle"
      :user-id="nSendUserID"
      @recharge="onRecharge"
    ></send-pop>
    <!-- 更多 -->
    <van-action-sheet v-model="showAction" :actions="actions" @select="onSelect" />
    <van-action-sheet v-model="showActionBtm" :actions="actionsBtm" @select="onSelectBtm" />
    <!-- 充值提示框 -->
    <l-recharge-modal v-model="bShowRechargeModal"></l-recharge-modal>
    <view-rank @showUserCard="showUserCardHandler" @close="showRank=false" v-if="showRank"></view-rank>
    <user-card :is-comp="true" v-show="showUserCard" v-model="showUserCard"></user-card>
    <download-ball v-if="$store.getters.appConfig.showDownloadBall"></download-ball>
  </div>
</template>
<script>
import "./index.scss";
import userCard from "@/pages/userCard/other";
import { mapGetters, mapActions } from "vuex";
import Agora from "utils/Agora";
import * as Util from "utils";
import RoomServerApi from "utils/RoomServerApi";
import RongIM from "utils/RongIM";

import microList from "./index/microList.vue";
import chatList from "./index/chatList.vue";

import ViewRank from "@/pages/room/components/rank";
import bulletinModal from "./components/bulletin.vue";
import cardModal from "./components/card.vue";
import onlinePop from "./components/online.vue";
import queuePop from "./components/queue.vue";
import lineUpPop from "./components/lineUp.vue";
import giftRecordPop from "./components/giftRecord.vue";
import sendPop from "./components/send.vue";
import avatar from "@/components/avatar.vue";
import downloadBall from "@/components/downloadBall.vue";
export default {
  components: {
    avatar,
    ViewRank,
    microList,
    chatList,

    bulletinModal,
    cardModal,
    onlinePop,
    queuePop,
    lineUpPop,
    giftRecordPop,
    sendPop,
    userCard,
    downloadBall
  },
  data() {
    return {
      showUserCard: false,
      flagSound: true,
      flagMicro: true,
      showRank: false,
      downlinkNetworkQuality: 0,
      showAction: false,
      showActionBtm: false,
      actions: [{ name: "退出派对" }, { name: "取消" }],
      actionsBtm: [{ name: "送礼记录" }],
      messageModel: "",
      bShowBulletin: false,
      bShowCard: false,
      curUserId: 0,
      // avatar,nickname,user_id
      bShowOnline: false,
      bShowQueue: false,
      bShowLineUp: false,
      bShowGiftRecord: false,
      bShowSend: false,
      bSendSingle: false,
      bShowRechargeModal: false,
      aChat: [],
      nSendUserID: -1
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "BASE_userinfo",
      roomInfo: "ROOM_roomInfo",
      hostInfo: "ROOM_oHostInfo",
      aQueue: "ROOM_aMicroList"
    }),
    isOnMicro() {
      return !!this.aQueue.find(
        item => item.user && item.user.user_id == this.curUserId
      );
    },
    roomId() {
      return this.roomInfo.room_id;
    }
  },
  watch: {
    roomId(val) {
      if (val) {
        this.getMicroList({ room_id: val });
      }
    }
  },
  methods: {
    listenWindowClose() {
      window.onbeforeunload = function() {
        this.exitRoom(true);
        //窗口关闭前
        return "确认要关闭当前窗口？";
      };
    },
    showUserCardHandler(i) {
      this.$store.dispatch("set-other-card-info", i);
      this.showUserCard = true;
    },
    cutstr: Util.cutstr,
    onRecharge() {
      if (this.userInfo && this.userInfo.user_id && !this.userInfo.is_visitor) {
        // 已登录提示弹窗
        if (window.self === window.top) {
          this.$store.dispatch("base/updateShowCharge", true);
        } else {
          this.bShowRechargeModal = true;
        }
      } else {
        // 未登录打开登录弹窗
        this.$store.dispatch("base/showLoginModal", true);
      }
    },
    getSelMicroData() {
      return this.aQueue.find(
        item => item && item.user && item.user.user_id == this.userInfo.user_id
      );
    },
    ...mapActions({
      // 通过store统一获取管理麦序列表
      getMicroList: "room/getMicroList"
    }),
    toggleSound() {
      Agora.toggleSound();
    },
    toggleMicro() {
      let selMicroData = this.getSelMicroData();
      if (!selMicroData) {
        return;
      }
      this.flagMicro = !this.flagMicro;
      Util.doAjax({
        url: Util.URLConfig(
          `/room/microphone/${this.flagMicro ? "open" : "close"}`
        ),
        params: {
          room_id: this.roomId,
          microphone_id: selMicroData.microphone_id,
          self: 1
        }
      }).then(msg => {
        Agora.toggleMicro(this.flagMicro);
      });
    },
    onSelectBtm(item) {
      switch (item.name) {
        case "送礼记录": {
          this.bShowGiftRecord = true;
          break;
        }
      }
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.showActionBtm = false;
    },
    onSelect(item) {
      switch (item.name) {
        case "取消": {
          this.showAction = false;
          break;
        }
        case "切换听筒": {
          break;
        }
        case "退出派对": {
          this.$bus.$emit("room/IM", {
            type: "closeRoom",
            data: {}
          });
          break;
        }
      }
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.showAction = false;
    },
    messageSubmit(e) {
      if (!this.messageModel) {
        return;
      }
      console.log("change", e);
      RongIM.sendMsg(this.roomId, this.messageModel, {
        k: 10001,
        fid: this.userInfo.user_id,
        fnn: this.userInfo.nickname,
        fimg: this.userInfo.images[0],
        t: this.messageModel
      }).then(e => {
        this.$refs.input.blur();
        let extra = JSON.parse(e.content.extra);
        this.aChat.push({
          type: 2,
          image: extra.fimg,
          message: extra.t,
          nickname: extra.fnn,
          user_id: this.userInfo.user_id
        });
        console.log("eeeee", e);
      });
      this.messageModel = "";
    },
    clickMicro(data, idx) {
      console.log(data, idx);
      this.changeMicroStatus(1, idx);
    },
    toUserCard(userId) {
      console.log(userId, "222");
      this.curUserId = userId;
      this.bShowCard = true;
    },
    onSend(userId, type = "single") {
      this.bSendSingle = type == "multi" ? false : true;
      if (userId > -1) {
        let flag =
          this.aQueue.find(item => item.user && item.user.user_id == userId) ||
          this.hostInfo.user_id == userId;
        // 送给麦序上的人，页面为多人送礼物类型
        this.bSendSingle = !flag;
      }
      this.nSendUserID = userId;
      this.bShowSend = true;
    },
    getHostList() {
      let self = this;
      Util.doAjax({
        url: Util.URLConfig("/room/hostmicrophone/info"),
        params: {
          room_id: this.roomId
        },
        callback: function(msg) {
          console.log("hostList", msg.data.user);
          msg.data.user.volume = msg.data.volume;
          self.$store.dispatch("room-hostInfo", msg.data.user);
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    },
    changeMicroStatus(status, microId) {
      // 请求服务上下麦操作
      RoomServerApi.askServerMicroStatusChange(
        status,
        this.roomId,
        microId
      ).then(e => {});
    },
    changeAgoraRole(status) {
      // 开麦关麦，只切换agora用户身份
      Agora.changeRole(status > 0).then(e => {});
    },
    imHandler(result) {
      let self = this;
      let type = result.type;
      let data = result.data;
      console.log(type, "typeeee");
      switch (type) {
        case "changeMicroFree": {
          if (data.type == 1) {
            console.log(this.bShowLineUp);
            this.bShowLineUp = false;
          }
          let roomInfoNew = Object.assign(this.roomInfo, {
            free_micro: data.type
          });
          this.$store.dispatch("updateRoomInfo", roomInfoNew);
        }
        case "updateLineUp": {
          console.log(22222);
          this.$refs.lineUpModal && this.$refs.lineUpModal.getDataList();
          break;
        }
        case "updateMute": {
          this.flagSound = data.flagSound;
          break;
        }
        case "updateMicroMute": {
          this.flagMicro = data.flagMicro;
          break;
        }
        case "updateNewQuality": {
          this.downlinkNetworkQuality = data.downlinkNetworkQuality;
          break;
        }
        case "chatMessage": {
          this.aChat.push(data);
          break;
        }
        case "closeRoom": {
          this.exitRoom(true);
          break;
        }
        case "updateMicroVolume": {
          if (!data) {
            return;
          }
          let volumnInfoHost = data.find(
            item => item.uid == this.hostInfo.user_id
          );
          if (volumnInfoHost) {
            this.hostInfo.speakingLev = volumnInfoHost.level;
          } else {
            this.hostInfo.speakingLev = 0;
          }
          this.$store.dispatch("room-hostInfo", this.hostInfo);
          let listQuene = this.aQueue.concat();
          listQuene.forEach(itemQuene => {
            if (itemQuene.user) {
              let infoMicro = data.find(
                item => item.uid == itemQuene.user.user_id
              );
              if (infoMicro) {
                itemQuene.speakingLev = infoMicro.level;
              } else {
                itemQuene.speakingLev = 0;
              }
            }
          });
          this.$store.dispatch("room/setMicroList", listQuene);
          break;
        }
        case "hostOff": {
          // 通讯关闭倒计时
          this.$store.dispatch("room-hostInfo", {});
          console.log("主持人下麦", this.hostInfo, "hostinfo");
          break;
        }
        case "hostUpdate1": {
          let info = Object.assign({}, this.hostInfo, {
            nickname: data.nn,
            user_id: data.uid,
            images: [data.img],
            gender: data.sex,
            volumn: data.v
          });
          this.$store.dispatch("room-hostInfo", info);
          console.log(data);
          break;
        }
        case "hostUpdate": {
          let info = Object.assign({}, this.hostInfo, data);
          this.$store.dispatch("room-hostInfo", info);
          console.log(data);
          break;
        }
        case "clearSeat": {
          let mid = data.mid;
          if (!this.aQueue[mid]) {
            this.aQueue[mid] = {};
          }
          this.aQueue[mid].user = null;
          break;
        }
        case "updateMicroList": {
          let mid = data.mid;
          let dataWillClear = this.aQueue.find(
            item => item.user && item.user.user_id == data.uid
          );
          if (dataWillClear) {
            dataWillClear.user = null;
          }
          if (!this.aQueue[mid]) {
            this.aQueue[mid] = {};
          }
          this.aQueue[mid].user = {
            user_id: data.uid,
            nickname: data.nn,
            gender: data.sex,
            images: [data.img],
            user_uid: data.uuid
          };
          break;
        }
        case "updateSeatConfig": {
          let mid = data.mid;
          if (data && data.boss != undefined) {
            this.aQueue[mid].boss = data.boss;
          }
          if (data && data.lock != undefined) {
            this.aQueue[mid].lock = data.lock;
          }
          break;
        }
        case "updateRoomInfo": {
          let roomInfoNew = Object.assign(this.roomInfo, data);
          console.log(
            this,
            this.roomInfo,
            data,
            roomInfoNew,
            "updateRoomInfo111"
          );
          this.$store.dispatch("updateRoomInfo", roomInfoNew);
          break;
        }
        case "updateMicroStatus": {
          if (this.aQueue[data.mid]) {
            Object.assign(this.aQueue[data.mid], data);
            // this.$set(this.aQueue[data.mid], "status", data.status);
          }
          break;
        }
        case "giftMsg": {
          data.tu.forEach(to => {
            this.aChat.push({
              type: 3,
              image: data.fimg,
              nickname: data.fnn,
              user_id: data.fid,
              gender: data.fsex,
              to: to, //受赠者是数组格式
              gid: data.gid,
              giftName: data.codeIM == 20006 ? data.box_name : data.gift_name,
              num: data.codeIM == 20006 ? to.gc : data.gc
            });
          });
          break;
        }
      }
    },
    exitRoom(autoClose) {
      if (!this.roomId) {
        return;
      }
      RongIM.quitRoom(this.roomId).then(e => {
        Util.doAjax({
          url: Util.URLConfig("/room/quit"),
          params: {
            room_id: this.roomId
          }
        }).then(msg => {
          Util.doAjax({
            url: Util.URLConfig("/room/quit/confirm"),
            params: {
              room_id: this.roomId
            }
          }).then(msg => {
            Agora.quitRoom().then(e => {
              this.$store.dispatch("clear-roomInfo");
              this.$router.replace({
                name: "Main",
                params: { isClose: autoClose ? 1 : 0 }
              });
            });
          });
        });
      });
    }
  },
  beforeDestroy() {
    this.$bus.$off("room/IM", this.imHandler);
    this.exitRoom();
  },
  created() {
    this.getMicroList({ room_id: this.$route.query.roomId });
    this.$nextTick(_ => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(e => {
            console.log(e, "success");
          })
          .catch(e => {
            console.log("fail", e);
          });
      }
      console.log(this.roomInfo, "roomInfo");
      this.$bus.$on("room/IM", this.imHandler);
      this.getHostList();
      Agora.joinRoom(this.roomInfo.room_id, this.roomInfo.agora_token);
      // // 聊天区域高度计算
      // let h = document.body.clientHeight;
      // let t = 375;
      // let b = $("#op").height() + 30;
      // $("#chat").css({
      //   height: h - t - b - 10 + "px",
      //   "overflow-y": "auto"
      // });
    });
  }
};
</script>