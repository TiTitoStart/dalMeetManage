/**
 * 各种工具类函数
 */
export default {
  /**
   * 格式化时间
   * @param {时间格式} date
   * @param {格式化的格式 yyyy-MM-dd HH:mm:ss} fmt
   */
  formatDate(date, fmt) {
    date = new Date(date);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : padLeftZero(str)
        );
      }
    }

    function padLeftZero(str) {
      return ('00' + str).substr(str.length);
    }

    return fmt;
  },

  /**
   * 从数组arr中删除指定元素val
   * @param {数组} arr
   * @param {*} val
   */
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },

  /**
   * 返回在数组中的索引位置
   * @param {数组} arr
   * @param {值} val
   */
  arrayIndexOf(arr, val) {
    let i = arr.length;
    while (i--) {
      if (arr[i] == val) {
        return i;
      }
    }
    return -1;
  },

    /**
   * 返回在数组对象中的索引位置
   * @param {数组} arr
   * @param {值} val
   * @param {属性} attr
   */
  arrayObjIndexOf(arr,attr,val) {
    let i = arr.length;
    while (i--) {
      if (arr[i][attr] == val) {
        return i;
      }
    }
    return -1;
  },


  /**
   * 深拷贝
   * @param {对象} obj
  */ 
 deepClone(obj) {
    let newObj= obj instanceof Array?[]:{};
    for(let i in obj){
      newObj[i]=typeof obj[i]=='object'?  
      this.deepClone(obj[i]):obj[i];
    }
    return newObj;
  },


  /**
   * 函数节流
   * @param {函数} fn
   * @param {延迟时间} delay
  */ 
  debounce(fn, delay) {
    let timeout = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
    };
  }
};
