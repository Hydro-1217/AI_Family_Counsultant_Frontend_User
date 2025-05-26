/** @module escapeHtmlStyle */

/**
 * 清除HTML字符串的style属性
 * @param {string} str HTML字符串
 * @return {string} 清除style之后的字符串
 */
export default function escapeHtmlStyle(str) {
  str = (str || '').trim();
  return str.replace(/style="(.*?)"/gi, '')
}