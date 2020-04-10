import store from "../store";

function logOut() {
  store.dispatch('FedLogOut').then(() => {
    location.reload()
  })
  return Promise.reject("未登录")
}

export function handleRespone(response) {
    let res;
    //session 超时
    if(response.data && response.data.returnCode === 504){
      logOut();
    }
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if(response.data == undefined){
      res = response.request.responseText;
    } else{
      res = response.data;
    }
   return res;
}
