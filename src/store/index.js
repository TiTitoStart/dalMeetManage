import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isDev: process.env.NODE_ENV == 'development',
    pageSize: 10,
    tableHeight: window.innerHeight - 280,
    categoryData: '',//分类
    categoryDataAll: '',//分类(包含全部)
    selectedMenuId: sessionStorage.getItem('menuId') || '1-1',
    breadcrumbList: JSON.parse(sessionStorage.getItem('breadcrumbList')) || [{
      url:'',
      name:'首页'
    },{
      url:'',
      name:'工作台'
    }]
  },
  mutations: {
    updateMenuIdAndBreadcrumb: function (state, payload) {
      state.selectedMenuId = payload.menuId;
      state.breadcrumbList = payload.breadcrumbList;
    },
    updateCategoryData: function(state, payload) {
      state.categoryData = payload;
    },
    updateCategoryDataAll: function(state, payload) {
      state.categoryDataAll = payload;
    }
  },
  actions: {},
  modules: {}
});
