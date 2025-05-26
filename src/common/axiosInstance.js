import axios from 'axios';
import {getUserInfo} from "@/service/user.js";
import {FC_X_FAMILY_CODE, FC_X_TOKEN, FC_X_USER_INFO, FC_X_USER_SESSION_ID} from "@/common/constants.js";

export function mixLoginJump() {
  localStorage.removeItem(FC_X_FAMILY_CODE)
  localStorage.removeItem(FC_X_TOKEN)
  localStorage.removeItem(FC_X_USER_INFO)
  localStorage.removeItem(FC_X_USER_SESSION_ID)
  window.location.href = '/'
}

export function getToken() {
  const userInfo = getUserInfo();
  if (userInfo) {
    return userInfo.token
  }
}

export function getUid() {
  const userInfo = getUserInfo();
  if (userInfo) {
    return userInfo.id
  }
}

export function getFamilyId() {
  const userInfo = getUserInfo();
  if (userInfo) {
    return userInfo.activeFamilyId
  }
}

// * ---------------------------------------------------------------- axe
/** 建一个 axios 实例用于显式绑定全局 config */
export const axe = axios.create();

export const initHttpHeaders = () => {
  const commonHeaders = {
    'Content-Type': 'application/json',
  };
  const xToken = getToken()
  const xUserId = getUid()
  if (xToken) {
    commonHeaders['x-token'] = xToken;
    commonHeaders['x-user-id'] = xUserId;
  }
  const xFamilyId = getFamilyId()
  if (xFamilyId && xFamilyId !== '0') {
    commonHeaders['x-family-id'] = xFamilyId;
  }
  axe.defaults.headers.common = commonHeaders;
}

export const initAxiosConfig = () => {
  axe.interceptors.request.use(
      config => {
        // 在发送请求之前做些什么
        console.log('Request Interceptor:', config);
        return config;
      },
      error => {
        // 对请求错误做些什么
        console.log('Request Interceptor Error:', error);
        return Promise.reject(error);
      }
  );

  axe.interceptors.response.use((res) => {
    // * not json
    if (!res || !res.data || !res.data.code) throw res;
    // * ---json
    const {code, message} = res.data;
    if (code !== '0') {
      if(message && message.indexOf('token is invalid') !== -1) {
        return mixLoginJump();
      }
      throw res.data;
    }
    // success
    return res.data.result;
  }, error => {
    // 对响应错误做些什么
    if (error.response) {
      // 服务器响应，但状态码不是 2xx
      console.error(`Server responded with status code: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      const {data} = error.response;
      if (data && data.code === '499') {
        return mixLoginJump();
      }
      if (data.message && data.message.indexOf('token is invalid') !== -1) {
        return mixLoginJump();
      }
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.error('No response received:', error.request);
    } else {
      // 在设置请求时发生了一些问题
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  });
};
