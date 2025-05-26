/** @module handleAction */

/**
 *
 * @param {int} type 类型
 * @param {initialState} 初始状态
 * @param {function} success 成功回调函数
 * @param {function} error 失败回调函数
 * @return {string}
 */
export default function (type, initialState, success, error) {
  return function (state = initialState, action) {
    if (action.type !== type) return state;
    if (action.error) {
      if (error) return error(state, action.payload);
      return state;
    }
    if (success) return success(state, action.payload);
    return action.payload;
  };
}