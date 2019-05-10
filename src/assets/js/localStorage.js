export default {
  /** 
   * 获取localStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 getValue(objName, name) {
    let obj = JSON.parse(window.localStorage.getItem(objName));
    if(obj) {
      return name?obj[name] : obj;
    }
    else {
      return undefined;
    }
 },

/** 
   * 设置localStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 setValue(objName, value) {
  window.localStorage.setItem(objName, JSON.stringify(value));
},

/** 
   * 清除localStorage的值
   * @param {存储对象名} objName
   * @param {对象属性} name
  **/
 removeItem(objName) {
    window.localStorage.removeItem(objName);
  }
};