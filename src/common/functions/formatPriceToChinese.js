import isNumber from 'lodash/isNumber'

const AA = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const BB = ['', '拾', '佰', '仟', '万', '亿', '圆', ''];
const CC = ['角', '分', '厘'];

/** @module formatPriceToChinese */

/**
 * 格式化金额为中文
 * @param {string|number} num 金额
 * @return {string}
 */
export default function formatPriceToChinese(num) {
  if (!isNumber(num)) return '';
  let a = (`${num}`).replace(/(^0*)/g, '').split('.'),
    k = 0,
    re = '';
  for (let i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0 :
        re = BB[7] + re;
        break;
      case 4 :
        if (!new RegExp(`0{4}\\d{${a[0].length - i - 1}}$`).test(a[0])) { re = BB[4] + re; }
        break;
      case 8 :
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 === 2 && a[0].charAt(i) === '0' && a[0].charAt(i + 2) !== '0') { re = AA[0] + re; }
    if (a[0].charAt(i) !== 0) { re = AA[a[0].charAt(i)] + BB[k % 4] + re; }
    k++;
  }
  if (a.length > 1) {
    re += BB[6];
    for (let i = 0; i < a[1].length; i++) {
      re += AA[a[1].charAt(i)] + CC[i];
      if (i === 2) { break; }
    }
    if (a[1].charAt(0) === '0' && a[1].charAt(1) === '0') {
      re += '圆整';
    }
  } else {
    re += '圆整';
  }
  return re;
}