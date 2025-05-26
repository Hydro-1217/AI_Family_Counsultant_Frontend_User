import './family-info.scss';

import homeUrl from '@/assets/home.png';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Dialog} from "antd-mobile";
import {getFamilyInfo} from "@/common/api.js";
import to from "await-to-js";
import {getFamilyId, mixLoginJump} from "@/common/axiosInstance.js";

export default function Root() {
  const navigate = useNavigate();
  const [familyInfo, setFamilyInfo] = useState({});

  const fetchFamilyInfo = async () => {
    const [err, _familyInfo] = await to(getFamilyInfo(getFamilyId()));
    if (err) {
      return Dialog.alert({
        content: `获取家庭信息: ${err.message}`,
      })
    }
    setFamilyInfo(_familyInfo);
  }

  useEffect(() => {
    fetchFamilyInfo();
  }, []);

  const {id, name, code, familyMembers} = familyInfo;
  return (<>
    <div className="wrap-family-info">
      <img src={homeUrl} alt="home"/>
      <div className="home_btn home_btn_split"/>
      <div>家庭ID: {id}</div>
      <div>家庭名称: {name}</div>
      <div>家庭码: {code}</div>
      <div>家庭成员</div>
      <ul>
        {familyMembers && familyMembers.map(({id, role, userId}, index) => (
            <li key={index}>ID:{id} Role:{role} userId:{userId}</li>
        ))}
      </ul>
      <button
          className="home_btn home_btn_3"
          onClick={() => navigate("/enter-welcome")}
      >
        返回聊天
      </button>
      <button
          className="home_btn home_btn_3"
          onClick={mixLoginJump}
      >
        退出登录
      </button>
    </div>
  </>);
}
