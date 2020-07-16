<template>
  <div id="chat" class="chat-list" ref="scroll">
    <div v-for="(i,y) in aChat" :key="y">
      <template v-if="i.type==1">
        <p style="color:white;">
          <span @click="toUserCard(i.user_id)" style="color:#78b7a4;">{{ i.nickname }}</span>进入了派对
        </p>
      </template>
      <template v-else-if="i.type==2">
        <avatar :url="i.image" @click="toUserCard(i.user_id)"></avatar>
        <div>
          <h5>{{ i.nickname }}</h5>
          <p>{{ i.message }}</p>
        </div>
      </template>
      <template v-else-if="i.type==3">
        <avatar :url="i.image" @click="toUserCard(i.user_id)"></avatar>
        <div>
          <!-- TODO:根据gid获取礼物名称；送多人礼物时的展示 -->
          <h5>{{ i.nickname }}</h5>
          <p>
            {{ i.nickname }}
            <span style="
          color:#FFCE7D">送给</span>
            {{ i.to.nn }}
            <span
              style="
          color:#FFCE7D"
            >{{ i.giftName }}x{{i.num}}</span>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import avatar from "@/components/avatar.vue";
export default {
  props: {
    //[{type:1进入提示 2用户聊天 3送礼信息  image头像 nickname用户名称 message内容 gender性别 user_id用户id}]
    aChat: {
      type: Array,
      default: _ => {
        return [];
      }
    }
  },
  watch: {
    aChat() {
      this.$nextTick(e => {
        if (this.$refs.scroll.scrollHeight > this.$refs.scroll.clientHeight) {
          //设置滚动条到最底部
          this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
        }
      });
    }
  },
  components: { avatar },
  methods: {
    toUserCard(id) {
      this.$emit("toUserCard", id);
    }
  }
};
</script>