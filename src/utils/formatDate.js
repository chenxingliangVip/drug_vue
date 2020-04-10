export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'w+': date.getDay()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      if(k === 'w+'){
          switch (str){
            case '0':str = '星期日';break;
            case '1':str = '星期一';break;
            case '2':str = '星期二';break;
            case '3':str = '星期三';break;
            case '4':str = '星期四';break;
            case '5':str = '星期五';break;
            case '6':str = '星期六';break;
            default:str = '无'; break;
          }
      }
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  //星期数据
  if(str.length==3){
    return ('00' + str).substr(str.length-1);
  }
  return ('00' + str).substr(str.length);
}
