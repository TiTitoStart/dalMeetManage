export default  {
  sysTypeId: 1,
  name: 'AI客服后台',
  code: 'csBotSym',
  menus: [
    {
      level: '2',
      role: ['manager', 'engineer', 'worker'],
      menuName: '动态管理',
      icon:'ios-book-outline',
      url:'',
      child:[
        {
          level: '2-2',
          role: ['manager', 'engineer', 'worker'],
          menuName: '动态运营',
          icon:'',
          url:'/Home/FieldManage',
        }
        // {
        //   level: '2-3',
        //   menuName: '语料管理',
        //   icon:'',
        //   url:'/CorpusManage',
        // }
      ]
    },{
      level: '4',
      role: ['manager'],
      menuName: '用户',
      icon:'ios-contact-outline',
      url:'',
      child: [{
        level: '4-1',
        menuName: '用户管理',
        icon:'',
        url:'/Home/User',
      }]
    }
  ]
};