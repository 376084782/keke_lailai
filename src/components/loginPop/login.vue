<template>
  <van-dialog
    v-model="show"
    title="登录来来"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
  >
    <van-field class="inputSingle" v-model="phone" type="tel" placeholder="请输入手机号" clearable />
    <van-field class="inputSingle" v-model="code" type="number" placeholder="请输入验证码" clearable>
      <template #button>
        <van-button size="small" type="primary" :disabled="codeFlg" @click="onCode">{{ codeTxt }}</van-button>
      </template>
    </van-field>
    <van-button :disabled="!phone||!code" round type="primary" @click="onLogin">登录</van-button>
  </van-dialog>
</template>
<script>
import * as Util from "utils";
import { mapActions } from "vuex";
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      show: this.value,
      phone: "",
      code: "",
      time: 60,
      timer: "",
      codeFlg: false,
      codeTxt: "发送验证码"
    };
  },
  watch: {
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    },
    phone() {
      this.time = 60;
      this.codeFlg = false;
      this.codeTxt = "发送验证码";
      clearInterval(this.timer);
    }
  },
  methods: {
    ...mapActions({
      getUserinfo: "base/getUserinfo",
      setUserInfo: "base/setUserInfo"
    }),
    onCode() {
      if (!Util.regMatch("phone", this.phone)) {
        this.$toast("请输入正确的手机号");
        return;
      }
      if (this.codeFlg) return;
      this.codeFlg = true;
      let self = this;
      Util.doAjax({
        url: Util.URLConfig("getCode"),
        type: "post",
        params: {
          phone: self.phone,
          sms_type: 1
        },
        callback: function(msg) {
          self.$toast("验证码已发送");
          self.timer = setInterval(() => {
            if (self.time > 0) {
              self.codeTxt = self.time + "S";
              self.time--;
            } else {
              clearInterval(self.timer);
              self.codeFlg = false;
              self.time = 60;
              self.codeTxt = "发送验证码";
            }
          }, 1000);
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    },
    onLogin() {
      let self = this;
      Util.doAjax({
        url: Util.URLConfig("login"),
        type: "post",
        params: {
          phone: self.phone,
          sms_code: self.code
        },
        callback: function(msg) {
          self.$toast.success("登录成功");
          self.setUserInfo(msg.data);
          self.show = false;
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    }
  }
};
</script>