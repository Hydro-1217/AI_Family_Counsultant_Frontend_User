// 角色列表
export const ROLE_TYPE = {
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
};

export const KEY_SYSTEM_PROMPT = "key_fc_system_prompt";

export const FC_X_TOKEN = "fc-token";
export const FC_X_USER_SESSION_ID = "fc-x-user-session-id";
export const FC_X_FAMILY_CODE = "fc-family-code";
export const FC_X_FAMILY_FIRST_CREATED = "fc-x-family-first-created";
export const FC_X_USER_INFO = "fc-user-info";

export const SYSTEM_PROMPT = `#角色设定：你是一名家庭顾问，性格活泼直爽，接地气，说话清晰，简洁又不失温暖，善于与孩子和家长进行沟通。善于通过一些询问，了解具体哪些事情，触发了咨询者的感受，进而通过三到四轮的追问，去了解咨询者遇到具体事件的感受，内心的想法以及需求，进而给到情绪安抚和具体的行动建议。

#能力要求：
##专业知识：掌握教育学与心理学理论，丰富的青少年心理问题处理经验，能提供具体的行动方案建议。 
##同理心：能够理解咨询者的内心感受，提供较强烈的关怀与支持。 
##沟通目的：帮助咨询者缓解各种不适情绪、压力和焦虑，提供具体且简单易懂的行动建议，并努力引导孩子向家长求助，并理解家长的一些行为，与此同时也善于引导家长理解孩子，并努力通过推荐“家庭会议”的沟通方式去解决家庭沟通问题。
##沟通技巧：优秀的倾听与表达能力，使用简单易懂的语言与咨询者进行沟通。 
##持续学习：关注心理学前沿研究，不断更新知识与技能。 
##职业道德：严格遵循职业道德，在孩子或家长表达一些三观不正的想法时，能予以温柔坚定的纠正。

#开场白：“哈喽，你好啊，今天我们聊些什么呢？”

#答复字数限制：80字`;

import roleImgRobot from '@/assets/avatar-robot.png';
import roleImgUrl1 from '@/assets/role-1.png';
import roleImgUrl2 from '@/assets/role-2.png';
import roleImgUrl3 from '@/assets/role-3.png';
import roleImgUrl4 from '@/assets/role-4.png';
import roleImgUrl5 from '@/assets/role-5.png';
import roleImgUrl6 from '@/assets/role-6.png';
import roleImgUrl7 from '@/assets/role-7.png';
import roleImgUrl8 from '@/assets/role-8.png';
import roleImgUrl9 from '@/assets/role-9.png';

export const ROLE_TYPES  = [
  {
    name: 'AI家庭顾问',
    roleType: 'assistant',
    imgUrl: roleImgRobot,
  },
  {
    name: '爸爸',
    roleType: 1,
    imgUrl: roleImgUrl1,
    bgColor: '#225DAF',
  },
  {
    name: '妈妈',
    roleType: 2,
    imgUrl: roleImgUrl2,
    bgColor: '#FF6EA6',
  },
  {
    name: '哥哥',
    secondName: '独生子',
    roleType: 3,
    imgUrl: roleImgUrl3,
    bgColor: '#3ECBC0',
  },
  {
    name: '弟弟',
    roleType: 4,
    imgUrl: roleImgUrl4,
    bgColor: '#5DDAFF',
  },
  {
    name: '姐姐',
    secondName: '独生女',
    roleType: 5,
    imgUrl: roleImgUrl5,
    bgColor: '#FCC900',
  },
  {
    name: '妹妹',
    roleType: 6,
    imgUrl: roleImgUrl6,
    bgColor: '#FE6869',
  },
  {
    name: '爷爷',
    roleType: 7,
    imgUrl: roleImgUrl7,
    bgColor: '#C9B3D8',
  },
  {
    name: '奶奶',
    roleType: 8,
    imgUrl: roleImgUrl8,
    bgColor: '#D3A9A0',
  },
  {
    name: '老师',
    roleType: 9,
    imgUrl: roleImgUrl9,
    bgColor: '#FE6869',
  },
];

export const ROLE_TYPE_MAP = ROLE_TYPES.reduce((acc, cur) => {
  acc[cur.roleType] = cur;
  return acc;
}, {});

export const ROLE_NAME_MAP = ROLE_TYPES.reduce((acc, cur) => {
  acc[cur.name] = cur;
  return acc;
}, {});