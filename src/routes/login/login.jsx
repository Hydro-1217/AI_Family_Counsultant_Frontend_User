import './login.scss';
import '@/routes/style-pc/login.scss';
import {useNavigate, Link} from 'react-router-dom'
import {useEffect, useState} from "react";
import {trim} from "lodash/string.js";
import {Dialog, Input} from "antd-mobile";
import to from "await-to-js";
import {userLogin} from "@/common/api.js";
import {FC_X_TOKEN, FC_X_USER_INFO} from "@/common/constants.js";
import {checkUserAndRedirect} from "@/service/user.js";
import {initHttpHeaders} from "@/common/axiosInstance.js";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    const _username = trim(username);
    const _password = trim(password);
    if (!_username || !_password) {
      return Dialog.alert({
        content: '请输入用户名和密码',
      });
    }

    const [err, userInfo] = await to(userLogin(_username, _password));
    if (err) {
      return Dialog.alert({
        // content: `登录失败: ${err.message}`,
        content: '用户名或密码不正确'
      })
    }
    const {token} = userInfo;
    // 设置登录信息
    localStorage.setItem(FC_X_USER_INFO, JSON.stringify(userInfo));
    localStorage.setItem(FC_X_TOKEN, token);

    // window.location.href = '/';
    initHttpHeaders()
    checkUserAndRedirect(navigate);
  }

  useEffect(() => {
    // 第一次进入页面的时候，检查是否登录
    checkUserAndRedirect(navigate);
  }, []);

  return (<>
    <div className="wrap-login">
      <div className="wrap-login-title">
        <h1>AI家庭顾问</h1>
        <h2>AI Family Counselor</h2>
      </div>

      <div className="wrap-login-opt">
        <h3>登录 / Sign In</h3>

        <Input
            inputMode="latin" className="login_btn login_btn_1" placeholder="用户名 / Username"
            onChange={setUsername}
        />
        <Input
            type="password" className="login_btn login_btn_2" placeholder="密码 / Password"
            onChange={setPassword}
            onEnterPress={handleLogin}
        />
        <button className="login_btn login_btn_3" onClick={handleLogin}>登录 / Sign In</button>
        <button className="login_btn login_btn_4" onClick={() => navigate("/register")}>立即注册 / Register</button>
      </div>
    </div>
  </>);
}
