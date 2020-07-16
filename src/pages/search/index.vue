<template>
  <div class="searchPage">
    <div class="searchWrap">
      <van-field
        class="inputSingle"
        left-icon="search"
        v-model="keyword"
        placeholder="搜索昵称、房间、ID"
        @keyup.enter="onSearch"
      />
      <router-link to="/">
        <span class="goback">取消</span>
      </router-link>
    </div>
    <van-loading size="24px" v-if="bLoading">加载中...</van-loading>
    <p class="tips" v-if="aUser.length>0">
      相关用户
      <span @click="toMore('user')">
        更多
        <van-icon name="arrow" />
      </span>
    </p>
    <div v-for="i in aUser" :key="i.user_id" class="items" @click="showUser(i)">
      <img :src="i.images[0]" />
      <div>
        <h4>{{ i.nickname }}</h4>
        <p>ID:{{ i.user_uid }}</p>
      </div>
    </div>
    <p class="tips" v-if="aRoom.length > 0">
      相关派对
      <span @click="toMore('room')">
        更多
        <van-icon name="arrow" />
      </span>
    </p>
    <div v-for="i in aRoom" :key="i.room_uid" class="items" @click="goRoom(i)">
      <img :src="i.image" />
      <div>
        <h4>{{ i.name }}</h4>
        <p>ID:{{ i.room_uid }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import "./index.scss";
import * as Util from "utils";
export default {
  data() {
    return {
      keyword: "",
      bLoading: false,
      aUser: [],
      aRoom: []
    };
  },
  methods: {
    onSearch() {
      let self = this;
      self.bLoading = true;
      Util.doAjax({
        url: Util.URLConfig("search"),
        type: "get",
        params: {
          keywords: self.keyword,
          type: 0 //0=搜索全部（用户、小屋/CBD房间），1=用户，2=小屋，3=CBD
        },
        callback: function(msg) {
          self.aUser = msg.data.user.list;
          self.aRoom = msg.data.room_cbd.list;
        },
        errcallback: function(msg) {},
        completecallback: function() {
          self.bLoading = false;
        }
      });
    },
    showUser(i) {
      this.$store.dispatch("show-user-card", i);
    },
    goRoom(i) {
      this.$store.dispatch("enter-room", i).then(e => {
        this.$router.push({
          path: "/room",
          query: {
            roomId: i.room_id
          }
        });
      });
    },
    toMore(type) {
      let self = this;
      this.$router.push({
        path: "/search-more",
        query: {
          type: type,
          keyword: self.keyword
        }
      });
    }
  },
  created() {
    if (this.$route.params.keyword) {
      this.keyword = this.$route.params.keyword;
      this.onSearch();
    }
  }
};
</script>