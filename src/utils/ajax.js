import Qs from 'qs'
import axios from 'axios'
import {
  Toast
} from 'vant';
import store from '../store'
import md5 from 'js-md5';
var axios_post = axios.create({
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

function doAjax({
  url,
  params = {},
  type = 'get',
  noPop = false,
  callback = () => {},
  errcallback = () => {},
  completecallback = () => {},
}) {
  let token = localStorage.getItem('keke_userToken');
  let timeStamp = Math.floor(new Date().getTime() / 1000)
  let queryString = '';
  let keyList = Object.keys(params).sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  keyList.forEach(key => {
    if (key && params[key] != null) {
      queryString += `${key}=${params[key]}`
    }
  })
  let secret = store.getters.secret;
  params._s_ = md5(`${type.toUpperCase()}:${url}:${queryString}:${timeStamp}:${secret}`)
  params._t_ = timeStamp;
  console.log(store.getters.dev, store.getters)
  if (!store.getters.dev) {}
  url = store.getters.baseUrl + url
  console.log('startajax', type, url)
  console.log(navigator)

  let u = navigator.userAgent,
    app = navigator.appVersion;
  let sys = '';
  let isMobile = !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/)
  if (isMobile) {
    if (u.indexOf('iPhone') > -1) {
      sys = 'iphone'
    } else {
      sys = 'Android'
    }
  } else {
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      sys = 'Mac'
    } else {
      sys = 'Windows'
    }
  }
  let headers = {
    'Authorization': token,
    'X-Requested-With': 'XMLHttpRequest',

    'H5-User-Agent': `${store.getters.appConfig.appName};${store.getters.appConfig.version};${sys};;${sys};${store.getters.appConfig.chanel};;${store.getters.userinfo?store.getters.userinfo.user_id:''}`,
  }
  console.log(headers)
  return new Promise((rsv, rej) => {
    if (type == 'get' || type == 'GET') {
      axios.get(
          url, {
            params: params,
            headers: headers
          },
        ).then((response) => {
          completecallback(response.data);
          if (response.data.code == 0) {
            callback(response.data);
            rsv(response.data);
          } else if (response.data.code == 4) {
            // 登录态过期 重新登录
            console.log(222, url, params)

            store.dispatch('base/clearUserInfo')
            store.dispatch('base/showLogin', true)
            errcallback(response.data);

          } else {
            errcallback(response.data);
            if (!noPop && response.data.msg) {
              Toast(response.data.msg);
            }
            rej(response.data);
          }
        })
        .catch((error) => {});
    } else if (type == 'post' || type == 'POST') {
      console.log('post')
      axios_post.post(url, params, {
          // transformRequest: [function (data, headers) {
          //   console.log('ininin', data)
          //   // 对 data 进行任意转换处理
          //   return '22535435437:dsad';
          // }],
          headers: headers
        }).then((response) => {
          completecallback(response.data);
          if (response.data.code == 0) {
            callback(response.data);
            rsv(response.data);
          } else if (response.data.code == 4) {
            // 登录
            console.log(222)
            store.dispatch('base/showLogin', true)
          } else {
            errcallback(response.data);
            if (!noPop && response.data.msg) {
              Toast(response.data.msg);
            }
            rej(response.data);
          }
        })
        .catch(function (error) {});
    }
  })
}

export {
  doAjax
};