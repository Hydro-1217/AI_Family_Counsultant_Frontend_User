import * as ReactDOM from "react-dom/client";

import {getToken, initAxiosConfig, initHttpHeaders, mixLoginJump} from "@/common/axiosInstance.js";
import App from "@/App.jsx";
import {h5PageAutoResponse} from "@/common/autoResponse.js";
import to from "await-to-js";
import {fetchUserInfo} from "@/common/api.js";
import {updateUserInfo} from "@/service/user.js";

const initApp = async () => {
  // 自适应设置
  h5PageAutoResponse();
  initAxiosConfig();
  const userToken = getToken();
  // 如果 token 存在，则加载用户信息，初始化 http header 之后，在进行组件渲染
  if (userToken) {
    initHttpHeaders();
    const [err, _userInfo] = await to(fetchUserInfo());
    if (err) {
      console.error('fetchUserInfo error', err)
      return mixLoginJump();
    }
    updateUserInfo(_userInfo);
    initHttpHeaders();
  }
  ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
}

initApp();


