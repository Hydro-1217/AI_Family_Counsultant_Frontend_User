import regex from '../regex'


/** @module getCharacterLength */

/**
 * 获取字符串的文字个数
 * @param {string} str 字符串
 * @return {number}
 */
export default function getCharacterLength (str) {
  if (!str) return 0;
  let length = 0, regHans = regex.HANS;
  for (const char of str) {
    length += regHans.test(char) ? 2 : 1;
  }
  return length;
}