<template>
  <div class="page charge" v-if="value">
    <div class="rank-header">
      <van-icon @click="closeHandler" class="rank-back btnBack" name="arrow-left" />
      <p class="title">我的钱包</p>
    </div>
    <div class="wrapper">
      <div class="card">
        <div class="diamond">{{userInfo.diamond_balance}}</div>
        <p class="num">
          <i class="icon-diamond"></i>
          钻石余额
        </p>
      </div>
      <div class="list-price">
        <div class="each" v-for="(item,idx) in listPrice" :key="idx">
          <span class="count">
            <i class="icon-diamond"></i>
            <span>{{item.diamond_amount}}钻</span>
          </span>
          <div class="btn" @click="doPay(item.rule_id)">¥{{(item.price/100)}}购买</div>
        </div>
      </div>
      <div class="title">选择支付方式</div>
      <div class="list-way">
        <div @click="selectWay=item.type" class="each" v-for="(item,idx) in listWay" :key="idx">
          <span class="left">
            <i :class="`icon-way ${item.icon}`"></i>
            <span>{{item.name}}</span>
          </span>
          <i class="icon-check" :class="{active:selectWay==item.type}"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Util from "utils";
import { mapGetters } from "vuex";
import "./index.scss";
export default {
  props: { value: Boolean },
  data() {
    return {
      selectWay: 1,
      listPrice: [],
      listWay: [
        {
          icon: "wechat",
          name: "微信支付",
          type: 1
        }
        // {
        //   icon: "alipay",
        //   name: "支付宝支付",
        //   type: 2
        // }
      ]
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "BASE_userinfo"
    })
  },
  methods: {
    closeHandler(e) {
      this.$store.dispatch("base/updateShowCharge", false);
    },
    doPay(rule_id) {
      Util.doAjax({
        url: Util.URLConfig("/finance/pay/do"),
        type: "post",
        params: {
          rule_id: rule_id,
          plat_type: 3,
          recharge_type: 0,
          pay_type: this.selectWay == 1 ? 7 : 6
        }
      }).then(e => {
        location.href = e.data.h5wxpay;
      });
    },
    getData() {
      Util.doAjax({
        url: Util.URLConfig("/finance/pay/rules"),
        type: "get",
        params: {
          platform: 3
        }
      }).then(e => {
        this.listPrice = e.data.itemlist;
        console.log(this.listPrice, 2, e);
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>