<template>
  <van-dialog
    :before-close="onHandle"
    v-model="showModal"
    showConfirmButton
    showCancelButton
    :closeOnClickOverlay="false"
  >
    <h4>
      <i></i>派对已上锁
    </h4>
    <van-field class="inputSingle" v-model="passwd" placeholder="请输入房间密码" clearable />
  </van-dialog>
</template>
<script>
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      showModal: false,
      passwd: ""
    };
  },
  mounted() {
    this.showModal = !!this.lockData.roomId;
  },
  computed: {
    ...mapGetters({
      lockData: "ROOM_LOCKDATA"
    })
  },
  watch: {
    lockData() {
      this.showModal = !!this.lockData.roomId;
    },
    value(val) {
      this.show = val;
      if (val) {
        this.passwd = "";
      }
    },
    show(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    onHandle(action, done) {
      if (action == "confirm") {
        this.$store
          .dispatch("enter-room", {
            room_id: this.lockData.roomId,
            password: this.passwd
          })
          .then(e => {
            this.$router.push({
              path: "/room",
              query: {
                roomId: this.lockData.roomId
              }
            });
          })
          .finally(e => {
            this.$store.dispatch("roomLock", {});
            this.passwd = "";
            done();
          });
      } else {
        this.passwd = "";
        done();
      }
      console.log(action);
    }
  }
};
</script>
<style lang="scss" scoped>
h4 {
  font-size: 20px;
  padding: 0 0 15px 0;
  font-weight: bold;
  line-height: 24px;
  text-align: center;
  i {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(~@/assets/icon/lock.png) no-repeat;
    background-size: 100%;
  }
}
</style>