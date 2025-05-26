import moment from 'moment';

const LOCAL_TIME_OFFSET = moment().utcOffset() * 60 * 1000;
const BJ_TIME_OFFSET = 8 * 60 * 60 * 1000; // +8:00
const DLT_TIME_OFFSET = BJ_TIME_OFFSET - LOCAL_TIME_OFFSET;

/**
 * 将北京时间转为当地时间
 * @function
 * @param {bjTime} string 字符串
 * @return string
 */
export default function bjTime2LocalTime(bjTime) {
  return bjTime - DLT_TIME_OFFSET;
}