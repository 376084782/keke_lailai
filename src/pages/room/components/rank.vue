<template>
  <div id="roomRank">
    <div class="rank-header">
      <div>
        <van-icon @click="$emit('close')" class="pull-left icon-back" name="arrow-left" />
      </div>
      <p>
        <span
          v-for="(i,y) in aType"
          :key="y"
          :class="{'active':curType == i.key}"
          @click="curType = i.key"
        >{{ i.name }}</span>
      </p>
    </div>
    <p class="rank-tabs">
      <span
        v-for="(i,y) in aTab"
        :key="y"
        :class="{'active':curTab == i.key}"
        @click="curTab = i.key"
      >{{ i.name }}</span>
    </p>
    <div class="rank-win">
      <template v-for="(i, y) in aList">
        <div v-if="y < 3" :key="y" :class="'rank_' + y">
          <div class="avatar">
            <avatar :url="i.images[0]" @click="toUserCard(i)"></avatar>
            <p>NO.{{ y+1 }}</p>
          </div>
          <h4>{{ i.nickname }}</h4>
          <template v-if="curTab=='wealth'">
            <h4>{{ i.devote_diamond_total }}</h4>
            <p class="tip">贡献值</p>
          </template>
          <template v-if="curTab=='charm'">
            <h4>{{ i.total_charm_value }}</h4>
            <p class="tip">魅力</p>
          </template>
        </div>
      </template>
    </div>
    <div class="rank-list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="loadRank(curPage+1)"
      >
        <template v-for="(i, y) in aList">
          <div v-if="y > 2" :key="y" class="rank-listItem">
            <span>{{ y+1 }}</span>
            <avatar style="margin: 0 .1rem;" :url="i.images[0]" @click="toUserCard(i)"></avatar>
            <div>
              <h4>{{ i.nickname }}</h4>
            </div>
            <div class="right">
              <h4>{{ i.ranking_diff_value }}</h4>
              <p class="tip">贡献值</p>
            </div>
          </div>
        </template>
      </van-list>
    </div>
  </div>
</template>
<script>
import "./rank.scss";
import * as Util from "utils";
import { mapActions, mapGetters } from "vuex";
import avatar from "@/components/avatar.vue";

export default {
  data() {
    return {
      aType: [
        { key: 1, name: "今日榜" },
        { key: 2, name: "本周榜" }
      ],
      curType: 1,
      aTab: [
        { key: "wealth", name: "财富榜" },
        { key: "charm", name: "魅力榜" }
      ],
      curTab: "wealth",
      aList: [],
      loading: false,
      finished: false,
      curPage: 1,
      error: false
    };
  },
  components: { avatar },
  computed: {
    ...mapGetters({
      userinfo: "BASE_userinfo"
    })
  },
  watch: {
    curTab(val) {
      this.loadRank(1);
    },
    curType(val) {
      this.loadRank(1);
    }
  },
  methods: {
    loadRank(page = 1) {
      let url =
        this.curTab == "wealth"
          ? Util.URLConfig("getRoomWealthRank")
          : Util.URLConfig("getRoomCharmRank");
      console.log(this.curType, this.curTab);
      let self = this;
      self.loading = true;
      Util.doAjax({
        url: url,
        type: "get",
        params: {
          type: self.curType, //是	获取榜单类型（1=日，2=周，3=月）
          page_index: page - 1, //是	页数
          page_size: 10, //是	条数
          room_id: self.$route.query.roomId //否	1	未登录情况需要传入
        },
        callback: function(msg) {
          self.curPage = page;
          self.finished = page >= msg.data.page_count ? true : false;
          if (page == 1) {
            self.aList = [];
          }
          self.aList = self.aList.concat(msg.data.list);
        },
        errcallback: function(msg) {
          self.error = true;
        },
        completecallback: function() {
          self.loading = false;
        }
      });
    },
    toUserCard(i) {
      this.$store.dispatch("show-user-card", i);
    }
  },
  created() {
    this.loadRank();
  }
};
</script>