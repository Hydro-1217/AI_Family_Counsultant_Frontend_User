import './family-create.scss';
import '@/routes/style-pc/family-create.scss';

import homeUrl from '@/assets/home.png';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Dialog, Toast} from "antd-mobile";
import {familyCreate} from "@/common/api.js";
import to from "await-to-js";
import {FC_X_FAMILY_CODE, FC_X_FAMILY_FIRST_CREATED} from "@/common/constants.js";

export default function Root() {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState('');
  const [newFamilyCode, setNewFamilyCode] = useState(localStorage.getItem(FC_X_FAMILY_CODE));
  const [isCopied, setIsCopied] = useState(false);

  const handleCreateFamily = async () => {
    console.log(familyName);
    if (!familyName || !familyName.trim()) {
      return Dialog.alert({
        content: '家庭名称不能为空'
      })
    }

    const [err, familyCode] = await to(familyCreate(familyName.trim()));
    if (err) {
      return Dialog.alert({
        content: `创建家庭失败: ${err.message}`,
      })
    }
    setNewFamilyCode(familyCode);
    // 缓存起来
    localStorage.setItem(FC_X_FAMILY_CODE, familyCode)
    localStorage.setItem(FC_X_FAMILY_FIRST_CREATED, "1")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newFamilyCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒后重置状态
      Toast.show({
        content: (<div>家庭码 <strong>{newFamilyCode}</strong> 已复制</div>),
        position: 'top'
      })
    }).catch(err => {
      Toast.show({
        content: (<div>家庭码 <strong>{newFamilyCode}</strong> 复制失败，请手动复制</div>),
        position: 'top'
      })
    });
  };

  return (<>
    <div className="wrap-family-create">
      <img src={homeUrl} alt="home"/>
      <div className="home_btn home_btn_split"/>
      <input
          className="home_btn home_btn_2"
          placeholder="请输入家庭名称"
          onChange={e => setFamilyName(e.target.value)}
      />
      <button
          className="home_btn home_btn_3"
          onClick={handleCreateFamily}
      >
        生成家庭码
      </button>
      {!!newFamilyCode && (
          <>
            <p onClick={handleCopy}>{newFamilyCode}<span>复制</span></p>
            <button
                className="home_btn home_btn_4"
                onClick={() => navigate("/role-select")}
            >
              确定
            </button>
          </>
      )}
    </div>
  </>);
}
