/** @module each */

function each(list, callback, n) {
  let len = list.length,
    i = 0;
  for (; i < len; i++) {
    if (n && i === n) break;
    callback && callback(list[i], i);
  }
}

/**
 * 指定列表和遍历截止的下标，并执行指定的回调
 * @param {Array} list 迭代的列表
 * @param {Function} callback 遍历过程中的回调，参数为列表选项和下标
 * @param {Number} n 可选，默认为list.length
 */
export default each;