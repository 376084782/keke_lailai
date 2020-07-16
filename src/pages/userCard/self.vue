<template>
  <div class="userCard">
    <van-icon class="goback" name="arrow-left" @click="goBack" />
    <van-button class="save" round type="default" size="mini" @click="onSave">保存</van-button>

    <!-- <van-uploader class="change" v-model="img_upload" :preview-image="false">
      <van-button round type="primary" size="mini">更换头像</van-button>
    </van-uploader> -->
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(i,y) in aImg" :key="y">
        <img :src="i" />
      </van-swipe-item>
    </van-swipe>
    <van-field
      v-model="nickname"
      label="昵称"
      placeholder="输入昵称"
      input-align="right"
      label-align="left"
    />
    <van-field v-model="user_uid" label="ID" disabled input-align="right" label-align="left" />
    <van-field
      v-model="age"
      label="年龄"
      right-icon="arrow"
      input-align="right"
      label-align="left"
      @click-input="bShow=true"
    />
    <van-field
      v-model="sign"
      label="个性签名"
      placeholder="填写签名"
      rows="1"
      autosize
      type="textarea"
      input-align="right"
      label-align="left"
    />
    <van-popup v-model="bShow" position="bottom" :style="{ height: '60%' }">
      <van-datetime-picker
        v-model="date"
        type="date"
        title="选择年月日"
        visible-item-count="7"
        :minDate="minDate"
        :maxDate="maxDate"
        @confirm="onConfirm"
        @cancel="bShow=false"
      />
    </van-popup>
  </div>
</template>
<script>
import axios from "axios";
import "./index.scss";
import * as Util from "utils";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      nickname: "",
      user_uid: "",
      age: "",
      sign: "",
      aImg: [],
      birthday: "",
      bShow: false,
      date: "",
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      img_upload: []
    };
  },
  computed: {
    ...mapGetters({
      userinfo: "BASE_userinfo",
      putUrl: "BASE_putUrl"
    })
  },
  watch: {
    userinfo() {
      this.init();
    },
    img_upload(val) {
      if (val) {
        this.aImg.unshift(val[0].content);
        // let data = new FormData();
        // data.append("file", val[0].file); //图片

        axios.put(this.putUrl, val[0], {
          processData: false,
          contentType: false
        });

        console.log(val);
        this.onSave("img");
      }
    }
  },
  methods: {
    ...mapActions({
      getUserinfo: "base/getUserinfo"
    }),
    init() {
      this.nickname = this.userinfo.nickname;
      this.user_uid = this.userinfo.user_uid;
      this.sign = this.userinfo.sign;
      this.aImg = this.userinfo.images;
      this.birthday = this.userinfo.birthday;
      this.date = new Date(this.userinfo.birthday * 1000);
      this.age = this.getAge(
        this.userinfo.birthday ? this.userinfo.birthday * 1000 : ""
      );
    },
    getAge(t) {
      if (!t) return "--";
      let c = new Date().format("yyyy");
      let a = new Date(t).format("yyyy");
      return c - a;
    },
    goBack() {
      this.$router.go(-1);
    },
    onUpdate() {},
    onConfirm(val) {
      this.bShow = false;
      this.age = this.getAge(new Date(val).getTime());
    },
    onSave(type) {
      let self = this;
      let params = {};
      if (type == "img") {
        params = {
          user_id: self.userinfo.user_id,
          images: self.aImg.join(","),
          user_id: self.userinfo.user_id,
          nickname: self.nickname,
          birthday: new Date(self.date).getTime() / 1000,
          sign: self.sign
        };
      } else {
        params = {
          user_id: self.userinfo.user_id,
          nickname: self.nickname,
          birthday: new Date(self.date).getTime() / 1000,
          sign: self.sign
        };
      }
      Util.doAjax({
        url: Util.URLConfig("editUserinfo"),
        type: "post",
        params: params,
        callback: function(msg) {
          self.getUserinfo({
            user_id: self.userinfo.user_id
          });
          self.$notify({ type: "success", message: "保存成功" });
        },
        errcallback: function(msg) {},
        completecallback: function() {}
      });
    }
  },
  created() {
    if (this.userinfo) {
      this.init();
    }
  }
};
</script>