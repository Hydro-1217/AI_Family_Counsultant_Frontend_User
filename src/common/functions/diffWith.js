/** @module diffWith */

function diffWith(obj1, obj2, keys) {
  if (keys) {
    return keys.some((key) => obj1[key] !== obj2[key]);
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return keys1.length !== keys2.length || keys1.some((key) => obj1[key] !== obj2[key]);
  }
}

/**
 * 判断两个对象是否不相等
 * @param {object} obj1 对象1
 * @param {object} obj2 对象1
 * @param {Array<string>} keys 比较的属性列表
 * @return {boolean} 比较结果
 */
export default diffWith;