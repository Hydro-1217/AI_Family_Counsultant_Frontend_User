import './home.scss';
import '@/routes/style-pc/home.scss';

import homeUrl from '@/assets/home.png';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Dialog} from "antd-mobile";
import {FC_X_FAMILY_CODE, FC_X_FAMILY_FIRST_CREATED} from "@/common/constants.js";
import _ from "lodash";

export default function Root() {
  const navigate = useNavigate();
  const [familyCode, setFamilyCode] = useState('');
  const navToFamilyCreate = () => {
    navigate('/family-create');
    window.location.reload();
  }

  const handleAddToFamily = async () => {
    if (!_.trim(familyCode)) {
      return Dialog.alert({
        content: '家庭码不能为空'
      })
    }
    // 缓存起来
    localStorage.setItem(FC_X_FAMILY_CODE, familyCode)
    localStorage.setItem(FC_X_FAMILY_FIRST_CREATED, "0")
    navigate('/role-select');
    window.location.reload();
  }

  return (<>
    <div className="wrap-home">
      <img src={homeUrl} alt="home"/>

      <button className="home_btn home_btn_1" onClick={navToFamilyCreate}>
        创建新家庭 / Create Family
      </button>

      <div className="home_btn home_btn_split"/>

      <input
          className="home_btn home_btn_2"
          placeholder="输入家庭码 / Enter Family Code"
          onChange={e => setFamilyCode(e.target.value)}
      />

      <button
          className="home_btn home_btn_3"
          onClick={handleAddToFamily}
      >
        加入家庭 / Join Family
      </button>
    </div>
  </>);
}
