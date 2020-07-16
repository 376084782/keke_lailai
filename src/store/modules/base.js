import * as types from '../mutation-types';
import * as Util from 'utils';
import {
  stat
} from 'fs';

const state = {
  bShowLogin: false,
  bShowLoginModal: false,
  userinfo: {},
  bLogined: false,
  bRongInited: false,

  bShowUserCard: false,
  userCardInfo: null,
  bShowRoom: false,

  putUrl: '',

  dev: false,
  showCharge: false,
  env: 3,
  // 1声撩测试2声撩正式3来来测试
  envConfig: {
    1: {
      secret: '879f6c6e1afb557bb7d77220a511099b',
      tokenAgora: '3c25b42b3af24650ae8df9b1f3f69007',
      tokenRongIm: 'bmdehs6pbg45s',
      baseUrl: 'https://test-ztaudio-api.qianyancm.com'
    },
    2: {
      secret: '2a2ec9746bd545947dd44173eea306c6',
      tokenAgora: '7f7d4db4eb9242078ab8b72f06bb1363',
      tokenRongIm: 'pkfcgjstpzba8',
      baseUrl: 'https://ztaudio-api.qianyancm.com:8866'
    },
    3: {
      secret: '879f6c6e1afb557bb7d77220a511099b',
      tokenAgora: 'eb1d8629e6a745669105eee55c6674f7',
      tokenRongIm: 'k51hidwqk4n7b',
      // baseUrl: 'http://39.105.149.236:5084',
      baseUrl: 'https://test-ll-api.kekestar.cn:50443',
    }
  }
};

const getters = {
  showCharge: state => state.showCharge,
  secret: state => {
    return state.envConfig[state.env].secret
  },
  tokenAgora: state => {
    return state.envConfig[state.env].tokenAgora
  },
  tokenRongIm: state => {
    return state.envConfig[state.env].tokenRongIm
  },
  baseUrl: state => {
    return state.envConfig[state.env].baseUrl
  },
  bLogined: state => state.bLogined,
  dev: state => state.dev,
  BASE_UserId: state => {
    return localStorage.getItem('keke_userId')
  },
  BASE_UserToken: state => {
    return localStorage.getItem('keke_userToken')
  },
  BASE_RongToken: state => {
    return localStorage.getItem('keke_RongToken')
  },
  BASE_bShowLogin: state => state.bShowLogin,
  BASE_bShowLoginModal: state => state.bShowLoginModal,
  BASE_bRongInited: state => state.bRongInited,
  BASE_userinfo: state => state.userinfo,
  BASE_putUrl: state => state.putUrl,

  USER_bShowUserCard: state => state.bShowUserCard,
  USER_userCardInfo: state => state.userCardInfo,

  ROOM_bShowRoom: state => state.bShowRoom,
};

const actions = {
  'base/changeEnv'({
    state
  }, env) {
    state.env = env
  },
  'base/updateShowCharge'({
    state
  }, flag) {
    state.showCharge = flag
  },
  'base/updateFinance'({
    state
  }) {
    Util.doAjax({
      url: Util.URLConfig("/finance/cash"),
      type: "get",
      params: {},
      callback: function (msg) {
        Object.assign(state.userinfo, msg.data)
      },
      errcallback: function (msg) {},
      completecallback: function () {}
    });
  },
  'base/getPutUrl'({
    state
  }) {
    Util.doAjax({
      url: Util.URLConfig("/system/put_file_url"),
      type: "get",
      params: {
        type: 1,
        exts: "jpg,png,jpeg"
      },
      callback: function (msg) {
        state.putUrl = msg.data[0].put_url
        console.log(msg)
      },
      errcallback: function (msg) {},
      completecallback: function () {}
    });
  },
  'base/clearUserInfo'({
    state
  }) {
    state.bLogined = false;
    state.userinfo = {};
  },
  'base/setUserInfo'({
    state
  }, data) {
    state.bLogined = true;
    state.userinfo = data;
    console.log(data, 'data')
    if (data && data.user_token) {
      localStorage.setItem('keke_userToken', data.user_token)
    }
    localStorage.setItem('keke_userId', data.user_id)
    localStorage.setItem('keke_RongToken', data.rong_token)
  },
  'base/setRongInited'({
    state,
    commit,
    dispatch,
    rootState
  }, flag) {
    state.bRongInited = flag
  },
  'base/showLogin'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    state.bShowLogin = data
  },
  'base/showLoginModal'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    state.bShowLogin = data
    state.bShowLoginModal = data
  },
  'base/getUserinfo'({
    state,
    commit,
    dispatch,
    rootState
  }, params) {
    Util.doAjax({
      url: Util.URLConfig('getUserinfo'),
      type: 'get',
      params: params,
      callback: function (msg) {
        console.log(msg.data)
        state.userinfo = msg.data
      }
    });
  },
  'show-user-card'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    // 跳转用户资料卡
    if (data) {
      state.bShowUserCard = true;
      state.userCardInfo = data;
    } else {
      state.bShowUserCard = false;
      state.userCardInfo = {};
    }
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