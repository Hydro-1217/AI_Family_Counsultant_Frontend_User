/** @module prepareCreativeType */

/**
 * 案例详情弹窗创意类型数据处理
 * @param {object} portfolio 案例信息
 * @return {Array}
 */

import capitalize from './capitalize'

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

export default function prepareCreativeType(portfolio) {
  const { creativeTypeList } = portfolio;
  const creativeMap = creativeTypeListToMap(creativeTypeList);

  const creativeNames = [];
  CREATIVE_TYPE_LIST.forEach(({ code, short, message }) => {
    if(!portfolio[`is${capitalize(short)}`]) {
      return;
    }

    let content = '';
    if(creativeMap[code]) {
      content = creativeMap[code].map(({ creativeName }) => creativeName).join(' | ');
    }

    creativeNames.push({
      content,
      title: message
    });
  });

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