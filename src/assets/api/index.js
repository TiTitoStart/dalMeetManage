import ajax from './../ajax/index';
import { baseUrl } from './../config/index';
export default {
  login: data => {
    return ajax.post(baseUrl + '/user/login', data);
  },
  user: {
    add: data => {
      return ajax.post(baseUrl + '/session/test',data);
    },
    modify: data => {
      return ajax.post(baseUrl + '/users/update',data);
    },
    delete: data => {
      return ajax.post(baseUrl + '/users/delete',data);
    },
    query: data => {
      return ajax.post(baseUrl + '/users/query',data);
    }
  },
  moment: {
    add: data => {
      return ajax.post(baseUrl + '/moment/add',data);
    },
    modify: data => {
      return ajax.post(baseUrl + '/moment/update',data);
    },
    delete: data => {
      return ajax.post(baseUrl + '/moment/delete',data);
    },
    query: data => {
      return ajax.post(baseUrl + '/moment/query',data);
    }
  }
};
