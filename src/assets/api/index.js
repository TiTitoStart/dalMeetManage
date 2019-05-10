import ajax from './../ajax/index';
export default {
  login: data => {
    return ajax.post('/bot/user/login', data);
  },
  test: data => {
    return ajax.post('/bot/session/test',data);
  },
  kb: {
    add: data => {
      return ajax.post('/bot/kpoint/add',data);
    },
    query: data => {
      return ajax.post('/bot/kpoint/query',data);
    },
    update: data => {
      return ajax.post('/bot/kpoint/update',data);
    },
    delete: data => {
      return ajax.post('/bot/knowledge/delete',data);
    },
    allQuery: data => {
      return ajax.post('/bot/knowledge/query',data);
    },
    like: data => {
      return ajax.post('/bot/kpoint/question/query',data);
    },
    allLike: data => {
      return ajax.post('/bot/knowledge/question/query',data);
    },
    get: data => {
      return ajax.post('/bot/knowledge/get',data);
    },
  },
  field: {
    add: data => {
      return ajax.post('/bot/kdomain/add',data);
    },
    query: data => {
      return ajax.post('/bot/kdomain/query',data);
    },
    update: data => {
      return ajax.post('/bot/kdomain/update',data);
    },
    delete: data => {
      return ajax.post('/bot/knowledge/delete',data);
    },
    like: data => {
      return ajax.post('/bot/kdomain/question/query',data);
    }
  },
  csm: {
    //获取用户列表
    getUsers: data => {
      return ajax.post('/bot/user/query',data);
    },
    //新增用户
    addUsers: data => {
      return ajax.post('/bot/user/add',data);
    },
    //删除用户
    deleteUsers: data => {
      return ajax.post('/bot/user/delete',data);
    },
    //修改用户
    modifyUsers: data => {
      return ajax.post('/bot/user/update',data);
    },
    //获取用户分组
    getUsersGroup: data => {
      return ajax.post('/bot/user/group/query',data);
    },
    //新增用户分组
    addUsersGroup: data => {
      return ajax.post('/bot/user/group/add',data);
    },
    //删除用户分组
    deleteUsersGroup: data => {
      return ajax.post('/bot/user/group/delete',data);
    },
    //修改用户分组
    modifyUsersGroup: data => {
      return ajax.post('/bot/user/group/update',data);
    }
  },
  category: {
    add: data => {
      return ajax.post('/bot/category/add',data);
    },
    query: data => {
      return ajax.post('/bot/category/query',data);
    },
    update: data => {
      return ajax.post('/bot/category/update',data);
    },
    delete: data => {
      return ajax.post('/bot/category/delete',data);
    }
  },
  chat: {
    pull: data => {
      return ajax.post('/bot/session/query',data);
    },
    check: data => {
      return ajax.post('/bot/session/check',data);
    },
    query: data => {
      return ajax.post('/bot/session/pull/query',data);
    },
    get: data => {
      return ajax.post('/bot/session/pull/get',data);
    },
    tag: data => {
      return ajax.post('/bot/session/mark/add',data);
    }
  },
  mark: {
    query: data => {
      return ajax.post('/bot/session/mark/query',data);
    },
    update: data => {
      return ajax.post('/bot/session/mark/update',data);
    },
    delete: data => {
      return ajax.post('/bot/session/mark/delete',data);
    }
  },
  statistics: {
    get: data => {
      return ajax.post('/bot/statistics/get',data);
    },
    query: data => {
      return ajax.post('/bot/statistics/query',data);
    }
  }
};
