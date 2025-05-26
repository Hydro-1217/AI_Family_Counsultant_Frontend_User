import {HashRouter, Route, Routes} from "react-router-dom";
import withPrivateRoute from '@/components/withPrivateRoute';
import Login from "./routes/login/login.jsx";
import FamilyCreate from "./routes/family-create.jsx";
import FamilyInfo from "./routes/family-info.jsx";
import Register from "./routes/register.jsx";
import Home from "./routes/home/home.jsx";
import RoleSelect from "./routes/role-select.jsx";
import SettingPrompt from "./routes/setting-prompt.jsx";
import UserFeedback from "./routes/user-feedback.jsx";
import EnterWelcome from "./routes/enter-welcome.jsx";
import Chat from "./routes/chat.jsx";

const PrivateHome = withPrivateRoute(Home);
const PrivateRoleSelect = withPrivateRoute(RoleSelect);
const PrivateFamilyCreate = withPrivateRoute(FamilyCreate);
const PrivateFamilyInfo = withPrivateRoute(FamilyInfo);
const PrivateSettingPrompt = withPrivateRoute(SettingPrompt);
const PrivateUserFeedback = withPrivateRoute(UserFeedback);
const PrivateEnterWelcome = withPrivateRoute(EnterWelcome);
const PrivateChat = withPrivateRoute(Chat);

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/role-select" element={<PrivateRoleSelect/>}/>
          <Route path="/home" element={<PrivateHome/>}/>
          <Route path="/family-create" element={<PrivateFamilyCreate/>}/>
          <Route path="/family-info" element={<PrivateFamilyInfo/>}/>
          <Route path="/setting-prompt" element={<PrivateSettingPrompt/>}/>
          <Route path="/user-feedback" element={<PrivateUserFeedback/>}/>
          <Route path="/enter-welcome" element={<PrivateEnterWelcome/>}/>
          <Route path="/chat" element={<PrivateChat/>}/>
          {/* 其他需要保护的路由 */}
        </Routes>
      </HashRouter>
  );
}

export default App