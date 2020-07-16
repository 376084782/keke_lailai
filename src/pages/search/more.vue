<template>
  <div class="searchPage">
    <p class="title" @click="goBack">
      <van-icon name="arrow-left" class="pull-left" />
      "{{ keyword }}"的相关{{ type=='user'?'用户':'派对' }}
    </p>
    <van-loading size="24px" v-if="bLoading">加载中...</van-loading>
    <template v-if="type=='user'">
      <div v-for="(i,y) in aUser" :key="y" class="items" @click="showUser(i)">
        <img :src="i.images[0]" />
        <div>
          <h4>{{ i.nickname }}</h4>
          <p>ID:{{ i.user_uid }}</p>
        </div>
      </div>
    </template>
    <template v-if="type=='room'">
      <div v-for="(i,y) in aRoom" :key="y" class="items" @click="goRoom(i)">
        <img :src="i.image" />
        <div>
          <h4>{{ i.name }}</h4>
          <p>ID:{{ i.room_uid }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import "./index.scss";
import * as Util from "utils";
export default {
  data() {
    return {
      type: "",
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
          type: self.type == "user" ? 1 : 3 //0=搜索全部（用户、小屋/CBD房间），1=用户，2=小屋，3=CBD
        },
        callback: function(msg) {
          self.aUser = self.type == "user" ? msg.data.user.list : [];
          self.aRoom = self.type == "room" ? msg.data.room_cbd.list : [];
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
    goBack() {
      let self = this;
      this.$router.push({
        name: "Search",
        params: {
          keyword: self.keyword
        }
      });
    }
  },
  created() {
    console.log(this.$route);
    this.type = this.$route.query.type;
    this.keyword = this.$route.query.keyword;
    this.onSearch();
  }
  // activated(){
  //   this.type = this.$route.params.type
  //   this.keyword = this.$route.params.keyword
  //   this.onSearch()
  // }
};
</script>