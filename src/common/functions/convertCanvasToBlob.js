/** @module convertCanvasToBlob */

function convertCanvasToBlob(canvas, type = 'image/png', quality) {
  const binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type });
}

/**
 * 将Canvas对象转换成Blob对象
 * @param canvas Canvas对象
 * @param type 转到的对象类型
 * @param quality 质量
 * @return {*} Blob对象
 */
export default convertCanvasToBlob;
