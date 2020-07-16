<template>
  <div id="rank">
    <div class="rank-top">
      <div class="rank-header">
        <router-link to="/">
          <van-icon class="rank-back" name="arrow-left" />
        </router-link>
        <p>
          <span
            v-for="(i,y) in aType"
            :key="y"
            :class="{'active':curType == i.key}"
            @click="curType = i.key"
          >{{ i.name }}</span>
        </p>
        <i class="rank-question" @click="bShow=true"></i>
      </div>
      <p class="rank-tabs">
        <span
          v-for="(i,y) in aTab"
          :key="y"
          :class="{'active':curTab == i.key}"
          @click="curTab = i.key"
        >{{ i.name }}</span>
      </p>
      <!-- <div class="rank-yestoday">
        昨日TOP3
        <avatar v-for="(i,y) in aTopYestoday" :key="y" :url="i.images[0]" @click="toUserCard(i)"></avatar>
      </div> -->
      <div class="rank-win">
        <template v-for="(i, y) in aList">
          <div v-if="y < 3" :key="y" :class="'rank_' + y">
            <div class="avatar">
              <avatar :url="i.images[0]" @click="toUserCard(i)"></avatar>
              <p>NO.{{ y+1 }}</p>
            </div>
            <p>ID:{{ i.user_uid }}</p>
            <h4>
              <i v-if="i.ranking_state==1"></i>
              {{ i.nickname }}
            </h4>
            <!-- <p class="org">{{ i.ranking_state==1 ? '今日之星' : i.ranking_diff_value }}</p>
            <p v-if="y>0" class="tip">距上名</p> -->
          </div>
        </template>
      </div>
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

            <avatar :url="i.images[0]" @click="toUserCard(i)"></avatar>
            <div>
              <h4>
                {{ i.nickname }}
                <i v-if="i.ranking_state==1"></i>
              </h4>
              <p>ID:{{ i.user_uid }}</p>
            </div>
            <div class="right">
              <!-- <p class="org">{{ i.ranking_diff_value }}</p>
              <p class="tip">距上名</p> -->
            </div>
          </div>
        </template>
      </van-list>

      <!-- <div class="rank-listItem rank-self">
        <img :src="oSelf.image"/>
        <h4>{{ oSelf.is_online_ranking }}</h4>
        <div class="right">
          <p class="org">{{ oSelf.ranking_diff_value }}</p>
          <p class="tip">距上名</p>
        </div>
      </div>-->
    </div>
    <tip-modal v-model="bShow"></tip-modal>
  </div>
</template>
<script>
import "./index.scss";
import * as Util from "utils";
import { mapActions, mapGetters } from "vuex";
import tipModal from "./tip.vue";
import avatar from "@/components/avatar.vue";

export default {
  components: {
    tipModal,
    avatar
  },
  data() {
    return {
      bShow: false,
      aType: [
        { key: "wealth", name: "富豪榜" },
        { key: "charm", name: "魅力榜" }
      ],
      curType: "wealth",
      aTab: [
        { key: 1, name: "日榜" },
        { key: 2, name: "周榜" },
        { key: 3, name: "月榜" }
      ],
      curTab: 1,
      aTopYestoday: [],
      oSelf: {},
      aList: [],
      loading: false,
      finished: false,
      curPage: 1,
      error: false
    };
  },
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
        this.curType == "wealth"
          ? Util.URLConfig("getWealthRank")
          : Util.URLConfig("getCharmRank");
      let self = this;
      self.loading = true;
      Util.doAjax({
        url: url,
        type: "get",
        params: {
          type: self.curTab, //是	获取榜单类型（1=日，2=周，3=月）
          page_index: page - 1, //是	页数
          page_size: 10, //是	条数
          user_id: self.userinfo.user_id || "" //否	1	未登录情况需要传入
        },
        callback: function(msg) {
          self.curPage = page;
          self.finished =
            msg.data.page_count == msg.data.page_size ? false : true;
          self.oSelf = msg.data.curr_user_is_online;
          if (page == 1) {
            self.aList = [];
          }
          console.log(self.aList, "aListaListaListaList");
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