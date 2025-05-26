import isInteger from 'lodash/isInteger'
import isString from 'lodash/isString'

import reg from '../regex'

/** @module formatPhoneNumber */

/**
 * 格式化手机号码
 * @param {string|number} num 手机号码
 * @return {string}
 */
export default function formatPhoneNumber (num) {
  if (isInteger(num)) num = '' + num;
  if (!reg.PHONE.test(num)) return num;
  if (!isString(num)) return '';
  return num.substring(0, 3) + ' ' + num.substring(3, 7) + ' ' + num.substring(7);
}
