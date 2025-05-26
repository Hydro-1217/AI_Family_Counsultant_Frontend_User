import take from 'lodash/take';
import isEmpty from 'lodash/isEmpty';
/** @module prepareTypeAndIndustry */

/**
 * 创意类型和行业数据处理
 * @param {object} portfolio 案例信息
 * @return {String}
 */

export default function prepareTypeAndIndustry(portfolio) {
  const {isPm, isUi, isCh, isDh, isH5, isMovie, isCreative, isSolid, isOther, pmList, uiList, chList, dhList,
    h5List, movieList, creativeList, solidList, otherList, industryList} = portfolio;
  let creativeNames = [];
  let industryNames = [];

  if (isPm) {
    creativeNames.push('平面设计', ...pmList.map(item => item.creativeName));
  }
  if (isUi) {
    creativeNames.push('UI / UX', ...uiList.map(item => item.creativeName));
  }
  if (isCh) {
    creativeNames.push('插画 / 漫画', ...chList.map(item => item.creativeName));
  }
  if (isH5) {
    creativeNames.push('H5', ...h5List.map(item => item.creativeName));
  }
  if (isDh) {
    creativeNames.push('动画', ...dhList.map(item => item.creativeName));
  }
  if (isMovie) {
    creativeNames.push('影视', ...movieList.map(item => item.creativeName));
  }
  if (isCreative) {
    creativeNames.push('创意策划 / 文案', ...creativeList.map(item => item.creativeName));
  }
  if (isSolid) {
    creativeNames.push('3D / AR / VR', ...solidList.map(item => item.creativeName));
  }
  if (isOther) {
    creativeNames.push(...otherList.map(item => item.creativeName));
  }
  if(creativeNames.length > 3) {
    creativeNames = take(creativeNames, 3);
  }

  if (!isEmpty(industryList)) {
    industryList.map(industryItem => {
      industryNames.push(industryItem.industryName);
    });
  }
  if(industryNames.length > 3) {
    industryNames = take(industryNames, 3);
  }

  let typeAndIndustryList = creativeNames.concat(industryNames);

  return typeAndIndustryList.join(' | ');
}