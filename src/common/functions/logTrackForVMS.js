import logTrack from './logTrack';
import {LOG_TYPE as _LOG_TYPE} from '../decorators/logTrackForVMS';
import tenantConfig from "../getTenantConfig";

export const LOG_TYPE = _LOG_TYPE;

const API_ORIGIN_DEFAULT = tenantConfig.value("apiOriginVms");
export default function logTrackForVMS(type, logObj = {}) {
  const {apiOrigin} = logObj;
  logObj.apiOrigin = apiOrigin || API_ORIGIN_DEFAULT;
  return logTrack(type, logObj, 'vmsxuid');
}