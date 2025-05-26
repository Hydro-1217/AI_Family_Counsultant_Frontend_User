/** @module formatApiDateTime */

const REG_API_DATETIME = /^\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}\:\d{2}/;

/**
 * 格式化 api 中的 datetime，支持 YYYY|Y MM DD HH hh mm ss 字符
 * @param {string} datetime
 * @param {string} format
 * @return {string}
 */
export default function formatApiDateTime (datetime, format) {
  if (!format) return datetime;
  if (!REG_API_DATETIME.test(datetime)) return datetime;
  const year = datetime.substr(0, 4);
  const month = datetime.substr(5, 2);
  const day = datetime.substr(8, 2);
  const hour = datetime.substr(11, 2);
  const minute = datetime.substr(14, 2);
  const second = datetime.substr(17, 2);
  return format.replace('YYYY', year)
    .replace('Y', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('hh', hour)
    .replace('mm', minute)
    .replace('ss', second);
}
