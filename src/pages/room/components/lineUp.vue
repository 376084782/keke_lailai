<template>
  <van-popup v-model="show" position="bottom" round :style="{ height: '60%' }">
    <div class="van-popup-topTitle">
      <p>排队人数</p>
      <span>当前排队人数：{{aList&&aList.length}}</span>
    </div>
    <div class="pop-content hasBtn">
      <div v-for="(i, y) in aList" :key="y" class="popListItem">
        <avatar :url="i.images&&i.images[0]"></avatar>
        <div>
          <p>{{ i.nickname }}</p>
          <span :class="{'boy':i.gender==1, 'gender':1}">
            <i v-if="i.gender==1" class="iconfont icon-boy"></i>
            <i v-if="i.gender==2" class="iconfont icon-gril"></i>
            {{ getAge(i.birthday) }}
          </span>
        </div>
      </div>
    </div>
    <div class="opBox">
      <van-button type="default" round v-if="isInList" @click="goWaiting">马上排麦</van-button>
      <!-- <van-button type="default" round v-else @click="goMicro">马上上麦</van-button> -->
      <van-button type="default" round v-else @click="cancelMicro">取消排麦</van-button>
    </div>
  </van-popup>
</template>
<script>
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
import RoomServerApi from "utils/RoomServerApi";
import RongIM from "utils/RongIM";
import avatar from "@/components/avatar.vue";
export default {
  props: {
    value: Boolean
  },
  components: { avatar },
  data() {
    return {
      show: this.value,
      aList: []
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "BASE_userinfo",
      roomInfo: "ROOM_roomInfo"
    }),
    isInList() {
      return (
        this.aList.filter(item => item.user_id == this.userInfo.user_id)
          .length == 0
      );
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getDataList();
      }
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    cancelMicro() {
      Util.doAjax({
        url: Util.URLConfig(`/room/microphone/cancel`),
        params: {
          room_id: this.$route.query.roomId
        }
      });
    },
    goMicro(data, microId) {
      RoomServerApi.askServerMicroStatusChange(
        1,
        2,
        1,
        this.roomInfo.room_id,
        0,
        0
      ).then(e => {
        this.$emit("input", false);
      });
    },
    goWaiting(data, microId) {
      console.log(data, microId, "=======");
      RoomServerApi.askServerMicroStatusChange(
        1,
        2,
        this.roomInfo.free_micro,
        this.roomInfo.room_id,
        0,
        0
      ).then(e => {
        this.getDataList();
      });
    },
    getDataList() {
      Util.doAjax({
        url: Util.URLConfig("/room/microphone/apply_list"),
        type: "get",
        noPop: true,
        params: { room_id: this.$route.query.roomId }
      }).then(e => {
        let data = e.data;
        this.aList = data;
      });
    },
    getAge(t) {
      if (!t) return "--";
      let c = new Date().format("yyyy");
      let a = new Date(t * 1000).format("yyyy");
      return c - a;
    }
  }
};
</script>