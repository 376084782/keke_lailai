<template>
  <van-popup v-model="show" position="bottom" round :style="{ height: '60%' }">
    <div class="van-popup-topTitle">
      <p>队列中的位置</p>
      <span>你在队列中的位置：3</span>
    </div>
    <div class="pop-content hasBtn">
      <div v-for="(i, y) in aList" :key="y" class="popListItem">
        <avatar :url="i.image"></avatar>
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
      <van-button type="default" round>取消排麦</van-button>
    </div>
  </van-popup>
</template>
<script>
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
import avatar from "@/components/avatar.vue";
export default {
  props: {
    value: Boolean
  },
  components:{avatar},
  data() {
    return {
      show: this.value,
      aList: [
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 1
        },
        {
          image:
            "https://c-ssl.duitang.com/uploads/item/202004/22/20200422201706_fhqym.jpg",
          nickname: "哦哦",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        },
        {
          image:
            "http://thirdwx.qlogo.cn/mmopen/vi_32/xqDgL2PrQjwxwqMTd47mcFG6PYLLPNQz5yhFkvAzl8pV7V43e0PkkfOdTcARCIqibS75LC9stN4nTHDYvPpVmXw/0",
          nickname: "啊啊啊啊啊啊",
          birthday: "725817600",
          gender: 2
        }
      ]
    };
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getAge(t) {
      if (!t) return "--";
      let c = new Date().format("yyyy");
      let a = new Date(t * 1000).format("yyyy");
      return c - a;
    }
  }
};
</script>
