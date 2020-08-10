<template>
  <div @click="clickHandler" class="download-ball"></div>
</template>
<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    clickHandler() {
     var _czc = window._czc || [];
      _czc.push(["_setAccount", "1279075837"]);
      _czc.push(['_trackEvent', '悬浮窗点击下载', '点击', '1','1','1']);
      if (this.$store.getters.client == "iphone") {
        location.href = this.$store.getters.appConfig.downloadUrlIos;
      } else {
        location.href = this.$store.getters.appConfig.downloadUrlAndriod;
      }
    }
  }
};
</script>

