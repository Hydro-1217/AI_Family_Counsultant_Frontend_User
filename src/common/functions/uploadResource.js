/** @module uploadResource */

import pick from 'lodash/pick';
import http from '../http'
import getFileExtension from './getFileExtension';
import isVideo from './isVideo';
import tenantConfig from "../getTenantConfig";

const OnReadyStateChange = 'OnReadyStateChange'.toLocaleLowerCase();

function upload2Qiniu(url, formData, progressCallback, successCallback, errorCallback) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  xhr.upload.addEventListener("progress", function (evt) {
    if (!evt.lengthComputable) return true;
    let res = pick(evt, ['loaded', 'total']);
    res.percent = Math.round(evt.loaded * 100 / evt.total);
    if (progressCallback) progressCallback(res);
  }, false);

  xhr[OnReadyStateChange] = function () {
    if (xhr.readyState !== 4) return;

    if(xhr.status !== 200 || !xhr.responseText){
      let error;
      if (xhr.responseText) error = JSON.parse(xhr.responseText);
      errorCallback(error);
      return;
    }

    successCallback();
  };
  xhr.send(formData);
}

function getFileType(str) {
  let postfix = str.lastIndexOf('.');
  return str.substring(postfix);
}

function addResource(url, resource, httpOptions) {
  return http.post(url, {
    resourceList: [resource]
  }, httpOptions).then(res => {
    let file = res.resourceList[0];
    file.thunderUrl = file.thunder;
    return file;
  });
}

const FEED_PATH = `${tenantConfig.value("apiOrigin")}/user/qiniu/getUploadToke`;
const ADD_RESOURCE_PATH = `${tenantConfig.value("apiOrigin")}/user/qiniu/file/add`;

/**
 * 上传文件到 qiniu 并且存储到 resource 表中
 * @param file
 * @param options
 * @param httpOptions 自定义http库的请求配置
 * @returns {Promise}
 */
export default function (file, options={}, httpOptions) {
  return new Promise((resolve, reject) => {
    http.get(`${options.getUploadFeedUrl || FEED_PATH}?extension=${getFileExtension(file.name)}`, httpOptions).then(feed => {
      let { key, token } = feed;
      const filename = file.name;
      const isVideoType = isVideo(filename);
      const fileExtension = getFileExtension(filename);
      let formData = new FormData();
      formData.append('file', file);
      formData.append('file', file);
      formData.append('key', `${key}${isVideoType ? '_original' : ''}.${fileExtension}`);
      formData.append('token', token);
      const UPLOAD_PATH = window.location.protocol.indexOf('https') !== -1 ? 'https://up.qbox.me' : 'http://upload.qiniu.com';
      upload2Qiniu(options.uploadUrl || UPLOAD_PATH, formData, data => {
        if (options.progress) options.progress(file, data);
      }, () => {
        const resource = {
          name: filename,
          path: `${key}.${isVideoType ? 'mp4' : fileExtension}`,
          size: file.size,
          type: isVideoType ? 'video/mp4' : file.type
        };
        addResource(options.addResourceUrl || ADD_RESOURCE_PATH, resource, httpOptions).then(resolve, () => {
          file.error = '文件上传失败';
          reject(file);
        });
      }, () => {
        file.error = '文件上传失败';
        reject(file);
      });
    }, () => {
      file.error = '获取上传 token 失败';
      reject(file);
    });
  });
};