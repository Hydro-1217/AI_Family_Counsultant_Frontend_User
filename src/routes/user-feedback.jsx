import './user-feedback.scss';
import {useNavigate} from 'react-router-dom'
import {useState} from "react";
import {Dialog, NavBar, TextArea} from "antd-mobile";
import to from "await-to-js";
import {getSystemPrompt, userSessionCreate} from "@/common/api.js";
import {FC_X_USER_SESSION_ID, KEY_SYSTEM_PROMPT} from "@/common/constants.js";

import userFeedbackWechatImg from '@/assets/user-feedback-wechat.png';


export default function Root() {
  const navigate = useNavigate();
  const [systemPrompt, setSystemPrompt] = useState(getSystemPrompt());
  const handleSetNewPromptAndStarNewSession = async () => {
    localStorage.setItem(KEY_SYSTEM_PROMPT, systemPrompt);
    const [err, userSessionInfo] = await to(userSessionCreate());
    if (err || !userSessionInfo) {
      return await Dialog.alert({
        content: `新用户会话创建失败: ${err.message}`
      })
    }
    const {id} = userSessionInfo;
    localStorage.setItem(FC_X_USER_SESSION_ID, id);
    return navigate("/chat")
  }

  return (<>
    <div className="wrap-user-feedback">
      <div className="wrap-login-title">
        <NavBar back='返回 / Back' onBack={() => navigate("/chat")}>
          用户反馈 / Feedback
        </NavBar>
      </div>
      <div className="wrap-login-opt">
        <div className="wrap-tip">
          <h1>联系我们 / Contact Us</h1>
          <p>扫描下方二维码加入用户群与开发者进行交流 / Scan the QR code to join the user community.</p>
        </div>

        <h2>
          用户沟通群 / User Community
        </h2>
        <div className="opt-wechat">
          <img src={userFeedbackWechatImg} alt="二维码"/>
          <span>AI家庭顾问用户沟通群 / AI Family Counselor Community</span>
        </div>
      </div>
    </div>
  </>);
}
