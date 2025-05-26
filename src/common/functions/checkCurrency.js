import regex from '../regex';

/**
 * @function
 * @description: 校验金额，整数或者是两位小数
 * @param value
 * @return {boolean}
 */
function checkCurrency(value) {
  return regex.CURRENCY.test(value) || !value
}

export default checkCurrency;