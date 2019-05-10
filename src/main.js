import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
// import i18n from './locale/index';
import './iview';

import interceptors from './assets/interceptors/index';
import api from './assets/api/index';
import * as validation from './assets/js/validation';
import utils from './assets/js/utils';
import localStorage from './assets/js/localStorage';
import cache from './assets/js/cache';
import md5 from 'js-md5';
import './assets/css/common.less';

import VeLine from 'v-charts/lib/line.common';
import VeHistogram from 'v-charts/lib/histogram.common';

Vue.component(VeLine.name, VeLine);
Vue.component(VeHistogram.name, VeHistogram);
// Vue.config.productionTip = false;
// Vue.config.lang = 'zh-CN';
/**
 * 挂载api方法
 */
Vue.prototype.$api = api;

/**
 * 挂载validation,utils方法
 */
Vue.prototype.$validation = validation;
Vue.prototype.$utils = utils;

/**
 *挂载md5,localStorage
 */

Vue.prototype.$md5 = md5;
Vue.prototype.$localStorage = localStorage;
Vue.prototype.$store = store;
Vue.prototype.$cache = cache;

/**
 *路由跟http请求拦截控制
 */
interceptors(router,store);

new Vue({
  // i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
