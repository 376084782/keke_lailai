<template>
  <van-popup
    id="sendPop"
    v-model="show"
    :overlay-style="{'background-color':'transparent'}"
    position="bottom"
    round
    :style="{ height: '5.5rem' }"
  >
    <div class="van-popup-topTitle">
      <p>礼物</p>
    </div>
    <!-- 选择多人赠送 -->
    <van-row class="send-user" v-if="!single">
      <van-col span="3">送礼：</van-col>
      <van-col span="17" class="userBox">
        <div class="userList">
          <div v-for="(i,y) in aUser" :key="y" :class="{'active': isActive(i)}">
            <template v-if="y==0">
              <avatar :url="getAvatar(i.images)" @click="onSelect(i)"></avatar>
              <span class="host" @click="onSelect(i)">主持</span>
            </template>
            <template v-else-if="i.user">
              <avatar :url="getAvatar(i.user.images)" @click="onSelect(i)"></avatar>
              <span @click="onSelect(i)">{{i.microphone_id + 1}}麦</span>
            </template>
          </div>
        </div>
      </van-col>
      <van-col span="4">
        <van-button
          type="primary"
          :class="flagSelectedAll?'select-green':''"
          round
          @click="onSelect(null,'toggle')"
        >全麦</van-button>
      </van-col>
    </van-row>
    <!-- 礼物列表 -->
    <van-swipe class="my-swipe" :autoplay="0" indicator-color="#19FFBE" @change="onChange">
      <van-swipe-item class="giftGroup" span="4" v-for="(giftList, y) in giftData" :key="y">
        <div
          v-for="(i, y) in giftList"
          :key="y"
          class="giftItem"
          :class="{'active': i.gift_id == selectGood.gift_id}"
        >
          <img :src="i.image" @click="selectGood=i" />
          <p>{{ i.name }}</p>
          <p class="price">
            <i class="diamond"></i>
            {{ i.price }}
          </p>
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 操作 -->
    <div class="opBox">
      <p>
        <i class="diamond"></i>
        {{ userinfo.diamond_balance }}
        <span @click="onRecharge">充值</span>
      </p>
      <div>
        <!-- TODO:数量选择弹框 -->
        <span @click="showSelectBox=!showSelectBox">
          {{selectNum}}
          <van-icon name="arrow-up" />
        </span>
        <!-- TODO:赠送事件 -->
        <span @click="doSend">赠送</span>
        <div class="selectBox" v-if="showSelectBox">
          <div v-for="(item) in typeList" :key="item" @click="doSelNum(item)">
            <span>{{item}}</span>
            <span>{{numMap[item]}}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
