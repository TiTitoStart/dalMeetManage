export default {
  /** 
   * 获取sessionStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 get(objName, name) {
    let obj = JSON.parse(window.sessionStorage.getItem(objName));
    if(obj) {
      return name ? obj[name] : obj;
    }
    else {
      return undefined;
    }
 },

/** 
   * 设置sessionStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 set(objName, value) {
  window.sessionStorage.setItem(objName, JSON.stringify(value));
},

/** 
   * 清除sessionStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 remove(objName) {
    window.sessionStorage.removeItem(objName);
  }
};