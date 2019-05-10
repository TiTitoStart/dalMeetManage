import Vue from 'vue';
import Router from 'vue-router';
// import localStorage from '../assets/js/localStorage';
import LoginRouter from './modules/login';
import HomeRouter from './modules/home';

//需权限控制路由
let permissionRouter = [];
// if(localStorage.getValue('userInfo', 'token')) {
//   permissionRouter = permissionRouter.concat(HomeRouter);
// }
// else {
//   permissionRouter = [
//     {
//     path: '*',
//     redirect: '/login'
//     }
//   ];
// }
let routes = [].concat(HomeRouter, LoginRouter, permissionRouter);
Vue.use(Router);
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
});
