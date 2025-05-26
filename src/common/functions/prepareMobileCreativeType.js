/** @module prepareMobileCreativeType */

/**
 * mobile案例详情创意类型数据处理
 * @param {object} portfolio 案例信息
 * @return {Array}
 */
import capitalize from './capitalize'

/*const CREATIVE_TYPE_MAP = {
  1: '平面设计',
  2: 'UI / UX',
  3: '插画 / 漫画',
  6: 'H5',
  4: '动画',
  7: '影视',
  8: '创意策划 / 文案',
  9: '3D / AR / VR',
  5: '其他'
};*/

const CREATIVE_TYPE = {
  PM: 1,
  UI: 2,
  CH: 3,
  H5: 6,
  DH: 4,
  MOVIE: 7,
  CREATIVE: 8,
  SOLID: 9,
  OTHER: 5,
};

const CREATIVE_TYPE_LIST = [
  { code: 1, message: '平面设计', short: 'pm' },
  { code: 2, message: 'UI / UX', short: 'ui'  },
  { code: 3, message: '插画 / 漫画', short: 'ch'  },
  { code: 6, message: 'H5', short: 'h5'  },
  { code: 4, message: '动画', short: 'dh'  },
  { code: 7, message: '影视', short: 'movie'  },
  { code: 8, message: '创意策划 / 文案', short: 'creative'  },
  { code: 9, message: '3D / AR / VR', short: 'solid'  },
  { code: 5, message: '其他', short: 'other'  },
];

export default function prepareMobileCreativeType(portfolio) {
  let {creativeTypeList} = portfolio;

  const creativeMap = creativeTypeListToMap(creativeTypeList);

  let creativeNames = [];
  CREATIVE_TYPE_LIST.forEach(({ code, short, message }) => {
    // 兼容只勾选了一级创意类型
    if((portfolio[`is${capitalize(short)}`]) && (code !== CREATIVE_TYPE.OTHER)) {
      creativeNames.push(message);
    }
    if(!creativeMap[code]) return;

    const typeNames = creativeMap[code].map(({ creativeName }) => creativeName);
    creativeNames = creativeNames.concat(typeNames);
  });

  /*(creativeTypeList || []).forEach(item => {
    if(creativeNames.indexOf(CREATIVE_TYPE_MAP[item.type]) === -1) {
      creativeNames.push(CREATIVE_TYPE_MAP[item.type]);
    }
    creativeNames.push(item.creativeName);
  });*/

  return creativeNames;
}

function creativeTypeListToMap(creativeTypeList=[]) {
  const creativeTypeMap = {};
  creativeTypeList.forEach((creativeType) => {
    const { type } = creativeType;
    let creativeTypes = creativeTypeMap[type];

    if(!creativeTypes) {
      creativeTypes = [];
      creativeTypeMap[type] = creativeTypes;
    }

    creativeTypes.push(creativeType);
  });

  return creativeTypeMap;
}