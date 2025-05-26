import reg from '../regex'

/** @module getFormattedDescription */

/**
 * 格式化描述中的链接
 * @param desc { string } 文件或者文件名
 * @return {string} 返回值
 */

// const REG_HTTP = /^(http|https|ftp).*/;

export default function getFormattedDescription(desc, options = {}){
  if (!desc && typeof desc !== 'string') {
    return desc;
  }

  const { link } = options

  let result = desc

  if (link === false) {
    // do nothing
  } else {
    // default transform link
    result = result.replace(reg.STRICTLY_URL, (match) => {
      const beforeMath = match;
      // if (!REG_HTTP.test(match)) {
      //   match = `http://${match}`;
      // }
      return `<a href="${match}" target="_blank">${beforeMath}</a>`;
    })
  }
  // transform 换行
  result = result.trim().replace(/\n/g, '<br/>')

  return result;
}