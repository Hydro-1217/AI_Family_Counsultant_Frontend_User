import './setting-prompt.scss';
import {useNavigate} from 'react-router-dom'
import {useState} from "react";
import {Dialog, NavBar, TextArea} from "antd-mobile";
import to from "await-to-js";
import {getSystemPrompt, userSessionCreate} from "@/common/api.js";
import {FC_X_USER_SESSION_ID, KEY_SYSTEM_PROMPT} from "@/common/constants.js";

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
    <div className="wrap-setting-prompt">
      <div className="wrap-login-title">
        <NavBar back='返回 / Back' onBack={() => navigate("/chat")}>
          提示词设置 / Prompt Settings
        </NavBar>
      </div>
      <div className="wrap-login-opt">
        <TextArea
            autoSize
            autoFocus
            value={systemPrompt}
            className="input-prompt"
            placeholder="请输入提示词 / Enter prompt"
            onChange={setSystemPrompt}
        />
        <button className="login_btn login_btn_3" onClick={handleSetNewPromptAndStarNewSession}>开启新会话 / Start New Chat</button>
        <button className="login_btn login_btn_4" onClick={() => navigate("/chat")}>返回聊天 / Back to Chat</button>
      </div>
    </div>
  </>);
}
