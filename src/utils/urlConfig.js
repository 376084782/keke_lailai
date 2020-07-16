// ajax配置url
var BASE_URL = '';

function URLConfig(which) {
  const map = {
    getCode: BASE_URL + '/user/sms/code',
    login: BASE_URL + '/user/visitor_login',
    getUserinfo: BASE_URL + '/user/info',
    editUserinfo: BASE_URL + '/user/edit',
    getBanner: BASE_URL + '/ad/banner',
    getRoomType: BASE_URL + '/room/type_list',
    getHotRoom: BASE_URL + '/room/hot/cbd/type',
    getRoomList: BASE_URL + '/room/rooms',
    getHotHead: BASE_URL + '/room/hot/head',
    getWealthRank: BASE_URL + '/finance/wealth_charts',
    getCharmRank: BASE_URL + '/finance/charm_charts',
    getRoomWealthRank: BASE_URL + '/finance/room_wealth_charts',
    getRoomCharmRank: BASE_URL + '/finance/room_charm_charts',
    search: BASE_URL + '/user/keywords/search',
    joinRoom: BASE_URL + '/room/join',
    getGoods: BASE_URL + '/counter/list'
  }
  if (map[which]) {
    return map[which]
  } else {
    return BASE_URL + which
  }
}
export {
  URLConfig
};
