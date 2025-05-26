
/**
 * 首字母大写
 * @function
 * @param {string} string 字符串
 * @return string
 */
export default function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}