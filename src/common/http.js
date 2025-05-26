import fetch from 'isomorphic-fetch';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import json2formData from './functions/json2formData';
import parseObjectToUrlParams from './functions/parseObjectToUrlParams';

const events = {};

/**
 * http 方法
 * @param {string} url - 请求地址
 * @param {object} options - 请求参数
 * @param {string} options.method - 方法类型
 * @param {json} options.body - 请求内容
 * @param {object} options.headers - 请求头
 * @param {function} [options.selector=(response) => response.result] - deafult: response => response.result
 * @return {Promise} Http 返回结果.
 * @memberof http
 */
function http(url, options = {}) {

  const { original, params, selector = response => response.result } = options;
  if (params) { url += '?' + parseObjectToUrlParams(params); }
  return fetch(url, omit(options, ['selector'])).then(function(response) {

    if (original) { return response; }
    // HTTP请求异常
    if (response.status !== 200) {
      http.trigger(response.status, response);
      // throw response;
    }

    // 业务数据正常返回
    return response.json().then(function(res) {
      // 业务逻辑
      if (res.code !== '0') {
        http.trigger(res.code, response);
        throw res;
      }

      return selector(res);
    }, function(err) {
      http.trigger('DATA-ERROR', response);
      throw err;
    });
  }, function(err) {
    http.trigger('FETCH-ERROR', err);
    throw err;
  });
}

http.defaults = { headers: { 'Content-Type': 'application/json;charset=UTF-8' } };

/**
 * http.get 方法
 * @function http.get
 * @param {string} url - 请求地址
 * @param {object} options - 请求参数
 * @param {object} options.headers - 请求头
 * @return {Promise} Http 返回结果.
 * @memberof http
 */
http.get = function(url, options) {
  options = options || {};
  options.method = 'GET';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

/**
 * http.post 方法
 * @function http.post
 * @param {string} url - 请求地址
 * @param {object} data - 请求内容
 * @param {object} options - 请求参数
 * @param {object} options.headers - 请求头
 * @return {Promise} Http 返回结果.
 * @memberof http
 */
http.post = function(url, data, options) {
  options = options || {};
  options.body = JSON.stringify(data);
  options.method = 'POST';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

http.put = function(url, data, options) {
  options = options || {};
  options.body = JSON.stringify(data);
  options.method = 'PUT';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

http.patch = function(url, data, options) {
  options = options || {};
  options.body = JSON.stringify(data);
  options.method = 'PATCH';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

http.delete = function(url, options) {
  options = options || {};
  options.method = 'DELETE';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

http.on = function(name, handler) {
  if (!events[name]) { events[name] = []; }
  events[name].push(handler);
};

http.trigger = function(name, data) {
  const handlers = events[name];
  if (handlers) {
    handlers.forEach((handler) => handler(data));
  }
};

// 特殊请求
http.postForm = function(url, data, options) {
  options = options || {};
  options.body = json2formData(data);
  options.headers = options.headers ? { ...options.headers, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } : { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
  options.method = 'POST';
  options = merge({}, http.defaults, options);
  return http(url, options);
};

/**
 * @namespace http
 */
export default http;
