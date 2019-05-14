/**
 * 封装axios 请求的拦截配置
 */
import axios from 'axios';
import { isEmptyObj } from './../js/validation';

function interceptors(router,store){
  /**
 * 路由拦截设置
 */
  router.beforeEach((to, from, next) => {
    const meta = to.meta;
    if (!isEmptyObj(meta) && !to.params.options){
      store.commit('updateMenuIdAndBreadcrumb', meta.menuIdAndBreadcrumb);
    }
    next();
  });
  
  //http request 拦截器
  axios.interceptors.request.use(
    config => {
      // config.headers.Appid = 'CSKB_FE';
      config.headers['content-type'] = 'application/json';
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))?JSON.parse(window.localStorage.getItem('userInfo')) : '';
      if(userInfo && userInfo['token']) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Token = userInfo.token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  //http response 拦截器
  axios.interceptors.response.use(
    response => {
      /*
        403 --没有权限
        404 --token失效
      */
      // if(response.data.code === 403 || response.data.code === 404) {
      //   router.replace({path: '/login'});
      // }
      // else {
        return response;
      // }
    },
    error => {
      return Promise.reject(error);
    }
  );
}
export default interceptors;
