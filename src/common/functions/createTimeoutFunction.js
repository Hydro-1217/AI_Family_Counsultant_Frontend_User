/** @module createTimeoutFunction */

/**
 * 创建一个延迟执行的函数
 * @param {function} func 函数
 * @param {int} timeout 延迟执行的 ms
 * @param {object} thisOrg 函数执行的上下文
 * @return {function}
 */
export default function createTimeoutFunction(func, timeout, thisOrg) {
  let _t;
  return function() {
    clearTimeout(_t);
     
    const args = arguments;
    _t = setTimeout(function() {
      func.apply(thisOrg || this, args);
    }, timeout);
  };
}