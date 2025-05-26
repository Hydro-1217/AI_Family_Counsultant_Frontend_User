import moment from 'moment'

/** @module fromNow */

/**
 * 距离现在的时间差
 * @param {number} time 时间戳 ms
 * @return {string}
 */
export default function fromNow(time) {
  const nowDate = Date.now();
  const interval = Math.round((nowDate - time) / (1000 * 60));
  if (interval < 5) {
    return '刚刚';
  }
  if (interval < 60) {
    return `${interval}分钟之前`;
  }
  if (interval >= 60 && interval < 120) {
    return '1小时之前';
  }
  if (interval >= 120 && interval < 180) {
    return '2小时之前';
  }
  const targetMoment = moment(time);
  const nowMoment = moment();
  const [nowYear, nowMonth, nowDay] = [nowMoment.year(), nowMoment.month(), nowMoment.date()];
  const targetYear = targetMoment.year();
  const targetMonth = targetMoment.month();
  const targetDay = targetMoment.date();
  // 一年之前
  if (targetYear < nowYear) {
    return targetMoment.format('YYYY.MM.DD HH:mm');
  }
  // 昨天之前 - 一年之间
  if (targetMonth < nowMonth || targetDay < nowDay - 1) {
    return `${targetMoment.format('MM.DD HH:mm')}`;
  }
  // 昨天
  if (targetDay === nowDay - 1) {
    return `昨天 ${targetMoment.format('HH:mm')}`;
  }

  // 今天上午(6-12)/今天下午(12-18)/今天晚上(18-24)/今天凌晨(0-6)  xx:xx
  const targetHour = targetMoment.hour();
  let firstStr;
  if (targetHour >= 0 && targetHour < 6) {
    firstStr = '今天凌晨';
  }
  if (targetHour >= 6 && targetHour < 12) {
    firstStr = '今天上午';
  }
  if (targetHour >= 12 && targetHour < 18) {
    firstStr = '今天下午';
  }
  if (targetHour >= 18 && targetHour < 24) {
    firstStr = '今天晚上';
  }
  return `${firstStr} ${targetMoment.format('HH:mm')}`;
}