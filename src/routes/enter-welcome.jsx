import './enter-welcome.scss';
import {useNavigate} from 'react-router-dom'

export default function Root() {
  const navigate = useNavigate();
  return (<>
    <div className="wrap-enter-welcome">
      <div className="wrap-login-title">
        <h1>AI家庭顾问</h1>
        <h2>AI Family Counselor</h2>
      </div>

      <div className="wrap-login-opt">
        <p>每个人都有迷茫困惑，来跟我说说吧😊<br />Everyone has questions—let's talk.</p>
        <button className="login_btn login_btn_3" onClick={() => navigate("/chat")}>进入 AI 聊天室 / Enter AI Chat</button>
      </div>
    </div>
  </>);
}
