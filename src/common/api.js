import {axe} from "@/common/axiosInstance.js";
import {KEY_SYSTEM_PROMPT, SYSTEM_PROMPT} from "@/common/constants.js";

// export const BASE_PATH = "https://afc.prd.rxqin.com";
export const BASE_PATH = "http://127.0.0.1:8080";
// export const BASE_PATH = "https://ai-familycounselor.rxqin.com:8080";
// const BASE_PATH = "http://127.0.0.1:8080";

export const userLogin = (username, password) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/user/login`, {
      name: username, password
    });
};
export const fetchUserInfo = () => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/user`);
};
export const userRegister = (username, password) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/user/register`, {
      name: username, password
    });
};
export const userUpdate = ({id, name, password, sex, birthday}) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/user/update`, {
    id, name, password, sex, birthday
    });
};
export const getFamilyInfo = (familyId) => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/family/getFamilyInfo?familyId=${familyId}`);
};
export const familyCreate = (familyName) => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/family/create?familyName=${familyName}`);
};
/**
 * 首次创建家庭并添加角色
 * @param code 家庭码
 * @param role 角色
 */
export const familyCreateAndAddRole = (code, role) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/family/createAndAddRole`, {
    code, role
  });
};
/**
 * 加入已经存在的家庭
 * @param code 家庭码
 * @param role 角色
 */
export const familyJoin = (code, role) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/family/joinFamily`, {
    code, role
  });
};
export const switchFamily = (familyId) => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/family/switchFamily?familyId=${familyId}`);
};
export const getUserSessionList = () => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/userSession/list`);
};
export const addSessionContent = (userSessionId, {role, content}) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/session/addSession/${userSessionId}`, [{
    role, content
  }]);
};
export const userSessionQuestionSuggestList = () => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/userSessionQuestionSuggest/list`);
};
export const getLastQuestionId = (userId, userSessionId) => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/userSessionQuestionSuggest/getLastQuestionId?userId=${userId}&userSessionId=${userSessionId}`);
};
export const saveLastQuestionId = ({userId, userSessionId, lastQuestionId}) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/userSessionQuestionSuggest/saveLastQuestionId`, {
    userId, userSessionId, lastQuestionId
  });
};
export const deleteLastQuestionId = ({userId, userSessionId}) => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/userSessionQuestionSuggest/deleteLastQuestionId`, {
    userId, userSessionId
  });
};
// 发送信息地址
export const getUserSessionStartUrl = (userSessionId) => {
  // return `${BASE_PATH}/AIFamilyConsultant/session/start/${userSessionId}`;
  return `${BASE_PATH}/AIFamilyConsultant/session/startDouBao/${userSessionId}`;
};
export const userSessionSendMessage = (userSessionId, message) => {
  return axe.post(getUserSessionStartUrl(userSessionId), message);
};
// 会话中的信息列表
export const userSessionMessageList = (userSessionId) => {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/session/get?userSessionId=${userSessionId}`);
};
export const getSystemPrompt = () => {
  let systemContent = SYSTEM_PROMPT;
  const cachedSystemPrompt = localStorage.getItem(KEY_SYSTEM_PROMPT);
  if(cachedSystemPrompt) {
    systemContent = cachedSystemPrompt;
  }
  return systemContent;
};
export const userSessionCreate = () => {
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/userSession/create`, {
    content: getSystemPrompt()
  });
};

export const generateReport = (params) => {
  params.reportPrompt = "#角色设定：您是一位能给人带来愉悦和温暖感的家庭顾问，你的语言幽默又直爽，然后又不失专业性和温暖感。\n" +
      "#能力要求：\n" +
      "##专业知识：掌握教育学理论、心理学理论、治疗方法及测评工具。 \n" +
      "##临床经验：丰富的青少年心理问题处理经验，提供具体可执行的解决方案。\n" +
      "#沟通目标：\n" +
      "麻烦根据这个家庭中，所有成员的聊天记录，进行综合分析，分析出\n" +
      "1. 所有成员的情绪状态得分（给出具体分数）；\n" +
      "2. 这个家庭沟通的主要矛盾（三条）；\n" +
      "3. 三条主要矛盾中，最重要最优先需要处理的一个问题；\n" +
      "4. 针对最重要最优先需要处理的这一个问题，安排一个家庭会议：\n" +
      "1）生成家庭会议的建议议题和议程，议程要尽可能的详细，最好把每个人要表达的或者要问的问题都给出示例\n" +
      "2）需要为这个会议推荐一个主持人\n" +
      "3）这个家庭会议要比较轻松愉快，开头的时候，需要有一个破冰环节\n" +
      "4）全家对所讨论的问题需要得出明确的共识规则，最好根据需要讨论的问题，列举一些符合SMART原则的规则供大家进行探讨\n" +
      "5）需要有打印规则并签字的环节";
  return axe.post(`${BASE_PATH}/AIFamilyConsultant/admin/generateReport`, params);
};

export async function queryFamilyReportPage(familyId, page, size) {
  console.log('getFamilyList', familyId, page, size);
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/admin/queryReportList?familyId=${familyId}&page=${page}&size=${size}`);
}

export async function getVoiceConfig() {
  return axe.get(`${BASE_PATH}/AIFamilyConsultant/voice/config`);
}


