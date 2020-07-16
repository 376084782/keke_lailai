import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import RongIM from '../utils/RongIM';
import * as Util from 'utils';
Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/',
    name: 'Main',
    component: () => import('@/pages/main')
  }, {
    path: '/room',
    name: 'Room',
    component: () => import('@/pages/room'),
    meta: {
      needLogin: true,
      isInRoom: true,
      noBack: true
    }
  }, {
    path: '/room-rank',
    name: 'RoomRank',
    meta: {
      needLogin: true,
      isInRoom: true
    },
    component: () => import('@/pages/room/components/rank')
  }, {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/pages/rank')
  }, {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/search/index')
  }, {
    path: '/search-more',
    name: 'SearchMore',
    component: () => import('@/pages/search/more')
  }, {
    path: '/user-card',
    name: 'UserCard',
    component: () => import('@/pages/userCard/other')
  }, {
    path: '/self-card',
    name: 'SelfCard',
    component: () => import('@/pages/userCard/self')
  }, {
    path: '/charge',
    name: 'charge',
    component: () => import('@/pages/charge')
  }]
})
router.beforeEach(async (to, from, next) => {
  if (!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
    //跳转到移动端
    // window.location.href = window.location.href.concat('m/');
  } else if (!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
    //跳转至pc端
    if (window.self === window.top) {
      window.location.href = './html/pc.html';
    }
  }
  // 房间页面不能返回
  // console.log(to.query,to.query.isClose,from.meta.noBack && !to.query.isClose,'query')
  // if (from.meta.noBack && (!to.params || !to.params.isClose)) {
  //   return
  // }
  if (to.name == 'Room' && !from.name) {
    next('/')
    return;
  }
  // 没有登录的跳转登录
  let ffAfterLogin = () => {
    // if (!store.getters.BASE_putUrl) {
    //   store.dispatch('base/getPutUrl')
    // }
    if (!store.getters.BASE_bRongInited) {
      // 没有进行融云初始化的，进行初始化后跳转页面
      RongIM.init(store.getters.tokenRongIm)
      if (store.getters.BASE_userinfo.rong_token) {
        RongIM.connect(store.getters.BASE_userinfo.rong_token).then(e => {
          next(); // 跳转
        })
      } else {
        next(); // 跳转
      }
    } else {
      next(); // 跳转
    }
  }
  let flagCanGoNext = true;
  console.log(store.getters.bLogined, 'bLogined')
  if (!store.getters.bLogined) {
    // 没有登录的检查本地是否有登录信息，已经登录过的获取后静默登录
    if (store.getters.BASE_UserId) {
      // flagCanGoNext = false;
      await Util.doAjax({
        url: Util.URLConfig('getUserinfo'),
        type: 'get',
        params: {
          user_id: store.getters.BASE_UserId
        },
        callback: function (msg) {
          let userinfo = Object.assign({
            rong_token: store.getters.BASE_RongToken
          }, msg.data);
          store.dispatch('base/setUserInfo', userinfo)
          ffAfterLogin()
          return;
        },
        errcallback() {
          ffAfterLogin()
          return;
        }
      });
    } else {
      await Util.doAjax({
        url: Util.URLConfig("login"),
        type: "post",
        params: {},
        callback: function (msg) {
          let userinfo = Object.assign({
            rong_token: store.getters.BASE_RongToken
          }, msg.data);
          store.dispatch('base/setUserInfo', userinfo)
          ffAfterLogin()
        },
        errcallback: function (msg) {},
        completecallback: function () {}
      })
      // if (to.meta.needLogin) {
      //   // 必须登录的跳到大厅并打开登录窗口
      //   flagCanGoNext = false;
      //   next('/')
      //   store.dispatch('base/showLogin', true)
      // }
    }
  } else {
    ffAfterLogin()
  }
})
export default router
