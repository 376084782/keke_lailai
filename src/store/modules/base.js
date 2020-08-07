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
  userCardInfo: {},
  bShowRoom: false,

  putUrl: '',
  dev: false,
  showCharge: false,
  env: 4,
  //3来来测试4来来正式
  envConfig: {
    3: {
      showDownloadBall: true,
      downloadUrlAndriod: 'https://ll-api.kekestar.cn/system/version/get?channel_id=800072',
      downloadUrlIos: 'https://itunes.apple.com/cn/app/id1449458036?mt=8',
      secret: '879f6c6e1afb557bb7d77220a511099b',
      tokenAgora: 'eb1d8629e6a745669105eee55c6674f7',
      tokenRongIm: 'k51hidwqk4n7b',
      // baseUrl: 'http://39.105.149.236:5084',
      baseUrl: 'https://test-ll-api.kekestar.cn:50443',
      version: '2.1.1',
      appName: 'h5lailai',
      chanel: '200072',
      urlDownload: 'https://kk-res.kekestar.cn/channel_down/800072/index.html',
      htmlPc: './html/pc.html'
    },
    // 来来正式
    4: {
      showDownloadBall: true,
      downloadUrlAndriod: 'https://ll-api.kekestar.cn/system/version/get?channel_id=800000',
      downloadUrlIos: 'https://itunes.apple.com/cn/app/id1449458036?mt=8',
      secret: 'fe154278d336d08e672745797644c364',
      tokenAgora: 'b14a0dfe76dc44fc9d170b700659d8cd',
      tokenRongIm: 'tdrvipkstyqj5',
      // baseUrl: 'http://39.105.149.236:5084',
      baseUrl: 'https://ll-api.kekestar.cn',
      version: '2.1.1',
      appName: 'h5lailai',
      chanel: '200072',
      urlDownload: 'https://kk-res.kekestar.cn/channel_down/800072/index.html',
      htmlPc: './html/pc.html'
    }
  }
};

const getters = {
  client: state => {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    let sys = '';
    let isMobile = !!u.match(/AppleWebKit.*Mobile/i) ||
      !!u.match(
        /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/
      );
    if (isMobile) {
      if (u.indexOf("iPhone") > -1) {
        sys = "iphone";
      } else {
        sys = "Android";
      }
    } else {
      if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        sys = "Mac";
      } else {
        sys = "Windows";
      }
    }
    return sys;
  },
  appConfig: state => {
    return state.envConfig[state.env]
  },
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
  'set-other-card-info'({
    state,
    commit,
    dispatch,
    rootState
  }, data) {
    // 跳转用户资料卡
    if (data) {
      state.userCardInfo = data;
    } else {
      state.userCardInfo = {};
    }
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