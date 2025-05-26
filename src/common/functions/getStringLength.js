/** @module getStringLength */

/**
 * 获取字符串的长度（中文字符占两个字节）
 * @param str 字符串
 * @return {int} 返回值
 * */

const REG_HANS = /^[\u4e00-\u9fa5]$/;

export default function getStringLength(str) {
  if (!str) return 0;
  if(typeof str !== 'string'){
    throw new Error('参数不对，只支持字符串');
  }
  let length = 0;
  for (const char of str) {
    length += REG_HANS.test(char) ? 2 : 1;
  }

  return length;
};