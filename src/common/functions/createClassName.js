/** @module createClassName */

import each from 'lodash/each'


function createClassName(obj) {
  let result = '';
  each(obj, (value, key) => {
    if (value) result += ' ' + key;
  });
  return result;
}

/**
 * 通过对象来获得className字符串的拼接
 * @param obj 格式：clazz1: bool, clazz2: bool
 * @return {string} 最终的className
 * @author sunshine .
 */
export default createClassName;