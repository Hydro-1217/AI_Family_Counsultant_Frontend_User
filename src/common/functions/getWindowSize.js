/** @module getWindowSize */

/**
 * 获取网页的滚动距离，注意滚动区域是网页时才有效。
 * @return {object}
 */
export default function getWindowSize () {
  if (typeof document !== 'object') return { width: 0, height: 0 }
  const width = Math.max(
    document.documentElement.clientWidth, 
    window.innerWidth
  );
  const height = Math.max(
    document.documentElement.clientHeight, 
    window.innerHeight
  );
  return { width, height }
}