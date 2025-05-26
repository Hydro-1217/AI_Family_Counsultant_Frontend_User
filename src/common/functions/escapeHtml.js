/** @module escapeHtml */

function escapeHtml(str) {
  str = (str || '').trim();
  return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '');
}

/**
 * 过滤掉字符串中HTML元素
 * @param {String} str 指定字符串
 * @return {string} 过滤之后的字符串
 */
export default escapeHtml;