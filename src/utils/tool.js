// 日期的格式化
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month 
    "d+": this.getDate(), //day 
    "h+": this.getHours(), //hour 
    "m+": this.getMinutes(), //minute 
    "s+": this.getSeconds(), //second 
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
    "S": this.getMilliseconds() //millisecond 
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

function fastDate(type, format) {
  // today:今日 ， week:近七天
  let f = format || 'yyyy-MM-dd';
  let date = [];
  switch (type) {
    case 'today':
      date = [new Date().format(f), new Date().format(f)];
      break;
    case 'week':
      date = [new Date(new Date() - 3600 * 1000 * 24 * 6).format(f), new Date().format(f)];
      break;
  }
  return date;
}

function regMatch(type, value) {
  let regName = '';
  let result = false;
  switch (type) {
    case 'none':
      result = value ? true : false
      break;
    case 'phone':
      regName = /^(0?(13|14|15|17|18|19|16|92|98)[0-9]{9})$/;
      result = regName.test(value);
      break;
    case 'name':
      regName = /^[\s\S]*.*[^\s][\s\S]*$/g;
      result = regName.test(value);
      break;
    case 'code':
      regName = /^[0-9]{6}$/;
      result = regName.test(value);
      break;
    case 'numid':
      regName = /^[0-9]*$/;
      result = regName.test(value);
      break;
    case 'password':
      regName = /^[\w_-]{6,16}$/;
      result = regName.test(value);
      break;
    case 'idcard':
      regName = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      result = regName.test(value);
      break;
    case 'money':
      regName = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      result = regName.test(value);
      break;
    case 'number':
      regName = /^[1-9]\d*$/;
      result = regName.test(value);
      break;
    case 'wx': //字母和数字限定
      regName = /^[0-9a-zA-Z]{4,23}$/;
      result = regName.test(value);
      break;
    case 'url':
      regName = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      result = regName.test(value);
      break;
  }
  return result;
}

function getLength(str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0,
    len = str.length,
    charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
}

function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  let str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    let a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4  
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；  
  if (str_length < len) {
    return str;
  }
}
export {
  fastDate,
  regMatch,
  getLength,
  cutstr
};
