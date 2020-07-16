// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vconsole from 'vconsole';
// new Vconsole();

// // 根据域名判断当前store环境
// if (location.href.indexOf('kk-res.kekestar.cn/test/h5a') > -1) {
//   // 测试来来
//   new Vconsole();
//   store.dispatch('base/changeEnv', 3)
// } else if (location.href.indexOf('ztaudio-res.qianyancm.com/test/h5a') > -1) {
//   // 测试声撩
//   new Vconsole();
//   store.dispatch('base/changeEnv', 1)
// } else if (location.href.indexOf('ztaudio-res.qianyancm.com/H5app') > -1) {
//   // 正式声撩
//   store.dispatch('base/changeEnv', 2)
// }

import Vant from 'vant';
import 'vant/lib/index.css';

import './styles/basic.scss'
Vue.use(Vant);

import VueBus from 'vue-bus'
window['VueBus'] = VueBus;
Vue.use(VueBus)

import header from './components/header.vue'
import loginPop from './components/loginPop/index.vue'
import rechargeModal from './components/loginPop/recharge.vue'

Vue.component("lHeader", header)
Vue.component("lLoginPop", loginPop)
Vue.component("lRechargeModal", rechargeModal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")