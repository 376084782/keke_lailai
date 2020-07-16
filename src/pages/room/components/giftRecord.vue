<template>
  <van-popup v-model="show" position="bottom" round :style="{ height: '60%' }">
    <div class="van-popup-topTitle">
      <p>全部礼物</p>
    </div>
    <div class="pop-content">
      <div v-for="(i, y) in aList" :key="y" class="popListItem giftRecord">
        <avatar :url="i.from_user_images&&i.from_user_images[0]"></avatar>
        <div>
          <div>
            <p>{{ i.from_user_nickname }}</p>
            <p class="receive">
              送给
              <span>{{ i.user_nickname }}</span>
            </p>
          </div>
          <div class="gift">
            <img :src="i.gift_image" />
            <p>{{ i.gift_name }}x{{i.gift_num}}</p>
            <p class="tip">{{ new Date(i.timestamp).format('MM-dd hh:mm:ss') }}</p>
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
    value: Boolean
  },
  components:{avatar},
  data() {
    return {
      show: this.value,
      aList: []
    };
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      if (val) {
        this.getData();
      }
      this.$emit("input", val);
    }
  },
  methods: {
    getData() {
      Util.doAjax({
        url: Util.URLConfig("/gift/room_day_log"),
        type: "get",
        params: {
          room_id: this.$route.query.roomId,
          page_index: 0,
          page_size: 20
        }
      }).then(e => {
        let data = e.data;
        this.aList = data.list;
      });
    }
  }
};
</script>
