import regex from '../regex'

// digits: 保留位数（默认两位）
// isRound:是否需要四舍五入（如：1.235 => 1.24）
export default function formatPrice(num, digits, isRound) {
  if (!regex.NUMBER.test(num)) return '';
  if (digits == null) {
    digits = 2;
  }
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num)) {
    num = '0';
  }
  var sign = (num == (num = Math.abs(num))); //正负号
  var multiple = Math.pow(10, digits); //倍数，主要用于小数位

  if (isRound) {
    num = Math.abs(Math.round((sign ? 1 : -1) * num * multiple));
  }
  else {
    num = Math.floor(Math.ceil(num * multiple * 10) / 10); //解决精度丢失问题 *10/10（例如：2.05*100=204.99999999999997，2.05*1000/10=205）
  }
  var cents = num.toString().slice(-1 * digits);
  if (cents.length < digits) {
    cents = new Array(digits - cents.length + 1).join('0') + cents;
  }
  if (num === 0) {
    cents = new Array(digits + 1).join('0');
  }
  num = Math.floor(num / multiple).toString();

  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + num + (digits > 0 ? ('.' + cents) : ''));
}