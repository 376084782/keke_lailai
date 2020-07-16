<template>
  <div @click="clickHandler" class="wrap-avatar" :style="{width:width,height:height}">
    <img :src="url" alt />
  </div>
</template>
<script>
export default {
  name: "Avatar",
  props: {
    url: String,
    width: Number,
    height: Number
  },
  data() {
    return {};
  },
  methods: {
    clickHandler(){
      console.log('click')
      this.$emit('click')
    },
    onLogin() {
      this.$store.dispatch("base/showLogin", true);
    }
  }
};
</script>
<style scoped lang="scss">
.wrap-avatar {
  margin: 0;
  position: relative;
  border-radius: 1000px;
  overflow: hidden;
  img {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

