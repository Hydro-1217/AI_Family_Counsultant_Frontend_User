/** @module wrapDownloadUrl */
import Cookies from 'js-cookie';

const _C_XTOKEN = "xtoken";
const _C_XUID = "xuid";
const _X_TENANT_ID = "xtenantid";

const TEZIGN_DOMAIN_EXP = /^.*\.tezign\.com$/;

/**
 * 为下载链接加上其他身份校验信息
 * @param originalDownloadUrl 原始下载链接
 * @param C_XTOKEN token
 * @param C_XUID uid
 * @param X_TENANT_ID
 * @returns {*} 新的下载链接
 */
export default function wrapDownloadUrl(originalDownloadUrl, C_XTOKEN = _C_XTOKEN, C_XUID = _C_XUID, X_TENANT_ID = _X_TENANT_ID) {
  if(!originalDownloadUrl){
    return originalDownloadUrl;
  }

  let token = Cookies.get(C_XTOKEN);
  let uid = Cookies.get(C_XUID);
  let xtenantid = Cookies.get(X_TENANT_ID);

  const hasParams = originalDownloadUrl.indexOf('?') !== -1;

  return `${originalDownloadUrl}${hasParams ? '&' : '?'}X-User-Id=${uid}&X-Token=${token}&X-TENANT-ID=${xtenantid}`;
}