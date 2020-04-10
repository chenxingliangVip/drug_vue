import axios from 'axios'
import store from '../store'
import {Message, MessageBox} from 'element-ui'
import {handleRespone} from '@/utils/responeHandle.js'
// 创建axios实例
const service = axios.create({
  // 基础url前缀,api的base_url
  // 请求头信息
  headers: {
   // 'X-Requested-With': 'XMLHttpRequest',
   'Content-Type':'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 600000,
  // 携带凭证
  withCredentials: true,//是否允许带cookie这些
  // 返回数据类型
  responseType: 'json'
});
//开发环境url过滤白名单
const urlWhiteList = {


};
// request拦截器
service.interceptors.request.use(config => {

  // 在发送请求之前做某件事
  config.url = 'api' + config.url;
  return config
}, error => {
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
    // return service.request(originalRequest);//例如再重复请求一次
  }
   // 2.需要重定向到错误页面
   const errorInfo = error.response;
   if (errorInfo) {
    // error =errorInfo.data//页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
    const errorStatus = errorInfo.status; // 404 403 500 ... 等
    this.router.push({
      //path: `/error/${errorStatus}`
      path:'/page404'
    })
  }
   console.log(errorInfo)
   return Promise.reject(error)  // 在调用的那边可以拿到(catch)你想返回的错误信息
})
// respone拦截器
service.interceptors.response.use(
  response => {
    return handleRespone(response);
  },
  error => {
    //使用的是 element UI 的提示组件
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    return Promise.reject(error)
  }
)
export default service

