<template>
  <div class="page home">
    <l-header></l-header>
    <div class="tag-wrap">
      <div class="inner">
        <div
          :class="{'active':curType == i, 'tag':1}"
          v-for="(i,y) in aType"
          :key="y"
          @click="onSelect(i)"
        >{{ i.type_name }}</div>
      </div>
    </div>

    <van-pull-refresh class="wrap-left" v-model="isLoading" @refresh="onRefresh">
      <van-swipe
        v-if="aSwipe&&aSwipe.length>0&&aType[0]&&curType.id==aType[0].id"
        class="top-banner"
        autoplay="5000"
      >
        <van-swipe-item v-for="(item, y) in aSwipe" :key="y">
          <div class="swipe-wrap">
            <img class="swipe-img" :src="item.img" @click="bannerJump(item)" />
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="list-wrap">
        <div class="item" v-for="(i,idx) in aList" :key="idx">
          <div class="pic-wrap">
            <p class="list-type">{{ i.room_type.type_name }}</p>
            <p class="list-tag">{{ i.tag_name }}</p>
            <img :src="i.image" @click="toRoom(i)" />
          </div>
          <p class="title">{{ i.name }}</p>
          <div class="wrap-btm" v-if="i.micro_user">
            <avatar :url="i.micro_user.images[0]"></avatar>
            <p class="sub">{{ i.micro_user.nickname }}</p>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import * as Util from "utils";
import "styles/home.scss";
import { mapActions, mapGetters } from "vuex";
import avatar from "@/components/avatar.vue";

import RongIM from "../../utils/RongIM";
export default {
  name: "Main",
  components: {
    avatar
  },
  data() {
    return {
      aSwipe: [],
      curType: null,
      aList: [],
      aType: [],
      count: 0,
      isLoading: false
    };
  },
  computed: {},
  watch: {
    aType(val) {
      this.onSelect(val[0]);
    }
  },
  methods: {
    bannerJump(data) {
      console.log(data);
      if (data.outside == 0) {
        location.href = data.url;
      }
    },
    onRefresh() {
      this.onSelect(this.curType).then(e => {
        this.isLoading = false;
      });
    },
    getRoomType() {
      let self = this;
      Util.doAjax({
        url: Util.URLConfig("getRoomType"),
        type: "get",
        params: {
          certified: 1 //0.非认证、1.认证、null.所有
        },
        callback: function(msg) {
          // self.aType = msg.data;
          if (self.$store.getters.dev) {
            self.aType.unshift({ id: 0, type_name: "推荐" });
            console.log(self.aType, ";asa");
            self.aType = self.aType.concat();
          } else {
            self.aType = msg.data.filter(item => item.id != 1 && item.id != 99);
          }
        }
      });
    },
    loadBanner() {
      let self = this;
      Util.doAjax({
        url: Util.URLConfig("getBanner"),
        type: "get",
        params: {
          type: 3
        },
        callback: function(msg) {
          self.aSwipe = msg.data;
          // self.aSwipe = [
          //   {img:"http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853"},
          //   {img:"http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853"},
          //   {img:"http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853"}
          // ]
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    },
    onSelect(i) {
      let self = this;
      self.curType = i;
      return new Promise((rsv, rej) => {
        if (i.id == 0) {
          //推荐房间
          Util.doAjax({
            url: Util.URLConfig("getHotHead"),
            type: "get",
            params: { type: 4 },
            callback: function(msg) {
              self.aList = msg.data;
              rsv();
            },
            errcallback: function(msg) {
              rej();
            },
            completecallback: function() {}
          });
        } else {
          Util.doAjax({
            url: Util.URLConfig("getHotRoom"),
            type: "get",
            params: { type_id: i.id },
            callback: function(msg) {
              self.getRoomList(msg.data.join(","));
              rsv();
            },
            errcallback: function(msg) {
              rej();
            },
            completecallback: function() {}
          });
        }
      });
    },
    getRoomList(ids) {
      let self = this;
      if (!ids) {
        self.aList = [];
        return;
      }
      Util.doAjax({
        url: Util.URLConfig("getRoomList"),
        type: "get",
        params: { ids: ids },
        callback: function(msg) {
          self.aList = msg.data;
          console.log(self.aList);
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    },
    toRoom(i) {
      let self = this;
      this.$store.dispatch("enter-room", i).then(e => {
        this.$router.push({
          path: "/room",
          query: {
            roomId: i.room_id
          }
        });
      });
    }
  },
  created() {
    this.loadBanner();
    this.getRoomType();
    if (this.aType.length > 0) {
      this.onSelect(this.aType[0]);
    }
  }
};
</script>