import avatar from "@/components/avatar.vue";
export default {
  props: {
    value: Boolean,
    single: {
      type: Boolean,
      default: true
    },
    userId: Number
  },
  components: { avatar },
  data() {
    return {
      selectNum: 1,
      showSelectBox: false,
      numMap: {
        1: "一心一意",
        10: "十全十美",
        11: "要你",
        77: "亲亲",
        188: "要抱抱",
        365: "想你",
        520: "我爱你",
        999: "长长久久",
        1314: "一生一世"
      },
      show: this.value,
      aUser: [],
      aGift: [],
      giftData: {},
      giftListTotal: [],
      typeList: [],
      page: 0,
      selectGood: "",
      aSelectUser: []
    };
  },
  computed: {
    flagSelectedAll() {
      let flagAll = true;
      this.aUser.forEach(item => {
        let target = this.aSelectUser.find(
          userId => item.user.user_id == userId
        );
        if (!target) {
          flagAll = false;
        }
      });
      return flagAll;
    },
    ...mapGetters({
      userinfo: "BASE_userinfo",
      hostInfo: "ROOM_oHostInfo",
      getMicroList: "room/getMicroList",
      aMicroList: "ROOM_aMicroList"
    })
  },
  watch: {
    value(val) {
      this.show = val;
      if (val) {
        let hostInfo=Object.assign({},this.hostInfo,{user:this.hostInfo})
        this.aUser = [hostInfo]
          .concat(this.aMicroList)
          .filter(
            item =>
              (item && item.user_id) ||
              (item.user && item.user.user_id != this.userinfo.user_id)
          );
      }
      // 点击麦序上的人送礼物时的处理
      if (!this.single && this.userId) {
        this.aSelectUser = [this.userId];
      }
    },
    show(val) {
      this.$emit("input", val);
      if (val) {
        this.$store.dispatch("base/updateFinance");
      }
    }
  },
  methods: {
    doSelNum(item) {
      this.selectNum = item;
      this.showSelectBox = false;
    },
    doSend() {
      if (
        !this.selectGood ||
        (this.aSelectUser && this.aSelectUser.length == 0)
      ) {
        this.$toast("请选择礼物");
        return;
      }
      let willSendUserList = this.aSelectUser.filter(id => id != -1);
      if (willSendUserList.length == 0) {
        this.$toast("请选择赠送人");
        return;
      }
      Util.doAjax({
        url: Util.URLConfig(`/gift/give_gift`),
        type: "post",
        params: {
          room_id: this.$route.query.roomId,
          type: 1,
          to_user_ids: willSendUserList.join("#"),
          gift_id: this.selectGood.gift_id,
          gift_num: this.selectNum
        }
      }).then(msg => {
        this.show = false;
      });
    },
    onChange(page) {
      this.loadGoods(page);
    },
    onRecharge() {
      this.$emit("recharge");
    },
    getAvatar(imageList) {
      let i = imageList && imageList[0];
      console.log(i);
      return i;
    },
    isActive(item) {
      if (!item.user) return false;
      return $.inArray(item.user.user_id, this.aSelectUser) > -1 ? true : false;
    },
    onSelect(item, type) {
      console.log(232);
      if (type == "toggle") {
        if (!this.flagSelectedAll) {
          this.aSelectUser = [];
          this.aUser.forEach(i => {
            if (i.user) {
              this.aSelectUser.push(i.user.user_id);
            }
          });
        } else {
          this.aSelectUser = [];
        }
        console.log(this.aSelectUser);
      } else {
        let id = item.user.user_id;
        let index = $.inArray(id, this.aSelectUser);
        if (index > -1) {
          this.aSelectUser.splice(index, 1);
        } else {
          this.aSelectUser.push(id);
        }
      }
    },
    getAge(t) {
      if (!t) return "--";
      let c = new Date().format("yyyy");
      let a = new Date(t * 1000).format("yyyy");
      return c - a;
    },
    loadGoods(page = 0) {
      let self = this;
      this.page = page;
      let call = msg => {
        let eachCount = 8;
        let list = self.giftListTotal.concat();
        for (let i = 0; i < list.length / eachCount; i++) {
          let targetList = list
            .concat()
            .slice(eachCount * i, eachCount * (i + 1));
          self.$set(self.giftData, i, targetList);
        }
        console.log(self.giftData, self.giftListTotal, "giftDatagiftData");
      };
      if (!this.giftListTotal || this.giftListTotal.length == 0) {
        Util.doAjax({
          url: Util.URLConfig("/gift/gift_list"),
          type: "get",
          params: {
            platform: 1,
            limit: 1000,
            page_size: 1000,
            page_index: this.page
          },
          callback: function(msg) {
            self.typeList = msg.data.spec_list;
            self.selectNum = self.typeList[0];
            self.giftListTotal = msg.data.list;
            console.log(self.giftListTotal, "listlist");
            // self.giftListTotal = self.giftListTotal.concat(
            //   self.giftListTotal,
            //   self.giftListTotal,
            //   self.giftListTotal,
            //   self.giftListTotal,
            //   self.giftListTotal
            // );
            call(msg);
          },
          errcallback: function(msg) {},
          completecallback: function() {}
        });
      }
    }
  },
  created() {
    this.loadGoods();
  }
};
</script>
<style lang="scss">
#sendPop {
  background-color: #1e2029;
  .van-popup-topTitle {
    border-color: #23272e;
    p {
      color: #19ffbe;
      margin-right: auto;
    }
  }
  .send-user {
    font-size: 14px;
    padding: 10px;
    div {
      color: #969696;
      &.active .wrap-avatar {
        border-color: #19ffbe;
      }
    }
    .wrap-avatar {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      border: 1px solid transparent;
    }
    .userBox {
      overflow-x: auto;
      overflow-y: hidden;
    }
    .userList {
      display: flex;
      div {
        position: relative;
        float: left;
        color: #969696;
        margin-right: 15px;
        span {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 10px;
          border-radius: 0px 4px 4px;
          background-color: #000;
          color: #fff;
          padding: 0px 3px;
          z-index: 999;
          &.host {
            background-color: #0ac896;
          }
        }
      }
    }
    .van-button {
      float: right;
      background-color: #37373e;
      border: none;
      font-size: 12px;
      line-height: 30px;
      height: 30px;
      width: auto;
      padding: 0 10px;
    }
  }
  .select-green {
    background-color: #0ac896 !important;
  }
  .van-swipe__track {
    padding-bottom: 10px;
  }
  .van-swipe__indicators {
    bottom: 0;
  }
  .diamond {
    display: inline-block;
    background-image: url(~@/assets/icon/diamond.png);
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .giftGroup {
    width: 100vw;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .giftItem {
    // width: 90%;
    // margin: 0 auto;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 4px 0;
    margin: 0 10px;
    &.active {
      border-color: #19ffbe;
    }
    img {
      display: block;
      width: 68px;
      height: 68px;
      margin: 0 auto;
    }
    p {
      font-size: 10px;
      color: #fff;
      i {
        width: 10px;
        height: 10px;
      }
      &.price {
        font-size: 8px;
      }
    }
  }
  .opBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background-color: #1e2029;
    height: 30px;
    margin-bottom: 10px;
    p {
      font-size: 14px;
      color: #fff;
      i {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
      span {
        color: #ffce00;
        margin-left: 10px;
      }
    }
    & > div {
      font-size: 14px;
      color: #fff;
      width: 120px;
      height: 28px;
      line-height: 28px;
      border: 1px solid #00f198;
      border-radius: 20px;
      span:nth-child(2) {
        float: right;
        width: 68px;
        background-image: linear-gradient(to right, #00f198, #08f6f6);
        border-radius: 0 20px 20px 0;
      }
      span:nth-child(1) {
        width: 50px;
        float: left;
        color: #fff;
        .van-icon {
          float: right;
          line-height: 28px;
          color: #fff;
          margin-right: 3px;
          font-size: 10px;
        }
      }
    }
    .selectBox {
      position: absolute;
      bottom: 40px;
      width: 120px;
      // max-height: 245px;
      // overflow: hidden;
      // overflow-y: scroll;
      background-color: #1c1c26;
      border: none;
      border-radius: 0;
      & > div {
        border: none;
        border-radius: 0;
        position: relative;
        font-size: 14px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        span {
          border: none;
          background: none;
          color: #969696;
        }
        span:nth-child(1) {
          color: #fff;
        }
        &:not(:last-child) ::after {
          content: "";
          position: absolute;
          bottom: 0;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.05);
          width: 100%;
          left: 0;
          // transform: scaleY(0.5);
        }
      }
    }
  }
}
</style>
