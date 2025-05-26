/** @module convertNumToChinese */

function convertNumToChinese(_num) {
  const units = ['', '万', '亿'];
  const _units = ['千', '百', '十', ''];
  const zero2Nine = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let num = parseInt(_num);
  if (isNaN(num)) {
    return '请传入正确的整数';
  }
  num = num.toString().split('').reverse().join('');
  const unitsLen = units.length;
  const numLen = num.length;
  if (numLen > unitsLen * 4) {
    return '请不要传入过大的数字';
  }
  let str = '';
  for (let i = 0; i < numLen / 4; i++) {
    const __num = num.slice(i * 4, i * 4 + 4).split('').reverse().join('');
    if (__num === '0000') {
      continue;
    }
    let __str = '';
    for (let j = 0; j < __num.length; j++) {
      const currentNum = zero2Nine[parseInt(__num[j])];
      const currentUnit = _units[j + 4 - __num.length];

      if (!(currentNum === '零' && currentUnit === '')) {
        __str += currentNum + currentUnit;
      }
    }
    str = __str + units[i] + str;
  }
  return str.replace(/零[\D]/g, '@').replace(/[@]+/g, '@').replace(/@$/, '').replace(/@([万亿]+)/, '$1').replace(/@/g, '零');
}

/**
 * 将阿拉伯数字转换成中文数字标识
 * 比如123005 => 十二万三千零五
 * @param {String | Number} _num 阿拉伯数字
 * @author sunshine .
 * @return {String} 中文数字
 */
export default convertNumToChinese;