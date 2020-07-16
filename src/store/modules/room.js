import * as types from '../mutation-types';
import * as Util from 'utils';
import store from '..';
import Vue from 'vue'

import RongIM from "utils/RongIM";
import Agora from "utils/Agora";

const state = {
  roomInfo: {},
  aMicroList: [],
  oHostInfo: {},
  lockData: {},
};

const getters = {
  ROOM_LOCKDATA: state => state.lockData,
  ROOM_roomInfo: state => state.roomInfo,
  ROOM_aMicroList: state => state.aMicroList,
  ROOM_oHostInfo: state => state.oHostInfo,
};

const actions = {
  'toggleHostMute'({
    state
  }, flagSound) {
    state.oHostInfo.status = flagSound ? '' : 'close';
    state.oHostInfo = state.oHostInfo;
  },
  'updateRoomInfo'({
    state
  }, data) {
    state.roomInfo = {}
    state.roomInfo = data
    // if (data.host) {
    //   state.oHostInfo.avatar = data.host.images[0];
    //   state.oHostInfo.nickname = data.host.nickname;
    //   state.oHostInfo.user_id = data.host.user_id;
    // } else {
    //   state.oHostInfo = {}
    // }
  },
  'roomLock'({
    state
  }, data) {
    state.lockData = data
    // if (data.host) {
    //   state.oHostInfo.avatar = data.host.images[0];
    //   state.oHostInfo.nickname = data.host.nickname;
    //   state.oHostInfo.user_id = data.host.user_id;
    // } else {
    //   state.oHostInfo = {}
    // }
  },
  'enter-room'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    // 进入房间
    return new Promise((rsv, rej) => {
      if (data) {
        let self = this;
        let roomId = data.room_id;
        Util.doAjax({
            url: Util.URLConfig("joinRoom"),
            type: "get",
            noPop: true,
            params: {
              room_id: roomId,
              password: data.password
            }
          })
          .then(msg => {
            console.log(1);
            if (!msg.data.opened) {
              window.$toast("房间未开启");
              rej()
            } else {
              // 加入融云，加入成功后跳转房间，否则
              console.log(msg.data, 1);
              RongIM.joinRoom(msg.data.room_id)
                .then(e => {
                  store.dispatch("updateRoomInfo", msg.data);
                  rsv()
                })
                .catch(e => {
                  // 加入失败，提示
                  window.$toast("加入群组失败");
                  rej()
                });
            }
          })
          .catch(msg => {
            if (msg.code == 1019 || msg.code == 1020) {
              // this.bShowLock = true;
              store.dispatch('roomLock', {
                roomId: roomId
              })
              if (msg.code == 1020) {
                window.$toast("密码错误");
              }
            } else {
              window.$toast(msg.msg);
            }
            rej()
          });

      } else {
        rootState.baseModule.bShowRoom = false;
        state.roomInfo = {};
        state.oHostInfo = {}
      }
    })
  },
  'room/getMicroList'({
    state,
    commit,
    dispatch,
    rootState
  }, param) {
    Util.doAjax({
      url: Util.URLConfig("/room/microphone/list"),
      params: param
    }).then(msg => {
      state.aMicroList = msg.data;
    });
  },
  'room/setMicroList'({
    state,
    commit,
    dispatch,
    rootState
  }, param) {
    state.aMicroList = param;
  },
  'clear-roomInfo'({
    state
  }) {
    state.aMicroList = [];
    state.oHostInfo = {};
    state.roomInfo = {};
  },
  // 'room-microList'({state,commit,dispatch,rootState}, data){
  //   state.aMicroList = data;
  // },
  'room-hostInfo'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    data = data || {}
    state.oHostInfo = {}
    state.oHostInfo = data;
    state.roomInfo.hostInfo = {};
    Object.assign(state.oHostInfo, data)
    console.log(state.oHostInfo, 222)
  },
};

const mutations = {
  // [types.BASE_USERINFO](state, data){
  // 	state.userinfo = data.info;
  // },
};

export default {
  state,
  getters,
  actions,
  mutations
};
