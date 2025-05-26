import {FC_X_FAMILY_CODE, FC_X_TOKEN, FC_X_USER_INFO, FC_X_USER_SESSION_ID} from "@/common/constants.js";
import {navToMainPage} from "@/common/util.js";

export function getUserSessionId() {
  const userSessionId = localStorage.getItem(FC_X_USER_SESSION_ID);
  if (!userSessionId) {
    return null;
  }
  return userSessionId;
}
export function getUserInfo() {
  const userInfoStr = localStorage.getItem(FC_X_USER_INFO);
  if (!userInfoStr) {
    return null;
  }
  return JSON.parse(userInfoStr);
}
export function updateUserInfo(updateObj) {
  if(!updateObj) {
    return
  }
  const userInfoObj = getUserInfo() || {};
  const newUserInfoObj = {...userInfoObj, ...updateObj};
  localStorage.setItem(FC_X_USER_INFO, JSON.stringify(newUserInfoObj));
  localStorage.setItem(FC_X_TOKEN, newUserInfoObj.token);
}

export function checkUserAndRedirect(navigate) {
  const userInfo = getUserInfo();
  // 未登录，直接跳转登录页
  if (!userInfo) {
    return navigate('/login');
  }
  const {activeFamilyId} = userInfo;

  // 还没有加入家庭，前往家庭加入页
  if (!activeFamilyId || '0' === activeFamilyId) {
    // 如果 familyCode 已经存在了，指直接前往 role-select
    if (localStorage.getItem(FC_X_FAMILY_CODE)) {
      return navigate('/role-select');
    }

    // 如果是家庭创建页，则跳转了
    const currHref = window.location.href;
    if (currHref.indexOf('/family-create') > 0) {
      return;
    }

    // return window.location.href = '/home';
    return navigate('/home');
  }

  // 已登录，且有家庭，前往聊天页
  navToMainPage();
}