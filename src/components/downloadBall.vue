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
      if (this.$store.getters.client == "iphone") {
        location.href = this.$store.getters.appConfig.downloadUrlIos;
      } else {
        location.href = this.$store.getters.appConfig.downloadUrlAndriod;
      }
    }
  }
};
</script>

