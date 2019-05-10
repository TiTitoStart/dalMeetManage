const Home = r => require.ensure([], () => r(require('@/views/Home')), 'Home');
const Main = r => require.ensure([], () => r(require('@/views/main/Main')), 'Main');
const KBManage = r => require.ensure([], () => r(require('@/views/kb/KBManage')), 'KBManage');
const FieldManage = r => require.ensure([], () => r(require('@/views/kb/FieldManage')), 'FieldManage');
const CorpusManage = r => require.ensure([], () => r(require('@/views/kb/CorpusManage')), 'CorpusManage');
const ChatAnalyse = r => require.ensure([], () => r(require('@/views/chat/ChatAnalyse')), 'ChatAnalyse');
const ChatManage = r => require.ensure([], () => r(require('@/views/chat/ChatManage')), 'ChatManage');
const User = r => require.ensure([], () => r(require('@/views/users/UsersManage')), 'User');
const ModelTest = r => require.ensure([], () => r(require('@/views/modelTest/ModelTest')), 'ModelTest');

export default [
  {
  path: '/Home',
  component: Home,
  children: [
    {
    path: 'Main',
    name: 'Main',
    component: Main,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '1-1',
        breadcrumbList: [{
          url: 'Main',
          name: '首页'
        }, {
          url: '/Home/Main',
          name: '工作台'
        }],
      }
    }
  },{
    path: 'KBManage',
    name: 'KBManage',
    component: KBManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '2-1',
        breadcrumbList: [{
          url: '',
          name: '知识管理'
        }, {
          url: '/Home/KBManage',
          name: '知识库运营'
        }]
      }
    }
  },{
    path: 'KBManage/:options',
    component: KBManage,
    meta: {
      menuIdAndBreadcrumb: {
      menuId: '2-1',
      role: ['manager', 'engineer', 'worker'],
      breadcrumbList: [{
          url: '',
          name: '知识管理'
        }, {
          url: '/Home/KBManage',
          name: '知识库运营'
        }]
      }
    }
  },{
    path: 'FieldManage',
    name: 'FieldManage',
    component: FieldManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '2-2',
        breadcrumbList: [{
          url: '',
          name: '知识管理'
        }, {
          url: '/Home/FieldManage',
          name: '领域管理'
        }],
      }
    }
  },{
    path: 'FieldManage/:options',
    component: FieldManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '2-2',
        breadcrumbList: [{
          url: '',
          name: '知识管理'
        }, {
          url: '/Home/FieldManage',
          name: '领域管理'
        }]
      }
    }
  },{
    path: 'CorpusManage',
    name: 'CorpusManage',
    component: CorpusManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '2-3',
        breadcrumbList: [{
          url: '',
          name: '知识管理'
        }, {
          url: '/Home/CorpusManage',
          name: '语料管理'
        }],
      }
    }
  },{
    path: 'ChatAnalyse',
    name: 'ChatAnalyse',
    component: ChatAnalyse,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '3-1',
        breadcrumbList: [{
          url: '',
          name: '会话管理'
        }, {
          url: '/Home/ChatAnalyse',
          name: '会话分析'
        }]
      }
    }
  },{
    path: 'ChatAnalyse/:options',
    component: ChatAnalyse,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '3-1',
        breadcrumbList: [{
          url: '',
          name: '会话管理'
        }, {
          url: '/Home/ChatAnalyse',
          name: '会话分析'
        }]
      }
    }
  },{
    path: 'ChatManage',
    name: 'ChatManage',
    component: ChatManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '3-2',
        breadcrumbList: [{
          url: '',
          name: '会话管理'
        }, {
          url: '/Home/ChatManage',
          name: '标注记录'
        }],
      }
    }
  },{
    path: 'ChatManage/:options',
    component: ChatManage,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '3-2',
        breadcrumbList: [{
          url: '',
          name: '会话管理'
        }, {
          url: '/Home/ChatManage',
          name: '标注记录'
        }],
      }
    }
  },{
    path: 'User',
    name: 'User',
    component: User,
    meta: {
      role: ['manager'],
      menuIdAndBreadcrumb: {
        menuId: '4-1',
        breadcrumbList: [{
          url: '',
          name: '用户'
        }, {
          url: '/Home/User',
          name: '用户管理'
        }],
      }
    }
  },{
    path: 'ModelTest',
    name: 'ModelTest',
    component: ModelTest,
    meta: {
      role: ['manager', 'engineer', 'worker'],
      menuIdAndBreadcrumb: {
        menuId: '6-1',
        breadcrumbList: [ {
          url: '/Home/ModelTest',
          name: '模型测试'
        }],
      }
    }
  },{
    path: '',
    redirect: 'Main'
  }]
},{
  path: '*',
  redirect: '/Home'
}];