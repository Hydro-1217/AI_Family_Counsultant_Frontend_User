import './register.scss';
import '@/routes/style-pc/register.scss';
import {useNavigate} from 'react-router-dom'
import {useState} from "react";
import {trim} from "lodash/string.js";
import {Dialog} from "antd-mobile";
import to from "await-to-js";
import {userRegister} from "@/common/api.js";

export default function Root() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleRegister = async () => {
    const _username = trim(username);
    const _password = trim(password);
    const _confirmPassword = trim(confirmPassword);
    if (!_username || !_password) {
      return Dialog.alert({
        content: '请输入用户名和密码',
      });
    }
    if (_confirmPassword !== _password) {
      return Dialog.alert({
        content: '两次密码输入不一致',
      });
    }
    const [err, result] = await to(userRegister(_username, _password));
    if (err || !result) {
      return Dialog.alert({
        content: `注册失败: ${err.message}`,
      })
    }
    await Dialog.confirm({
      title: "注册成功",
      content: `注册成功，请前往登录页登录`,
    })
    return navigate("/login")
  }

  return (<>
    <div className="wrap-register">
      <div className="wrap-login-title">
        <h1>AI家庭顾问</h1>
        <h2>AI Family Counselor</h2>
      </div>

      <div className="wrap-login-opt">
        <h3>注册</h3>

        <input
            inputMode="latin" className="login_btn login_btn_1" placeholder="用户名"
            onChange={e => setUsername(e.target.value)}
        />
        <input
            type="password" className="login_btn login_btn_2" placeholder="密码"
            onChange={e => setPassword(e.target.value)}
        />
        <input
            type="password" className="login_btn login_btn_2" placeholder="确认密码"
            onChange={e => setConfirmPassword(e.target.value)}
        />
        <button className="login_btn login_btn_3" onClick={handleRegister}>点击注册</button>
      </div>
    </div>
  </>);
}
