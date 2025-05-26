/** @module getFileSizeStr */

/**
 * 将文件大小转为xxM
 * @param szie { string }
 * @return {string} 返回值
 */

export default function getFileSizeStr (size) {
  let num = size / (1024 * 1024);
  return num + 'M';
}
