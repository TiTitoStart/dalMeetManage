const LoginHome = r => require.ensure([], () => r(require('@/views/login/Login')), 'login');

export default [{
  path: '/login',
  name: 'login',
  component: LoginHome
},{
  path: '*',
  redirect: '/login'
  }];