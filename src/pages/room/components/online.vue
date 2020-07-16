<template>
  <van-popup v-model="show" position="bottom" round :style="{ height: '60%' }">
    <div class="van-popup-topTitle">
      <p>在线用户</p>
      <span>当前在线人数：{{ roomInfo.online_count || 0 }}</span>
    </div>
    <div class="pop-content">
      <div v-for="(i, y) in aList" :key="y" class="popListItem">
        <avatar :url="i.images&&i.images[0]"></avatar>
        <div>
          <p>
            {{ i.nickname }}
          </p>
            <span v-if="i.gender!=3" :class="{'boy':i.gender==1, 'gender':1}">
              <i v-if="i.gender==1" class="iconfont icon-boy"></i>
              <i v-if="i.gender==2" class="iconfont icon-gril"></i>
              {{ getAge(i.birthday) }}
            </span>
        </div>
        <!-- <i class="iconfont icon-sofa-o"></i> -->
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
    roomId: Number
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
      roomInfo: "ROOM_roomInfo"
    })
  },
  watch: {
    value(val) {
      this.show = val;
      if (val) {
        this.updateList();
      }
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    updateList() {
      Util.doAjax({
        url: Util.URLConfig("/room/user_list"),
        type: "get",
        noPop: true,
        params: { room_id: this.$route.query.roomId, guard_type: 1 }
      }).then(e => {
        console.log(e, "eeeee2");
        this.aList = e.data;
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
