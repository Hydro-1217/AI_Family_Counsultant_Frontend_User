/** @module tryPromise */

/**
 * 已指定的次数尝试执行 promise 直到 resolve
 * @param {Promise} promise
 * @param {number} times 尝试的次数，默认不尝试
 * @return {number}
 */
export default function tryPromise(promise, times) {
  times = times || 0;
  if (times <= 0) return promise();
  times --;
  return promise().catch(() => tryPromise(promise, times));
}