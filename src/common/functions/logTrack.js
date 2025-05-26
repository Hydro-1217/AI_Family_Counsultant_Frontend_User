/** @module logTrack */

import moment from 'moment';
import Cookies from 'js-cookie'
import http from '../http'
import tenantConfig from "../getTenantConfig";

const C_XUID = "xuid";
const API_ORIGIN_DEFAULT = tenantConfig.value("apiOrigin");

function getRandomString(length) {
  let text = "";
  let dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
  }
  return text
}

function genderateEventId(type, userId='') {
  let currentTime = new Date().getTime();
  let randomStr = getRandomString(4);
  return `${type}${userId}${currentTime}${randomStr}`;
}

function _onLogSuccess(eventId) {
  console.log(`log success, eventId: ${eventId}`);
}

function _onLogError(error) {
  console.error(`log error, error`, error);
}

function _log2BackEnd(logObj) {
  const {
    id,
    apiOrigin = API_ORIGIN_DEFAULT,
    onLogSuccess = _onLogSuccess,
    onLogError = _onLogError,
  } = logObj;
  delete logObj.apiOrigin;

  http.post(`${apiOrigin}/tracking/track`, [logObj]).then(() => {
    onLogSuccess(id);
  }, err => {
    onLogError(err);
    return err;
  });
}

export const log2BackEnd = _log2BackEnd;

/**
 * 日志埋点函数接口
 * @param {string} type 日志类型，参考decorators/logTrack.LOG_TYPE
 * @param {object} logObj 日志对象 （可指定businessId等字段）
 */
export default function (type, logObj, CX = C_XUID) {
  const userId = Cookies.get(CX);
  const defaultLogObj = {
    type,
    createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    id: genderateEventId(type, userId),
  };

  if(userId){
    defaultLogObj.userId = userId;
  }

  const fLogObj = Object.assign(defaultLogObj, logObj);

  _log2BackEnd(fLogObj);
};