import isString from 'lodash/isString'

/** @module getLink */

/**
 * 格式化链接
 * @param url { string } 链接
 * @return {string} 返回值
 */
export default function getLink (url) {
  if (!isString(url)) return '';
  url = url.trim();
  if (url.indexOf('://') !== -1) return url;
  return 'http://' + url;
}