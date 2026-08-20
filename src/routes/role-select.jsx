import './role-select.scss';
import '@/routes/style-pc/role-select.scss';

import {useState} from "react";
import {familyCreateAndAddRole, familyJoin} from "@/common/api.js";
import {FC_X_FAMILY_CODE, FC_X_FAMILY_FIRST_CREATED, ROLE_TYPE_MAP, ROLE_TYPES} from "@/common/constants.js";
import to from "await-to-js";
import {Dialog} from "antd-mobile";
import {updateUserInfo} from "@/service/user.js";
import {useNavigate} from "react-router-dom";
import {initHttpHeaders} from "@/common/axiosInstance.js";
import {navToMainPage} from "@/common/util.js";

export default function Root() {
  const navigate = useNavigate();
  const [selectedRoleType, setSelectedRoleType] = useState(0);

  const handleRoleSelect = (roleType) => {
    setSelectedRoleType(roleType);
  }

  const handleAddFamilyAndCreate = async () => {
    if (!selectedRoleType) {
      return Dialog.alert({
        content: '请选择你的角色',
      })
    }
    const familyCode = localStorage.getItem(FC_X_FAMILY_CODE);
    const familyFirstCreated = localStorage.getItem(FC_X_FAMILY_FIRST_CREATED);
    const familyAddRoleFun = familyFirstCreated === "1" ? familyCreateAndAddRole : familyJoin;
    const roleInfo = ROLE_TYPE_MAP[selectedRoleType];
    const [err, userFamilyId] = await to(familyAddRoleFun(familyCode, roleInfo.name));
    if (err || !userFamilyId) {
      if(err.message === "家庭号不存在") {
        await Dialog.alert({
          content: `设置家庭角色失败: ${err.message}`,
        })
        localStorage.removeItem(FC_X_FAMILY_CODE);
        localStorage.removeItem(FC_X_FAMILY_FIRST_CREATED);
        navigate("/home");
        return;
      }

      return Dialog.alert({
        content: `设置家庭角色失败: ${err.message}`,
      })
    }
    // 设置
    updateUserInfo({
      activeFamilyId: userFamilyId,
      role: String(roleInfo.name),
    });
    initHttpHeaders()
    navToMainPage();
  }

  const selectedRoleTypes = ROLE_TYPES.filter(({roleType}) => roleType !== 'assistant');

  return (<>
    <div className="role-select-wrap">
      <p>请选择你在家庭中的角色 / Select Your Family Role</p>
      <ul>
        {selectedRoleTypes.map(({name, secondName, roleType, imgUrl, bgColor}) => {
          return (
              <li
                  className={`role-item ${roleType === selectedRoleType ? 'role-item-selected' : ''}`}
                  key={roleType}
                  onClick={() => handleRoleSelect(roleType)}
              >
                <img src={imgUrl} alt={name}/>
                <span className="role" style={{backgroundColor: bgColor}}>{name}</span>
                <span className="second-name">{secondName}</span>
              </li>
          )
        })}
      </ul>
      <div className="wrap-btn">
        <button onClick={handleAddFamilyAndCreate}>确定 / Confirm</button>
      </div>
    </div>
  </>);
}
